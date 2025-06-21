<template>
  <div class="pa-4">
    <h1 class="text-h5 mb-4">Gestión de Áreas</h1>

    <CreateButtonComponent resource="área" label="Área" @open="abrirFormulario" />

    <v-slide-y-transition>
      <div v-if="mostrarFormulario" class="mb-4">
        <FormAreaView
          :mode="modoFormulario"
          :initial-data="areaEditando"
          @cancelar="cerrarFormulario"
          @guardado="alGuardar"
        />
      </div>
    </v-slide-y-transition>

    <v-data-table-server
      :headers="headers"
      :items="areas"
      :items-length="total"
      :loading="loading"
      :items-per-page="itemsPerPage"
      :page="page"
      class="elevation-1"
      @update:page="onPageChange"
      @update:items-per-page="onItemsPerPageChange"
    >
      <template #top>
        <v-text-field
          v-model="search"
          label="Buscar área"
          prepend-inner-icon="mdi-magnify"
          hide-details
          density="compact"
          class="ma-2"
          @input="onSearchChange"
        />
      </template>

      <template #[`item.acciones`]="{ item }">
        <div class="d-flex align-center">
          <UpdateButtonComponent class="me-2" size="small" @click="editarArea(item)" />
          <DeleteButtonComponent size="small" @confirm="eliminarArea(item.id)" />
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AreaService from '@/services/AreaService'
import FormAreaView from '@/components/form-area-view.vue'
import CreateButtonComponent from '@/components/buttons/CreateButtonComponent.vue'
import UpdateButtonComponent from '@/components/buttons/UpdateButtonComponent.vue'
import DeleteButtonComponent from '@/components/buttons/DeleteButtonComponent.vue'

const areas = ref([])
const total = ref(0)
const page = ref(1)
const itemsPerPage = ref(10)
const search = ref('')
const loading = ref(false)

const mostrarFormulario = ref(false)
const modoFormulario = ref<'crear' | 'editar'>('crear')
const areaEditando = ref<any>(null)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'nombre' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

async function recargar() {
  loading.value = true
  const res = await AreaService.getPaginated(page.value, search.value, itemsPerPage.value)
  areas.value = res.data
  total.value = res.total
  loading.value = false
}

function onPageChange(newPage: number) {
  page.value = newPage
  recargar()
}

function onItemsPerPageChange(newLimit: number) {
  itemsPerPage.value = newLimit
  recargar()
}

function onSearchChange() {
  page.value = 1
  recargar()
}

function abrirFormulario() {
  modoFormulario.value = 'crear'
  areaEditando.value = null
  mostrarFormulario.value = true
}

function editarArea(item: any) {
  modoFormulario.value = 'editar'
  areaEditando.value = { ...item }
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
}

async function eliminarArea(id: number) {
  await AreaService.destroy(id)
  recargar()
}

function alGuardar() {
  cerrarFormulario()
  recargar()
}

onMounted(recargar)
</script>