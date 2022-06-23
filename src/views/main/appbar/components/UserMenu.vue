<template>
  <v-menu
    bottom
    left
    offset-y
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" icon class="ml-1">
        <employee-profile-picture
          :employee="userProfile"
          size="48"
        ></employee-profile-picture>
      </v-btn>
    </template>
    <v-card v-if="userProfile">
      <v-list dense nav>
        <v-list-item>
          <employee-profile-picture
            :employee="userProfile"
            component="v-list-item-avatar"
            size="40"
          ></employee-profile-picture>

          <v-list-item-content class="d-block">
            <v-list-item-title class="text-h6">
              {{ userProfile.full_name }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ userProfile.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item to="/main/people/profile/view/me" color="cctBlue">
          <v-list-item-icon>
            <v-icon>account_box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mein Profil</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/people/profile/requests" color="cctBlue">
          <v-list-item-icon>
            <v-icon>mdi-clipboard-text</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Meine Anträge</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider class="mx-5"></v-divider>
      <v-list dense nav>
        <v-list-item to="/main/people/profile/edit" color="cctGreen">
          <v-list-item-icon>
            <v-icon>edit</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Profil bearbeiten</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/people/profile/settings" color="cctGreen">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Einstellungen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/people/profile/edit-password" color="cctOrange">
          <v-list-item-icon>
            <v-icon>vpn_key</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Passwort ändern</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Abmelden</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="toggleFeature" v-if="$route.meta && $route.meta.featureFlag" color="cctOrange" :input-value="!isFlagSet()">
          <v-list-item-icon>
            <v-icon>{{ isFlagSet() ? 'mdi-flask-outline' : 'mdi-flask-empty-outline' }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <span>Beta für <b>{{ $route.meta.featureFlag }}</b> {{ isFlagSet() ? 'deaktivieren' : 'aktivieren' }}</span></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { dispatchToggleFeatureFlag, dispatchUserLogOut } from '@/store/main/actions';
import { readIsFlagSet, readUserProfile } from '@/store/main/getters';
import { Vue, Component } from 'vue-property-decorator'
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';

@Component({
  components: { EmployeeProfilePicture }
})
export default class UserMenu extends Vue {

  public get userProfile() {
    return readUserProfile(this.$store);
  }
  
  public async logout() {
    await dispatchUserLogOut(this.$store);
  }

  public isFlagSet() {
    const flag = this.$route.meta?.featureFlag;
    if (!flag) {
      return;
    }
    return readIsFlagSet(this.$store)(flag);
  }

  public async toggleFeature() {
    const flag = this.$route.meta?.featureFlag;
    if (!flag) {
      return;
    }
    await dispatchToggleFeatureFlag(this.$store, flag);
  }

}
</script>

<style lang="scss">

</style>