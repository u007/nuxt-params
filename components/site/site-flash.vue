<template>
  <div class="bg-red-100 p-2 relative" v-if="$alert.error">
    <a-button type="text" v-if="closable" @click="closeError" class="absolute right-2 top-1">
      <template #icon>
        <close-outlined />
      </template>
    </a-button>
    {{ $alert.error }}
    <span v-if="$alert.link">
      <RouterLink :to="$alert.link">
        {{ $alert.linkLabel }}
      </RouterLink>
    </span>
  </div>

  <div class="bg-green-200 p-2 relative" v-if="$alert.success">
    <a-button type="text" v-if="closable" @click="closeSuccess" class="absolute right-2 top-1">
      <template #icon>
        <close-outlined />
      </template>
    </a-button>
    {{ $alert.success }}
    <span v-if="$alert.link">
      <RouterLink :to="$alert.link">
        {{ $alert.linkLabel }}
      </RouterLink>
    </span>
  </div>
  <!-- <a-alert :message="$alert.error" v-if="$alert.error" type="error" closable />
  <a-alert :message="$alert.success" v-if="$alert.success" type="success" closable /> -->
</template>

<script lang="ts" setup>
import { CloseOutlined } from '@ant-design/icons-vue'
const props = defineProps({
  closable: {
    type: Boolean,
    default: true,
  },
})
const $alert = useAlertStore()
const closeError = () => {
  $alert.clearError()
}
const closeSuccess = () => {
  $alert.clearSuccess()
}

</script>