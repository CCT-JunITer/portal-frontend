<template>
  <v-navigation-drawer temporary v-model="showDrawer" fixed>
    <template v-slot:prepend>
      <v-app-bar dark color="cctBlue" class="flex-grow-0">
        <v-app-bar-nav-icon default @click.stop="switchShowDrawer"></v-app-bar-nav-icon>
        <portal-button></portal-button>
      </v-app-bar>
      <v-list dense nav>
        <v-list-item two-line v-if="userProfile">
          <v-list-item-avatar>
            <employee-profile-picture :employee="userProfile"></employee-profile-picture>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title">{{ userProfile.full_name }}</v-list-item-title>
            <v-list-item-subtitle>{{ userProfile.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <v-divider></v-divider>
    <v-list dense nav>
      <v-subheader>Apps</v-subheader>
      <v-list-item to="/main/" color="cctBlue">
        <v-list-item-icon>
          <v-icon>people</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Mitglieder</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { readDashboardShowDrawer, readUserProfile } from '@/store/main/getters';
import { commitSetDashboardShowDrawer } from '@/store/main/mutations';
import { Vue, Component } from 'vue-property-decorator'
import PortalButton from './PortalButton.vue';

@Component({
  components: { EmployeeProfilePicture, PortalButton }
})
export default class NavigationDrawer extends Vue {


  public get userProfile() {
    return readUserProfile(this.$store);
  }

  public switchShowDrawer() {
    commitSetDashboardShowDrawer(
      this.$store,
      !readDashboardShowDrawer(this.$store),
    );
  }

  get showDrawer() {
    return readDashboardShowDrawer(this.$store);
  }

  set showDrawer(value) {
    commitSetDashboardShowDrawer(this.$store, value);
  }
}
</script>

<style lang="scss">

</style>