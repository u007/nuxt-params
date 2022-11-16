
// import * as trpc from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const hi = router({
  hi: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(({ input, ctx }) => {
      return {
        greeting: `hello ${ctx.user?.username ?? 'world'} - ${input?.text}`,
        now: new Date(),
      }
    })
})
