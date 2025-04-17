import { Box, Card, Flex, Heading, VStack } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card.Root shadow='md' mb={0}>
      <Card.Header>
        <Flex justify='space-between' align='center'>
          <Heading size='2xl'>Admin</Heading>
        </Flex>
      </Card.Header>

      <Card.Body>
        <VStack align='stretch' divideY='2px'>
          <Box>
            <div>
              <p>no admin stuff yet</p>
            </div>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
