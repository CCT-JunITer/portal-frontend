<template>
  <v-app-bar dark :color="env === 'production' ? 'cctBlue' : 'cctOrange darken-3'" class="flex-grow-0" app ref="toolbar" v-mutate="onMutate">
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
import { env } from '@/env';

@Component({
  components: { EmployeeProfilePicture, UserMenu, SearchBar, PortalButton },
})
export default class DefaultAppBar extends Vue {

  public env = env;

  public get userProfile() {
    return readUserProfile(this.$store);
  }

  public switchShowDrawer() {
    commitSetDashboardShowDrawer(
      this.$store,
      !readDashboardShowDrawer(this.$store),
    );
  }

  onMutate() {
    let height = '0'
    const toolbar = this.$refs.toolbar
    if (toolbar) {
      height = `${(toolbar as any).$el.offsetHeight}px`
    }
    document.documentElement.style.setProperty('--toolbarHeight', height)
  }
}
</script>
