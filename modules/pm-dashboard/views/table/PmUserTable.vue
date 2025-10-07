<template>
  <backdrop :height="this.$vuetify.breakpoint.mdAndUp ? '100px' : '50px'" color="grey lighten-4">
    <div class="d-flex align-center justify-center flex-column mb-5">
      <v-toolbar
        class="mt-md-15 mx-5"
        rounded
        elevation="3"
        width="500"
      >
        <v-text-field
          v-model="searchText"
          class="search-bar"
          clearable
          label="Mitglieder suchen"
          hide-details
          color="cctGreen"
          full-width
          dense
          solo
          flat
          single-line
          prepend-icon="mdi-magnify"
        >
        </v-text-field>
        <v-divider vertical inset class="mx-0"></v-divider>
        <div class="select-wrapper px-2">
          <v-select
            v-model="category"
            :menu-props="{ offsetY: true, bottom: true }"
            solo
            flat
            dense
            hide-details
            :items="categories"
          >
          </v-select>
        </div>
      </v-toolbar>
    </div>
    <div>
      <v-data-table 
        :headers="headers" 
        :items="users" 
        :search="searchText" 
        multi-sort
      >
        <template v-slot:item.custom_details="{ item }">
          <v-btn
            color="cctGrey"
            :to="{ name: 'pm-user-detail', params: { id: item.id } }"
            dark
          >
            <v-icon>
              mdi-text
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </backdrop>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Backdrop from '@/components/Backdrop.vue';
import { IUserProfile, UserType } from '@/interfaces';
import { dispatchGetUsers } from '@/store/main/actions';
import { readUsers } from '@/store/main/getters';
import { readProjects } from '@modules/projects/store/getters';
import { dispatchGetProjects } from '@modules/projects/store/actions';

@Component({
  components: { Backdrop }
})
export default class PmUserTable extends Vue {
  public userBtMap: Record<number, number> = {};
  public userProjectsMap: Record<number, number> = {};
  public userApplicationsMap: Record<number, number> = {};

  get users() {
    const users = readUsers(this.$store);
    return users.map(user => ({
      ...user,
      total_external_bt: this.userBtMap[user.id] || 0,
      amount_projects_closed: this.userProjectsMap[user.id] || 0,
      amount_applications: this.userApplicationsMap[user.id] || 0,
    }));
  }

  get projects() {
    return readProjects(this.$store)('all') || [];
  }

  get searchText() {
    return (this.$route.query.value as string) || '';
  }

  set searchText(value: string) {
    this.$router.replace({ query: { ...this.$route.query, value: value || undefined } });
  }

  private categories = [
    { value: 'all', text: 'Alle' },
    { value: 'consultants', text: 'Consultants' },
    { value: 'trainees', text: 'Trainees' }
  ];
  
  get category() {
    const cat = (this.$route.query.category as string);
    if (!this.categories.find(category => category.value === cat)) {
      return 'all';
    }
    return cat as UserType;
  }

  set category(category: string) {
    this.$router.replace({ query: { ...this.$route.query, category } });
  }

  public headers: { text: string; value: keyof IUserProfile | string; sortable?: boolean }[] = [
    {
      text: 'Name',
      value: 'full_name',
    },
    {
      text: 'Ressort',
      value: 'ressort',
    },
    {
      text: 'Mitgliedsstatus',
      value: 'memberstatus',
    },
    {
      text: 'Höchste Projektposition',
      value: 'highest_project_position',
    },
    {
      text: 'Anzahl Projektbewerbungen',
      value: 'amount_applications',
    },
    {
      text: 'Projekte abgeschlossen',
      value: 'amount_projects_closed',
    },
    {
      text: 'externe BT',
      value: 'total_external_bt',
    },
    {
      text: 'Studiengang',
      value: 'major',
    },
    {
      text: 'Hochschulgrad des Studiums',
      value: 'studylevel',
    },
    {
      text: 'Ist passiv',
      value: 'is_passive',
    },
    {
      text: 'Details',
      value: 'custom_details',
      sortable: false,
    },
  ];

  async mounted() {
    await this.loadData();
  }

  private async loadData() {
    if (!this.projects || !this.projects.length) {
      await dispatchGetProjects(this.$store, 'all');
      await dispatchGetUsers(this.$store);
    }

    this.calculateUserMetrics();
  }

  private calculateUserMetrics() {
    const users = this.users;
    const projects = this.projects;
    const userBtMap: Record<number, number> = {};

    projects.forEach(project => {
      // Calculate BT amounts and project counts for external projects
      if (project.type === 'external' && project.participants?.committee) {
        project.participants.committee.forEach(participant => {
          const userId = participant.participant.id;
          
          // Accumulate BT amounts
          if (project.bt_amount_actual) {
            userBtMap[userId] = (userBtMap[userId] || 0) + project.bt_amount_actual;
          }
          
          // Count completed projects
          this.userProjectsMap[userId] = (this.userProjectsMap[userId] || 0) + 1;
        });
      }

      // Count applications
      if (project.applications) {
        project.applications.forEach(application => {
          const userId = application.participant_id;
          this.userApplicationsMap[userId] = (this.userApplicationsMap[userId] || 0) + 1;
        });
      }
    });

    this.userBtMap = userBtMap;

    // Combine projects and applications count
    users.forEach(user => {
      const projectCount = this.userProjectsMap[user.id] || 0;
      const applicationCount = this.userApplicationsMap[user.id] || 0;
      this.userApplicationsMap[user.id] = projectCount + applicationCount;
    });
  }
}
</script>