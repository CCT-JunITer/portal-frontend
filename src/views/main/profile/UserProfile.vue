<template>
  <v-sheet color="grey lighten-4" class="fill-height">
    <v-container>
      <v-card tile outlined class="mb-5">
        <div class="d-flex flex-column flex-sm-row">
          <div class="d-flex align-center ma-5">
            <div class="mx-3">
              <employee-profile-picture size="128" :employee="userProfile"></employee-profile-picture>
            </div>
            <div>
              <v-card-text>
                <div class="text-h6">{{ userProfile.full_name || 'Kein Name' }}</div>
                <div class="text-subtitle-1">{{ userProfile.ressort || 'Kein Ressort' }} - {{ userProfile.memberstatus }}</div>
              </v-card-text>
              <v-card-actions>
                <v-btn to="/main/profile/edit" rounded color="cctGreen" small outlined v-if="isMe">
                  <v-icon left small>
                    mdi-pencil
                  </v-icon>
                  Profil bearbeiten
                </v-btn>
              </v-card-actions>
            </div>
          </div>

          <v-divider :vertical="$vuetify.breakpoint.smAndUp" :class="$vuetify.breakpoint.smAndUp ? 'my-3': 'mx-3'"></v-divider>
          <div class="d-flex flex flex-column ma-5 justify-space-between">
            <div class="d-flex">
              <v-icon class="mx-3">mdi-map-marker</v-icon>
              <div class="subtitle-2 text--secondary">
                {{ userProfile.university }} {{userProfile.district}}
              </div>
            </div>
            <v-card-actions>
              <v-btn :ripple="false" text icon>
                <v-icon>mdi-email</v-icon>
              </v-btn>
              <v-btn :ripple="false" text icon>
                <v-icon>mdi-phone</v-icon>
              </v-btn>
              <v-btn :ripple="false" text icon>
                <v-icon>mdi-slack</v-icon>
              </v-btn>
              <v-btn :ripple="false" text icon>
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
            </v-card-actions>
          </div>
        </div>
      </v-card>

      <div>
        <v-tabs background-color="transparent" slider-color="cctOrange" color="cctGrey">
          <v-tab :ripple="false" :to="{name: 'skills'}">
            Skills
          </v-tab>
          <v-tab :ripple="false" :to="{name: 'projects'}">
            Projekte
          </v-tab>
        </v-tabs>
        <v-divider></v-divider>
      </div>

      <router-view></router-view>

    </v-container>
  </v-sheet>
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
