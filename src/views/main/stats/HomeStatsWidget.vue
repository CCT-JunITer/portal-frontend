<template>
  <v-col cols="12" md="6" lg="4" class="d-flex">
    <v-card elevation="2" class="widget-card flex-grow-1 d-flex flex-column">
      <v-card-title class="cctGreen white--text">
        <v-icon left color="white">mdi-chart-line</v-icon>
        Deine Statistiken
      </v-card-title>

      <v-card-text class="flex-grow-1">
        <div v-if="isMetricsLoading" class="text-center py-5">
          <v-progress-circular indeterminate color="cctGreen"></v-progress-circular>
          <div class="mt-3 text-caption">Kennzahlen werden geladen…</div>
        </div>

        <div v-else-if="metricsError" class="text-center py-5">
          <v-icon size="48" color="grey lighten-1">mdi-alert-circle-outline</v-icon>
          <div class="text-subtitle-2 mt-2">{{ metricsError }}</div>
        </div>

        <div v-else-if="!metrics.length" class="text-center py-5 text--secondary">
          <v-icon size="40" color="grey lighten-2">mdi-chart-donut</v-icon>
          <div class="mt-2 text-caption">Noch keine Kennzahlen vorhanden</div>
        </div>

        <div v-else class="metric-list">
          <div
            v-for="metric in metrics"
            :key="metric.label"
            class="metric-row"
          >
            <div class="metric-icon">
              <v-icon color="cctGreen">{{ metric.icon || 'mdi-chart-line' }}</v-icon>
            </div>
            <div class="metric-content">
              <div class="metric-label">{{ metric.label }}</div>
              <div v-if="metric.hint" class="metric-hint">
                {{ metric.hint }}
              </div>
            </div>
            <div class="metric-value">
              <span
                class="metric-value-text"
                :class="{
                  'metric-value-text--muted': metric.shouldHighlight === false,
                }"
              >
                {{ metric.value }}
              </span>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions v-if="isVorstand">
        <v-spacer></v-spacer>
        <v-btn
          text
          color="cctGreen"
          :to="{ name: 'stats-dashboard' }"
        >
          Alle Statistiken
          <v-icon right small>mdi-chevron-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readUserProfile, readIsVorstand } from '@/store/main/getters';
import { dispatchUpdateUserStatsMe } from '@/store/main/actions';
import { IUserProfile } from '@/interfaces';

interface StatisticItem {
  label: string;
  value: string;
  hint?: string;
  numericValue?: number;
  shouldHighlight?: boolean;
  icon?: string;
}

@Component
export default class HomeStatsWidget extends Vue {
  statistics: StatisticItem[] = [];
  loading = false;
  errorMessage: string | null = null;

  async mounted() {
    await this.loadStatistics();
  }

  get metrics(): StatisticItem[] {
    return this.statistics;
  }

  get isMetricsLoading(): boolean {
    return this.loading;
  }

  get metricsError(): string | null {
    return this.errorMessage;
  }

  get isVorstand(): boolean {
    return readIsVorstand(this.$store);
  }

  private async loadStatistics(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;

    try {
      await dispatchUpdateUserStatsMe(this.$store);
      const user = readUserProfile(this.$store);

      if (user) {
        this.statistics = [
          this.getDoSiAttendance(user),
          this.getRessortAttendance(user),
          this.getProjectApplications(user),
          this.getProjectAppointments(user),
          this.getWorkshopParticipation(user),
        ];
      }
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
      this.errorMessage = 'Statistiken konnten nicht geladen werden';
      this.statistics = [];
    } finally {
      this.loading = false;
    }
  }

  private getDoSiAttendance(user: IUserProfile): StatisticItem {
    const quota = user.dosi_attendance_quota || 0;
    const threshold = this.getDoSiThreshold(user.memberstatus);
    const shouldHighlight = threshold === null ? true : quota >= threshold;
    const isTrainee = (user.memberstatus || '').trim().toLowerCase() === 'trainee';
    const hint = isTrainee
      ? 'Gezählt seit deinem Eintritt (max. 12 Sitzungen)'
      : 'Gezählt über die letzten 12 Donnerstagssitzungen';

    return {
      label: 'DoSi Anwesenheitsquote',
      value: `${quota.toFixed(2)} %`,
      hint,
      numericValue: quota,
      shouldHighlight,
      icon: 'mdi-account-clock',
    };
  }

