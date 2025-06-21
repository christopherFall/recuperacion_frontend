<template>
  <v-form ref="formRef" v-model="formIsValid">
    <v-text-field
      label="Nombre del área"
      v-model="form.nombre"
      :rules="[rules.required, rules.minLength]"
      class="mb-4"
    />

    <div class="d-flex ga-2">
      <v-btn
        color="primary"
        :disabled="!formIsValid || loading"
        @click="confirmarGuardado"
      >
        {{ mode === 'crear' ? 'Crear' : 'Actualizar' }}
      </v-btn>
      <v-btn variant="tonal" @click="emit('cancelar')">Cancelar</v-btn>
    </div>

    <ConfirmDialog ref="confirmDialog" />
  </v-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AreaService from '@/services/AreaService'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const props = defineProps<{
  mode: 'crear' | 'editar'
  initialData?: any
}>()

const emit = defineEmits<{
  (e: 'guardado'): void
  (e: 'cancelar'): void
}>()

const form = ref({
  id: undefined,
  nombre: '',
})

const formRef = ref()
const formIsValid = ref(false)
const confirmDialog = ref()
const loading = ref(false)

const rules = {
  required: (v: any) => !!v || 'Este campo es obligatorio',
  minLength: (v: string) => v.length >= 3 || 'Mínimo 3 caracteres',
}

watch(
  () => props.initialData,
  (val) => {
    if (props.mode === 'editar' && val) {
      form.value = { ...val }
    }
  },
  { immediate: true }
)

function confirmarGuardado() {
  confirmDialog.value?.open(
    `¿Estás seguro de ${props.mode === 'crear' ? 'crear' : 'actualizar'} esta área?`,
    guardar
  )
}

async function guardar() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  loading.value = true

  if (props.mode === 'crear') {
    await AreaService.create({ nombre: form.value.nombre })
  } else {
    await AreaService.update(form.value.id, { nombre: form.value.nombre })
  }

  loading.value = false
  emit('guardado') // esto ya cierra el formulario desde el padre
}
</script>
