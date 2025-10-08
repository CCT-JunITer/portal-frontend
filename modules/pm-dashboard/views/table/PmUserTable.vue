<template>
  <backdrop :height="this.$vuetify.breakpoint.mdAndUp ? '100px' : '50px'" color="grey lighten-4">
    <div class="d-flex align-center justify-center flex-column mb-5">
      <v-toolbar
        class="mt-md-15 mx-5"
        rounded
        elevation="3"
        :width="$vuetify.breakpoint.mdAndUp ? '900' : '100%'"
      >
        <v-text-field
          v-model="searchText"
          class="search-bar"
          clearable
          label="Mitglieder suchen (Name, Ressort, Studiengang...)"
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
            @change="onCategoryChange"
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

    <!-- Advanced Filters -->
    <v-card class="mx-5 mb-5" outlined>
      <v-card-text class="pb-2">
        <v-row dense>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterRessort"
              :items="ressortOptions"
              label="Ressort"
              clearable
              dense
              outlined
              hide-details
              multiple
              chips
              small-chips
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterMemberstatus"
              :items="memberstatusOptions"
              label="Mitgliedsstatus"
              clearable
              dense
              outlined
              hide-details
              multiple
              chips
              small-chips
            ></v-select>
          </v-col>
          <v-col cols="6" md="2">
            <v-checkbox
              v-model="hidePassive"
              label="Passive ausblenden"
              dense
              hide-details
              class="mt-0"
            ></v-checkbox>
          </v-col>
          <v-col cols="6" md="2">
            <v-checkbox
              v-model="hideAlumni"
              label="Alumni ausblenden"
              dense
              hide-details
              class="mt-0"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn small text @click="clearFilters">
              <v-icon small left>mdi-filter-remove</v-icon>
              Filter zurücksetzen
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div class="px-5">
      <v-data-table 
        :headers="headers" 
        :items="filteredUsers" 
        :search="searchText"
        :custom-filter="customFilter"
        multi-sort
        :items-per-page="25"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100, -1]
        }"
        class="elevation-2"
      >
        <template v-slot:item.full_name="{ item }">
          <div class="d-flex align-center">
            <employee-profile-picture :employee="item" size="32" class="mr-2" />
            <span class="font-weight-medium">{{ item.full_name }}</span>
          </div>
        </template>

        <template v-slot:item.is_passive="{ item }">
          <v-chip
            x-small
            :color="item.is_passive ? 'cctOrange' : 'green'"
            dark
          >
            {{ item.is_passive ? 'Ja' : 'Nein' }}
          </v-chip>
        </template>

        <template v-slot:item.availability_weekdays="{ item }">
          <div v-if="item.availability_weekdays && item.availability_weekdays.length" class="text-caption">
            {{ formatWeekdays(item.availability_weekdays) }}
          </div>
          <span v-else class="text-caption grey--text">—</span>
        </template>

        <template v-slot:item.custom_details="{ item }">
          <v-btn
            color="cctGrey"
            :to="{ name: 'pm-user-detail', params: { id: item.id } }"
            dark
            small
          >
            <v-icon small>
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
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { IUserProfile, UserType } from '@/interfaces';
import { dispatchGetUsers } from '@/store/main/actions';
import { readUsers } from '@/store/main/getters';

@Component({
  components: { Backdrop, EmployeeProfilePicture }
})
export default class PmUserTable extends Vue {
  // Filter state
  private filterRessort: string[] = [];
  private filterMemberstatus: string[] = [];
  private hidePassive = true;
  private hideAlumni = true;

  get users() {
    return readUsers(this.$store);
  }

