<template>
  <div>
    Hi {{ r.params.name }}
  </div>
  <nuxt-link to="/">
    back
  </nuxt-link>
</template>

<script lang="ts" setup>
const r = useRoute()
definePageMeta({
  layout: "default",
});
</script>