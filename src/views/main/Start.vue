<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { store } from '@/store';
import { readIsLoggedIn } from '@/store/main/getters';
import { dispatchCheckLoggedIn } from '@/store/main/actions';

const startRouteGuard = async (to, from, next) => {
  await dispatchCheckLoggedIn(store);
  if (readIsLoggedIn(store)) {
    if (!(to.path as string).startsWith('/main')) {
      next('/main');
    } else {
      next();
    }
  } else if (readIsLoggedIn(store) === false) {
    if (to.path === '/' || (to.path as string).startsWith('/main')) {
      next({path: '/login', query: { redirect: to.fullPath }});
    } else {
      next();
    }
  }
};

@Component
export default class Start extends Vue {
  public beforeRouteEnter(to, from, next) {
    startRouteGuard(to, from, next);
  }

  public beforeRouteUpdate(to, from, next) {
    startRouteGuard(to, from, next);
  }

  mounted() {
    const splash = document.getElementById('splash-screen');
    if (!splash) {
      return;
    }
    splash.classList.add('ended');
    setTimeout(() => splash.remove(), 1000);
  }
}
</script>
