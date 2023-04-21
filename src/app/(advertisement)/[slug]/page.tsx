import { and, eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { ShowProperty } from '~/components/ShowProperty'
import { db } from '~/db/db'
import { properties } from '~/db/schema'

type Props = {
  params: {
    slug: string
  }
  searchParams: {}
}

export default async function AdvertisementPage(props: Props) {
  const [advertisement] = await db
    .select()
    .from(properties)
    .where(and(eq(properties.slug, props.params.slug)))
    .limit(1)

  if (!advertisement) {
    notFound()
  }

  return <ShowProperty {...advertisement} />
}
