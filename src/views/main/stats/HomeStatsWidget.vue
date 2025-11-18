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
import { dispatchGetProjectTenders, dispatchGetOwnProjectApplicationByTender } from '@modules/project-application/store/actions';
import { readProjectTenders } from '@modules/project-application/store/getters';
import { ProjectHistoryItem } from '@/interfaces';

interface StatisticItem {
  label: string;
  value: string;
  hint?: string;
  numericValue?: number;
  shouldHighlight?: boolean;
  icon?: string;
}

interface MeetingAttendanceOptions {
  subtype: string;
  label: string;
  icon: string;
  emptyHint: string;
  hintBase: string;
  limit?: number;
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
      const [doSi, ressortMeetings, projectApplications, projectAppointments] = await Promise.all([
        this.fetchDoSiAttendance(),
        this.fetchRessortMeetingAttendance(),
        // this.fetchRessortAttendance(),
        this.fetchProjectApplications(),
        this.fetchProjectAppointments(),
        // this.fetchSurveyParticipation(),
      ]);

      const workshopParticipation = await this.fetchWorkshopParticipation();

      this.statistics = [
        doSi,
        ressortMeetings,
        projectApplications,
        projectAppointments,
        workshopParticipation,
      ];
    } catch (error) {
      console.error('Fehler beim Laden der Statistiken:', error);
      this.errorMessage = 'Statistiken konnten nicht geladen werden';
      this.statistics = [];
    } finally {
      this.loading = false;
    }
  }

  private async fetchDoSiAttendance(): Promise<StatisticItem> {
    return this.fetchMeetingAttendance({
      subtype: 'Donnerstagssitzung',
      label: 'DoSi Anwesenheitsquote',
      icon: 'mdi-account-clock',
      emptyHint: 'Keine Donnerstagssitzungen gefunden',
      hintBase: 'Gezählt über die letzten 12 Donnerstagssitzungen',
    });
  }

  private async fetchRessortMeetingAttendance(): Promise<StatisticItem> {
    return this.fetchMeetingAttendance({
      subtype: 'Ressortsitzung',
      label: 'Ressortsitzungsquote',
      icon: 'mdi-account-group-outline',
      emptyHint: 'Keine Ressortsitzungen gefunden',
      hintBase: 'Gezählt über die letzten 12 Ressortsitzungen',
    });
  }

  private async fetchMeetingAttendance(options: MeetingAttendanceOptions): Promise<StatisticItem> {
    const { subtype, label, icon, emptyHint, hintBase, limit = 12 } = options;
    const user = readUserProfile(this.$store);

    if (!user?.id) {
      return { label, value: '–', hint: 'Kein Benutzerprofil geladen', icon };
    }

    try {
      await dispatchGetEvents(this.$store, 'meeting');
      const events = readEvents(this.$store)('meeting');

      if (!Array.isArray(events) || !events.length) {
        return { label, value: '–', hint: emptyHint, icon };
      }

      const meetingEvents = events
        .filter(event => event.subtype === subtype)
        .sort((a, b) => new Date(b.date_from).getTime() - new Date(a.date_from).getTime())
        .slice(0, limit);

      if (!meetingEvents.length) {
        return { label, value: '–', hint: emptyHint, icon };
      }

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

      const quota = (attended / limit) * 100;
      const threshold = this.getDoSiThreshold(user.memberstatus);
      const shouldHighlight = threshold === null ? true : quota >= threshold;

      const value = `${quota.toFixed(2)} %`;
      const hint = hintBase;

      return { label, value, hint, numericValue: quota, shouldHighlight, icon };
    } catch (error) {
      console.error(`Fehler beim Laden der ${subtype}-Anwesenheit:`, error);
      return { label, value: '–', hint: `${label} konnte nicht geladen werden`, icon };
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
      const now = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);

      const recentTenderIds = tenders
        .filter(tender => {
          const deadline = new Date(tender.date_deadline);
          return !isNaN(deadline.getTime()) && deadline >= threeMonthsAgo && deadline <= now;
        })
        .map(tender => tender.id);

      if (!recentTenderIds.length) {
        return {
          label,
          value: '0',
          hint: 'Abgeschlossene Bewerbungen in den letzten 3 Monaten', //Keine Ausschreibungen mit Deadline in den letzten 3 Monaten
          numericValue: 0,
          shouldHighlight: false,
          icon,
        };
      }

      const applications = await Promise.all(
        recentTenderIds.map(id => dispatchGetOwnProjectApplicationByTender(this.$store, id))
      );

      const completedCount = applications.filter(app => app?.status === 'completed').length;
      const hint = 'Abgeschlossene Bewerbungen in den letzten 3 Monaten';

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
      return { label, value: '–', hint: 'Projektbewerbungen konnten nicht geladen werden', icon };
    }
  }

  private async fetchProjectAppointments(): Promise<StatisticItem> {
    const label = 'Projektbesetzungen';
    const icon = 'mdi-briefcase-check-outline';
    const profile = readUserProfile(this.$store);
    const history = profile?.project_history;
    const hint = 'Projekte in den letzten 3 Monaten';

    if (!history?.length) {
      return {
        label,
        value: '0',
        hint,
        numericValue: 0,
        shouldHighlight: false,
        icon,
      };
    }

    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setMonth(now.getMonth() - 3);

    const recentCount = history.filter(project => this.isRecentProjectStaffing(project, cutoff)).length;

    return {
      label,
      value: `${recentCount}`,
      hint,
      numericValue: recentCount,
      shouldHighlight: recentCount >= 1,
      icon,
    };
  }

  private isRecentProjectStaffing(project: ProjectHistoryItem, cutoff: Date): boolean {
    const role = (project.role || '').trim().toLowerCase();
    if (role === 'committee') {
      return false;
    }

    const dates = [project.start_date, project.end_date]
      .map(dateStr => {
        if (!dateStr) {
          return null;
        }
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? null : parsed;
      })
      .filter((date): date is Date => date !== null);

    if (!dates.length) {
      return false;
    }

    return dates.some(date => date >= cutoff);
  }

  private async fetchWorkshopParticipation(): Promise<StatisticItem> {
    const label = 'Workshopteilnahmen';
    const icon = 'mdi-school-outline';
    const user = readUserProfile(this.$store);
    const hint = 'Workshopteilnahmen in den letzten 3 Monaten';

    if (!user?.id) {
      return {
        label,
        value: '–',
        hint: 'Kein Benutzerprofil geladen',
        icon,
        shouldHighlight: false,
      };
    }

    try {
      await dispatchGetEvents(this.$store, 'training');
      const events = readEvents(this.$store)('training') || [];
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setMonth(now.getMonth() - 3);

      const workshopEvents = events.filter(event => {
        const subtype = (event.subtype || '').trim().toLowerCase();
        if (subtype !== 'workshop') {
          return false;
        }

        const startDate = new Date(event.date_from);
        return !isNaN(startDate.getTime()) && startDate >= cutoff && startDate <= now;
      });

      if (!workshopEvents.length) {
        return {
          label,
          value: '0',
          hint,
          numericValue: 0,
          shouldHighlight: false,
          icon,
        };
      }

      let attended = 0;

      for (const workshop of workshopEvents) {
        try {
          await dispatchGetOneEvent(this.$store, workshop.id);
          const detailedEvent = readOneEvent(this.$store)(workshop.id);
          const participants = detailedEvent?.participants || [];

          if (participants.some(participant => participant.id === user.id)) {
            attended += 1;
          }
        } catch (error) {
          console.error(`Fehler beim Laden des Workshops (${workshop.id}):`, error);
        }
      }

      return {
        label,
        value: `${attended}`,
        hint,
        numericValue: attended,
        shouldHighlight: attended >= 1,
        icon,
      };
    } catch (error) {
      console.error('Fehler beim Laden der Workshopteilnahmen:', error);
      return {
        label,
        value: '–',
        hint: 'Workshopteilnahmen konnten nicht geladen werden',
        icon,
        shouldHighlight: false,
      };
    }
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
