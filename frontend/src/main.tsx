import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DefaultCatchBoundary } from './components/common/DefaultCatchBoundary'
import NotFound from './components/common/NotFound'
import { CustomProvider } from './components/ui/provider'

import { client } from './client/client.gen';

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  auth: async () => {
    return localStorage.getItem("access_token") ?? ""
  }
});

export function createOurRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  })
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createOurRouter>
  }
}

const handleApiError = (error: Error) => {
  if (error instanceof ApiError && [401, 403].includes(error.status)) {
    localStorage.removeItem("access_token")
    window.location.href = "/login"
  }
}
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleApiError,
  }),
  mutationCache: new MutationCache({
    onError: handleApiError,
  }),
})

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <CustomProvider>
          <RouterProvider router={createOurRouter()} />
        </CustomProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}