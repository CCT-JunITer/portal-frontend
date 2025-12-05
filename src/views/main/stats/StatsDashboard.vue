<template>
  <div>
    <v-toolbar flat class="elevation-2">
      <v-toolbar-title> Aktivitätsstatistiken </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="cctBlue"
        outlined
        @click="loadStatistics"
        :loading="loading"
      >
        <v-icon left>mdi-refresh</v-icon>
        Aktualisieren
      </v-btn>
    </v-toolbar>

    <div class="px-1">
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular
          indeterminate
          color="cctBlue"
          size="64"
        ></v-progress-circular>
        <div class="mt-4 text-body-1">
          Statistiken werden geladen und aktualisiert…
        </div>
        <div class="text-caption cctGrey--text">
          Dies kann einige Sekunden dauern.
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
        <div class="text-h6 mt-4">{{ error }}</div>
        <v-btn color="cctBlue" class="mt-4" @click="loadStatistics">
          Erneut versuchen
        </v-btn>
      </div>

      <div v-else>
        <!-- Summary Cards -->
        <v-row class="mb-4 mt-4">
          <v-col cols="12" md="4">
            <v-card flat class="summary-card summary-card--active">
              <v-card-text class="text-center py-6">
                <div class="text-h3 font-weight-bold cctGreen--text">
                  {{ activeCount }}
                </div>
                <div class="text-subtitle-1 cctGrey--text">
                  Aktiv (alle Kriterien erfüllt)
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card
              flat
              class="summary-card summary-card--quote"
              :style="quoteCardStyle"
            >
              <v-card-text class="text-center py-6">
                <div class="text-h3 font-weight-bold cctBlue--text">
                  {{ activityPercentage }}%
                </div>
                <div class="text-subtitle-1 cctGrey--text">Aktivitätsquote</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card flat class="summary-card summary-card--passive">
              <v-card-text class="text-center py-6">
                <div class="text-h3 font-weight-bold cctOrange--text">
                  {{ inactiveCount }}
                </div>
                <div class="text-subtitle-1 cctGrey--text">
                  Passiv (Kriterien nicht erfüllt)
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filter Row -->
        <v-row class="mb-1 align-center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Suche nach Name"
              dense
              outlined
              hide-details
              clearable
              color="cctBlue"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              label="Status filtern"
              dense
              outlined
              hide-details
              clearable
              color="cctBlue"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterMemberstatus"
              :items="memberstatusOptions"
              label="Memberstatus filtern"
              dense
              outlined
              hide-details
              clearable
              color="cctBlue"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="filteredActiveUsers"
          :search="search"
          :items-per-page="-1"
          class="elevation-2"
          dense
          :footer-props="{
            'items-per-page-options': [25, 50, 100, -1],
            'items-per-page-text': 'Zeilen pro Seite',
          }"
        >
          <template v-slot:item.is_activity_fulfilled="{ item }">
            <v-chip
              :color="item.is_activity_fulfilled ? 'cctGreen' : 'cctOrange'"
              dark
              small
            >
              <v-icon left small>{{
                item.is_activity_fulfilled
                  ? 'mdi-check-circle'
                  : 'mdi-alert-circle'
              }}</v-icon>
              {{ item.is_activity_fulfilled ? 'Aktiv' : 'Passiv' }}
            </v-chip>
          </template>

          <template v-slot:item.full_name="{ item }">
            <div class="d-flex align-center py-2">
              <employee-profile-picture :employee="item" size="32" class="mr-4" />
              <div>
                <div class="font-weight-medium">{{ item.full_name }}</div>
                <div class="text-caption cctLightGrey--text">
                  {{ item.ressort }}
                </div>
              </div>
            </div>
          </template>

          <template v-slot:item.memberstatus="{ item }">
            <v-chip small outlined color="cctBlue">{{
              item.memberstatus || "–"
            }}</v-chip>
          </template>

          <template v-slot:item.dosi_attendance_quota="{ item }">
            <div class="d-flex align-center">
              <v-icon
                :color="item.dosi_ok ? 'cctGreen' : 'error'"
                small
                class="mr-1"
              >
                {{ item.dosi_ok ? "mdi-check" : "mdi-close" }}
              </v-icon>
              <span :class="item.dosi_ok ? 'cctGreen--text' : 'error--text'">
                {{ formatQuota(item.dosi_attendance_quota) }}
              </span>
              <span class="text-caption cctLightGrey--text ml-1">(≥{{ item.thresholds?.dosi }}%)</span>
            </div>
          </template>

          <template v-slot:item.ressort_attendance_quota="{ item }">
            <div class="d-flex align-center">
              <v-icon
                :color="item.ressort_ok ? 'cctGreen' : 'error'"
                small
                class="mr-1"
              >
                {{ item.ressort_ok ? "mdi-check" : "mdi-close" }}
              </v-icon>
              <span :class="item.ressort_ok ? 'cctGreen--text' : 'error--text'">
                {{ formatQuota(item.ressort_attendance_quota) }}
              </span>
              <span class="text-caption cctLightGrey--text ml-1">(≥{{ item.thresholds?.ressort }}%)</span>
            </div>
          </template>

          <template v-slot:item.applications_or_staffing="{ item }">
            <div class="d-flex align-center">
              <v-icon
                :color="item.applications_or_staffing_ok ? 'cctGreen' : 'error'"
                small
                class="mr-1"
              >
                {{
                  item.applications_or_staffing_ok ? 'mdi-check' : 'mdi-close'
                }}
              </v-icon>
              <span
                :class="
                  item.applications_or_staffing_ok
                    ? 'cctGreen--text'
                    : 'error--text'
                "
              >
                {{ item.project_applications_count || 0 }} /
                {{ item.project_staffing_count || 0 }}
              </span>
              <span class="text-caption cctLightGrey--text ml-1">{{
                item.thresholds?.applications_or_staffing_required ? '(mind. 1)' : '(–)'
              }}</span>
            </div>
          </template>

          <template v-slot:item.workshop_participation_count="{ item }">
            <div class="d-flex align-center">
              <v-icon
                :color="item.workshop_ok ? 'cctGreen' : 'error'"
                small
                class="mr-1"
              >
                {{ item.workshop_ok ? "mdi-check" : "mdi-close" }}
              </v-icon>
              <span
                :class="item.workshop_ok ? 'cctGreen--text' : 'error--text'"
              >
                {{ item.workshop_participation_count || 0 }}
              </span>
              <span class="text-caption cctLightGrey--text ml-1">(≥{{ item.thresholds?.workshop }})</span>
            </div>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon
              small
              :to="{ name: 'profile', params: { id: item.id } }"
            >
              <v-icon small color="cctBlue">mdi-account-details</v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-card class="mt-6">
          <v-card-title class="paused-title">
            Ruhende Mitgliedschaften ({{ pausedMembers.length }})
          </v-card-title>
          <v-divider></v-divider>
          <v-data-table
            :headers="pausedHeaders"
            :items="pausedMembers"
            :items-per-page="-1"
            hide-default-footer
            dense
            class="paused-table"
          >
            <template v-slot:no-data>
              <div class="text-center py-4 cctGrey--text">
                Keine ruhenden Mitgliedschaften vorhanden.
              </div>
            </template>

            <template v-slot:item.full_name="{ item }">
              <div class="d-flex align-center py-2">
                <employee-profile-picture :employee="item" size="28" class="mr-3" />
                <span>{{ item.full_name }}</span>
              </div>
            </template>

            <template v-slot:item.paused_since="{ item }">
              {{ formatDate(item.paused_since) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon
                small
                :to="{ name: 'profile', params: { id: item.id } }"
              >
                <v-icon small color="cctBlue">mdi-account-details</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { api } from '@/api';
import { readToken } from '@/store/main/getters';
import { IUserStatistics, IUserStatisticsResponse } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';

@Component({
  components: { EmployeeProfilePicture },
})
export default class StatsDashboard extends Vue {
  users: IUserStatistics[] = [];
  pausedMembers: IUserStatistics[] = [];
  loading = false;
  error: string | null = null;
  search = '';
  filterStatus: string | null = null;
  filterMemberstatus: string | null = null;

  headers = [
    { text: 'Status', value: 'is_activity_fulfilled', sortable: true, class: 'text-no-wrap' },
    { text: 'Name', value: 'full_name', sortable: true },
    {
      text: 'Memberstatus',
      value: 'memberstatus',
      sortable: true,
      class: 'text-no-wrap',
    },
    {
      text: 'DoSi Quote',
      value: 'dosi_attendance_quota',
      sortable: true,
      class: 'text-no-wrap',
    },
    {
      text: 'Ressort Quote',
      value: 'ressort_attendance_quota',
      sortable: true,
      class: 'text-no-wrap',
    },
    {
      text: 'Bewerbungen / Besetzungen',
      value: 'applications_or_staffing',
      sortable: true,
      class: 'text-no-wrap',
    },
    {
      text: 'Workshops',
      value: 'workshop_participation_count',
      sortable: true,
      class: 'text-no-wrap',
    },
    { text: '', value: 'actions', sortable: false },
  ];

  pausedHeaders = [
    { text: 'Name', value: 'full_name', sortable: true },
    { text: 'Ressort', value: 'ressort', sortable: true },
    { text: 'Memberstatus', value: 'memberstatus', sortable: true },
    { text: 'Ruhend seit', value: 'paused_since', sortable: true },
    { text: '', value: 'actions', sortable: false },
  ];

  statusOptions = [
    { text: 'Alle', value: null },
    { text: 'Aktiv', value: 'active' },
    { text: 'Passiv', value: 'passive' },
  ];

  get memberstatusOptions() {
    const statuses = [
      ...new Set(this.users.map((u) => u.memberstatus).filter(Boolean)),
    ];
    return [
      { text: 'Alle', value: null },
      ...statuses.map((s) => ({ text: s, value: s })),
    ];
  }

  get filteredActiveUsers() {
    let result = this.users;

    if (this.filterStatus === 'active') {
      result = result.filter((u) => u.is_activity_fulfilled);
    } else if (this.filterStatus === 'passive') {
      result = result.filter((u) => !u.is_activity_fulfilled);
    }

    if (this.filterMemberstatus) {
      result = result.filter((u) => u.memberstatus === this.filterMemberstatus);
    }

    return result;
  }

  get activeCount() {
    return this.users.filter((u) => u.is_activity_fulfilled).length;
  }

  get inactiveCount() {
    return this.users.filter((u) => !u.is_activity_fulfilled).length;
  }

  get activityPercentage() {
    if (this.users.length === 0) return 0;
    return ((this.activeCount / this.users.length) * 100).toFixed(0);
  }

  get quoteCardStyle() {
    const percentage =
      this.users.length > 0 ? (this.activeCount / this.users.length) * 100 : 0;
    return {
      background: `linear-gradient(to right, rgba(29, 69, 124, 0.2) ${percentage}%, transparent ${percentage}%)`,
    };
  }

  async mounted() {
    await this.loadStatistics();
  }

  async loadStatistics() {
    this.loading = true;
    this.error = null;

    try {
      const token = readToken(this.$store);
      if (!token) {
        this.error = 'Nicht authentifiziert';
        return;
      }

      const response = await api.getAllUserStatistics(token);
      const payload = response.data as IUserStatisticsResponse;
      this.users = payload.active_users;
      this.pausedMembers = payload.paused_members;
    } catch (err: any) {
      console.error('Error loading statistics:', err);
      if (err.response?.status === 403) {
        this.error =
          'Keine Berechtigung. Diese Ansicht ist nur für den Vorstand verfügbar.';
      } else {
        this.error = 'Fehler beim Laden der Statistiken';
      }
    } finally {
      this.loading = false;
    }
  }

  formatQuota(value: number | null): string {
    if (value === null || value === undefined) return '–';
    return `${value.toFixed(1)}%`;
  }

  formatDate(value: string | null): string {
    if (!value) return '–';
    return new Date(value).toLocaleDateString('de-DE');
  }
}
</script>

<style scoped lang="scss">
.summary-card {
  border-radius: 8px;
  background: transparent;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  border: 2px solid var(--v-cctBlue-base);

  &--active {
    border: 2px solid var(--v-cctGreen-base);
  }

  &--passive {
    border: 2px solid var(--v-cctOrange-base);
  }
}


.paused-title {
  font-weight: 600;
  color: var(--v-cctBlue-base);
}
</style>
