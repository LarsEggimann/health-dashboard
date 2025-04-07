import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import {
  AuthService,
  UserPublic,
  UsersService,
  type BodyAuthLoginAccessToken,
} from "../client"
import useCustomToast from './useCustomToast';

const isLoggedIn = () => {
  const accessToken = localStorage.getItem("access_token")
  return accessToken != null && accessToken !== ""
}

const useAuth = () => {
  
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const toast = useCustomToast();
  const userQuery = useQuery<UserPublic>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await UsersService.usersGetOwnUser()
      if (response.data) {
        return response.data
      }
      throw new Error("User data not available")
    },
    enabled: isLoggedIn(),
  })


  const login = async (data: BodyAuthLoginAccessToken) => {
    const response = await AuthService.authLoginAccessToken({
      body: data,
    })
    if (response.error) {
      const errorMessage = response.error.detail?.toString() ?? "Login failed"
      toast.showErrorToast(errorMessage)
      throw new Error(errorMessage)
    } else {
      toast.showSuccessToast("Login successful")
      localStorage.setItem("access_token", response.data?.access_token ?? "")
    }
    return response.data
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: (error: Error) => {
      toast.showErrorToast(error.message)
    }
  })

  const logout = () => {
    localStorage.removeItem("access_token")
    navigate({ to: "/login" })
  }

  return {
    loginMutation: loginMutation,
    logout: logout,
    user: userQuery.data,
    error: error,
    resetError: () => setError(null),
  }
}

export { isLoggedIn }
export default useAuth
