<template>
  <v-form ref="form" v-model="valid">
    <v-text-field
      v-model="placeInput"
      filled
      label="場所"
      :rules="$rules.eventPlace"
    />
    <v-text-field
      v-model="dateStartMem"
      filled
      label="開催日"
      :rules="
        $rules.eventDate &&
        $rules.eventTimeInstant(timeStartInput, timeEndInput)
      "
      type="date"
      @blur="setDefaultDateEnd"
    />
    <v-text-field
      v-model="timeStartMem"
      filled
      label="開始時刻"
      :rules="$rules.eventTimeInstant(timeStartInput, timeEndInput)"
      type="time"
    />
    <v-text-field
      v-model="dateEndMem"
      filled
      label="終了日"
      :rules="
        $rules.eventDate &&
        $rules.eventTimeInstant(timeStartInput, timeEndInput)
      "
      type="date"
    />
    <v-text-field
      v-model="timeEndMem"
      filled
      label="終了時刻"
      :rules="$rules.eventTimeInstant(timeStartInput, timeEndInput)"
      type="time"
    />
  </v-form>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { getIso8601, today } from '@/workers/date'

export type EventInputTimeAndPlaceInstant = {
  place: string
  timeStart: string
  timeEnd: string
}

const props = defineProps<{
  value: boolean
  eventInputTimeAndPlaceInstant: EventInputTimeAndPlaceInstant
}>()

const emit = defineEmits<{
  (
    e: 'update:eventInputTimeAndPlaceInstant',
    v: EventInputTimeAndPlaceInstant
  ): void
  (e: 'update:value', v: boolean): void
}>()

const placeInput = computed({
  get: () => props.eventInputTimeAndPlaceInstant.place,
  set: v =>
    emit('update:eventInputTimeAndPlaceInstant', {
      ...props.eventInputTimeAndPlaceInstant,
      place: v,
    }),
})

const timeStartInput = computed({
  get: () => props.eventInputTimeAndPlaceInstant.timeStart,
  set: v =>
    emit('update:eventInputTimeAndPlaceInstant', {
      ...props.eventInputTimeAndPlaceInstant,
      timeStart: v,
    }),
})

const timeEndInput = computed({
  get: () => props.eventInputTimeAndPlaceInstant.timeEnd,
  set: v =>
    emit('update:eventInputTimeAndPlaceInstant', {
      ...props.eventInputTimeAndPlaceInstant,
      timeEnd: v,
    }),
})

const valid = computed({
  get: () => props.value,
  set: v => emit('update:value', v),
})

const form = ref<{ validate(): void }>()
const dateStartMem = ref('')
const dateEndMem = ref('')
const timeStartMem = ref('')
const timeEndMem = ref('')

watch([timeStartInput, timeEndInput], async () => {
  if (!timeStartInput.value || !timeEndInput.value) return
  await nextTick()
  form.value?.validate()
})

watch([dateStartMem, timeStartMem], () => {
  if (dateStartMem.value && timeStartMem.value) {
    timeStartInput.value = getIso8601(dateStartMem.value, timeStartMem.value)
  }
})

watch([dateEndMem, timeEndMem], () => {
  if (dateEndMem.value && timeEndMem.value) {
    timeEndInput.value = getIso8601(dateEndMem.value, timeEndMem.value)
  }
})

const setDefaultDateEnd = () => {
  if (!dateEndMem.value) dateEndMem.value = dateStartMem.value
}
const dateMin = today()
</script>
