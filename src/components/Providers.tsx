'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { httpBatchLink, loggerLink } from '@trpc/react-query'
import { useState } from 'react'
import superjson from 'superjson'
import { trpc } from '~/trpc/client'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: () => true
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`
        })
      ]
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </trpc.Provider>
    </QueryClientProvider>
  )
}
