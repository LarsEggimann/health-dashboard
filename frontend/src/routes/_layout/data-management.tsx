import { Box, Button, Flex } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { HealthDataManagementService } from '../../client'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_layout/data-management')({
  component: RouteComponent,
})

function RouteComponent() {
  const updateStatusQuerry = useQuery({
    queryKey: ['updateHealthDataStatus'],
    queryFn: async () => {
      const response =
        await HealthDataManagementService.healthDataManagementGetStatusOnUpdateHealthData()
      if (!response.data) {
        throw new Error('Error fetching health data management status')
      }
      return response.data
    },
  })

  return (
    <Flex gap={4}>
      <Button
        variant='surface'
        onClick={async () => {
          HealthDataManagementService.healthDataManagementUpdateHealthData(
            {},
          ).then((res) => {
            console.log(res)
          })
        }}
      >
        Update Health Data
      </Button>

      <Button variant='surface' onClick={() => updateStatusQuerry.refetch()}>
        Refresh Status
      </Button>

      <Box>
        <div>Status: {JSON.stringify(updateStatusQuerry.data)}</div>
      </Box>
    </Flex>
  )
}
