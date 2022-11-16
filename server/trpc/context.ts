import { inferAsyncReturnType } from "@trpc/server"
import { H3Event } from "h3"
import jwt from 'jsonwebtoken';
import { ROLES } from "@/constants/roles";

export async function createContext({ req }: H3Event) {
  function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = jwt.decode(req.headers.authorization.split(' ')[1]) as any;
      // return user;
      console.log('jwt?', user)
      return {
        uid: user?.id,
        username: user?.username,
        name: 'james',
        roles: user?.roles,
      }
    }
    return null
  }

  // console.log('aaa', req.headers)
  const isSystem = !!process.env.SYSTEMPASS && req.headers['x-pass'] === process.env.SYSTEMPASS
  console.log('url?' + req.url, { isSystem })
  // if (req.url?.toLocaleLowerCase().startsWith('/api/trpc/crud.') && (!process.env.SYSTEMPASS)) {
  //   console.log('systempass empty!', process.env.SYSTEMPASS)
  //   throw new Error('Invalid system pass')
  // }
  const user = await getUserFromHeader()
  const isAdmin = isSystem || (user && user.roles &&
    (user.roles?.indexOf('admin') >= 0 || user.roles?.indexOf('superadmin') >= 0
      || user.roles?.indexOf(ROLES.ADMIN_ALL) >= 0))

  return {
    user,
    isSystem,
    isAdmin,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>