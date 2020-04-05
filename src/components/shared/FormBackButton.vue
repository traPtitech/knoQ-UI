<template>
  <v-btn depressed v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-btn>
</template>

<script>
export default { name: 'FormBackButton' }
</script>
