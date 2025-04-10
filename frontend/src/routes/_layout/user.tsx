import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { UsersService } from '../../client'

export const Route = createFileRoute('/_layout/user')({
  component: RouteComponent,
})


function RouteComponent() {
  const navigate = useNavigate()

  const query = useQuery({
    queryKey: ['test'],
    queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
          const response = await UsersService.usersGetOwnUser()
          console.log(response.response)
          if ([401, 403].includes(response.response.status)) {
            console.log('Unauthorized')
            navigate({ to: '/login' })
            
          }
          return response
      }
  })

  return (
    <div>
      <h1>Test</h1>
      <p>{query.isLoadingError ? 'Loading...' : 'Loaded!'}</p>
      <p>Error: {query.error ? query.error.message : 'No error'}</p>
      <p>{query.data ? JSON.stringify(query.data) : 'No data'}</p>
      {/* <p>{JSON.stringify(query)}</p> */}
      <p>Query Status: {query.status}</p>

    </div>
  );

}
