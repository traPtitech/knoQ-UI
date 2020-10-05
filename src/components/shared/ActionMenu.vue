<template>
  <v-menu offset-y>
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <slot>
        <v-list-item>
          <v-list-item-subtitle> No action available </v-list-item-subtitle>
        </v-list-item>
      </slot>
    </v-list>
  </v-menu>
</template>

<script>
export default { name: 'ActionMenu' }
</script>
