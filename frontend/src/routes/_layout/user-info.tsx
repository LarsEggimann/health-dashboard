import { createFileRoute } from '@tanstack/react-router'
import { UserInfo } from '../../components/UserInfo'

export const Route = createFileRoute('/_layout/user-info')({
  component: UserInfo,
})
