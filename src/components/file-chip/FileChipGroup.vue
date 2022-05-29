<template>
  <div>
    <div class="file-chip-group">
      <span v-if="label" class="text-overline">
        <v-icon small>
          mdi-label
        </v-icon>
        {{ label }}
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class FileChipGroup extends Vue {

  @Prop({default: null})
  public label!: string | null;

}
</script>

<style lang="scss">

.file-chip-group {

  & > * {
    margin: 2px 8px;
  }
}

</style>