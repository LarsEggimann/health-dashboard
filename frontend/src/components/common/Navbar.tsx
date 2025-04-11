import { Flex, Image, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'

import Logo from '../../assets/images/favicon.png'
import UserMenu from './UserMenu'
import { useSidebar } from '../../providers/SidebarContext'
import { useColorMode } from '../ui/color-mode'
import { useAuth } from '../../providers/AuthContext'

function Navbar() {
  const sidbarContext = useSidebar()

  const { textColor } = useColorMode()

  const { user } = useAuth()

  const name = user ? user.first_name + '\'s' : 'Your'

  return (
    <Flex
      justify='space-between'
      position='sticky'
      color='white'
      align='center'
      bg='bg.muted'
      w='100%'
      top={0}
      p={2}
    >
      <Flex align='center'>
        <sidbarContext.SideBarButton />
      </Flex>
      <Flex align='center'>
        <Link to='/'>
          <Image src={Logo} alt='Logo' maxH='50px' p={1} />
        </Link>

        <Text fontSize='2xl' ml={2} color={textColor} fontWeight='bold'>
          {name} Health Dashboard
        </Text>
      </Flex>
      <Flex gap={2} alignItems='center'>
        <UserMenu />
      </Flex>
    </Flex>
  )
}

export default Navbar
