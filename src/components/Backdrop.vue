<template>
  <div class="root">
    <div :class="'backdrop'" :style="`background-color: ${backgroundColor};`"></div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Backdrop extends Vue {
  @Prop({default: 'primary', type: String})
  public color: string | undefined;

  public get backgroundColor() {
    return this.color && this.$vuetify.theme.currentTheme[this.color];
  }
}
</script>

<style scoped>
.backdrop {
  position: absolute !important;
  height: 200px;
  width: 100%;
  top: 0;
}
.root {
  display: flex;
  flex-direction: column;
  z-index: 1;
  position: relative;
}
</style>
