import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Index,
})

export default function Index() {
  return (
    <div>Home Page!</div>
  )
}