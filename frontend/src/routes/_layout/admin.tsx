import { Box } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Box>
      <p>There is no admin functionality yet!</p>
    </Box>
  )
}
