import {
  ErrorComponent,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import { Box, Button, Text, Card } from '@chakra-ui/react'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error(error)

  return (
    <Box>
      <Text fontSize='xl' fontWeight='bold' m={2}>
        Oh no! We have an error! 🫠
      </Text>

      <Card.Root p={2} m={2}>
        <ErrorComponent error={error} />
      </Card.Root>

      <Button
        variant='surface'
        m={2}
        onClick={() => {
          router.invalidate()
        }}
      >
        Try Again
      </Button>
      {isRoot ? (
        <Button
          variant='surface'
          m={2}
          onClick={() => {
            router.navigate({ to: '/' })
          }}
        >
          Home
        </Button>
      ) : (
        <Button
          variant='surface'
          m={2}
          onClick={(e) => {
            e.preventDefault()
            window.history.back()
          }}
        >
          Go Back
        </Button>
      )}
    </Box>
  )
}
