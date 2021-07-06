<template>
  <v-navigation-drawer temporary v-model="showDrawer" fixed>
    <template v-slot:prepend>
      <v-app-bar dark color="cctBlue" class="flex-grow-0">
        <v-app-bar-nav-icon default @click.stop="switchShowDrawer"></v-app-bar-nav-icon>
        <portal-button></portal-button>
      </v-app-bar>
      <v-list dense nav>
        <v-list-item two-line v-if="userProfile">
          <v-list-item-avatar>
            <employee-profile-picture :employee="userProfile" :size="40"></employee-profile-picture>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="title">{{ userProfile.full_name }}</v-list-item-title>
            <v-list-item-subtitle>{{ userProfile.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <v-divider></v-divider>
    <v-list dense nav>
      <v-subheader>Apps</v-subheader>

      <v-list-item to="/main/people" color="cctBlue">
        <v-list-item-icon>
          <v-icon>people</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Mitglieder</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/main/admin/dashboard" color="cctOrange" v-if="userProfile && userProfile.is_superuser">
        <v-list-item-icon>
          <v-icon>mdi-wizard-hat</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Admin Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/main/calendar" color="purple">
        <v-list-item-icon>
          <v-icon>mdi-calendar</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Kalender</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/main/hochladen" color="cctGreen">
        <v-list-item-icon>
          <v-icon>upload</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Dateien hochladen</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      


    </v-list>

    <v-divider></v-divider>
    <v-list dense nav>
      <v-subheader>Dienste</v-subheader>

      <v-list-item href="https://webmail.all-inkl.com/" color="cctBlue" target="_blank">
        <v-list-item-icon>
          <v-icon>mail</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Mail</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item href="https://wms.cct-ev.de/" color="cctBlue" target="_blank">
        <v-list-item-icon>
          <v-icon>mdi-folder-open</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>WMS</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item href="https://cloud.cct-ev.de/apps/files/" color="cctBlue" target="_blank">
        <v-list-item-icon>
          <v-icon>cloud</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Nextcloud</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item href="https://www.umfrage.cct-ev.de/index.php/admin/authentication/sa/login" color="cctBlue" target="_blank">
        <v-list-item-icon>
          <v-icon>mdi-file-document-edit</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>LimeSurvey</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item href="https://wiki.cct-ev.de/" color="cctBlue" target="_blank">
        <v-list-item-icon>
          <v-icon>mdi-wikipedia</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Wiki</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item href="https://app.slack.com/client/" color="cctBlue" target="_blank">
        <v-list-item-icon>
          <v-icon>mdi-slack</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Slack</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- value:false highlightet nicht als wäre es geklickt -->

      <v-list-group :value="false" prepend-icon="mdi-menu">

        <template v-slot:activator>
          <v-list-item-title>Weiteres</v-list-item-title>
        </template>

        <v-list-item to="/main/guide" color="lime darken-3">
          <v-list-item-icon>
            <v-icon>mdi-file-document</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>CCT-Guide</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/main/tower" color="cctGreen">
          <v-list-item-icon>
            <v-icon>mdi-chess-rook</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Towernutzung</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/main/shop" color="#00B8D4">
          <v-list-item-icon>
            <v-icon>mdi-tshirt-crew</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>CCT-Shop</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      
      </v-list-group>

     

    </v-list>
  </v-navigation-drawer>
</template>



<script lang="ts">
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import {
  readDashboardShowDrawer,
  readUserProfile
} from '@/store/main/getters';
import {
  commitSetDashboardShowDrawer
} from '@/store/main/mutations';
import {
  Vue,
  Component
} from 'vue-property-decorator'
import PortalButton from './PortalButton.vue';

@Component({
  components: {
    EmployeeProfilePicture,
    PortalButton
  }
})
export default class NavigationDrawer extends Vue {

  public get userProfile() {
    return readUserProfile(this.$store);
  }

  public switchShowDrawer() {
    commitSetDashboardShowDrawer(
      this.$store,
      !readDashboardShowDrawer(this.$store),
    );
  }

  get showDrawer() {
    return readDashboardShowDrawer(this.$store);
  }

  set showDrawer(value) {
    commitSetDashboardShowDrawer(this.$store, value);
  }
}
</script>

<style lang="scss">

</style>
