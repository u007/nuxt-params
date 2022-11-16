import { TablePaginationConfig } from 'ant-design-vue'
import { Ref, ref, watch } from 'vue'
import { ObjectId } from 'bson'
import {
  Router,
  RouteLocationNormalizedLoaded,
} from 'vue-router'

export type RefFromRouteOption = {
  isObjectId?: boolean
}

export const refFromRouteWithFilter = <T>(
  filters: { [key: string]: any },
  $router: Router,
  $route: RouteLocationNormalizedLoaded,
  name: string,
  defaultValue: any,
  options: RefFromRouteOption = {}
): Ref<T | undefined> => {
  const store = refFromRoute<T>($route, name, defaultValue, options)

  watch(store, (v) => {
    // console.log('changed', store)
    if (v === null || typeof v === 'undefined') {
      delete filters.value.commType
      return
    }
    filters.value[name] = v
    updateQueryURL($router, $route, { ...filters.value, [name]: store.value })
  })
  return store
}

export enum QueryFieldTypeEnum {
  String = 'String',
  ObjectId = 'ObjectId',
}

type HashT = { [key: string]: any }

const matchObjectId = (v: any, v2: any): boolean => {
  if (
    (typeof v === 'undefined' || v === null) &&
    (typeof v2 === 'undefined' || v2 === null)
  ) {
    return true
  }

  return v?.toString() === v2?.toString()
}

const getObjectIdOrDefault = (v: any, defaultValue: any): ObjectId => {
  if (typeof v === 'string') {
    return new ObjectId(v as string) as any
  }

  if (
    v === undefined ||
    !v ||
    (typeof v === 'object' && '_value' in v && v._value === undefined)
  ) {
    return defaultValue
  }
  return v as ObjectId
}

export const refFromRoute = <T>(
  $route: RouteLocationNormalizedLoaded,
  name: string,
  defaultValue: any,
  options: RefFromRouteOption = {}
): Ref<T | undefined> => {
  const store = ref<T>()
  const { isObjectId } = options
  const lowerName = name.toLowerCase()
  const queryV = $route.query[name] as any
  const paramV = $route.params[name] as any

  const v = typeof queryV !== 'undefined' ? queryV : paramV
  if (isObjectId) {
    if (v) {
      store.value = getObjectIdOrDefault(v, defaultValue) as any
    } else {
      const paramV = $route.params[name] as string
      if (paramV) {
        store.value = getObjectIdOrDefault(paramV, defaultValue) as any
      } else {
        store.value = defaultValue as T
      }
    }
  } else {
    store.value = v ?? defaultValue
  }

  console.log('refFromRoute', name, store.value, { queryV, paramV })
  watch(
    $route.query,
    (v: any) => {
      const queryV = v?.[name] as any
      const paramV = $route.params?.[name] as any
      console.log('queryChange', name, { queryV, paramV })
      if (typeof queryV === 'undefined') {
        if (typeof paramV !== 'undefined') {
          // store.value = paramV
          // set this in watch param below
          return
        }
        store.value = undefined
        return
      }
      // // console.log('qqqq changed', name, v)
      if (isObjectId) {
        if (!matchObjectId(v[name], store.value)) {
          console.log('query changed', name, v[name])
          store.value = getObjectIdOrDefault(v[name], store.value) as any
        }
      } else if (store.value !== v[name]) {
        console.log('query changed', name, v[name])
        store.value = v[name]
      }
      // console.log('query changed', name, store.value, { queryV, paramV })
    },
    { immediate: true }
  )
  watch(
    $route.params,
    (v: any) => {
      console.log('paramsChanged', name, v)
      if (typeof v === 'undefined') {
        console.log('is empty', name, v)
        return
      }
      if (typeof $route.query[name] !== 'undefined') {
        //ignore overwriten by querystring
        return
      }

      if (typeof v[name] === 'undefined') {
        store.value = undefined
        return
      }
      if (isObjectId) {
        if (isObjectId && !matchObjectId(v[name], store.value)) {
          console.log('p changed', name, v[name])
          store.value = getObjectIdOrDefault(v[name], store.value) as any
        }
      } else if (store.value !== v[name]) {
        console.log('p changed', name, v[name])
        store.value = v[name]
      }
    },
    { immediate: true }
  )

  return store
}

export const updateQueryURL = (
  $router: { replace: (a: any) => void },
  $route: { path: string; query: Record<string, any> },
  listFilter: Record<string, any>,
  pagination?: TablePaginationConfig
) => {
  const queryParam = { ...$route.query }
  console.log('queryparam', queryParam, listFilter)

  Object.keys(listFilter).forEach((field) => {
    const val = listFilter[field]
    if (typeof val === 'undefined') {
      queryParam[field] = undefined
      return
    }
    if (typeof val === 'string') {
      queryParam[field] = val
      return
    }
    // undefine objectid
    if ('_value' in val && 'toHexString' in val) {
      console.log('is objectid', field, val)
      if (val._value === undefined) {
        return
      }

      queryParam[field] = val.toHexString()
      return
    }
    console.log('is not string', field, val, val.toString())
    // if (val.toString().startsWith('[object')) {
    //   throw new Error('not support object')
    // }
    queryParam[field] = val.toString()
  })

  if (pagination) {
    queryParam.page = pagination.current
    queryParam.pageSize = pagination.pageSize
  }
  $router.replace({ path: $route.path, query: queryParam })
}
