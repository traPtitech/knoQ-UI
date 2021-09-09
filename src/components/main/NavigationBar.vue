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

    <v-menu v-model="menu" offset-y>
      <template #activator="{ on }">
        <v-btn text class="text--secondary" v-on="on">
          <user-avatar
            v-if="me"
            size="36"
            :user-id="me.name"
            :user-icon="me.icon"
            class="mr-2"
          />
          <span v-if="me">{{ me.name }}</span>
          <v-icon small>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item :to="'/settings/ical'">
          <v-list-item-icon>
            <v-icon>mdi-access-point</v-icon>
          </v-list-item-icon>
          <v-list-item-title>カレンダー配信設定</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { ResponseUser } from '@/api'

@Component({
  components: {
    UserAvatar,
  },
})
export default class NavigationBar extends Vue {
  menu: boolean = false

  @Emit('click-nav-icon')
  onClickNavIcon() {}

  get color(): string {
    return this.$vuetify.breakpoint.smAndDown ? 'white' : 'background'
  }

  get me(): ResponseUser | null {
    return this.$store.direct.state.me
  }
}
</script>
