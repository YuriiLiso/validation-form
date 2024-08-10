<script setup lang="ts">
  import Form from '@/components/Form.vue'
  import MainHeader from './components/MainHeader.vue'
</script>

<template>
  <header class="fixed left-0 right-0">
    <MainHeader />
  </header>

  <main class="flex h-full bg-gray-900 px-4">
    <Form class="m-auto" />
  </main>

  <footer></footer>
</template>

<style scoped></style>
