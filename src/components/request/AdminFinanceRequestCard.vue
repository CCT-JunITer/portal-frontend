<template>
  <v-card v-bind="$attrs" v-on="$listeners" :to="{ name: 'finance-request-detail', params: { id: request.id } }">
    <v-card-title>
      Finanzantrag
    </v-card-title>
    <v-card-subtitle>
      <div class="my-2"><v-chip class="mx-1">{{request.amount}} €</v-chip><v-chip class="mx-1 my-2">{{request.type}}</v-chip><v-chip v-if="this.request.association" class="mx-1">Ressortbudget: {{this.request.association}}</v-chip></div>
      <div class="text-overline green--text">
        <b>Status:</b> {{  translateFinanceRequestStatus(request.status) }} 
      </div>
      <!--
      <div class="text-overline green--text">
        Nächster Schritt: {{ financeRequestNextStep(request.status) }}
      </div>
      -->
    </v-card-subtitle>
    <v-card-text>
      Verwendungszweck:
      <span>{{request.purpose}}</span>
    </v-card-text>
    <v-card-actions>
      <v-list-item>
        <employee-profile-picture :employee="request.author" component="v-list-item-avatar" small></employee-profile-picture>

        <v-list-item-content>
          <v-list-item-title v-text="request.author.full_name"></v-list-item-title>
          <v-list-item-subtitle v-text="request.author.ressort"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>  
</template>

<script lang="ts">
import { IFinanceRequest } from '@/interfaces';
import { financeRequestNextStep, translateFinanceRequestStatus } from '@/utils';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EmployeeProfilePicture from '../employee/EmployeeProfilePicture.vue';

@Component({
  components: {
    EmployeeProfilePicture
  },
  methods: { 
    translateFinanceRequestStatus,
    financeRequestNextStep
  },
})
export default class FinanceRequestCard extends Vue {

  @Prop()
  public request!: IFinanceRequest;

}
</script>

<style>
.pre-formatted {
  white-space: pre-wrap;
}
</style>