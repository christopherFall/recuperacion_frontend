<template>
  <div class="pa-4">
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h5">INSTRUCTORES INACTIVOS</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-arrow-left"
        @click="$router.push('/')"
      >
        Volver a Instructores
      </v-btn>
    </div>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="total"
      :loading="loading"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      class="elevation-1"
    >
      <template #item.acciones="{ item }: { item: any }">
        <v-btn icon size="small" color="green" @click="restaurar(item)">
          <v-icon size="small">mdi-restore</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>

    <v-snackbar v-model="snackbar" :color="snackbarColor" location="top right">
      {{ snackbarMensaje }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import InstructorService from '@/services/InstructorService'

const router = useRouter()

const items = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const itemsPerPage = ref(5)

const headers = [
  { title: 'Nombre', key: 'nombreCompleto' },
  { title: 'Área', key: 'especialidad.nombre' },
  { title: 'Número de Documento', key: 'registroProfesional' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

async function cargarDatos() {
  loading.value = true
  const { data, meta } = await InstructorService.getInactivos()
  items.value = data
  total.value = meta.total
  loading.value = false
}

onMounted(cargarDatos)
watch([page, itemsPerPage], cargarDatos)

const snackbar = ref(false)
const snackbarMensaje = ref('')
const snackbarColor = ref('success')

function mostrarSnackbar(texto: string, color = 'success') {
  snackbarMensaje.value = texto
  snackbarColor.value = color
  snackbar.value = true
}

async function restaurar(item: any) {
  try {
    await InstructorService.restore(item.id)
    mostrarSnackbar('Instructor restaurado correctamente', 'success')
    await cargarDatos()
  } catch (error) {
    mostrarSnackbar('Error al restaurar', 'warning')
  }
}
</script>