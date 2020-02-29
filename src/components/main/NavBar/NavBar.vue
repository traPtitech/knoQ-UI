<template>
  <v-app-bar app :color="color" :elevation="elevation">
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

    <Avatar size="36" :traq-id="me" />
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'
import Avatar from '@/components/shared/Avatar.vue'

@Component({
  components: {
    Avatar,
  },
})
export default class NavBar extends Vue {
  @Emit('toggleDrawer')
  onClickNavIcon() {}

  get color(): string {
    return this.$vuetify.breakpoint.smAndDown ? 'white' : 'background'
  }

  get elevation(): number {
    return this.$vuetify.breakpoint.smAndDown ? 3 : 0
  }

  get me(): string {
    const me = this.$store.direct.state.me
    return me ? me.userId : null
  }
}
</script>
