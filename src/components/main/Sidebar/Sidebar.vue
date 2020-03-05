<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :mobile-break-point="$vuetify.breakpoint.thresholds.sm"
  >
    <template #prepend>
      <Header />
    </template>

    <Navigation />

    <template #append>
      <Footer />
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import Header from '@/components/main/Sidebar/Header.vue'
import Navigation from '@/components/main/Sidebar/Navigation.vue'
import Footer from '@/components/main/Sidebar/Footer.vue'

@Component({
  components: {
    Header,
    Navigation,
    Footer,
  },
})
export default class Sidebar extends Vue {
  @Prop() value: boolean | null

  get drawer(): boolean | null {
    return this.value
  }
  set drawer(value: boolean) {
    this.$emit('input', value)
  }
}
</script>
