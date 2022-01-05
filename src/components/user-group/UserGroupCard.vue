
<template>
  <v-card outlined v-bind="$attrs" v-on="$listeners" >
    <v-card-title>
      {{ group.group.name }} {{ !group.is_primary ? '(sekundär)' : '' }}
    </v-card-title>
    <v-card-subtitle>
      <div class="text-overline purple--text">
        {{ group.group.type }}
        {{ group.is_active ? 'aktiv' : 'inaktiv' }}
      </div>
    </v-card-subtitle>
    <v-card-text>
      {{ fromDate }} - {{ toDate }}
    </v-card-text>
    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>  
</template>

<script lang="ts">
import { UserGroup } from '@/interfaces';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { format } from 'date-fns'


@Component({})
export default class UserGroupCard extends Vue {

  @Prop()
  public group!: UserGroup;

  get fromDate() {
    return format(new Date(this.group.date_from), 'dd.MM.yyyy')
  }
  
  get toDate() {
    if (!this.group.date_to) {
      return 'heute';
    }
    const date = new Date(this.group.date_to)
    return format(date, 'dd.MM.yyyy')
  }

}
</script>

<style>

</style>