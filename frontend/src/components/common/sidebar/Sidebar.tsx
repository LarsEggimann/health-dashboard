import { Box, Flex } from '@chakra-ui/react'

import SidebarItems from './SidebarItems'
import { useSidebar } from '../../../providers/SidebarContext'

const Sidebar = () => {
  const sidebarContext = useSidebar()

  return (
    <>
      <Box
        rounded='lg'
        p={2}
        m={2}
        mt={0}
        width='xs'
        bg='bg.muted'
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
        </Flex>
      </Box>
    </>
  )
}

export default Sidebar
