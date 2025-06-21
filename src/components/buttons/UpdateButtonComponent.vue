<!-- src/components/buttons/UpdateButtonComponent.vue -->
<template>
  <v-btn icon color="primary" @click="$emit('click')">
    <v-icon>mdi-pencil</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'click'): void
}>()
</script>
