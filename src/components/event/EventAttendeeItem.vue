<template>
  <div>
    <v-row align="center" style="width: 100%">
      <v-col class="flex-grow-0 mr-n3 text-no-wrap">
        <v-sheet
          v-if="state === 'pending'"
          outlined
          rounded
          :style="{
            'border-color': $vuetify.theme.themes.light.secondary,
          }"
        >
          <span class="secondary--text ma-1">未定</span>
        </v-sheet>
        <v-sheet
          v-if="state === 'attendance'"
          outlined
          rounded
          :style="{
            'border-color': $vuetify.theme.themes.light.primary,
          }"
        >
          <span class="primary--text ma-1">参加</span>
        </v-sheet>
        <v-sheet
          v-if="state === 'absent'"
          outlined
          rounded
          style="border-color: #d3664f"
        >
          <span style="color: #d3664f" class="ma-1">欠席</span>
        </v-sheet>
      </v-col>
      <v-col class="flex-grow-0 mr-n3">
        <div>
          <user-avatar size="36" :user-id="name" :user-icon="icon" />
        </div>
      </v-col>
      <v-col class="text-no-wrap">
        <span>{{ name }} </span>
        <span v-if="isAdmin" class="secondary--text">(Admin)</span>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from '@/components/shared/UserAvatar.vue'

defineProps<{
  name?: string
  icon?: string
  state: string
  isAdmin: boolean
}>()
</script>
