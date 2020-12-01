<template>
  <div class="root" v-bind="this.$attrs">
    <div :class="classes" :style="style"></div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Backdrop extends Vue {
  @Prop({default: 'primary', type: String})
  public color: string | undefined;

  @Prop()
  public height: string | undefined;

  public get classes() {
    return [
      this.color,
      'backdrop'
    ];
  }

  public get style() {
    return {
      height: this.height
    }
  }
}
</script>

<style scoped>
.backdrop {
  position: absolute !important;
  width: 100%;
  top: 0;
  z-index: -1;
}
.root {
  position: relative;
  z-index: 0;
}

</style>
