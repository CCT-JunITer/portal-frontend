<template>
  <v-btn :to="to" exact text :icon="small">
    <v-icon :left="!small">$cct</v-icon>
    {{ small ? '' : 'Portal' }}
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class PortalButton extends Vue {

  @Prop({ default: '/main' })
  public to!: string;

  get small() {    
    return this.$vuetify.breakpoint.xsOnly;
  }

}
</script>

<style lang="scss">

</style>