import { Skeleton } from '~/components/Skeleton'

export default function AdvertisementLoading() {
  return (
    <div className="divide-y divide-neutral-200 rounded-md border border-slate-200 py-10">
      <Skeleton className="w-full h-40" />
    </div>
  )
}
