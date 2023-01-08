<template>
  <div class="DetailView">

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DetailViewOptions } from './types';

@Component({})
export default class DetailView extends Vue {

  @Prop()
  public detailOptions!: DetailViewOptions;

  @Prop()
  public entity!: object;

}
</script>

<style lang="scss">

</style>