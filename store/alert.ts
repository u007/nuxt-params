import { defineStore, acceptHMRUpdate } from 'pinia'

export const useAlertStore = defineStore('alert', {
  state: () => {
    return {
      loading: false,
      success: '',
      error: '',
      link: '',
      linkLabel: ''
    }
  },
  actions: {
    setLink (link: string, linkLabel: string) {
      this.link = link
      this.linkLabel = linkLabel
    },
    setSuccess (msg: string) {
      this.success = msg
      this.error = ''
    },
    setError (msg: string) {
      this.error = msg
      this.success = ''
    },
    clear () {
      this.clearError()
      this.success = ''
    },
    clearSuccess () {
      this.success = ''
    },
    clearError () {
      this.error = ''
      this.link = ''
      this.linkLabel = ''
    }
  }
})

if (import.meta.hot) { import.meta.hot.accept(acceptHMRUpdate(useAlertStore, import.meta.hot)) }
