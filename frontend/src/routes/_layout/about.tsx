import { createFileRoute } from '@tanstack/react-router'
import { Box, Card, Flex, Heading, VStack } from '@chakra-ui/react'

export const Route = createFileRoute('/_layout/about')({
  component: About,
})

function About() {
  return (
    <Card.Root shadow='md' mb={0}>
      <Card.Header>
        <Flex justify='space-between' align='center'>
          <Heading size='2xl'>About</Heading>
        </Flex>
      </Card.Header>

      <Card.Body>
        <VStack align='stretch' divideY='2px'>
          <Box>
            <div>
              <p>
                My name is Lars and I like to play around with code stuff and
                data. See{' '}
                <a
                  href='https://larseggimann.github.io/links/'
                  target='_blank'
                  style={{ color: 'blue' }}
                >
                  here
                </a>{' '}
                for more information about me.
              </p>
            </div>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
