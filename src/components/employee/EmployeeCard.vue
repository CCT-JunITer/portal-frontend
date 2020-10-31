<template>
  <v-card class="text-center" mx-auto v-bind="$attrs">
    <v-row align-content="center" justify="center" class="pa-3">
      <employee-profile-picture :employee="employee"></employee-profile-picture>
    </v-row>
    <v-card-text>
      <div class="text-h6 text--primary">{{ employee.full_name || 'Kein Name' }}</div>
      <div class="subtitle-1 mb-2">{{ employee.ressort || 'Kein Ressort' }}</div>
    </v-card-text>
    <v-divider ></v-divider>
    <v-card-actions class="d-flex justify-space-between pa-2 pl-5 pr-5 grey lighten-5">
      <v-btn :ripple="false" text icon class="center-employee-text">
        <v-icon>mdi-email</v-icon>
      </v-btn>
      <v-btn :ripple="false" text icon class="center-employee-text">
        <v-icon>mdi-phone</v-icon>
      </v-btn>
      <v-btn :ripple="false" text icon class="center-employee-text">
        <v-icon>mdi-slack</v-icon>
      </v-btn>
      <v-btn :ripple="false" text icon class="center-employee-text" :to="{path: `/main/profile/view/${this.employee.id}`}">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {IUserProfile} from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
@Component({
  components: {EmployeeProfilePicture}
})
export default class EmployeeCard extends Vue {
  @Prop()
  private employee: IUserProfile | undefined;
}
</script>

