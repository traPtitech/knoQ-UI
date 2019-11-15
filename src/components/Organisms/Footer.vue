<template>
  <v-footer color="grey lighten-2" absolute>
    <v-container>
      <v-row justify="center">
        <v-btn
          v-for="link in footerlinks"
          :key="link.head"
          class="mx-3"
          depressed
          small
          @click="openLink(link.src)"
        >
          {{ link.head }}
        </v-btn>
      </v-row>
      <v-row justify="end">
        QonPass 0.1.0
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {
  footerlinks: { head: string; src: string }[] = [
    {
      head: '使い方',
      src: 'https://md.trapti.tech/0spW8adnSyCUaV_wioVlWA',
    },
    {
      head: '質問・要望・報告',
      src: 'http://anke-to.sysad.trap.show/targeted',
    },
    {
      head: '進捗部屋の追加申告',
      src: 'https://q.trap.jp/channels/general/executive/room',
    },
  ]

  openLink = (link: string): Window => window.open(link)
}
</script>
