<template>
  AAA
  <p>
    {{ data }} {{ loading }}
  </p>
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


const { data, loading } = useTRPCQuery((client) => client.hello.hi.query({ text: 'hi' }), [],
  { authenticated: false })

definePageMeta({
  layout: "admin",
});

useHead({
  title: 'Dashboard',
})
</script>

<script lang="ts">
export default {
  ssr: false // Disable Server Side rendering
}
</script>
