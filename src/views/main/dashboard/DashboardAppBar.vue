<template>
  <v-app-bar dark color="cctBlue" class="flex-grow-0" app v-if="searchText === null">
    <v-app-bar-nav-icon default @click.stop="switchShowDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Mitglieder</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click.stop="searchText = ''"><v-icon>mdi-magnify</v-icon></v-btn>
    <v-menu bottom left offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/main/dashboard">
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>web</v-icon>
          </v-list-item-action>
        </v-list-item>
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
  <v-app-bar dark v-else color="cctBlue" class="flex-grow-0" app extended>
    <v-app-bar-nav-icon default @click.stop="switchShowDrawer"></v-app-bar-nav-icon>
    <v-text-field
        solo-inverted
        class="mx-4"
        hide-details
        autofocus
        single-line
        v-model="searchText"
        placeholder="Suchen"
    >
    </v-text-field>
    <v-btn icon @click.stop="searchText = null">
      <v-icon>
        mdi-close
      </v-icon>
    </v-btn>
    <template slot="extension">
      <v-icon>mdi-filter</v-icon>

      <v-chip-group
          column
          class="mx-4"
          multiple
          v-model="filters">
        <v-chip
            filter
            outlined
            v-for="filter in [{ text: 'Resort: IT', value: 'IT' }]"
            :key="filter.value"
            :value="filter.value"
        >
          {{ filter.text }}
        </v-chip>
      </v-chip-group>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

import {appName} from '@/env';
import {commitSetDashboardShowDrawer} from '@/store/main/mutations';
import {readDashboardShowDrawer} from '@/store/main/getters';
import {dispatchUserLogOut} from '@/store/main/actions';
import {readFilters, readSearchText} from '@/store/dashboard/getters';
import {commitSetFilters, commitSetSearchText} from '@/store/dashboard/mutations';

@Component
export default class DashboardAppBar extends Vue {
  public appName = appName;

  public get filters() {
    return readFilters(this.$store);
  }

  public set filters(filters: string[]) {
    commitSetFilters(this.$store, filters);
  }

  public get searchText() {
    return readSearchText(this.$store);
  }

  public set searchText(searchText: string | null) {
    commitSetSearchText(this.$store, searchText);
  }

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
