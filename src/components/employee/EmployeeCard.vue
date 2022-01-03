<template>
  <v-card
    class="text-center"
    width="100%"
    v-bind="$attrs">
    <router-link
      :to="{ path: `/main/people/profile/view/${employee.id}`}"
      v-slot="{ navigate, isActive }"
    >
      <div v-ripple :active="isActive" @click="navigate">
        <backdrop class="d-flex align-center justify-center" color="grey lighten-3" height="84%">
          <employee-profile-picture :employee="employee" class="mt-5" size="72"></employee-profile-picture>
        </backdrop>
        <div class="pa-2">
          <div class="text-subtitle-1 text--primary d-flex align-content-start justify-center">
            {{ employee.full_name || 'Kein Name' }}
            <v-icon v-if="hasBirthday" color="cctOrange" size="20">mdi-cake-variant</v-icon>
          </div>
          <div v-if="!isAlumni">
            <div class="text-subtitle-2 mb-2">
              {{ employee.ressort || 'Kein Ressort' }}

              <group-icon
                v-for="group in groups"
                :key="group.id"
                :group="group"
              >
              </group-icon> 
            </div>
            <v-chip small color="cctBlue" outlined dark label>{{ employee.memberstatus }}</v-chip>
          </div>
          <div v-else>
            <div class="text-body-2 mb-2">
              Alumni seit <b>{{ exitFormatted }}</b>
            </div>
            <v-chip small color="cctOrange" outlined dark label>{{ yearsIn }} im Verein</v-chip>
          </div>
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
import GroupIcon from './GroupIcon.vue';
import { format, formatDistance } from 'date-fns';
import { de } from 'date-fns/locale';

@Component({
  components: { Backdrop, EmployeeProfilePicture, GroupIcon }
})
export default class EmployeeCard extends Vue {
  @Prop()
  private employee!: IUserProfile;

  get hasBirthday() {
    if(!this.employee) {
      return false;
    }
    return this.$common.isTodayBirthday(this.employee.birthdate);
  }

  get isAlumni() {
    return this.employee.is_alumni;
  }

  get exitFormatted() {
    return format(new Date(this.employee.exitdate), 'MMMM yyyy', { locale: de });
  }

  get yearsIn() {
    return formatDistance(new Date(this.employee.exitdate), new Date(this.employee.entrydate), { locale: de })
  }


  get groups() {
    return this.employee.active_groups;
  }
}
</script>

