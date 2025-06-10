<template>
  <v-navigation-drawer v-model="showDrawer" clipped app fixed temporary width="300px" :style="`padding-top: ${$vuetify.application.top}px; z-index: 4; top: 0; max-height: unset;`">
    <template v-slot:prepend>
      <v-list dense nav>
        <v-list-item two-line v-if="userProfile">
          <v-list-item-avatar>
            <employee-profile-picture :employee="userProfile" :size="40"></employee-profile-picture>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="text-h6">{{ userProfile.full_name }}</v-list-item-title>
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

      <v-list-item to="/main/project-tender" color="cctPurple">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Projektausschreibungen</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/main/trainings" color="cctOrange">
        <v-list-item-icon>
          <v-icon>mdi-school</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Wissenvermittlung</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-group group="wms" style="pa-0" prepend-icon="mdi-folder-open">
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Wissensmanagement</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item to="/main/wms/projects" color="cctPurple" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-account-tie</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Projektdokumentation</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/meetings" color="cctGreen" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-human-male-board</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>CCT-Sitzungen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/documents/templates" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-file-powerpoint</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Vorlagen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/documents/member-progression" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-account-arrow-up</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Mitgliedswerdegang</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/documents/recruiting" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-human-greeting</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Recruiting</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/documents/archive" class="ml-2" v-if="hasAnyPermission(['portal.documents.archive.create'])">
          <v-list-item-icon>
            <v-icon>mdi-archive</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Archiv</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/documents/project-work" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-briefcase</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Projektarbeit</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/documents/public-affairs" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-earth</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Öffentlichkeitsarbeit</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/documents/quality-management" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-check-decagram</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Quality Management</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/wms/boards" class="ml-2">
          <v-list-item-icon>
            <v-icon>mdi-crown</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Vorstand</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-item :to="{ name: 'finance-request'}" color="cctBlue">
        <v-list-item-icon>
          <v-icon>mdi-cash</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Finanzanträge</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-group group="qm" style="pa-0" prepend-icon="mdi-folder-open" >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>QM-Tools</v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item to="/main/qmsa" class="ml-2" disabled>
          <v-list-item-icon>
            <v-icon>mdi-check-decagram</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>QM Checker</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/main/dokumentenlenkung" class="ml-2" v-if="hasAnyPermission(['portal.approve'])" disabled>
          <v-list-item-icon>
            <v-icon>mdi-file-check</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dokumentenlenkung</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-item to="/main/admin/dashboard" color="cctOrange" v-if="hasAdminAccess">
        <v-list-item-icon>
          <v-icon>mdi-wizard-hat</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Admin Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item :to="calendarURL" color="purple">
        <v-list-item-icon>
          <v-icon>mdi-calendar</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Kalender</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item :to="towernutzungURL" color="purple">
        <v-list-item-icon>
          <v-icon>mdi-chess-rook</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Towernutzung</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/main/tower-anwesenheit" color="cctOrange">
        <v-list-item-icon>
          <v-icon>mdi-key</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Tower-Anwesenheit</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item to="/main/hochladen" color="cctGreen">
        <v-list-item-icon>
          <v-icon>upload</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>DoSi-Folien hochladen</v-list-item-title>
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

      <v-list-item href="https://cct-ev-pm.monday.com" color="cctBlue" target="_blank">
        <v-list-item-icon>
          <v-icon>mdi-television</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>CRM-Tool</v-list-item-title>
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
  readHasAdminAccess,
  readHasAnyPermission,
  readUserProfile
} from '@/store/main/getters';
import {
  commitSetDashboardShowDrawer
} from '@/store/main/mutations';
import {
  Vue,
  Component
} from 'vue-property-decorator'
import CustomAppBar from './CustomAppBar.vue';
import PortalButton from './PortalButton.vue';

@Component({
  components: {
    EmployeeProfilePicture,
    PortalButton,
    CustomAppBar
  }
})
export default class NavigationDrawer extends Vue {

  public hasAnyPermission = readHasAnyPermission(this.$store);

  public get hasAdminAccess() {
    return readHasAdminAccess(this.$store);
  }

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

  get calendarViewType() {
    const param = this.$route.params['viewType']
    if (!param) return 'week'
    return param
  }

  get calendarViewDate() {
    const param = this.$route.params['viewDate']
    if (!param) return 'today'
    return param
  }

  get towernutzungURL() {
    const url = `/main/towernutzung/${this.calendarViewType}/${this.calendarViewDate}`
    return url
  }

  get calendarURL() {
    const url = `/main/calendar/${this.calendarViewType}/${this.calendarViewDate}`
    return url
  }
}
</script>

<style lang="scss">

</style>
