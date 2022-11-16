import { DataWithNullDefault } from "../types/model"


export type FormColType = {
  labelCol: {
    span: number
  }
  wrapperCol: {
    span: number
  }
}

export const tinyMCEKey: string =
  ''

export type AdminFormOption<T> = {
}

export type DataWithId = {
  id: string
}

export const setupWithDefault = <T>(v: DataWithNullDefault<T>) => {
  return {
    ...v,
    id: v.id || '',
    createdAt: v.createdAt ?? null,
    updatedAt: v.updatedAt ?? null,
    deletedAt: v.deletedAt ?? null,
  } as T
}

export const useAdminForm = <T extends DataWithId>(defaultoptions?: AdminFormOption<T>) => {
  const $acl = useAclStore()
  const $alert = useAlertStore()
  // const $router = useRouter()
  const $data = ref<Partial<T>>()
  const $modified = ref<boolean>(false)
  // const defaultData = setupWithDefault<T>()
  const $oriData = ref<T>()

  const makeWatchData = () => {
    const unWatch = watch(() => $data.value as DataWithId, (v: DataWithId, old: DataWithId) => {
      // console.log('modifed?', { ...old }, old.id, { ...v })
      if (typeof v === 'undefined' || typeof old === 'undefined') {
        $modified.value = false;
        return;// is fresh
      }
      // new id assigned
      if (v.id !== old.id) {
        $modified.value = false;
        return;
      }
      $modified.value = true;
    }, { deep: true })
    return unWatch;
  }
  let unwatchData = makeWatchData()

  // activate reset
  const $reset = () => {
    unwatchData()
    if (typeof $oriData.value !== 'undefined') {
      $data.value = { ...$oriData.value }
    }
    $modified.value = false;
    // console.log('data!', {...$data.value}, {...oriData.value})
    unwatchData = makeWatchData()
  }

  // set base data - from form or from default
  const $resetData = (update: DataWithNullDefault<T>) => {
    const updateOri = setupWithDefault<T>(update)
    $oriData.value = updateOri
    $reset()
    return $oriData.value
  }

  return {
    // $route,
    $acl,
    $alert,
    $data,
    $oriData,
    $reset,
    $resetData,
    setupDefault: setupWithDefault,
    $modified,
  }
}