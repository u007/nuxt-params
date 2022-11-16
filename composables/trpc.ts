import { AppRouter } from "@/server/trpc/routers";
import { inferRouterProxyClient } from "@trpc/client";

type defaultQueryType<TReturn> = {
  enabled?: boolean;
  authenticated?: boolean;
  onQuery?: (query: TReturn) => void;
  onError?: (err: Error) => void;
};

const defaultQueryOptions = {
  enabled: true,
  authenticated: true,
  onQuery: () => { },
  onError: () => { },
}

// query and automatic requery 
export const useTRPCQuery = <TReturn>(
  callback: (client: inferRouterProxyClient<AppRouter>) => Promise<TReturn>,
  deps: any[] = [],
  options: defaultQueryType<TReturn> = {}) => {
  const optionsWithDefaults = { ...defaultQueryOptions, ...options };
  const { enabled, authenticated, onQuery, onError } = optionsWithDefaults;

  const { $trpcClient, $trpcAuthenticated } = useNuxtApp()
  const data = ref<TReturn>()
  const loading = ref(true)
  const status = ref(0)
  const error = ref('')
  // console.log('query', enabled)
  const execute = async (): Promise<TReturn> => {
    loading.value = true
    const res = await callback($trpcClient).catch((err: any) => {
      error.value = err.message
      onError(err)
      throw err
      // return undefined
    })
    loading.value = false
    data.value = res

    onQuery(res)
    return res
  }

  watch([$trpcAuthenticated, enabled, ...deps], (values) => {
    // console.log('watch', enabled, $trpcAuthenticated.value)
    if (enabled && (!authenticated || (authenticated && $trpcAuthenticated.value))) {
      // console.log('running', enabled, $trpcAuthenticated.value)
      execute()
    }
  }, { immediate: true })

  return { data, loading, status, error, execute }
}

// with manual execution
export const useTRPCAsync = <TReturn>(callback: (client: inferRouterProxyClient<AppRouter>) => Promise<TReturn>, authenticated = true) => {
  const { $trpcClient, $trpcAuthenticated } = useNuxtApp()
  const data = ref<TReturn>()
  const loading = ref(false)
  const status = ref(0)
  const error = ref('')

  const execute = async () => {
    loading.value = true
    const res = await callback($trpcClient).catch((err: any) => {
      error.value = err.message
      return undefined
    })
    loading.value = false
    data.value = res
    return res
  }

  // only execute on authenticated
  const run = new Promise((resolve, reject) => {
    watch([$trpcAuthenticated], (v) => {
      if (authenticated && v && loading.value) {
        execute().then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })

    if (!authenticated || (authenticated && $trpcAuthenticated)) {
      loading.value = true
      execute().then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    }
  })

  return { data, loading, status, error, execute: run, authenticated: $trpcAuthenticated }
}

// export const useAsyncClient = async (query: AsyncClientQuery, { authorization = true }) => {
//   const { client } = useClient()
//   const { pending: isLoading, data } = useLazyAsyncData('count', () => $fetch('/api/count'))


//   return { isLoading, data }
// }