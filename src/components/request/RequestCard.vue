<template>
  <v-card v-bind="$attrs" v-on="$listeners" :disabled="request.status !== 'in progress'">
    <v-card-title>
      Antrag
    </v-card-title>
    <v-card-subtitle>
      <div class="text-overline purple--text">
        {{ {'in progress': 'In Bearbeitung', accepted: 'Angenommen', denied: 'Abgelehnt' }[request.status] }}
      </div>
    </v-card-subtitle>
    <v-list dense>
      <v-list-item v-for="group in request.groups" :key="`${group.group_id} ${group.request_id}`" dense>
        <v-list-item-icon>
          <v-icon :color="group.mode === 'add' ? 'green' : 'red'">
            {{ group.mode === 'add' ? 'mdi-plus' : 'mdi-minus' }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-if="group.group">{{ group.group.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-card-text>
      <div v-text="request.description" class="pre-formatted"></div>
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
.pre-formatted {
  white-space: pre;
}

</style>