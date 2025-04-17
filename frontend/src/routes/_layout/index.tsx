import { createFileRoute } from '@tanstack/react-router'
import { Box, Card, Flex, Heading, VStack } from '@chakra-ui/react'

export const Route = createFileRoute('/_layout/')({
  component: Index,
})

export default function Index() {
  return (
    <Card.Root shadow='md' mb={0}>
      <Card.Header>
        <Flex justify='space-between' align='center'>
          <Heading size='2xl'>What even is this?</Heading>
        </Flex>
      </Card.Header>

      <Card.Body>
        <VStack align='stretch' divideY='2px'>
          <Box>
            <div>
              <p>
                This is a simple health dashboard website that displays health
                data from your Garmin account. The backend periodically fetches
                the data (not yet implemented, just on demand) and stores it in
                a db. The backend uses the{' '}
                <a
                  href='https://github.com/tcgoetz/GarminDB'
                  target='_blank'
                  style={{ color: 'blue' }}
                >
                  GarminDB Python library
                </a>{' '}
                to fetch the data from the Garmin API.
              </p>
              <p>
                The frontend is built with React, TypeScript, and Chakra UI. The
                backend is built with FastAPI and SQLite.
              </p>
              <p>
                The goal is mostly to just have fun and learn some stuff. Use at
                your own risk, I take no resposibility if your data gets lost.
                This is a personal project that is hosted on my Raspberry pi.
              </p>
            </div>
          </Box>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
