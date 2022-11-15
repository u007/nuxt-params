<template>
  AAA
  <p>
    <nuxt-link to="/hi/abcme">
      abc
    </nuxt-link>
    <br />
  </p>
  <p>
    <nuxt-link to="/hi2/abcme">
      abc 2
    </nuxt-link>
  </p>
  <p>
    <nuxt-link to="/aaa/bbb/ccc">
      abc 3
    </nuxt-link>
  </p>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: "default",
});
</script>