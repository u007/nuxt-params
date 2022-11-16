import { NitroFetchRequest } from "nitropack";
import { AsyncDataOptions, _Transform, KeyOfRes, AsyncData, PickFrom } from "nuxt/dist/app/composables/asyncData";
import { Ref } from "vue";
import type { FetchError, FetchOptions, FetchResponse } from 'ohmyfetch';
import { FetchResult } from "nuxt/dist/app/composables";

// url: R extends NitroFetchRequest
export const useAuthLazyFetch = <
  TReturn extends { success: boolean, error?: any }>
  (callback: (token: string, options: FetchOptions) => Promise<FetchResponse<TReturn>>,
    enabled = true, deps: any[] = []) => {
  const $acl = useAclStore()
  const data = ref<TReturn>()
  const pending = ref(true)
  const status = ref(0)
  const error = ref('')
  const response = ref<FetchResponse<TReturn>>()
  const options = ref<FetchOptions & { headers: HeadersInit }>({ headers: {} })
  const token = ref<string>('')

  const execute = async () => {
    const res = await callback(token.value, options.value)
    // console.log('execute res', res.body)
    error.value = ''
    if (!res.ok || !res._data?.error) {
      error.value = res._data?.error
    }
    pending.value = false
    data.value = res._data
    status.value = res.status
    response.value = res
  }

  watch([token, enabled, ...deps], (values) => {
    // console.log('watch', enabled, token, deps)
    if (enabled && !!token) {
      execute()
    }
  })

  $acl.getAccessToken().then(async (t) => {
    // console.log('token', t)
    if (t) {
      options.value.headers = { ...options.value.headers, Authorization: `Bearer ${t}` }
    }
    token.value = t || ''
  })

  return { data, pending, status, error, response, execute }
}

// export const $useLazyFetch22 = <ResT = void, ErrorT = FetchError, ReqT extends NitroFetchRequest = NitroFetchRequest, _ResT = ResT extends void ? FetchResult<ReqT> : ResT, Transform extends (res: _ResT) => any = (res: _ResT) => _ResT, PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>>(
//   method: 'get' | 'post' | 'put' | 'delete' | 'option' | 'patch',
//   uri: Ref<ReqT> | ReqT | (() => ReqT),
//   options: { params?: Record<string, any>, body?: Record<string, any> } = {}):
//   Promise<AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, ErrorT | null | true>>
//   => {
//   const headers = ref<Record<string, string>>({})
//   const $acl = useAclStore();

//   return $acl.getAccessToken().then((token) => {
//     if (token) {
//       headers.value = {
//         ...headers.value,
//         Authorization: `Bearer ${token}`,
//       }
//     }

//     return useFetch(
//       uri,
//       { method, ...options, headers: headers.value },
//     );
//   })