<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="text-h6">{{ mensaje }}</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" text @click="confirmar">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)
const mensaje = ref('¿Estás seguro?')
let accion: (() => void) | null = null

function open(mensajeTexto: string, fn: () => void) {
  mensaje.value = mensajeTexto
  accion = fn
  dialog.value = true
}

function confirmar() {
  dialog.value = false
  if (accion) accion()
}

defineExpose({ open })
</script>
