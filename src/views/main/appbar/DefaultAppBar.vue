<template>
  <v-app-bar dark color="cctBlue" class="flex-grow-0" app>
    <v-app-bar-nav-icon default @click.stop="switchShowDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title v-text="appName"></v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu bottom left offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/main/profile">
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>person</v-icon>
          </v-list-item-action>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>close</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

import {appName} from '@/env';
import {commitSetDashboardShowDrawer} from '@/store/main/mutations';
import {readDashboardShowDrawer} from '@/store/main/getters';
import {dispatchUserLogOut} from '@/store/main/actions';

@Component
export default class DefaultAppBar extends Vue {
  public appName = appName;
  public switchShowDrawer() {
    commitSetDashboardShowDrawer(
        this.$store,
        !readDashboardShowDrawer(this.$store),
    );
  }
  public async logout() {
    await dispatchUserLogOut(this.$store);
  }
}
</script>
