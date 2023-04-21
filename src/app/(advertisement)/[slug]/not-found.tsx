import Link from 'next/link'
import { EmptyPlaceholder } from '~/components/EmptyPlaceholder'

export default function AdvertisementNotFound() {
  return (
    <EmptyPlaceholder className="mx-auto max-w-[800px] my-10">
      <EmptyPlaceholder.Icon name="warning" />
      <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        This page could not be found. Please try again.
      </EmptyPlaceholder.Description>
      <Link
        href="/"
        className="text-brand-900 relative inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-4  py-2 text-sm font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        Go to Home
      </Link>
    </EmptyPlaceholder>
  )
}
