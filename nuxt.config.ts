import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: {
    transpile: [
      ...(isDev ? [] : ['@babel/runtime']),
      'lodash-es',
      // '@trpc',
      // 'trpc-nuxt',
    ]
  },
  imports: {
    dirs: [
      // Scan composables from nested directories
      'composables/**',
      'models/**',
      'store/**',
    ]
  },
  modules: [
    'nuxt-windicss',
    [
      '@pinia/nuxt',
      {
        autoImports: [
          'defineStore'// import { defineStore } from 'pinia'
          // ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
        ]
      }
    ]
  ],
  css: [
    // windi preflight
    'virtual:windi-base.css',
    // your stylesheets which overrides the preflight
    '@/assets/main.css',
    // windi extras
    'virtual:windi-components.css',
    'virtual:windi-utilities.css'
  ],
  vite: {
    ssr: {
      noExternal: [
        'lodash-es',
        /vue-i18n/,
        'ant-design-vue',
        '@ant-design/icons-vue',
        // '@prisma/client',
      ]
    },
    plugins: [
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true })],
      }),
    ]
  },
  typescript: {
    strict: true // required to make input/output types work
  }
})
