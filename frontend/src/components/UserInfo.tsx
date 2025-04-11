import { useQueryClient } from '@tanstack/react-query'
import { UserPublic } from '../client'
import {
  Box,
  Flex,
  Heading,
  Avatar,
  VStack,
  Badge,
  Card,
  Stat,
} from '@chakra-ui/react'
import { useColorMode } from './ui/color-mode'

export function UserInfo() {
  // reuse currentUser query from react-query
  const currentUser = useQueryClient().getQueryState<UserPublic>([
    'currentUser',
  ])
  const { textColor } = useColorMode()

  const userData = currentUser?.data

  const fullName = userData?.first_name + ' ' + userData?.last_name

  return (
    <Box p='8' w='100%' h='100%'>
      <Card.Root shadow='md' mb={0}>
        <Card.Header>
          <Flex justify='space-between' align='center'>
            <Heading size='2xl' color={textColor}>
              User Info
            </Heading>
            <Avatar.Root
              size='2xl'
              bg='blue.500'
              color='white'
              _hover={{ transform: 'scale(1.2)' }}
            >
              {userData?.is_superuser && (
                <Badge
                  position='absolute'
                  bottom='0'
                  right='0'
                  colorScheme='purple'
                  rounded='full'
                  p={1}
                >
                  Admin
                </Badge>
              )}
              <Avatar.Fallback name={fullName ?? '?'} />
            </Avatar.Root>
          </Flex>
        </Card.Header>

        <Card.Body>
          <VStack align='stretch' divideY='2px'>
            <Stat.Root>
              <Stat.Label fontSize='md'>Email</Stat.Label>
              <Stat.ValueText fontSize='lg'>{userData?.email}</Stat.ValueText>
            </Stat.Root>

            <Stat.Root>
              <Stat.Label fontSize='md'>First Name</Stat.Label>
              <Stat.ValueText fontSize='lg'>
                {userData?.first_name}
              </Stat.ValueText>
            </Stat.Root>

            <Stat.Root>
              <Stat.Label fontSize='md'>Last Name</Stat.Label>
              <Stat.ValueText fontSize='lg'>
                {userData?.last_name}
              </Stat.ValueText>
            </Stat.Root>

            <Stat.Root>
              <Stat.Label fontSize='md'>Account Type</Stat.Label>
              <Stat.ValueText fontSize='lg'>
                {userData?.is_superuser ? 'Administrator' : 'Standard User'}
              </Stat.ValueText>
            </Stat.Root>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}
