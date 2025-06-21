<!-- src/components/buttons/CreateButtonComponent.vue -->
<template>
  <v-btn color="primary" class="mb-4" @click="$emit('open')">
    <v-icon left>mdi-plus</v-icon>
    Crear {{ label || resource }}
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  resource?: string
  label?: string
}>()

defineEmits<{
  (e: 'open'): void
}>()
</script>
