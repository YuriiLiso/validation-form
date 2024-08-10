<script setup lang="ts">
  import BaseInput from '@/components/BaseInput.vue'
  const inputValue = defineModel({ default: '' })
  // if need send number to server just use +inputValue

  const sendFormData = () => {
    console.log('sendFormData >>>', inputValue.value)
  }
</script>
<template>
  <form @submit.prevent="sendFormData" class="container">
    <BaseInput v-model="inputValue" :label="'Amount'" />
  </form>
</template>
