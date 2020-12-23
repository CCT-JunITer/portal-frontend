<template>
  <v-container class="container">
    <div class="d-flex flex-column flex-sm-row align-stretch align-sm-start">
      <div class="ma-3 text-center">
        <employee-profile-picture size="112" :employee="userProfile"></employee-profile-picture>
      </div>
      <div class="flex flex-shrink-0 mx-3 mt-3">
        <div class="text-h5">{{ userProfile.full_name || 'Kein Name' }}</div>
        <div class="text-subtitle-1 text--secondary mb-1">{{ userProfile.ressort || 'Kein Ressort' }} - {{ userProfile.memberstatus }}</div>

        <div class="text-body-2 text--secondary mb-1">
          <v-icon left>
            place
          </v-icon>{{ userProfile.district }}
        </div>
        <div class="text-body-2 text--secondary mb-1" v-if="userProfile.linkedin">
          <v-icon left class="mt-n2">
            mdi-linkedin
          </v-icon>
          <a class="text--secondary text-decoration-none" :href="`${userProfile.linkedin}`">{{ strippedLinkedIn }}</a>
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

        <v-btn to="/main/profile/edit" color="cctGreen" small outlined v-if="isMe" class="ma-2 flex-grow-1">
          <v-icon left small>
            mdi-pencil
          </v-icon>
          Profil bearbeiten
        </v-btn>
      </div>
    </div>


    <div>
      <v-tabs background-color="transparent" slider-color="cctOrange" color="cctGrey">
        <v-tab :ripple="false" :to="{name: 'profile-about'}">
          Über mich
        </v-tab>
        <v-tab :ripple="false" :to="{name: 'profile-skills'}" disabled>
          Skills
        </v-tab>
        <v-tab :ripple="false" :to="{name: 'profile-projects'}" disabled>
          Projekte
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
import { Component, Vue } from 'vue-property-decorator';
import { readAdminOneUser, readUserProfile } from '@/store/main/getters';
import { dispatchGetUsers } from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import { IUserProfile } from '@/interfaces';


@Component({
  components: {EmployeeCard, EmployeeProfilePicture}
})
export default class UserProfile extends Vue {

  get isMe() {
    const id = this.$route.params.id;
    const me = readUserProfile(this.$store);
    return id === 'me' || +id === me?.id;
  }

  get strippedLinkedIn() {
    return decodeURI(this.userProfile.linkedin?.replace(/https:\/\/[a-z]{2,3}\.linkedin\.com/, ''));
  }

  get userProfile() {
    if (this.isMe) {
      return readUserProfile(this.$store) || {} as IUserProfile;
    }
    const id = this.$route.params.id;
    return readAdminOneUser(this.$store)(parseInt(id)) || {} as IUserProfile;
  }

  public goToEdit() {
    this.$router.push('/main/profile/edit');
  }

  public goToPassword() {
    this.$router.push('/main/profile/password');
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
  }

}
</script>

<style lang="scss">

.container {
  max-width: 1000px;
}

</style>
