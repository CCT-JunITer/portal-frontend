<template>
  <v-container v-if="userProfile">
    <div class="d-flex flex-column flex-sm-row align-stretch align-sm-start">
      <div class="ma-3 text-center">
        <employee-profile-picture 
          size="112" 
          :employee="userProfile">
        </employee-profile-picture>
      </div>
      <div class="flex flex-shrink-0 mx-3 mt-3">
        <div class="text-h5">
          {{ userProfile.full_name || 'Kein Name' }}
          <v-icon v-if="hasBirthday" color="cctOrange">mdi-cake-variant</v-icon>  
        </div>
        <div class="text-subtitle-1 text--secondary mb-1" v-if="!userProfile.is_alumni">{{ userProfile.ressort || 'Kein Ressort' }} - {{ userProfile.memberstatus }}</div>
        <div v-else class="mb-1 text-subtitle-1 text-secondary">
          Alumni seit <b>{{ exitFormatted }}</b>
        </div>

        <div class="text-body-2 text--secondary mb-1">
          <v-icon left>
            place
          </v-icon>{{ userProfile.district }}
        </div>
        <div class="text-body-2 text--secondary mb-1" v-if="userProfile.linkedin">
          <v-icon left class="mt-n2">
            mdi-linkedin
          </v-icon>
          <a class="text--secondary text-decoration-none" :href="`${userProfile.linkedin}`"  target="_blank">{{ strippedLinkedIn }}</a>
        </div>
      </div>
      <div class="d-flex flex-wrap justify-end align-content-end my-1">
        <v-btn text :href="`mailto:${userProfile.email}`" outlined class="ma-2 flex-grow-1" small>
          <v-icon left small>
            mdi-email
          </v-icon>
          Nachricht
        </v-btn>
        <v-btn text :href="`tel:${userProfile.phonenumber}`" outlined class="ma-2 flex-grow-1" small>
          <v-icon left small>
            mdi-phone
          </v-icon>
          Anrufen
        </v-btn>

        <v-btn to="/main/people/profile/settings" color="cctGreen" small outlined v-if="isMe" class="ma-2 flex-grow-1">
          <v-icon left small>
            mdi-cog
          </v-icon>
          Einstellungen
        </v-btn>

        <v-btn to="/main/people/profile/edit" color="cctOrange" small outlined v-if="isMe" class="ma-2 flex-grow-1">
          <v-icon left small>
            mdi-pencil
          </v-icon>
          Profil bearbeiten
        </v-btn>
        <v-btn :to="`/main/people/admin/users/edit/${userProfile.id}`" color="red" small outlined v-if="isSuperuser" class="ma-2 flex-grow-1">
          <v-icon left small>
            mdi-wrench
          </v-icon>
          Account verwalten
        </v-btn>
      </div>
    </div>
    <div>
      <v-tabs background-color="transparent" slider-color="cctOrange" color="cctGrey">
        <v-tab :ripple="false" :to="{name: 'profile-about'}">
          <v-icon left>
            mdi-account
          </v-icon>
          Über mich
        </v-tab>
        <v-tab :ripple="false" :to="{name: 'profile-trainings'}">
          <v-icon left>
            mdi-school
          </v-icon>
          Schulungen
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>
    </div>

    <div class="mt-4">
      <router-view></router-view>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { readIsMe, readRouteUser, readUserProfile } from '@/store/main/getters';
import { dispatchGetOneUser } from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import format from 'date-fns/format';
import { de } from 'date-fns/locale';
import { Route } from 'vue-router';


@Component({
  components: {EmployeeCard, EmployeeProfilePicture}
})
export default class UserProfile extends Vue {

  get isMe() {
    return readIsMe(this.$store)(this.$route);
  }

  get hasBirthday() {
    if (!this.userProfile) {
      return false;
    }
    return this.$common.isTodayBirthday(this.userProfile.birthdate);
  }

  get strippedLinkedIn() {
    return decodeURI(`/in/${this.userProfile?.linkedin?.replace(this.$common.linkedInRegex, '')}`);
  }

  @Watch('$route', { immediate: true })
  public async onRoute(route?: Route, oldRoute?: Route) {
    if (route?.params.id !== oldRoute?.params.id) {
      if (+route!.params.id) {
        await dispatchGetOneUser(this.$store, { userId: +route!.params.id });
      }
    }
  }

  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }

  get isSuperuser() {
    return readUserProfile(this.$store)?.is_superuser;
  }

  get exitFormatted() {
    if (!this.userProfile) {
      return '';
    }
    return format(new Date(this.userProfile.exitdate), 'MMMM yyyy', { locale: de });
  }


  public goToEdit() {
    this.$router.push('/main/people/profile/edit');
  }

  public goToPassword() {
    this.$router.push('/main/people/profile/password');
  }

}
</script>
