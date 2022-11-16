<script lang="ts" setup>
import {
  DollarOutlined,
  MenuUnfoldOutlined,
  IdcardOutlined,
  UserOutlined,
  ShopOutlined,
  SettingOutlined,
  LogoutOutlined,
  DollarCircleOutlined,
  LayoutOutlined,
  ShoppingOutlined,
  TagOutlined,
  DownloadOutlined,
  MenuOutlined,
  RightOutlined,
} from '@ant-design/icons-vue'

import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { ROLES } from '@/constants/roles'

const $acl = useAclStore()
const $route = useRoute()
const $router = useRouter()
const isPhitomas = ref(false)

const openMenus = ref<string[]>([])
const preOpenKeys = ref<string[]>([])
const selectedMenus = ref<string[]>([])
const loaded = ref(false)
const collapsed = ref(false)
// console.log('$route.name', $route.name)

const theme = ref<'dark' | 'light'>('light')

const enabledMenus = ref({
  offer: true,
  offerAssignment: true,
  customer: true,
  wallet: true,
  delivery: true,
  outlet: true,
  cms: true,
})

onMounted(() => {
  switch ($route.name) {
    case 'cp1-users':
      selectedMenus.value.push('users')
      break
    default:
      if ($route.name) {
        const name = $route.name as string
        selectedMenus.value.push(name.substring(4, name.length))
      }
  }
  // console.log('selectedMenus', selectedMenus.value)
  // console.log('openMenus', openMenus.value)


  isPhitomas.value = window.location.hostname.startsWith('merchant.mercstudio')
  // if (isPhitomas.value) {
  //   enabledMenus.value.offer = false
  //   enabledMenus.value.offerAssignment = false
  //   enabledMenus.value.customer = false
  //   enabledMenus.value.wallet = false
  //   enabledMenus.value.delivery = false
  //   enabledMenus.value.outlet = false
  //   enabledMenus.value.cms = false
  // }
  // loaded.value = true
})

// const sideBarCollapsed = computed(() => store.getters[`env/sidebarCollapsed`])

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  openMenus.value = collapsed.value ? [] : preOpenKeys.value;
}
// const currentUser = ref<AuthUser | null>(store.state.session.currentUser)
const currentUser = computed(() => $acl.currentUser)
// watch(store.state.session.currentUser, (val) => {
//   console.log('currentuser changed', val)
//   currentUser.value = val
// })
// const currentUser = store.getters[`session/currentUser`]
watch(openMenus, async (previous, current) => {
  console.log('openMenus', current)
  preOpenKeys.value = previous
})

const logout = async () => {
  await $acl.logout()
  window.location.href = '/auth';
}
// const { logout } = mapActions({
//   logout: 'session/logout',
// })
const isSuperAdmin = computed(() => currentUser.value?.roles?.includes(ROLES.SUPER))

const adminSales = computed(() => {
  return isSuperAdmin.value || currentUser.value?.roles?.includes(ROLES.ADMIN_SALES)
})

const adminHr = computed(() => {
  return isSuperAdmin.value || currentUser.value?.roles?.includes(ROLES.ADMIN_HR)
})

const adminMerch = computed(() => {
  return isSuperAdmin.value || currentUser.value?.roles?.includes(ROLES.ADMIN_MERCH)
})

const adminSuper = computed(() => {
  return isSuperAdmin.value || currentUser.value?.roles?.includes(ROLES.ADMIN_ALL)
}) 
</script>

