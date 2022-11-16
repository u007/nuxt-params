import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  if (!event.req.url?.startsWith('/api/')) {
    return;
  }
  console.log('req: ' + event.req.url, event.req.headers.authorization)

  let ctxUser = { uid: '', name: '', roles: [] }
  if (event.req.headers.authorization) {
    const user = jwt.decode(event.req.headers.authorization.split(' ')[1]) as any;
    // console.log('Auth: ' + event.req.headers.authorization, user)
    // console.log('User: ', user)

    // return user;
    ctxUser = {
      uid: user?.id,
      name: 'james',
      roles: [],
    }
  }
  // console.log('aaa', req.headers)
  const isSystem = !!process.env.SYSTEMPASS && event.req.headers['x-pass'] === process.env.SYSTEMPASS
  console.log('url?' + event.req.url, { isSystem })

  event.context.user = ctxUser
  event.context.isSystem = isSystem
})
