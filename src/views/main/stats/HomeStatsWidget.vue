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

    </v-card>
  </v-col>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { dispatchGetEvents, dispatchGetOneEvent } from '@/store/event/actions';
import { readEvents, readOneEvent } from '@/store/event/getters';
import { readUserProfile } from '@/store/main/getters';
import { dispatchGetProjectsFor } from '@modules/projects/store/actions';
import { readProjectsForUser } from '@modules/projects/store/getters';
import { dispatchGetProjectTenders, dispatchGetOwnProjectApplicationByTender } from '@modules/project-application/store/actions';
import { readProjectTenders } from '@modules/project-application/store/getters';
import { DateTime } from 'luxon';

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

  private async loadStatistics(): Promise<void> {
    this.loading = true;
    this.errorMessage = null;

    try {
      const stats = await Promise.all([
        this.fetchDoSiAttendance(),
        // this.fetchRessortAttendance(),
        this.fetchProjectApplications(),
        this.fetchProjectAppointments(),
        // this.fetchWorkshopParticipation(),
        // this.fetchSurveyParticipation(),
      ]);

      this.statistics = stats;
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
      this.errorMessage = 'Statistiken konnten nicht geladen werden.';
      this.statistics = [];
    } finally {
      this.loading = false;
    }
  }

  private async fetchDoSiAttendance(): Promise<StatisticItem> {
    const label = 'DoSi Anwesenheitsquote';
    const icon = 'mdi-account-clock';
    const user = readUserProfile(this.$store);

    if (!user?.id) {
      return { label, value: '–', hint: 'Kein Benutzerprofil geladen.', icon };
    }

    try {
      await dispatchGetEvents(this.$store, 'meeting');
      const events = readEvents(this.$store)('meeting');

      if (!Array.isArray(events) || !events.length) {
        return { label, value: '–', hint: 'Keine Donnerstagssitzungen gefunden.', icon };
      }

      const meetingEvents = events
        .filter(event => event.subtype === 'Donnerstagssitzung')
        .sort((a, b) => new Date(b.date_from).getTime() - new Date(a.date_from).getTime())
        .slice(0, 18);

      let attended = 0;

      for (const meeting of meetingEvents) {
        try {
          await dispatchGetOneEvent(this.$store, meeting.id);
          const detailedEvent = readOneEvent(this.$store)(meeting.id);
          const participants = detailedEvent?.participants || [];

          if (participants.some(participant => participant.id === user.id)) {
            attended += 1;
          }
        } catch (error) {
          console.error(`Fehler beim Laden der Meeting-Details (${meeting.id}):`, error);
        }
      }
      const quota = (attended / 18) * 100;
      const threshold = this.getDoSiThreshold(user.memberstatus);
      const shouldHighlight = threshold === null ? true : quota >= threshold;

      // Keep the different values of 12 and 18 because they are intentional
      const value = `${quota.toFixed(2)} %`;
      const hintBase = 'Gezählt über die letzten 12 Donnerstagssitzungen';
      const hint = threshold === null ? hintBase : `${hintBase} • Grenzwert ${threshold}%`;

      return { label, value, hint, numericValue: quota, shouldHighlight, icon };
    } catch (error) {
      console.error('Fehler beim Laden der DoSi-Anwesenheit:', error);
      return { label, value: '–', hint: 'DoSi-Anwesenheit konnte nicht geladen werden.', icon };
    }
  }

  private async fetchRessortAttendance(): Promise<StatisticItem> {
    return { label: 'Ressort Anwesenheitsquote', value: 'X' };
  }

  private async fetchProjectApplications(): Promise<StatisticItem> {
    const label = 'Projektbewerbungen';
    const icon = 'mdi-file-document-edit-outline';

    try {
      await dispatchGetProjectTenders(this.$store);
      const tenders = readProjectTenders(this.$store) || [];
      const now = DateTime.now();
      const fourMonthsAgo = now.minus({ months: 4 });

      const recentTenderIds = tenders
        .filter(tender => {
          const deadline = DateTime.fromISO(tender.date_deadline);
          return deadline.isValid && deadline >= fourMonthsAgo && deadline <= now;
        })
        .map(tender => tender.id);

      if (!recentTenderIds.length) {
        return {
          label,
          value: '0',
          hint: 'Keine Ausschreibungen mit Deadline in den letzten 4 Monaten.',
          numericValue: 0,
          shouldHighlight: false,
          icon,
        };
      }

      const applications = await Promise.all(
        recentTenderIds.map(id => dispatchGetOwnProjectApplicationByTender(this.$store, id))
      );

      const completedCount = applications.filter(app => app?.status === 'completed').length;
      const hint = 'Abgeschlossene Bewerbungen in den letzten 4 Monaten';

      return {
        label,
        value: `${completedCount}`,
        hint,
        numericValue: completedCount,
        shouldHighlight: completedCount >= 1,
        icon,
      };
    } catch (error) {
      console.error('Fehler beim Laden der Projektbewerbungen:', error);
      return { label, value: '–', hint: 'Projektbewerbungen konnten nicht geladen werden.', icon };
    }
  }

  private async fetchProjectAppointments(): Promise<StatisticItem> {
    const label = 'Projektbesetzung';
    const icon = 'mdi-briefcase-check-outline';
    const user = readUserProfile(this.$store);

    if (!user?.id) {
      return { label, value: '–', hint: 'Kein Benutzerprofil geladen.', icon };
    }

    try {
      await dispatchGetProjectsFor(this.$store, user.id);
      const projects = readProjectsForUser(this.$store)(user.id) || [];
      const fourMonthsAgo = DateTime.now().minus({ months: 4 });

      const recentCount = projects.filter(project => {
        const relevantDateStr =
          project.project_end_date_actual ||
          project.project_end_date_expected ||
          project.project_start_date_actual ||
          project.project_start_date_expected ||
          project.acceptance_date;

        if (!relevantDateStr) {
          return false;
        }

        const dt = DateTime.fromISO(relevantDateStr);
        return dt.isValid && dt >= fourMonthsAgo;
      }).length;

      const value = `${recentCount}`;
      const hint = 'Projekte in den letzten 4 Monaten';

      return {
        label,
        value,
        hint,
        numericValue: recentCount,
        shouldHighlight: recentCount >= 1,
        icon,
      };
    } catch (error) {
      console.error('Fehler beim Laden der Projektbesetzungen:', error);
      return { label, value: '–', hint: 'Projektbesetzungen konnten nicht geladen werden.', icon };
    }
  }

  private async fetchWorkshopParticipation(): Promise<StatisticItem> {
    return { label: 'Workshopteilnahme', value: 'X' };
  }

  private async fetchSurveyParticipation(): Promise<StatisticItem> {
    return { label: 'Umfragenteilnahme', value: 'X' };
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
  margin-top: 12px;
  gap: 4px;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.metric-row:last-child {
  border-bottom: none;
}

.metric-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
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
  gap: 4px;
}

.metric-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.78);
}

.metric-hint {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}

.metric-value {
  min-width: 80px;
  text-align: right;
}

.metric-value-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--v-cctGreen-base);
}

.metric-value-text--muted {
  color: rgba(0, 0, 0, 0.65);
}
</style>
