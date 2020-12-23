<template>
  <v-card
    class="text-center"
    width="100%"
    v-bind="$attrs">
    <router-link
      :to="{ path: `/main/profile/view/${employee.id}`}"
      v-slot="{ href, route, navigate, isActive }"
    >
      <div v-ripple :active="isActive" @click="navigate">
        <backdrop class="d-flex align-center justify-center" color="grey lighten-4" height="84%">
          <employee-profile-picture :employee="employee" class="mt-5" size="72"></employee-profile-picture>
        </backdrop>
        <div class="pa-2">
          <div class="text-subtitle-1 text--primary" >{{ employee.full_name || 'Kein Name' }}</div>
          <div class="subtitle-2 mb-2">{{ employee.ressort || 'Kein Ressort' }}</div>
        </div>
      </div>
    </router-link>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-space-between py-2 px-2 flex-wrap">
      <v-btn
        text
        small
        :href="`mailto:${employee.email}`"
        color="grey"
        class="center-employee-text">
        <v-icon left small>mdi-message</v-icon>
        Nachricht
      </v-btn>
      <v-btn
        text
        small
        :href="`tel:${employee.phonenumber}`"
        color="grey"
        class="center-employee-text">
        <v-icon left small>mdi-phone</v-icon>
        Anrufen
      </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {IUserProfile} from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import Backdrop from '@/components/Backdrop.vue';

@Component({
  components: { Backdrop, EmployeeProfilePicture}
})
export default class EmployeeCard extends Vue {
  @Prop()
  private employee: IUserProfile | undefined;
}
</script>

