import { Suspense } from 'react'
import { ListProperties } from '~/components/ListProperties'
import { Skeleton } from '~/components/Skeleton'

export const metadata = {
  title: 'Advertisements'
}

type PageProps = {
  params: {}
  searchParams: {
    status: string | null
  }
}

export default async function Page(props: PageProps) {
  return (
    <div className="">
      <Suspense fallback={<Skeleton className="w-full h-40" />}>
        <ListProperties status={props.searchParams.status} />
      </Suspense>
    </div>
  )
}
