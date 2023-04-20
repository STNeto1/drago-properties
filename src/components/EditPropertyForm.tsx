'use client'

import { FC } from 'react'
import { trpc } from '~/trpc/client'

type Props = {
  slug: string
}
export const EditPropertyForm: FC<Props> = (props) => {
  const showPropertyQuery = trpc.property.show.useQuery(props.slug, {
    suspense: true,
    retry: 1
  })

  return <h1>{props.slug}</h1>
}
