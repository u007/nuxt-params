<template>
  <div>
    Hi {{ $route.params.name }}
  </div>
  <nuxt-link to="/">
    back
  </nuxt-link>
</template>

<script lang="ts" setup>

const $route = useRoute()

definePageMeta({
  layout: "default",
});
</script>