<template>
  <v-card class="px-3">
    <v-list>
      <template v-for="(event, i) in events">
        <v-list-item :key="event.name">
          <v-row align="center" style="width: 100%;">
            <v-col class="flex-grow-0 text-no-wrap text--secondary">
              {{ event.date }}
            </v-col>
            <v-col class="text-truncate">
              {{ event.name }}
            </v-col>
            <v-col class="flex-grow-0">
              <v-btn small outlined color="primary">EDIT</v-btn>
            </v-col>
          </v-row>
        </v-list-item>
        <v-divider :key="i" />
      </template>
      <v-list-item>
        <v-list-item-content>
          <v-btn depressed color="primary">
            <v-icon small>mdi-plus</v-icon>
            CREATE NEW EVENT
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YourEvents extends Vue {
  get events() {
    return [
      {
        name: 'afo',
        date: '12/31',
      },
      {
        name: 'fooooooooooooooooooooooooooooooooooooooooooooooooooooo',
        date: '12/31',
      },
      {
        name: 'bar',
        date: '12/31',
      },
      {
        name: 'baz',
        date: '01/01',
      },
      {
        name: 'qux',
        date: '01/01',
      },
      {
        name: 'quux',
        date: '01/03',
      },
    ]
  }
}
</script>
