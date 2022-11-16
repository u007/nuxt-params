<template>
  this is detail of CCC
  {{ $route.params.id }}
  <br />
  <RouterLink to="/aaa/bbb/ccc/">Back to list</RouterLink>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin"
})

</script>