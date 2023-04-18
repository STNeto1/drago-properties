import { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/dist/api'
import { getAuth } from '@clerk/nextjs/server'
import { TRPCError, initTRPC } from '@trpc/server'
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { NextApiRequest } from 'next'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { db } from '~/db/db'

type CreateContextOptions = {
  auth: SignedInAuthObject | SignedOutAuthObject
}

const createInnerTRPCContext = ({ auth }: CreateContextOptions) => {
  return {
    db: db,
    auth
  }
}

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  return createInnerTRPCContext({
    auth: getAuth(opts.req as unknown as NextApiRequest)
  })
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    }
  }
})

export const router = t.router

export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      db: ctx.db,
      auth: ctx.auth
    }
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
