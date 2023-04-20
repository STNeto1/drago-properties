import { Suspense } from 'react'
import { EditPropertyForm } from '~/components/EditPropertyForm'
import { Skeleton } from '~/components/Skeleton'

type PageProps = {
  params: {
    slug: string
  }
  searchParams: {}
}

export default async function Page(props: PageProps) {
  return (
    <div className="">
      <Suspense fallback={<Skeleton className="w-full h-40" />}>
        <EditPropertyForm slug={props.params.slug} />
      </Suspense>
    </div>
  )
}
