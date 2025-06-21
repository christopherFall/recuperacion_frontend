<template>
  <div class="form-wrapper">
    <v-form @submit.prevent="submit" v-model="formIsValid" ref="formRef">
      <v-text-field
        v-model="form.nombre_completo"
        label="Nombre completo"
        :rules="[rules.required, rules.minLengthName]"
        dense
        hide-details="auto"
      />

      <v-select
        v-model="form.especialidad_id"
        :items="especialidades"
        item-title="nombre"
        item-value="id"
        label="Área"
        :rules="[rules.required]"
        dense
        hide-details="auto"
      />

      <v-text-field
        v-model="form.registro_profesional"
        label="Número de Cédula"
        :rules="[rules.required, rules.minLengthCedula, rules.maxLengthCedula]"
        dense
        hide-details="auto"
      />

      <h3 class="mt-4 mb-2">CLASES SEMANALES (Agregar horario semanal)</h3>
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
          dense
          hide-details="auto"
        />
        <v-text-field
          v-model="d.hora_inicio"
          type="time"
          label="Hora inicio"
          dense
          hide-details="auto"
        />
        <v-text-field
          v-model="d.hora_fin"
          type="time"
          label="Hora fin"
          dense
          hide-details="auto"
        />
        <v-btn icon @click="form.disponibilidades.splice(index, 1)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <div class="d-flex ga-2 mt-4 justify-center">
        <v-btn variant="tonal" @click="agregarDisponibilidad">Agregar horario</v-btn>
        <v-btn type="submit" color="primary">Guardar</v-btn>
        <v-btn @click="emit('cancelar')">Cancelar</v-btn>
      </div>
    </v-form>
  </div>
</template>

<style scoped>
.form-wrapper {
  max-width: 800px;
  margin: 0 auto;
}
</style>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import EspecialistaService from '@/services/InstructorService'
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

const formIsValid = ref(false)
const formRef = ref()

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  minLengthName: (v: string) => (v?.length >= 3) || 'Mínimo 3 caracteres',
  minLengthCedula: (v: string) => (v?.length >= 9) || 'Mínimo 9 caracteres',
  maxLengthCedula: (v: string) => (v?.length <= 10) || 'Máximo 10 caracteres',
}

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
  const response = await EspecialidadService.getAll()
  especialidades.value = response.data || []
})

// Llenar el form al editar
const oldDisponibilidades = ref<any[]>([])

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
          id: d.id,
          dia_semana: d.diaSemana,
          hora_inicio: d.horaInicio,
          hora_fin: d.horaFin,
        })) ?? [],
      }

      // Clonamos para detectar cambios
      oldDisponibilidades.value = JSON.parse(JSON.stringify(form.value.disponibilidades))
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
  const formValid = await formRef.value?.validate()
  if (!formValid.valid) return

  if (tieneTraslapes(form.value.disponibilidades)) {
    alert('Hay horarios traslapados en la disponibilidad.')
    return
  }

  if (props.mode === 'crear') {
    const { id } = await EspecialistaService.create(form.value)
    for (const d of form.value.disponibilidades) {
      await EspecialistaService.createDisponibilidad({
        especialista_id: id,
        dia_semana: d.dia_semana,
        hora_inicio: d.hora_inicio,
        hora_fin: d.hora_fin,
      })
    }
  } else {
    const id = form.value.id
    await EspecialistaService.update(id, {
      nombre_completo: form.value.nombre_completo,
      especialidad_id: form.value.especialidad_id,
      registro_profesional: form.value.registro_profesional,
    })

    const nuevas = form.value.disponibilidades
    const antiguas = oldDisponibilidades.value

    const nuevasSinId = nuevas.filter((d) => !d.id)
    const editadas = nuevas.filter(
      (d) =>
        d.id &&
        antiguas.some(
          (o) =>
            o.id === d.id &&
            (o.dia_semana !== d.dia_semana || o.hora_inicio !== d.hora_inicio || o.hora_fin !== d.hora_fin)
        )
    )
    const eliminadas = antiguas.filter((o) => !nuevas.some((n) => n.id === o.id))

    for (const d of eliminadas) {
      await EspecialistaService.deleteDisponibilidad(d.id)
    }

    for (const d of editadas) {
      await EspecialistaService.updateDisponibilidad(d.id, {
        dia_semana: d.dia_semana,
        hora_inicio: d.hora_inicio,
        hora_fin: d.hora_fin,
      })
    }

    for (const d of nuevasSinId) {
      await EspecialistaService.createDisponibilidad({
        especialista_id: id,
        dia_semana: d.dia_semana,
        hora_inicio: d.hora_inicio,
        hora_fin: d.hora_fin,
      })
    }
  }

  emit('guardado')
}
</script>
