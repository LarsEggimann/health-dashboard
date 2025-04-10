import { Box, Flex } from '@chakra-ui/react'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/sidebar/Sidebar'
import { SidebarProvider } from "../components/common/sidebar/SidebarContext";

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{'  '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>{'  '}
        <Link to="/login" className="[&.active]:font-bold">
          Login
        </Link>{'  '}
        <Link to="/user" className="[&.active]:font-bold">
          Test Querries
        </Link>{'  '}
      </div>
      <hr />
      
      <SidebarProvider>
      <Flex flexDirection="column" height="100vh">
        {/* Navbar stays at top */}
        <Box>
          <Navbar />
        </Box>
        
        {/* Main content area - sidebar + content */}
        <Flex flex="1" overflow="hidden">
          <Sidebar />
          <Box 
            flex="1" 
            overflowY="auto" 
            p={4} 
            transition="margin-left 0.3s"
          >
            <Outlet />
          </Box>
        </Flex>
      </Flex>
    </SidebarProvider>


    </div>
  )
}