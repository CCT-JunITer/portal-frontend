<template>
  <v-autocomplete
    :items="this.projects"
    :item-value="this.returnValue"
    item-text="title"
    chips
    cache-items
    deletable-chips
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:selection="{ attrs, on, item, selected, parent }">
      <v-chip
        v-bind="{...attrs, ...chipProps}"
        v-on="on"
        :input-value="selected"
        close
        @click:close="parent.multiple ? parent.selectItem(item) : parent.setValue(null)"
      >
        <span>{{ item.title }}</span>
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template>
        <v-list-item-content>
          <v-list-item-title>{{ data.item.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ data.item.description }}</v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { dispatchGetProjects } from '@modules/projects/store/actions';
import { readProjects } from '@modules/projects/store/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'
import { VChip } from 'vuetify/lib/components';


@Component({
  components: {
    
  }
})
export default class ProjectSelect extends Vue {

  @Prop({ default: 'id' })
  public returnValue!: string;

  @Prop({ default: () => ({}), required: false })
  public chipProps?: typeof VChip;

  async mounted() {
    if (!this.projects || !this.projects.length) {
      await dispatchGetProjects(this.$store, 'all');
    }
  }

  get projects() {
    return readProjects(this.$store)('all') || [];
  }

}
</script>

<style lang="scss">

</style>