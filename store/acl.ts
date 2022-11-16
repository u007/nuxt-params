import { PhotoURL, Site } from '@prisma/client'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { UserType } from '../models/UserType'
// import { dataFetchSingle, dataFetchSingleWhere } from '../realm/data/get'

export interface UserSession {
  id: string
  uid: string
  username?: string
  photoURL?: PhotoURL
  roles?: string[]
  teams?: string[]
  customData: UserType | null
  providerType: string
  cartSessionToken?: string
  country: string

  site?: Site | null
}

let accessToken = typeof window !== 'undefined' ? window.localStorage.getItem('accessToken') : ''
let refreshToken = typeof window !== 'undefined' ? window.localStorage.getItem('refreshToken') : ''

export const useAclStore = defineStore('acl', {
  state: (): {
    loading: boolean
    currentUser: UserSession
    loginError: string
    cartSessionToken: string
    loadIndex: number// update every refresh
  } => {
    return {
      loading: false,
      currentUser: {} as UserSession,
      loginError: '' as string,
      cartSessionToken: '' as string,
      loadIndex: 0
    }
  },

  getters: {
    currentDisplayName: (state) => {
      const data = state.currentUser?.customData
      // console.log('currentUserName', state.currentUser, data)
      if (state.currentUser && data) {
        return data.firstName + (data.lastName ? ` ${data.lastName}` : '')
      }
      return 'Guest'
    },
    siteCurrencyLabel: () => {
      // TODO
      return 'RM'
      // if (state.currentUser && state.currentUser.customData) {
      //   return state.currentUser.customData.currency
      // }
      // return 'USD'
    },

  },
  actions: {
    async getAccessToken() {
      return accessToken
    },
    async login(siteName: string, username: string, password: string) {
      const { $trpcClient } = useNuxtApp()
      this.loginError = ''
      this.loading = true
      try {
        // const res = await $fetch('/api/auth', {
        //   method: 'POST',
        //   body: {
        //     siteName, username, password
        //   }
        // })
        const res = await $trpcClient.auth.login.mutate({ siteName, username, password })

        console.log('login res', res)
        // res._data?.hi
        if (res.success) {
          accessToken = res.accessToken
          refreshToken = res.refreshToken

          window.localStorage.setItem('accessToken', accessToken || '')
          window.localStorage.setItem('refreshToken', refreshToken || '')
          this.currentUser = {
            id: res.user.id,
            uid: res.user.id,
            username: res.user.username,
            providerType: 'email',
            customData: res.user.customData,
            country: res.user.country,
            site: res.site,
            roles: res.user.roles
          }
        } else {
          throw new Error('Unknown error')
        }
        // return useFetch('/api/hi', { body: { name: 'abc' }, headers: { Authorization: `Bearer ${token}` } })
        return this.currentUser
      } catch (error: any) {
        console.log('error?', error)
        this.loginError = error?.message
        throw error
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.loginError = ''
      this.loading = true
      try {
        // TODO
      } catch (err) {
        console.log('logout failed', err)
      } finally {
        accessToken = ''
        refreshToken = ''
        window.localStorage.setItem('accessToken', '')
        window.localStorage.setItem('refreshToken', '')
        this.currentUser = {
          id: '',
          uid: '',
          customData: null,
          teams: [],
          providerType: '',
          site: null,
          country: 'my',
        }

        this.loading = true
        this.cartSessionToken = ''
      }
    },

    checkSession() {
      return true
    },
    setCartSession(token: string) {
      this.cartSessionToken = token
      this.currentUser.cartSessionToken = token
    },

    isGuest(): boolean {
      return !this.currentUser.providerType || this.currentUser.providerType === 'anon-user'
    },

    refetchCurrentUser() {
      // const user = await dataFetchSingleWhere<UserType>(userModel, { uid: realm.currentUser.id })
      // if (!user) {
      //   console.error('user missing', realm.currentUser.id)
      //   throw new Error('User not found')
      // }
      // console.log('refetchCurrentUser', user)
      // await realm.currentUser.refreshCustomData()
      // this.currentUser.customData = realm.currentUser.customData
      // this.currentUser.teams = realm.currentUser.customData.teams
      // this.currentUser.providerType = realm.currentUser.providerType
      // this.cartSessionToken = realm.currentUser.customData.cartSessionToken
    },
    setTeams(teams: string[]) {
      this.currentUser.teams = teams
    },
    loginEmail(email: string, pass: string) {
      this.loginError = ''
      this.loading = true
      try {
        // const credentials = Realm.Credentials.function({ username: email, password: pass })
        // console.log('loggedin?', currentUser.customData.dob)
        // this.currentUser = {
        //   id: res.id,
        //   uid: res.id,
        //   username: res.profile.name,
        //   avatar: res.profile.pictureUrl,
        //   accessToken: res.accessToken,
        //   refreshToken: res.refreshToken,
        //   teams: currentUser?.customData.teams,
        //   customData: currentUser?.customData,
        //   providerType: currentUser?.providerType,
        // }

        return this.currentUser
      } catch (err) {
        console.log('login failed', err)
      } finally {
        this.loading = true
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendVerifyEmail(_email: string) {
      // this.loading = true
      // try {
      // }
      // finally {
      //   this.loading = false
      // }
    },
  },
  persist: true
})

if (import.meta.hot) { import.meta.hot.accept(acceptHMRUpdate(useAclStore, import.meta.hot)) }
