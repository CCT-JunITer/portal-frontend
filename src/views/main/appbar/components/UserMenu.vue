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
          <v-list-item-avatar>
            <employee-profile-picture
              :employee="userProfile"
              size="48"
            ></employee-profile-picture>
          </v-list-item-avatar>

          <v-list-item-content class="d-block">
            <v-list-item-title class="title">
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
        <v-list-item to="/main/people/profile/edit" color="cctGreen">
          <v-list-item-icon>
            <v-icon>edit</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Profil bearbeiten</v-list-item-title>
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
      </v-list>

      <div v-if="userProfile.is_superuser">
        <v-divider></v-divider>
        <v-list dense nav>
          <v-list-item to="/main/people/admin/users/all" color="cctOrange">
            <v-list-item-icon>
              <v-icon>people</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mitglieder verwalten</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { dispatchUserLogOut } from '@/store/main/actions';
import { readUserProfile } from '@/store/main/getters';
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

}
</script>

<style lang="scss">

</style>