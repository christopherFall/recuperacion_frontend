<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="form.nombre_completo"
      label="Nombre completo"
      required
    />
    <v-select
      v-model="form.especialidad_id"
      :items="especialidades"
      item-title="nombre"
      item-value="id"
      label="Área"
      required
    />
    <v-text-field
      v-model="form.registro_profesional"
      label="Número de Cedula"
      required
    />

    <h3 class="mt-4 mb-2">Clases semanales</h3>
    <div
      v-for="(d, index) in form.disponibilidades"
      :key="index"
      class="d-flex align-center ga-2 mb-2"
    >
      <v-select
        v-model="d.dia_semana"
        :items="dias"
        label="Día"
        class="flex-1"
        required
      />
      <v-text-field v-model="d.hora_inicio" type="time" label="Hora inicio" />
      <v-text-field v-model="d.hora_fin" type="time" label="Hora fin" />
      <v-btn icon @click="form.disponibilidades.splice(index, 1)">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <div class="d-flex ga-2 mt-4">
      <v-btn variant="tonal" @click="agregarDisponibilidad">Agregar horario</v-btn>
      <v-btn type="submit" color="primary">Guardar</v-btn>
      <v-btn @click="emit('cancelar')">Cancelar</v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import EspecialistaService from '@/services/EspecialistaService'
import EspecialidadService from '@/services/EspecialidadService'

const props = defineProps<{
  mode: 'crear' | 'editar'
  initialData?: any
}>()

const emit = defineEmits<{
  (e: 'cancelar'): void
  (e: 'guardado'): void
}>()

const form = ref({
  id: undefined,
  nombre_completo: '',
  especialidad_id: null,
  registro_profesional: '',
  disponibilidades: [],
})

const dias = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
]

const especialidades = ref([])

onMounted(async () => {
  const data = await EspecialidadService.getAll()
  especialidades.value = data
})

// Llenar el form al editar
watch(
  () => props.initialData,
  (newVal) => {
    if (props.mode === 'editar' && newVal) {
      form.value = {
        id: newVal.id,
        nombre_completo: newVal.nombreCompleto,
        especialidad_id: newVal.especialidadId,
        registro_profesional: newVal.registroProfesional,
        disponibilidades: newVal.disponibilidades?.map((d: any) => ({
          dia_semana: d.diaSemana,
          hora_inicio: d.horaInicio,
          hora_fin: d.horaFin,
        })) ?? [],
      }
    }
  },
  { immediate: true }
)

function agregarDisponibilidad() {
  form.value.disponibilidades.push({
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
  })
}

// 🔥 Validación de traslapes frontend
function tieneTraslapes(disponibilidades: any[]): boolean {
  const porDia: Record<string, { inicio: string; fin: string }[]> = {}

  for (const d of disponibilidades) {
    if (!porDia[d.dia_semana]) {
      porDia[d.dia_semana] = []
    }
    porDia[d.dia_semana].push({ inicio: d.hora_inicio, fin: d.hora_fin })
  }

  for (const dia in porDia) {
    const bloques = porDia[dia].sort((a, b) => a.inicio.localeCompare(b.inicio))
    for (let i = 0; i < bloques.length - 1; i++) {
      const actual = bloques[i]
      const siguiente = bloques[i + 1]
      if (actual.fin > siguiente.inicio) {
        return true
      }
    }
  }

  return false
}

async function submit() {
  if (tieneTraslapes(form.value.disponibilidades)) {
    alert('Hay horarios traslapados en la disponibilidad. Revisa los bloques de tiempo.')
    return
  }

  if (props.mode === 'crear') {
    await EspecialistaService.create(form.value)
  } else {
    if (!form.value.id) {
      console.error('ID no definido para actualización')
      return
    }

    await EspecialistaService.update(form.value.id, {
      nombre_completo: form.value.nombre_completo,
      especialidad_id: form.value.especialidad_id,
      registro_profesional: form.value.registro_profesional,
    })

    const especialistaId = form.value.id
    const old = await EspecialistaService.getById(especialistaId)
    for (const d of old.disponibilidades) {
      await EspecialistaService.deleteDisponibilidad(d.id)
    }

    for (const nueva of form.value.disponibilidades) {
      await EspecialistaService.createDisponibilidad({
        especialista_id: especialistaId,
        dia_semana: nueva.dia_semana,
        hora_inicio: nueva.hora_inicio,
        hora_fin: nueva.hora_fin,
      })
    }
  }

  emit('guardado')
}
</script>
