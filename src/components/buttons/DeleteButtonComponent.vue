<!-- src/components/buttons/DeleteButtonComponent.vue -->
<template>
  <v-btn icon color="error" @click="abrirConfirmacion">
    <v-icon>mdi-delete</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'confirm'): void
}>()

function abrirConfirmacion() {
  if (confirm('¿Estás seguro de eliminar este elemento?')) {
    emit('confirm')
  }
}
</script>
