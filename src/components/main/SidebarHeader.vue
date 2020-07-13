<template>
  <v-list-item class="mx-4 mt-3">
    <v-list-item-content class="d-block">
      <v-avatar>
        <img src="/logo.svg" class="logo-icon" />
      </v-avatar>
      <img src="/logotype.svg" class="logo-type" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default { name: 'SidebarHeader' }
</script>

<style scoped>
.logo-icon {
  width: 30px;
}

.logo-type {
  position: absolute;
  padding-left: 8px;
  padding-top: 10px;
  width: 80px;
}
</style>
