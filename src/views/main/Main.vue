<template>
  <div class="d-flex flex-column fill-height">
    <navigation-drawer></navigation-drawer>
    <default-app-bar></default-app-bar>
    <route-title></route-title>

    <v-main class="flex-grow-1 grey lighten-5">
      <div :is="transitionDirection">
        <router-view class="child-view"></router-view>
      </div>
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readUserProfile } from '@/store/main/getters';
import NavigationDrawer from './appbar/components/NavigationDrawer.vue';
import { dispatchUserLogOut } from '@/store/main/actions';
import DefaultAppBar from '@/views/main/appbar/DefaultAppBar.vue';
import RouteTitle from '@/views/main/RouteTitle.vue';
import { store } from '@/store';
import { Route } from 'vue-router';

const routeGuardMain = async (to, from, next) => {
  const user = readUserProfile(store);
  // check if users full_name is valid
  // and if not redirect to edit page
  if (!user?.full_name && to.path !== '/main/people/profile/edit') {
    next('/main/people/profile/edit');
    return;
  }
  next();

};
@Component({
  components: {DefaultAppBar, RouteTitle, NavigationDrawer}
})
export default class Main extends Vue {

  public transitionDirection = 'v-slide-x-reverse-transition';

  public beforeRouteEnter(to, from, next) {
    routeGuardMain(to, from, next);
  }

  public beforeRouteUpdate(to: Route, from: Route, next) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionDirection = toDepth < fromDepth ? 'v-slide-x-transition' : 'v-slide-x-reverse-transition'
    routeGuardMain(to, from, next);
  }


  public async logout() {
    await dispatchUserLogOut(this.$store);
  }
}
</script>

<style lang="css">
.child-view {
  height: 100%;
}
</style>