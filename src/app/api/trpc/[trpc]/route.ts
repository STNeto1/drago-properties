import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '~/trpc/root'
import { createTRPCContext } from '~/trpc/trpc'

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: createTRPCContext
  })
}

export const GET = handler
export const POST = handler
