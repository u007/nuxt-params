import { AppRouter } from "../server/trpc/routers";
import { httpBatchLink } from "@trpc/client";
import { createTRPCProxyClient } from '@trpc/client';
type AsyncClientQuery = () => Promise<unknown>;
import superjson from "superjson";

export default defineNuxtPlugin(() => {
  const $acl = useAclStore()
  const headers = ref<Record<string, any>>({})
  const authenticated = ref(false)
  const createClient = () => createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        /**
        * If you want to use SSR, you need to use the server's full URL
        * @link https://trpc.io/docs/ssr
        **/
        url: `/api/trpc`,
        async headers() {
          // const token = auth?.isAuthenticated;
          // console.log('auth?.isAuthenticated', auth?.isAuthenticated);
          return headers.value
        },
      }),
    ],
  })
  // const client = createTRPCProxyClient<AppRouter>({
  //   links: [
  //     httpBatchLink({
  //       /**
  //        * If you want to use SSR, you need to use the server's full URL
  //        * @link https://trpc.io/docs/ssr
  //        **/
  //       url: '/api/trpc',
  //     }),
  //   ],
  // })

  const client = createClient()
  watch(() => $acl.loadIndex, async (val) => {
    const token = await $acl.getAccessToken()
    headers.value.authorization = !!token ? 'Bearer ' + token : ''
    authenticated.value = !!token
  }, { immediate: true })
  // console.log('headers.value', headers.value);
  return {
    provide: {
      trpcClient: client,
      trpcHeaders: headers,
      trpcAuthenticated: authenticated,
    }
  }
})
