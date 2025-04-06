import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import {
  authLoginAccessToken,
  type UserPublic,
  usersGetOwnUser,
  type BodyAuthLoginAccessToken,
} from "../client"
import { handleError } from "../utils"

const isLoggedIn = () => {
  return localStorage.getItem("access_token") !== null
}

const useAuth = () => {
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  // const { data: user } = useQuery<UserPublic | null, Error>({
  //   queryKey: ["currentUser"],
  //   queryFn: async () => {
  //     const response = await usersGetOwnUser();
  //     return response.data ?? null;
  //   },
  //   enabled: isLoggedIn(),
  // })


  const login = async (data: BodyAuthLoginAccessToken) => {
    const response = await authLoginAccessToken({
      body: data,
    })
    localStorage.setItem("access_token", response.data?.access_token ?? "")
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: (err: any) => {
      handleError(err)
    },
  })

  const logout = () => {
    localStorage.removeItem("access_token")
    navigate({ to: "/login" })
  }

  return {
    loginMutation,
    logout,
    user,
    error,
    resetError: () => setError(null),
  }
}

export { isLoggedIn }
export default useAuth
