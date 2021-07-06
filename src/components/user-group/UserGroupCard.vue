
<template>
  <v-card :disabled="!group.is_active" v-bind="$attrs" v-on="$listeners" >
    <v-card-title>
      {{ group.group.name }} {{ !group.is_primary ? '(sekundär)' : '' }}
    </v-card-title>
    <v-card-subtitle>
      <div class="overline purple--text">
        {{ group.group.type }}
        {{ group.is_active ? 'aktiv' : 'inaktiv' }}
      </div>
    </v-card-subtitle>
    <v-card-text>
      {{ group.date_from }} - {{ group.date_to }}
    </v-card-text>
    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>  
</template>

<script lang="ts">
import { UserGroup } from '@/interfaces';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class UserGroupCard extends Vue {

  @Prop()
  public group!: UserGroup;

}
</script>

<style>

</style>