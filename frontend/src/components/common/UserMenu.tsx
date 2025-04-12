import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { Link, useNavigate } from '@tanstack/react-router'
import { FaUserAstronaut } from 'react-icons/fa'
import { FiLogIn, FiLogOut, FiUser } from 'react-icons/fi'

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from '../ui/menu'
import { useAuth } from '../../providers/AuthContext'

const UserMenu = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <>
      <Flex>
        <MenuRoot>
          <MenuTrigger asChild p={2}>
            <Button
              variant='surface'
              data-testid='user-menu'
              maxW='sm'
              truncate
            >
              <FaUserAstronaut fontSize='18' />
              <Text>{user?.username || 'User'}</Text>
            </Button>
          </MenuTrigger>

          <MenuContent>
            {isAuthenticated && (
              <Link to='/user-info'>
                <MenuItem
                  closeOnSelect
                  value='user-info'
                  gap={2}
                  py={2}
                  style={{ cursor: 'pointer' }}
                >
                  <FiUser fontSize='18px' />
                  <Box flex='1'>My Profile</Box>
                </MenuItem>
              </Link>
            )}

            {isAuthenticated ? (
              <MenuItem
                value='logout'
                gap={2}
                py={2}
                onClick={logout}
                style={{ cursor: 'pointer' }}
              >
                <FiLogOut />
                Log Out
              </MenuItem>
            ) : (
              <MenuItem
                value='login'
                gap={2}
                py={2}
                onClick={() => {
                  navigate({ to: '/login' })
                }}
                style={{ cursor: 'pointer' }}
              >
                <FiLogIn />
                Log In
              </MenuItem>
            )}
          </MenuContent>
        </MenuRoot>
      </Flex>
    </>
  )
}

export default UserMenu
