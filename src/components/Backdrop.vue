<template>
  <div class="root">
    <div :class="color + ' backdrop'"></div>
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Backdrop extends Vue {
  @Prop({default: 'grey darken-4', type: String}) public color: string | undefined;
}
</script>

<style scoped>
.backdrop {
  position: absolute !important;
  height: 200px;
  width: 100%;
}
.root {
  display: flex;
  flex-direction: column;
  z-index: 1;
  position: relative;
}
</style>
