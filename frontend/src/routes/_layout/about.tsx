import { createFileRoute } from '@tanstack/react-router'
import { Box } from '@chakra-ui/react'

export const Route = createFileRoute('/_layout/about')({
  component: About,
})

function About() {
  return (
    <Box>
      <div>
        <h1>About</h1>
        <p>
          This is a simple health dashboard that displays health data from your
          Garmin account. The backend periodically fetches the data (not yet
          implemented, just on demand) and stores it in a db. The backend uses
          the{' '}
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
        <p>The goal is mostly to just have fun and learn some stuff.</p>
      </div>
    </Box>
  )
}
