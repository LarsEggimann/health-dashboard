import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { UsersService } from '../../client'
import { client } from '../../client/client.gen'

export const Route = createFileRoute('/_layout/user')({
  component: RouteComponent,
})

function RouteComponent() {
  const query = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
      const response = await UsersService.usersGetOwnUser()
      return response
    },
  })

  return (
    <div>
      <h1>Test</h1>
      <p>{query.isLoadingError ? 'Loading...' : 'Loaded!'}</p>
      <p>Error: {query.error ? query.error.message : 'No error'}</p>
      <p>{query.data ? JSON.stringify(query.data) : 'No data'}</p>
      {/* <p>{JSON.stringify(query)}</p> */}
      <p>Query Status: {query.status}</p>
      <br />
      <p>Client Auth: {JSON.stringify(client.getConfig())}</p>
    </div>
  )
}
