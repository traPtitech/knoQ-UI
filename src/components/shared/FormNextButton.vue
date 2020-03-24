<template>
  <v-btn depressed color="primary" v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-btn>
</template>

<script>
export default { name: 'FormNextButton' }
</script>
