import { router } from '../trpc'
import { hi } from './hi'

export const appRouter = router({
  hello: hi,
})
// export type definition of API
export type AppRouter = typeof appRouter