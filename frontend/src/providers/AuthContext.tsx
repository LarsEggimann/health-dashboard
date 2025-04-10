import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  AuthService,
  UserPublic,
  UsersService,
  type BodyAuthLoginAccessToken,
} from '../client'
import useCustomToast from '../hooks/useCustomToast'
import { client } from '../client/client.gen'

interface AuthContextType {
  user: UserPublic | undefined
  isLoading: boolean
  isAuthenticated: boolean
  login: (
    data: BodyAuthLoginAccessToken,
    redirectFn?: CallableFunction,
  ) => Promise<void>
  logout: () => void
  error: string | null
  resetError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const isLoggedIn = () => {
  const accessToken = localStorage.getItem('access_token')
  return accessToken != null && accessToken !== ''
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const toast = useCustomToast()

  // fetch user data
  const userQuery = useQuery<UserPublic>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { response, error, data } = await UsersService.usersGetOwnUser()

      if (data) {
        return data
      }

      let message = 'Failed to fetch user data: \n'

      if (
        response instanceof Response &&
        response.status == 401 &&
        response.statusText == 'Unauthorized'
      ) {
        message += 'Unauthorized, please login again'
      } else if (error) {
        console.error('Error fetching user data:', error)
        message += JSON.stringify(error)
      }

      toast.showErrorToast(message)

      throw new Error('Failed to fetch user data')
    },
    throwOnError: false,
    enabled: isLoggedIn(),
    staleTime: 60 * 1000 * 30, // 30 minutes, after that time it will refetch
    retry: false,
  })

  const loginFn = async (
    data: BodyAuthLoginAccessToken,
    redirectFn?: CallableFunction,
  ) => {
    const response = await AuthService.authLoginAccessToken({
      body: data,
    })

    if (response.error) {
      const errorMessage = response.error.detail?.toString() ?? 'Login failed'
      toast.showErrorToast(errorMessage)
      throw new Error(errorMessage)
    }

    toast.showSuccessToast('Login successful')

    // store token in local storage and set it in the client config
    const accessToken = response.data?.access_token ?? ''
    localStorage.setItem('access_token', accessToken)
    client.setConfig({ auth: accessToken })

    // trigger refetch of user data
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] })

    // see if redirector is defined, if not redirect to home page
    if (!redirectFn) {
      window.location.href = '/'
    } else {
      redirectFn()
    }
  }

  const loginMutation = useMutation({
    mutationFn: (args: {
      data: BodyAuthLoginAccessToken
      redirectFn?: CallableFunction
    }) => loginFn(args.data, args.redirectFn),
    onError: (error: Error) => {
      setError(error.message)
      toast.showErrorToast(error.message)
    },
  })

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    client.setConfig({ auth: '' })
    queryClient.removeQueries({ queryKey: ['currentUser'] })
    window.location.href = '/login'
  }, [queryClient])

  const resetError = () => setError(null)

  const value = {
    user: userQuery.data,
    isLoading: userQuery.isLoading || loginMutation.isPending,
    isAuthenticated: isLoggedIn() && !!userQuery.data,
    login: (data: BodyAuthLoginAccessToken, redirectFn?: CallableFunction) =>
      loginMutation.mutateAsync({ data, redirectFn }),
    logout,
    error,
    resetError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
