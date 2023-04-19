import { initTRPC } from '@trpc/server'
import { propertyRouter } from '~/trpc/routers/property'
import { s3Router } from '~/trpc/routers/s3'

const t = initTRPC.create()

export const appRouter = t.router({
  property: propertyRouter,
  s3: s3Router
})

export type AppRouter = typeof appRouter
