<template>
  <v-btn to="/main" exact text :icon="small">
    <v-icon :left="!small">$cct</v-icon>
    {{ small ? '' : 'Portal' }}
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class PortalButton extends Vue {

  get small() {    
    return this.$vuetify.breakpoint.xsOnly;
  }

}
</script>

<style lang="scss">

</style>