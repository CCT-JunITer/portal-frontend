<template>
  <v-app-bar dark color="cctBlue" class="flex-grow-0" app>
    <v-app-bar-nav-icon to="/main">
      <v-icon>home</v-icon>
    </v-app-bar-nav-icon>
    <v-spacer></v-spacer>

    <v-autocomplete
      v-if="!this.$route.meta.disableSearchBar"
      class="mx-4"
      v-model="model"
      ref="autocomplete"
      :items="employees"
      @change="goToProfile"
      @keydown.enter="goToSearch"
      :search-input.sync="searchText"
      return-object
      clearable
      hide-details
      item-text="full_name"
      item-value="id"
      label="Suche"
      solo-inverted
      flat
      dense
      dark
      prepend-inner-icon="mdi-magnify"
    >
      <template v-slot:no-data>
        <v-list-item
          @click="goToSearch"
          color="primary"
          ripple>
          <v-list-item-title>
            Weitere Benutzer finden
          </v-list-item-title>
        </v-list-item>
      </template>

      <template v-slot:item="{ item }">

        <employee-profile-picture :employee="item" component="v-list-item-avatar" small></employee-profile-picture>
        <v-list-item-content>
          <v-list-item-title v-text="item.full_name"></v-list-item-title>
          <v-list-item-subtitle v-text="item.ressort"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-autocomplete>

    <v-menu bottom left offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on" icon>
          <employee-profile-picture
            :employee="userProfile"
            size="48"
          ></employee-profile-picture>
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { appName } from '@/env';
import { commitSetDashboardShowDrawer } from '@/store/main/mutations';
import { readAdminUsers, readDashboardShowDrawer, readUserProfile } from '@/store/main/getters';
import { dispatchUserLogOut } from '@/store/main/actions';
import { IUserProfile } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';

@Component({
  components: { EmployeeProfilePicture }
})
export default class DefaultAppBar extends Vue {
  public appName = appName;
  public model = {};
  public searchText = '';

  public get userProfile() {
    return readUserProfile(this.$store);
  }

  get employees(): IUserProfile[] {
    return readAdminUsers(this.$store)
      .filter(user => user.full_name);
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

  public clearInput() {
    this.model = {};
    (this.$refs.autocomplete as HTMLElement).blur();
  }

  public goToProfile(e) {
    this.clearInput();
    if (e?.id) {
      this.$router.push({ path: '/main/profile/view/' + e.id })
    }
  }

  public goToSearch() {
    if (this.searchText) {
      this.$router.push({ path: '/main/search', query: { value: this.searchText } })
    }
    this.clearInput();
  }
}
</script>
