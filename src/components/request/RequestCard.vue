<template>
  <v-card v-bind="$attrs" v-on="$listeners" :disabled="request.status !== 'in progress'">
    <v-card-title>
      {{ { add: 'Hinzufügen zu', remove: 'Entfernen von' }[request.mode] }} {{ request.group.name }}
    </v-card-title>
    <v-card-subtitle>
      <div class="text-overline purple--text">
        {{ {'in progress': 'In Bearbeitung', accepted: 'Angenommen', denied: 'Abgelehnt' }[request.status] }}
      </div>
    </v-card-subtitle>
    <v-card-text>
      {{ request.description }}
    </v-card-text>
    <v-card-actions>
      <v-list-item>
        <employee-profile-picture :employee="request.user" component="v-list-item-avatar" small></employee-profile-picture>

        <v-list-item-content>
          <v-list-item-title v-text="request.user.full_name"></v-list-item-title>
          <v-list-item-subtitle v-text="request.user.ressort"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>  
</template>

<script lang="ts">
import { Request } from '@/interfaces';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EmployeeProfilePicture from '../employee/EmployeeProfilePicture.vue';

@Component({
  components: {
    EmployeeProfilePicture
  }  
})
export default class RequestCard extends Vue {

  @Prop()
  public request!: Request;

}
</script>

<style>

</style>