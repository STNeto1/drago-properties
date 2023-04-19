import { DashboardHeader, DashboardShell } from '~/components/DashboardShell'
import { Skeleton } from '~/components/Skeleton'

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <h1>Dashboard</h1>
      </DashboardHeader>
      <div className="divide-y divide-neutral-200 rounded-md border border-slate-200">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </DashboardShell>
  )
}
