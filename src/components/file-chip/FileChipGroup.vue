<template>
  <div class="file-chip-group">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class FileChipGroup extends Vue {

}
</script>

<style lang="scss">

.file-chip-group {
  display: flex;
  flex-wrap: wrap;

  & > * {
    margin: 8px;
  }
}

</style>