<template>
  <a-layout-sider collapsible v-model:collapsed="collapsed" width="250" :theme="theme" breakpoint="md"
    collapsed-width="3em" style="min-height: 90v" class="ALayoutSlider">
    <div class="logo flex" style="font">
      <router-link to="/cp1" class="w-full">
        <!-- <img
          v-if="loaded && !isPhitomas"
          src="@/assets/logo.png"
          style="width: 70%; max-width: 120px"
          class="mx-auto"
        /> -->

        <!-- <img src="/img/logo.png" style="width: 70%; max-width: 120px" class="mx-auto" /> -->
      </router-link>
      <!-- <a-button type="text" class="p-0" @click="toggleCollapsed">
        <template #icon>
          <MenuOutlined />
        </template>
      </a-button> -->
    </div>
    <div>

    </div>
    <div v-if="!currentUser || !currentUser.uid" class="profile">
      <router-link to="/auth">Login</router-link>
    </div>

    <a-menu class="mt-2" v-if="currentUser && currentUser.uid" mode="inline" :inline-indent="12"
      v-model:open-keys="openMenus" v-model:selected-keys="selectedMenus" :theme="theme">
      <!-- <a-menu-item key="commCoverages">
        <DollarOutlined />
        <router-link to="/cp1/commCoverages" class="member_menu menu_course">Commission Coverage</router-link>
      </a-menu-item> -->
      <a-menu-item key="dashboard">
        <template #icon>
          <LayoutOutlined />
        </template>
        <router-link to="/cp1/" class="member_menu menu_course">Dashboard</router-link>
      </a-menu-item>

      <!-- <a-sub-menu key="subSales" v-if="adminSales || adminSuper">
        <template #icon>
          <DollarOutlined />
        </template>
        <template #title>
          <span class="ml-2.5">Sales</span>
        </template>
        <a-menu-item key="orderReports">
          <router-link to="/cp1/orderReports" class="member_menu menu_course">Sales Report</router-link>
        </a-menu-item>
      </a-sub-menu> -->

      <a-sub-menu key="subPromoter" v-if="adminSales || adminSuper">
        <template #icon>
          <UserOutlined />
        </template>
        <template #title>
          <span class="ml-2.5">Promoter</span>
        </template>
        <a-menu-item key="promoterReports">
          <template #icon>
            <RightOutlined />
          </template>
          <router-link to="/cp1/promoter/promoterSelection" class="member_menu menu_course">
            Reports
          </router-link>
        </a-menu-item>
        <a-menu-item key="promoterSettings">
          <template #icon>
            <RightOutlined />
          </template>
          <router-link to="/cp1/promoter/settings" class="member_menu menu_course">
            Settings
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-sub-menu key="subMerchandiser" v-if="adminMerch || adminSuper">
        <template #icon>
          <ShoppingOutlined />
        </template>
        <template #title>
          <span class="ml-2.5">Merchandiser</span>
        </template>
        <a-menu-item key="users">
          <UserOutlined />
          <router-link to="/cp1/users" class="member_menu menu_course">
            Users
          </router-link>
        </a-menu-item>
      </a-sub-menu>

      <a-menu-item key="staffAttendance" v-if="adminHr || adminSuper">
        <template #icon>
          <IdcardOutlined />
        </template>
        <router-link to="/cp1/staffAttendance" class="member_menu menu_course">
          Staff Attendance
        </router-link>
      </a-menu-item>
      <a-menu-item key="marketIntelligence" v-if="adminSales || adminSuper">
        <template #icon>
          <TagOutlined :rotate="270" />
        </template>
        <router-link to="/cp1/marketIntelligence" class="member_menu menu_course">
          Market Intelligence
        </router-link>
      </a-menu-item>

      <a-sub-menu key="subAdminSettings" v-if="adminHr || adminSuper">
        <template #icon>
          <SettingOutlined />
        </template>
        <template #title>
          <span class="ml-2.5">Administration Settings</span>
        </template>
        <a-menu-item key="manageEmployees">
          <router-link to="/cp1/adminSettings/employees" class="member_menu menu_course">
            Manage Employees
          </router-link>
        </a-menu-item>
        <a-menu-item key="manageProducts">
          <router-link to="/cp1/adminSettings/products" class="member_menu menu_course">
            Manage Products
          </router-link>
        </a-menu-item>
        <a-menu-item key="manageOutlets">
          <router-link to="/cp1/adminSettings/outlets" class="member_menu menu_course">
            Manage Outlets
          </router-link>
        </a-menu-item>
        <a-menu-item key="manageStockCount">
          <router-link to="/cp1/adminSettings/stock" class="">
            Manage Stock Count
          </router-link>
        </a-menu-item>
        <a-menu-item key="manageRoles">
          <router-link to="/cp1/adminSettings/roles" class="member_menu menu_course">
            Manage Roles
          </router-link>
        </a-menu-item>
      </a-sub-menu>

    </a-menu>

    <!-- <div v-if="currentUser" class="my-2 px-2">
      <a-button
        class="mt-2 mb-2 max-w-full w-full"
        type="primary"
        size="small"
        @click="logout"
      >
        <span class="hidden md:block">Log-out</span>
        <LogoutOutlined />
      </a-button>
    </div> -->
    <div class="my-4" style="height: 400px"></div>
  </a-layout-sider>
</template>

<style lang="scss">
.profile {
  text-align: center;
}

@media print {
  .ALayoutSlider {
    display: none;
  }
}
</style>
