import { Box, Flex, Text } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'

import type { UserPublic } from '../../../client'
import SidebarItems from './SidebarItems'
import { useSidebar } from '../../../providers/SidebarContext'

const Sidebar = () => {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(['currentUser'])
  const sidebarContext = useSidebar()

  return (
    <>
      <Box
        width='xs'
        bg='bg.subtle'
        display={sidebarContext.isOpen ? 'block' : 'none'}
        // transform={sidebarContext.isOpen ? "translateX(0)" : "translateX(-100%)"}
        // transition="transform 0.1s ease-in-out"
        data-state='open'
        _open={{
          animationName: 'slide-from-left-full',
          animationDuration: '300ms',
        }}
      >
        <Flex flexDir='column' justify='space-between' h='calc(100% - 60px)'>
          <Box>
            <SidebarItems />
          </Box>
          {currentUser?.email && (
            <Text fontSize='sm' p={4} truncate maxW='sm'>
              Logged in as: {currentUser.email}
            </Text>
          )}
        </Flex>
      </Box>
    </>
  )
}

export default Sidebar
