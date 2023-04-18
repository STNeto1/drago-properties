import { initTRPC } from '@trpc/server'
import { propertyRouter } from '~/trpc/routers/property'

const t = initTRPC.create()

export const appRouter = t.router({
  property: propertyRouter
})

export type AppRouter = typeof appRouter
