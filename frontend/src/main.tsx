import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DefaultCatchBoundary } from './components/common/DefaultCatchBoundary'
import NotFound from './components/common/NotFound'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './components/ui/color-mode'
import { Toaster } from './components/ui/toaster'

import { client } from './client/client.gen'
import { SidebarProvider } from './providers/SidebarContext'
import { AuthProvider } from './providers/AuthContext'

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL,
  auth: async () => {
    return localStorage.getItem('access_token') ?? ''
  },
})

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

const queryClient = new QueryClient()

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      {/* querry and theme providers */}
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider enableSystem={true}>
            {/* custom providers */}
            <AuthProvider>
              <SidebarProvider>
                {/* route provider */}
                <RouterProvider router={createOurRouter()} />
              </SidebarProvider>
            </AuthProvider>
          </ColorModeProvider>

          {/* toasterrr */}
          <Toaster />
        </ChakraProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
