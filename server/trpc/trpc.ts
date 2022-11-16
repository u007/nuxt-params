import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context'
import superjson from "superjson"
// Avoid exporting the entire t-object since it's not very
// descriptive and can be confusing to newcomers used to t
// meaning translation in i18n libraries.
const t = initTRPC.context<Context>().create({
  transformer: superjson,
})
// Base router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.isSystem && !ctx.user?.uid) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx
  });
});
// you can reuse this for any procedure
export const protectedProcedure = t.procedure.use(isAuthed);