  private getRessortAttendance(user: IUserProfile): StatisticItem {
    const quota = user.ressort_attendance_quota || 0;
    const threshold = this.getRessortThreshold(user.memberstatus, user.ressort);
    const shouldHighlight = threshold === null ? true : quota >= threshold;
    const isTrainee = (user.memberstatus || '').trim().toLowerCase() === 'trainee';
    const hint = isTrainee
      ? 'Gezählt seit deinem Eintritt (max. 12 Sitzungen)'
      : 'Gezählt über die letzten 12 Ressortsitzungen';

    return {
      label: 'Ressortsitzungsquote',
      value: `${quota.toFixed(2)} %`,
      hint,
      numericValue: quota,
      shouldHighlight,
      icon: 'mdi-account-group-outline',
    };
  }

  private getProjectApplications(user: IUserProfile): StatisticItem {
    const count = user.project_applications_count || 0;
    const staffingCount = user.project_staffing_count || 0;
    // Combined criterion: at least one application OR one staffing
    // Vorstand members have no requirement
    const isVorstandMember = this.isUserInVorstand(user);
    const shouldHighlight = isVorstandMember || count >= 1 || staffingCount >= 1;

    return {
      label: 'Projektbewerbungen',
      value: `${count}`,
      hint: 'Abgeschlossene Bewerbungen in den letzten 3 Monaten',
      numericValue: count,
      shouldHighlight,
      icon: 'mdi-file-document-edit-outline',
    };
  }

  private getProjectAppointments(user: IUserProfile): StatisticItem {
    const count = user.project_staffing_count || 0;
    const applicationsCount = user.project_applications_count || 0;
    // Combined criterion: at least one application OR one staffing
    // Vorstand members have no requirement
    const isVorstandMember = this.isUserInVorstand(user);
    const shouldHighlight = isVorstandMember || count >= 1 || applicationsCount >= 1;

    return {
      label: 'Projektbesetzungen',
      value: `${count}`,
      hint: 'Projekte in den letzten 3 Monaten',
      numericValue: count,
      shouldHighlight,
      icon: 'mdi-briefcase-check-outline',
    };
  }

  private isUserInVorstand(user: IUserProfile): boolean {
    if (!user.active_groups) return false;
    return user.active_groups.some(
      group => group.name?.toLowerCase() === 'vorstand' || group.type?.toLowerCase() === 'vorstand'
    );
  }

  private getWorkshopParticipation(user: IUserProfile): StatisticItem {
    const count = user.workshop_participation_count || 0;
    const threshold = this.getWorkshopThreshold(user.memberstatus);
    const shouldHighlight = threshold === null ? true : count >= threshold;

    return {
      label: 'Workshopteilnahmen',
      value: `${count}`,
      hint: 'Workshopteilnahmen in den letzten 3 Monaten',
      numericValue: count,
      shouldHighlight,
      icon: 'mdi-school-outline',
    };
  }

  private getDoSiThreshold(memberStatus?: string | null): number | null {
    if (!memberStatus) {
      return null;
    }

    const normalized = memberStatus.trim().toLowerCase();

    if (normalized === 'trainee' || normalized === 'junior consultant') {
      return 66;
    }

    if (normalized === 'consultant') {
      return 40;
    }

    // Senior Consultant has no DoSi requirement
    return null;
  }

  private getRessortThreshold(memberStatus?: string | null, ressort?: string | null): number | null {
    // Projektmanagement has no Ressort attendance requirement
    if (ressort && ressort.trim().toLowerCase() === 'projektmanagement') {
      return null;
    }

    if (!memberStatus) {
      return null;
    }

    const normalized = memberStatus.trim().toLowerCase();

    if (normalized === 'trainee' || normalized === 'junior consultant') {
      return 66;
    }

    // Consultant and Senior Consultant have no Ressort requirement
    return null;
  }

  private getWorkshopThreshold(memberStatus?: string | null): number | null {
    if (!memberStatus) {
      return null;
    }

    const normalized = memberStatus.trim().toLowerCase();

    if (normalized === 'trainee' || normalized === 'junior consultant') {
      return 1;
    }

    // Consultant and Senior Consultant have no Workshop requirement
    return null;
  }
}
</script>

<style scoped lang="scss">
.widget-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
  }
}

.metric-list {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  gap: 2px;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.metric-row:last-child {
  border-bottom: none;
}


.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background: rgba(56, 142, 60, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.78);
}

.metric-hint {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.6);
}

.metric-value {
  min-width: 70px;
  text-align: right;
}

.metric-value-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--v-cctGreen-base);
}

.metric-value-text--muted {
  color: rgba(0, 0, 0, 0.65);
}
</style>
