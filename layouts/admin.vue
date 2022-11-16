<template>
  <a-layout id="components-layout-demo-custom-trigger" class="min-h-full">
    <site-sidebar />
    <a-layout>
      <a-layout-header class="bg-gray-100 px-2">
        {{ $nav.title }}
        <div class="float-right">
          <a-dropdown-button>
            Welcome, {{ $acl.currentDisplayName }}
            <template #overlay v-if="$acl.currentUser?.id">
              <a-menu>
                <a-menu-item key="1">
                  <UserOutlined />
                  Profile
                </a-menu-item>
                <a-menu-item key="2" @click="logout()">
                  <UserOutlined />
                  Log out
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown-button>

        </div>
      </a-layout-header>

      <a-layout-content class="contentBody">
        <site-flash />
        <div class="px-4">
          <slot />
        </div>
      </a-layout-content>

      <site-footer />
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
const $acl = useAclStore()
const $nav = useNavStore()

const logout = async () => {
  await $acl.logout()
  window.location.href = '/auth';
}

</script>

<style lang="scss" scoped>
@import '@/assets/cp.css';
</style>