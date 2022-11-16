import { Ref } from "vue"
import { ListFetchEvent } from "@/constants/data"

export type adminListOption = {
  pageName?: string
  pageSizeName?: string
  searchName?: string
  idName?: string
}

// TODO sorting
export const useAdminList = <T>(moduleUri: string, options?: adminListOption) => {
  const pageName = options?.pageName || 'page'
  const pageSizeName = options?.pageSizeName || 'pageSize'
  const searchName = options?.searchName || 'search'
  const idName = options?.idName || 'id'

  const $acl = useAclStore()
  const $alert = useAlertStore()
  const $route = useRoute()
  const $router = useRouter()
  const $dataList: Ref<T[]> = ref([])
  const $formId = refFromRoute<string>($route, idName, '')
  const editMode = ref<boolean>($formId.value === 'new')
  const lastEditMode = ref<boolean>(editMode.value)

  const page = refFromRoute<number>($route, pageName, 1)
  const pageSize = refFromRoute<number>($route, pageSizeName, undefined)

  const search = refFromRoute<string>($route, searchName, '')

  const onFetch = async ({ pagination, filters }: ListFetchEvent) => {
    console.log('onfetch', filters, pagination)
    search.value = filters?.$text?.$search || ''
    updateQueryURL(
      $router,
      $route,
      { ...(filters?.value || {}), search: search.value },
      pagination
    )
    page.value = pagination.current
    pageSize.value = pagination.pageSize
  }

  const backToList = async () => {
    $router.push({ path: moduleUri, query: $route.query, hash: $route.hash })
    // while($router.getRoutes().length > 0) {
    //   const res = await $router.back();
    //   console.log('back', res);
    // }
  }

  const doAdd = () => {
    if (editMode.value) {
      return
    }
    $router.push(moduleUri + '/new')
  }

  const selectRecord = (record: { id: string }) => {
    if (editMode.value) {
      return
    }
    $router.push(moduleUri + '/' + record.id)
  }

  const doSearch = (s: string) => {
    search.value = s
  }

  return {
    $route,
    $router,
    page,
    pageSize,
    search,
    onFetch,
    $acl,
    $alert,
    $dataList,
    $formId,
    backToList,
    editMode,
    lastEditMode,
    doAdd,
    selectRecord,
    doSearch,
  }
}
