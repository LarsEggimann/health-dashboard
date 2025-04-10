import { Box, Flex } from '@chakra-ui/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/sidebar/Sidebar'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Flex flexDirection='column' height='100vh'>
        <Box>
          <Navbar />
        </Box>
        <Flex flex='1' overflow='hidden'>
          <Sidebar />

          <Outlet />
        </Flex>
      </Flex>
    </>
  )
}
