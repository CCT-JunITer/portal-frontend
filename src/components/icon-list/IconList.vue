<template>
  <v-combobox 
    v-bind="$attrs"
    v-on="$listeners"
    :search-input="$props.value"
    :items="icons"
    label="Icon"
    clearable
  >
    <template #prepend>
      <v-icon
        color="primary"
      >
        {{ $props.value || 'mdi-minus' }}
      </v-icon>
    </template>
    <template v-slot:item="{ item }">
      <v-list-item-icon>
        <v-icon
          color="primary"
          class="mr-2"
        >{{ item }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ item }}</v-list-item-title>
      </v-list-item-content>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const icons = require('@mdi/svg/meta.json');

@Component({})
export default class IconList extends Vue {
  public icons = icons.map(icon => `mdi-${icon.name}`);

  @Prop()
  public value;

  @Emit()
  public input(value) {
    return value;
  }
}
</script>

<style lang="scss">

</style>