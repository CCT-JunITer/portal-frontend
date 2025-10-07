<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { store } from '@/store';
import { readIsProjektmanager } from '@/store/main/getters';

const routeGuardPm = async (to, from, next) => {
  if (!readIsProjektmanager(store)) {
    next('/main');
  } else {
    next();
  }
};

@Component
export default class PmGuard extends Vue {
  public beforeRouteEnter(to, from, next) {
    routeGuardPm(to, from, next);
  }

  public beforeRouteUpdate(to, from, next) {
    routeGuardPm(to, from, next);
  }
}
</script>
