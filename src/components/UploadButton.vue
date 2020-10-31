<template>
  <div>
    <v-btn :color="color" @click="trigger" v-bind="$attrs"><slot>Choose File</slot></v-btn>
    <input :multiple="multiple" class="visually-hidden" type="file" :accept="accept" v-on:change="files" ref="fileInput">
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component
export default class UploadButton extends Vue {
  @Prop(String) public color: string | undefined;
  @Prop({default: false}) public multiple!: boolean;
  @Prop({default: '*'}) public accept!: string;
  @Emit()
  public files(e): File[] {
    const files = [...e.target.files];
    // reset files
    e.target.value = '';
    return files;
  }

  public trigger() {
    (this.$refs.fileInput as HTMLElement).click();
  }
}
</script>

<style scoped>
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
}
</style>
