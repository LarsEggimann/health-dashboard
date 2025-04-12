import { IconButton } from '@chakra-ui/react'
import { createContext, useContext, useState, ReactNode, JSX } from 'react'
import { FaBars } from 'react-icons/fa'

interface SidebarContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  SideBarButton: () => JSX.Element
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const storedSidebarState = localStorage.getItem('sidebarOpen')
  const initialSidebarState = storedSidebarState
    ? JSON.parse(storedSidebarState)
    : true
  const [isOpen, setIsOpen] = useState(initialSidebarState)

  localStorage.setItem('sidebarOpen', isOpen)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen((prev: boolean) => !prev)

  const SideBarButton = () => {
    return (
      <IconButton variant='surface' m={4} onClick={toggle}>
        <FaBars />
      </IconButton>
    )
  }

  return (
    <SidebarContext.Provider
      value={{ isOpen, open, close, toggle, SideBarButton }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
