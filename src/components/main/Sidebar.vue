<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :mobile-break-point="$vuetify.breakpoint.thresholds.sm"
  >
    <template #prepend>
      <SidebarHeader />
    </template>

    <SidebarNavigation />

    <template #append>
      <SidebarFooter />
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import 'reflect-metadata'
import { Component, Prop } from 'vue-property-decorator'
import SidebarHeader from '@/components/main/SidebarHeader.vue'
import SidebarNavigation from '@/components/main/SidebarNavigation.vue'
import SidebarFooter from '@/components/main/SidebarFooter.vue'

@Component({
  components: {
    SidebarHeader,
    SidebarNavigation,
    SidebarFooter,
  },
})
export default class Sidebar extends Vue {
  @Prop() value!: boolean | null

  get drawer(): boolean | null {
    return this.value
  }
  set drawer(value: boolean | null) {
    this.$emit('input', value)
  }
}
</script>
