<template>
  <v-app-bar dark color="cctBlue" class="flex-grow-0" app>
    <v-app-bar-nav-icon default @click.stop="switchShowDrawer"></v-app-bar-nav-icon>
    <portal-button></portal-button>
    <v-container class="pa-0">
      <search-bar></search-bar>
    </v-container>
    
    <user-menu></user-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { commitSetDashboardShowDrawer } from '@/store/main/mutations';
import { readDashboardShowDrawer, readUserProfile } from '@/store/main/getters';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import SearchBar from './components/SearchBar.vue';
import UserMenu from './components/UserMenu.vue';
import PortalButton from './components/PortalButton.vue';


@Component({
  components: { EmployeeProfilePicture, UserMenu, SearchBar, PortalButton }
})
export default class DefaultAppBar extends Vue {

  public get userProfile() {
    return readUserProfile(this.$store);
  }

  public switchShowDrawer() {
    commitSetDashboardShowDrawer(
      this.$store,
      !readDashboardShowDrawer(this.$store),
    );
  }

}
</script>
