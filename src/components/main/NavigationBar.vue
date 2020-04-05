<template>
  <v-app-bar app :color="color" :flat="$vuetify.breakpoint.mdAndUp">
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.smAndDown"
      @click="onClickNavIcon"
    >
      <v-icon>mdi-menu</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="headline">
      {{ $route.meta.headerTitle }}
    </v-toolbar-title>

    <v-spacer />

    <TrapAvatar v-if="me" size="36" :traq-id="me" />
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'
import TrapAvatar from '@/components/shared/TrapAvatar.vue'

@Component({
  components: {
    TrapAvatar,
  },
})
export default class NavigationBar extends Vue {
  @Emit('click-nav-icon')
  onClickNavIcon() {}

  get color(): string {
    return this.$vuetify.breakpoint.smAndDown ? 'white' : 'background'
  }

  get me(): string {
    return this.$store.direct.state.me?.name
  }
}
</script>
