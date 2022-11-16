<template>
  <div class="mt-4 p-2 text-center">
    Copyright 2022 ...
    <div class="float-right text-sm text-gray-400" v-if="$acl.currentUser?.id">
      ({{ $acl.currentUser.roles?.join(', ') }})
    </div>
  </div>
</template>

<script lang="ts" setup>
const $acl = useAclStore()

</script>