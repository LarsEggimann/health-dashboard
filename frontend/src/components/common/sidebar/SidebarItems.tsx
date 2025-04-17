import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink } from '@tanstack/react-router'
import { FiDatabase, FiInfo, FiTag, FiUser, FiUsers } from 'react-icons/fi'
import type { IconType } from 'react-icons/lib'

import type { UserPublic } from '../../../client'
import { BsClipboardData } from 'react-icons/bs'

const items = [
  { icon: BsClipboardData, title: 'Monitoring Data', path: '/monitoring' },
  { icon: FiDatabase, title: 'Data Management', path: '/data-management' },
  { icon: FiUser, title: 'User Info', path: '/user-info' },
  { icon: FiInfo, title: 'About', path: '/about' },
]
interface Item {
  icon: IconType
  title: string
  path: string
}

const SidebarItems = () => {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(['currentUser'])

  const finalItems: Item[] = currentUser?.is_superuser
    ? [
        ...items,
        { icon: FiUsers, title: 'Admin', path: '/admin' },
        { icon: FiTag, title: 'Test Websockets', path: '/test-websockets' },
      ]
    : items

  const listItems = finalItems.map(({ icon, title, path }) => (
    <RouterLink key={title} to={path}>
      <Flex
        rounded='lg'
        gap={4}
        px={4}
        py={2}
        _hover={{
          background: 'gray.emphasized',
        }}
        alignItems='center'
        fontSize='sm'
      >
        <Icon as={icon} alignSelf='center' />
        <Text ml={2}>{title}</Text>
      </Flex>
    </RouterLink>
  ))

  return (
    <>
      <Text fontSize='xs' px={4} py={2} fontWeight='bold'>
        Menu
      </Text>
      <Box>{listItems}</Box>
    </>
  )
}

export default SidebarItems