  get filteredUsers() {
    let filtered = this.users;

    // Filter by category (similar to SearchView logic)
    if (this.category === 'consultants') {
      // Filter for consultant-level members (Consultant, Senior Consultant)
      filtered = filtered.filter(u => 
        u.memberstatus === 'Consultant' || u.memberstatus === 'Senior Consultant'
      );
    } else if (this.category === 'trainees') {
      // Filter for trainee-level members
      filtered = filtered.filter(u => 
        u.memberstatus === 'Trainee' || u.memberstatus === 'Junior Consultant'
      );
    }
    // 'all' shows everyone

    // Filter by ressort
    if (this.filterRessort.length > 0) {
      filtered = filtered.filter(u => this.filterRessort.includes(u.ressort));
    }

    // Filter by memberstatus
    if (this.filterMemberstatus.length > 0) {
      filtered = filtered.filter(u => this.filterMemberstatus.includes(u.memberstatus));
    }

    // Hide passive members
    if (this.hidePassive) {
      filtered = filtered.filter(u => !u.is_passive);
    }

    // Hide alumni
    if (this.hideAlumni) {
      filtered = filtered.filter(u => !u.is_alumni);
    }

    return filtered;
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

  get ressortOptions() {
    const ressorts = new Set(this.users.map(u => u.ressort).filter(Boolean));
    return Array.from(ressorts).sort();
  }

  get memberstatusOptions() {
    const statuses = new Set(this.users.map(u => u.memberstatus).filter(Boolean));
    return Array.from(statuses).sort();
  }

  public headers: { text: string; value: keyof IUserProfile | string; sortable?: boolean; width?: string; sort?: (a: string, b: string) => number }[] = [
    {
      text: 'Name',
      value: 'full_name',
      width: '200px'
    },
    {
      text: 'Ressort',
      value: 'ressort',
      sort: (a: string, b: string) => {
        // Alphabetical sorting for ressort
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;
        return a.localeCompare(b);
      }
    },
    {
      text: 'Status',
      value: 'memberstatus',
      sort: (a: string, b: string) => {
        // Hierarchical order: Senior Consultant > Consultant > Junior Consultant > Trainee
        const statusOrder: Record<string, number> = {
          'Senior Consultant': 1,
          'Consultant': 2,
          'Junior Consultant': 3,
          'Trainee': 4,
        };
        const aValue = statusOrder[a] || 99;
        const bValue = statusOrder[b] || 99;
        return aValue - bValue;
      }
    },
    {
      text: 'Studiengang',
      value: 'major',
    },
    {
      text: 'Hochschulgrad',
      value: 'studylevel',
    },
    {
      text: 'Verfügbare Tage',
      value: 'availability_weekdays',
      sortable: false,
    },
    {
      text: 'Passiv',
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
    await dispatchGetUsers(this.$store);
  }

  public async onCategoryChange() {
    await dispatchGetUsers(this.$store);
  }

  private clearFilters() {
    this.filterRessort = [];
    this.filterMemberstatus = [];
    this.hidePassive = true;
    this.hideAlumni = true;
  }

  private customFilter(value: unknown, search: string | null, item: IUserProfile) {
    if (!search) return true;
    
    const searchLower = search.toLowerCase();
    
    // Search in basic fields
    const basicFields = [
      item.full_name,
      item.email,
      item.ressort,
      item.memberstatus,
      item.major,
      item.studylevel,
    ].filter(Boolean).join(' ').toLowerCase();
    
    if (basicFields.includes(searchLower)) return true;
    
    return false;
  }

  private formatWeekdays(weekdays: string[]) {
    const weekdayMap: Record<string, string> = {
      'monday': 'Mo',
      'tuesday': 'Di',
      'wednesday': 'Mi',
      'thursday': 'Do',
      'friday': 'Fr',
      'saturday': 'Sa',
      'sunday': 'So',
    };
    return weekdays.map(d => weekdayMap[d] || d).join(', ');
  }
}
</script>

<style lang="scss" scoped>
.search-bar {
  ::v-deep .v-input__control {
    min-height: 40px;
  }
}

.select-wrapper {
  min-width: 150px;
}

::v-deep .v-data-table {
  th {
    white-space: nowrap;
  }
  
  td {
    padding: 8px 12px !important;
  }
}
</style>
