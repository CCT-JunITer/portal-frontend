<template>
  <v-app-bar dark color="cctBlue" class="flex-grow-0" app v-if="searchText === null">
    <v-app-bar-nav-icon default @click.stop="switchShowDrawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Mitglieder</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click.stop="searchText = ''"><v-icon>mdi-magnify</v-icon></v-btn>

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
