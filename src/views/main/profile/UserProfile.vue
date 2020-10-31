<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <employee-profile-picture :employee="userProfile" tile size="256"></employee-profile-picture>
        <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.full_name">
          {{ userProfile.full_name }}
        </div>
        <div class="title primary--text text--darken-2" v-else>-----</div>
      </v-col>
      <v-col cols="6">
        <v-card class="ma-3 pa-3">
          <v-card-title primary-title>
            <div class="headline primary--text">User Profile</div>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <div class="my-4">
                  <div class="subheading secondary--text text--lighten-3">Name</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.full_name">
                    {{ userProfile.full_name }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-4">
                  <div class="subheading secondary--text text--lighten-3">Geburtstag</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.birthdate">
                    {{ userProfile.birthdate }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Email</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.email">
                    {{ userProfile.email }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Handynummer</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.phonenumber">
                    {{ userProfile.phonenumber }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Rolle</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.memberstatus">
                    {{ userProfile.memberstatus }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Ressort</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.ressort">
                    {{ userProfile.ressort }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Studiengang</div>
                  <div class="title primary--text text--darken-2"
                       v-if="userProfile && userProfile.major && userProfile.studylevel">
                    {{ userProfile.studylevel + userProfile.major }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Universität</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.university">
                    {{ userProfile.university }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Stadtteil</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.district">
                    {{ userProfile.district }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">LinkedIn</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.linkedin">
                    {{ userProfile.linkedin }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Slack</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.slackid">
                    {{ userProfile.slackid }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">LinkedIn</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.linkedin">
                    {{ userProfile.linkedin }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
                <div class="my-3">
                  <div class="subheading secondary--text text--lighten-3">Slack</div>
                  <div class="title primary--text text--darken-2" v-if="userProfile && userProfile.slackid">
                    {{ userProfile.slackid }}
                  </div>
                  <div class="title primary--text text--darken-2" v-else>-----</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>


          <v-card-actions v-if="isMe">
            <v-btn to="/main/profile/edit">Edit</v-btn>
            <v-btn to="/main/profile/password">Change password</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {readAdminOneUser, readUserProfile} from '@/store/main/getters';
import {dispatchGetUsers} from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
@Component({
  components: {EmployeeProfilePicture}
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
