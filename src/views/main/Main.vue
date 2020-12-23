<template>
  <div class="d-flex flex-column fill-height">
    <default-app-bar></default-app-bar>

    <v-main style="flex-basis: 0; overflow: hidden;">
      <div style="overflow-y: auto; height: 100%" class="flex-grow-1 grey lighten-5">
        <router-view></router-view>
      </div>
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { appName } from '@/env';
import { readDashboardShowDrawer, readHasAdminAccess, readUserProfile } from '@/store/main/getters';
import { commitSetDashboardShowDrawer } from '@/store/main/mutations';
import { dispatchUserLogOut } from '@/store/main/actions';
import DefaultAppBar from '@/views/main/appbar/DefaultAppBar.vue';
import { store } from '@/store';

const routeGuardMain = async (to, from, next) => {
  const user = readUserProfile(store);
  // check if users full_name is valid
  // and if not redirect to edit page
  if (!user?.full_name && to.path !== '/main/profile/edit') {
    next('/main/profile/edit');
    return;
  }
  next();

};
@Component({
  components: {DefaultAppBar}
})
export default class Main extends Vue {
  public appName = appName;

  public beforeRouteEnter(to, from, next) {
    routeGuardMain(to, from, next);
  }

  public beforeRouteUpdate(to, from, next) {
    routeGuardMain(to, from, next);
  }


  get showDrawer() {
    return readDashboardShowDrawer(this.$store);
  }

  set showDrawer(value) {
    commitSetDashboardShowDrawer(this.$store, value);
  }


  public get hasAdminAccess() {
    return readHasAdminAccess(this.$store);
  }

  public async logout() {
    await dispatchUserLogOut(this.$store);
  }
}
</script>
