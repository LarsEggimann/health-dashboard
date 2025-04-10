import { Container, Input } from "@chakra-ui/react"
import {
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock, FiUser } from "react-icons/fi"

import type { BodyAuthLoginAccessToken as AccessToken } from "../../client"
import { Button } from "../../components/ui/button"
import { Field } from "../../components/ui/field"
import { InputGroup } from "../../components/ui/input-group"
import { PasswordInput } from "../../components/ui/password-input"
import useAuth, { isLoggedIn } from "../../hooks/useAuth"

export const Route = createFileRoute("/_layout/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

function Login() {
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // error is handled by useAuth hook
    }
  }

  return (
      <Container
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        h="100vh"
        maxW="sm"
        alignItems="stretch"
        justifyContent="center"
        gap={4}
        centerContent
        verticalAlign={"center"}
      >
        <Field
          invalid={!!errors.username}
          errorText={errors.username?.message ?? !!error}
        >
          <InputGroup w="100%" startElement={<FiUser />}>
            <Input
              id="username"
              {...register("username", {
                required: "Username is required",
              })}
              placeholder="Username"
              type="username"
            />
          </InputGroup>
        </Field>
        <PasswordInput
          type="password"
          startElement={<FiLock />}
          {...register("password",  {
            required: "Password is required",
          })}
          placeholder="Password"
          errors={errors}
        />
        <Button variant="solid" type="submit" loading={isSubmitting} size="md">
          Log In
        </Button>
      </Container>
  )
}
