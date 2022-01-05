<template>
  <v-btn :to="to" exact text :icon="small">
    <v-badge :value="env !== 'production'" :content="env" light color="cctOrange">
      <v-icon :left="!small">$cct</v-icon>
      {{ small ? '' : 'Portal' }}
    </v-badge>
  </v-btn>
</template>

<script lang="ts">
import { env } from '@/env';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class PortalButton extends Vue {

  public env = env;

  @Prop({ default: '/main' })
  public to!: string;

  get small() {    
    return this.$vuetify.breakpoint.xsOnly;
  }

}
</script>

<style lang="scss">

</style>