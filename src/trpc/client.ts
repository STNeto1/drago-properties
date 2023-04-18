import { createTRPCReact } from '@trpc/react-query'
import { AppRouter } from '~/trpc/root'

/** A set of type-safe react-query hooks for your tRPC API. */
export const trpc = createTRPCReact<AppRouter>({})
