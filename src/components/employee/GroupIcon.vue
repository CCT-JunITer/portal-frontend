<template>
  <v-tooltip bottom content-class="tooltip" v-if="group.icon">
    <template v-slot:activator="{ on, attrs }">
      <v-icon 
        color="cctGrey"
        size="20"           
        v-bind="attrs"
        v-on="on">{{ icon }}</v-icon>
    </template>
    <span class="text-overline zero-lineheight">{{ group.name }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Group } from '@/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class GroupIcon extends Vue {

  @Prop()
  public group!: Group;

  get icon() {
    return `${this.group.icon}`;
  }

}
</script>

<style lang="scss" scoped>

.tooltip {
  padding: 2px 7px;
  font-size: unset;
}

.zero-lineheight {
  line-height: 0;
}

</style>