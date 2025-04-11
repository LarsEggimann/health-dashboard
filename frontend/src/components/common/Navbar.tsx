import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'

import Logo from '../../assets/images/favicon.png'
import UserMenu from './UserMenu'
import { useSidebar } from '../../providers/SidebarContext'
import { useAuth } from '../../providers/AuthContext'

function Navbar() {
  const sidbarContext = useSidebar()

  const { user } = useAuth()

  const name = user ? user.first_name + "'s" : 'Your'

  return (
    <Box rounded='lg' m='2'>
      <Flex
        rounded='lg'
        justify='space-between'
        position='sticky'
        align='center'
        bg='bg.muted'
        w='100%'
        p={2}
      >
        <Flex align='center'>
          <sidbarContext.SideBarButton />
        </Flex>
        <Flex align='center'>
          <Link to='/'>
            <Image src={Logo} alt='Logo' maxH='50px' p={1} />
          </Link>

          <Text fontSize='2xl' ml={2} fontWeight='bold'>
            {name} Health Dashboard
          </Text>
        </Flex>
        <Flex mr={5} alignItems='center'>
          <UserMenu />
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar
