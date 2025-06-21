<template>
  <div class="pa-4">
    <h1 class="text-h5 mb-4">Gestión de Instructores</h1>

    <v-btn color="primary" class="mb-4" @click="abrirFormulario">
      Crear Profesor
    </v-btn>

    <v-btn color="secondary" class="mb-4 ml-2" @click="router.push('/especialistas-inactivos')">
      Ver Inactivos
    </v-btn>

    <!-- Formulario deslizante -->
    <v-slide-y-transition>
      <div v-if="mostrarFormulario">
        <FormEspecialista
          :mode="modoFormulario"
          :initial-data="especialistaEditando"
          @guardado="alGuardar"
          @cancelar="mostrarFormulario = false"
        />
      </div>
    </v-slide-y-transition>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :items-length="total"
      :loading="loading"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      class="elevation-1"
    >
      <template #item.disponibilidades="{ item }: { item: any }">
        <ul v-if="item.disponibilidades.length">
          <li v-for="(disp, i) in item.disponibilidades" :key="i">
            {{ disp.diaSemana }}: {{ formatHora(disp.horaInicio) }} - {{ formatHora(disp.horaFin) }}
          </li>
        </ul>
        <span v-else>No disponible</span>
      </template>

      <template #item.acciones="{ item }: { item: any }">
        <div class="d-flex ga-2">
          <v-btn icon size="small" color="primary" @click="editar(item)">
            <v-icon size="small">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" @click="confirmarEliminacion(item)">
            <v-icon size="small">mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table-server>

    <v-snackbar v-model="snackbar" :color="snackbarColor" location="top right">
      {{ snackbarMensaje }}
    </v-snackbar>

    <v-dialog v-model="dialogEliminar" max-width="400">
      <v-card>
        <v-card-title>¿Eliminar Instructor?</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar a
          <strong>{{ especialistaAEliminar?.nombreCompleto }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn color="error" text @click="eliminar">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import EspecialistaService from '@/services/EspecialistaService'
import FormEspecialista from '@/components/FormInstructor.vue'

const router = useRouter()
const items = ref([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const itemsPerPage = ref(5)

const mostrarFormulario = ref(false)
const modoFormulario = ref<'crear' | 'editar'>('crear')
const especialistaEditando = ref<any>(null)

const headers = [
  { title: 'Nombre', key: 'nombreCompleto' },
  { title: 'Área', key: 'especialidad.nombre' },
  { title: 'Número de documento', key: 'registroProfesional' },
  { title: 'Horario de Clases', key: 'disponibilidades' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

async function cargarDatos() {
  loading.value = true
  const { data, meta } = await EspecialistaService.getAll({
    page: page.value,
    limit: itemsPerPage.value,
  })
  items.value = data
  total.value = meta.total
  loading.value = false
}

onMounted(cargarDatos)
watch([page, itemsPerPage], cargarDatos)

function abrirFormulario() {
  modoFormulario.value = 'crear'
  especialistaEditando.value = null
  mostrarFormulario.value = true
}

function editar(item: any) {
  modoFormulario.value = 'editar'
  especialistaEditando.value = JSON.parse(JSON.stringify(item))
  mostrarFormulario.value = true
}

const snackbar = ref(false)
const snackbarMensaje = ref('')
const snackbarColor = ref('success')

function mostrarSnackbar(texto: string, color = 'success') {
  snackbarMensaje.value = texto
  snackbarColor.value = color
  snackbar.value = true
}

function alGuardar() {
  mostrarFormulario.value = false
  cargarDatos()
  mostrarSnackbar(
    modoFormulario.value === 'crear'
      ? 'Especialista creado correctamente'
      : 'Especialista actualizado correctamente'
  )
}

const dialogEliminar = ref(false)
const especialistaAEliminar = ref<any>(null)

function confirmarEliminacion(item: any) {
  especialistaAEliminar.value = item
  dialogEliminar.value = true
}

async function eliminar() {
  if (!especialistaAEliminar.value?.id) return

  try {
    await EspecialistaService.delete(especialistaAEliminar.value.id)
    mostrarSnackbar('Especialista eliminado correctamente', 'error')
    await cargarDatos()
  } catch (error) {
    mostrarSnackbar('Error al eliminar', 'warning')
  } finally {
    dialogEliminar.value = false
  }
}

function formatHora(hora: string) {
  if (!hora) return ''
  const [h, m] = hora.split(':')
  const date = new Date()
  date.setHours(parseInt(h), parseInt(m), 0)
  return date.toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
</script>
