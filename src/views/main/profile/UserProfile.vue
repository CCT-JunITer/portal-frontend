<template>
  <v-container>
    <div class="d-flex flex-column flex-sm-row">
      <div class="ma-3 text-center">
        <employee-profile-picture size="112" :employee="userProfile"></employee-profile-picture>
      </div>
      <div class="flex ma-3">
        <div class="text-h5">{{ userProfile.full_name || 'Kein Name' }}</div>
        <div class="text-subtitle-1">{{ userProfile.ressort || 'Kein Ressort' }} - {{ userProfile.memberstatus }}</div>
        <div class="text-subtitle-2 text--secondary" >
          <v-icon left small>
            mdi-email
          </v-icon>
          <a class="text--secondary text-decoration-none" :href="`mailto:${userProfile.email}`">{{ userProfile.email }}</a>
        </div>
        <div class="text-subtitle-2 text--secondary">
          <v-icon left small>
            mdi-phone
          </v-icon>
          <a class="text--secondary text-decoration-none" :href="`tel:${userProfile.phonenumber}`">{{ userProfile.phonenumber }}</a>
        </div>
        <div class="text-subtitle-2 text--secondary">
          <v-icon left small>
            mdi-linkedin
          </v-icon>
          <a class="text--secondary text-decoration-none" :href="`${userProfile.linkedin}`">{{ userProfile.linkedin }}</a>
        </div>

      </div>
      <v-btn to="/main/profile/edit" rounded color="cctGreen" small outlined v-if="isMe" class="ma-3">
        <v-icon left small>
          mdi-pencil
        </v-icon>
        Profil bearbeiten
      </v-btn>
    </div>

    <div>
      <v-tabs background-color="transparent" slider-color="cctOrange" color="cctGrey">
        <v-tab :ripple="false" :to="{name: 'about'}">
          Über mich
        </v-tab>
        <v-tab :ripple="false" :to="{name: 'skills'}" disabled>
          Skills
        </v-tab>
        <v-tab :ripple="false" :to="{name: 'projects'}" disabled>
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
import {Component, Vue} from 'vue-property-decorator';
import {readAdminOneUser, readUserProfile} from '@/store/main/getters';
import {dispatchGetUsers} from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';


@Component({
  components: {EmployeeCard, EmployeeProfilePicture}
})
export default class UserProfile extends Vue {

  get isMe() {
    const id = this.$route.params.id;
    return id === 'me';
  }

  get userProfile() {
    if (this.isMe) {
      return readUserProfile(this.$store);
    }
    const id = this.$route.params.id;
    return readAdminOneUser(this.$store)(parseInt(id));
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
