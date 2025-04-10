import { Box, Flex } from '@chakra-ui/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/sidebar/Sidebar'
import { useSidebar } from "../components/common/sidebar/SidebarContext";

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  const sidebarContext = useSidebar()
  return (
    <>
      <Flex flexDirection="column" height="100vh">
        <Box>
          <Navbar />
        </Box>
        <Flex flex="1" overflow="hidden">
          <Sidebar />
          <Box 
            p={1}
            transform={sidebarContext.isOpen ? "translateX(0)" : "translateX(-300px)"}
            transition="transform 0.1s ease-in-out"
            width="100%"
          >
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}