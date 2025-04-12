import { Container, Input } from '@chakra-ui/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { FiLock, FiUser } from 'react-icons/fi'

import type { BodyAuthLoginAccessToken as AccessToken } from '../../client'
import { Button } from '../../components/ui/button'
import { Field } from '../../components/ui/field'
import { InputGroup } from '../../components/ui/input-group'
import { PasswordInput } from '../../components/ui/password-input'
import { useAuth } from '../../providers/AuthContext'

export const Route = createFileRoute('/_layout/login')({
  component: Login,
})

function Login() {
  const auth = useAuth()
  const navigate = useNavigate()

  // use effect to redirect if user is already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate({ to: '/' })
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    auth.resetError()

    try {
      await auth.login(data, () => navigate({ to: '/' }))
    } catch {
      // error is handled by auth provider
    }
  }

  return (
    <Container
      as='form'
      onSubmit={handleSubmit(onSubmit)}
      h='100vh'
      maxW='sm'
      alignItems='stretch'
      justifyContent='center'
      gap={4}
      centerContent
      verticalAlign={'center'}
    >
      <Field
        invalid={!!errors.username || !!auth.error}
        errorText={errors.username?.message || auth.error}
      >
        <InputGroup w='100%' startElement={<FiUser />}>
          <Input
            id='username'
            {...register('username', {
              required: 'Username is required',
            })}
            placeholder='Username'
            type='username'
          />
        </InputGroup>
      </Field>
      <PasswordInput
        type='password'
        startElement={<FiLock />}
        {...register('password', {
          required: 'Password is required',
        })}
        placeholder='Password'
        errors={errors}
      />
      <Button
        variant='surface'
        type='submit'
        loading={isSubmitting || auth.isLoading}
        size='md'
      >
        Log In
      </Button>
    </Container>
  )
}
