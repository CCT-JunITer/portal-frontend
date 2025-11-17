<template>
  <v-container fluid class="pa-4">
    <h2 class="text-h4 mb-4">Willkommen, {{ userName }}!</h2>
    
    <v-row>
      <!-- Mitgliedswerdegang Widget -->
      <v-col cols="12" md="6" lg="4" class="d-flex">
        <v-card 
          elevation="2" 
          hover 
          @click="goToMemberProgressionDetail"
          class="widget-card flex-grow-1 d-flex flex-column"
        >
          <v-card-title class="cctBlue white--text">
            <v-icon left color="white">mdi-account-arrow-up</v-icon>
            Dein Mitgliedswerdegang
          </v-card-title>
          
          <v-card-text class="pt-4 flex-grow-1">
            <div class="text-center mb-4">
              <v-avatar size="80" :color="getCurrentStatusColor()" class="white--text mb-2">
                <v-icon size="50" color="white">{{ getCurrentStatusIcon() }}</v-icon>
              </v-avatar>
              <div class="text-h6 font-weight-bold">{{ currentStatus }}</div>
              <div class="text-caption text--secondary">Aktueller Status</div>
            </div>

            <v-divider class="my-3"></v-divider>

            <!-- Next Steps -->
            <div v-if="nextStatus" class="next-steps">
              <div class="text-subtitle-2 font-weight-bold mb-2">
                <v-icon small color="cctOrange">mdi-arrow-up-circle</v-icon>
                Nächster Schritt
              </div>
              <div class="d-flex align-center">
                <v-icon small class="mr-2" color="grey">mdi-target</v-icon>
                <span class="text-body-2">{{ nextStatus }}</span>
              </div>
            </div>

            <div v-else class="text-center py-3">
              <v-icon color="cctGreen" size="40">mdi-trophy</v-icon>
              <div class="text-subtitle-2 font-weight-bold mt-2">Höchster Status erreicht!</div>
              <div class="text-caption text--secondary">Teile dein Wissen und werde zur Legende!</div>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="cctBlue">
              Details ansehen
              <v-icon right small>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Events Widget -->
      <v-col cols="12" md="6" lg="4" class="d-flex">
        <v-card 
          elevation="2" 
          hover 
          @click="goToEventsDetail"
          class="widget-card flex-grow-1 d-flex flex-column"
        >
          <v-card-title class="cctBlue white--text">
            <v-icon left color="white">mdi-calendar-check</v-icon>
            CCTermine
          </v-card-title>
          <v-card-text class="flex-grow-1 pa-0">
            <div v-if="loadingEvents" class="text-center py-5">
              <v-progress-circular indeterminate color="cctOrange"></v-progress-circular>
              <div class="mt-3 text-caption">Lade Termine...</div>
            </div>
            
            <div v-else-if="upcomingEvents.length > 0">
              <div
                v-for="(event, idx) in upcomingEvents" 
                :key="idx"
                class="event-item px-4 py-3"
                :class="{'border-bottom': idx < upcomingEvents.length - 1}"
              >
                <div class="d-flex">
                  <div class="mr-3 mt-1">
                    <v-avatar
                      :color="event.all_day ? 'cctPurple' : 'cctBlue'"
                      size="48"
                      class="white--text"
                    >
                      <v-icon color="white" size="24">
                        {{ getEventIcon(event) }}
                      </v-icon>
                    </v-avatar>
                  </div>
                  
                  <div class="flex-grow-1" style="min-width: 0;">
                    <div class="text-subtitle-1 font-weight-bold mb-1 text-truncate">
                      {{ event.summary || 'Ohne Titel' }}
                    </div>
                    
                    <div class="d-flex align-center mb-1 text-body-2 text--secondary">
                      <v-icon small class="mr-1" color="grey darken-1">mdi-clock-outline</v-icon>
                      <span>
                        {{ formatEventDateTime(event.start, event.all_day) }}
                        <span v-if="event.end">
                          -
                          <span v-if="!event.all_day && (new Date(event.start)).toDateString() === (new Date(event.end)).toDateString()">
                            {{ new Date(event.end).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) }}
                          </span>
                          <span v-else>
                            {{ formatEventDateTime(event.end, event.all_day) }}
                          </span>
                        </span>
                      </span>
                    </div>

                    <div v-if="event.location && event.location !== 'None'" class="d-flex align-center mb-1 text-body-2 text--secondary">
                      <v-icon small class="mr-1" color="grey darken-1">mdi-map-marker</v-icon>
                      <span class="text-truncate">{{ event.location }}</span>
                    </div>

                    <div v-if="event.category" class="mt-2">
                      <v-chip 
                        x-small 
                        :color="event.all_day ? 'cctPurple' : 'cctBlue'"
                        text-color="white"
                        class="px-2"
                      >
                        {{ event.category }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-5">
              <v-icon size="64" color="grey lighten-2">mdi-calendar-blank</v-icon>
              <div class="mt-3 text-body-1 text--secondary">Keine anstehenden Termine</div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="cctBlue">
              Alle Termine
              <v-icon right small>mdi-chevron-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <home-stats-widget />
    </v-row>

    <!-- Quick Access Section -->
    <v-row class="mt-4">
      <v-col cols="12" class="d-flex align-center">
        <h3 class="text-h6 mb-0">Schnellzugriff</h3>
        <v-spacer></v-spacer>
        <v-btn 
          small 
          text 
          color="cctBlue" 
          @click="openQuickAccessDialog"
        >
          <v-icon small left>mdi-cog</v-icon>
          Anpassen
        </v-btn>
      </v-col>
      
      <v-col 
        v-for="item in selectedQuickAccessItems" 
        :key="item.id" 
        cols="6" 
        sm="4" 
        md="3" 
        lg="2"
      >
        <v-card 
          elevation="2" 
          hover 
          :to="item.to" 
          :href="item.href" 
          :target="item.href ? '_blank' : undefined"
          class="quick-access-card"
        >
          <v-card-text class="text-center pa-3">
            <v-icon :color="item.color" size="40">{{ item.icon }}</v-icon>
            <div class="text-body-2 mt-2 text-truncate">{{ item.title }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Access Settings Dialog -->
    <v-dialog v-model="showQuickAccessDialog" max-width="700px">
      <v-card>
        <v-card-title class="cctBlue white--text">
          <v-icon left color="white">mdi-cog</v-icon>
          Schnellzugriff anpassen
        </v-card-title>
        
        <v-card-text class="pt-4">
          <div class="mb-4">
            <strong>Wähle 6 Themen aus:</strong> ({{ tempSelectedIds.length }}/6)
          </div>
          
          <v-row dense>
            <v-col 
              v-for="item in availableQuickAccessItems" 
              :key="item.id"
              cols="12"
              sm="6"
            >
              <v-card
                outlined
                :class="{'selected-item': isItemSelected(item.id), 'disabled-item': !isItemSelected(item.id) && tempSelectedIds.length >= 6}"
                @click="handleItemClick(item.id)"
                class="selection-card"
              >
                <v-card-text class="d-flex align-center pa-3">
                  <v-checkbox
                    :input-value="isItemSelected(item.id)"
                    :disabled="!isItemSelected(item.id) && tempSelectedIds.length >= 6"
                    color="cctBlue"
                    hide-details
                    class="mt-0 mr-3"
                    @click.stop="handleItemClick(item.id)"
                  ></v-checkbox>
                  
                  <v-icon :color="item.color" class="mr-3">{{ item.icon }}</v-icon>
                  
                  <div class="flex-grow-1">
                    <div class="text-body-2 font-weight-medium">{{ item.title }}</div>
                    <div v-if="item.subtitle" class="text-caption text--secondary">{{ item.subtitle }}</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="flex-wrap">
          <v-btn 
            text 
            @click="resetToDefaults"
            class="mb-2 mb-sm-0"
          >
            <v-icon left small>mdi-refresh</v-icon>
            <span class="d-none d-sm-inline">Standard wiederherstellen</span>
            <span class="d-inline d-sm-none">Standard</span>
          </v-btn>
          <v-spacer class="d-none d-sm-flex"></v-spacer>
          <div class="d-flex" style="gap: 8px;">
            <v-btn text @click="showQuickAccessDialog = false">
              Abbrechen
            </v-btn>
            <v-btn 
              color="cctBlue" 
              text 
              @click="saveQuickAccessSettings"
              :disabled="tempSelectedIds.length !== 6"
            >
              Speichern
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { readUserProfile } from '@/store/main/getters';
import { dispatchGetInklEvents } from '@/store/event/actions';
import { MEMBERSTATUS, format } from '@/common';
import HomeStatsWidget from '@/views/main/stats/HomeStatsWidget.vue';

interface CalendarEvent {
  summary: string;
  start: string;
  end: string;
  description?: string | null;
  location?: string | null;
  uid: string;
  all_day: boolean;
  category?: string;
}

interface QuickAccessItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  color: string;
  to?: string;
  href?: string;
}

interface MemberStatusColors {
  [key: string]: string;
}

interface MemberStatusIcons {
  [key: string]: string;
}

const QUICK_ACCESS_STORAGE_KEY = 'homepage_quick_access_items';
const DEFAULT_QUICK_ACCESS_IDS = ['people', 'calendar', 'wms-projects', 'trainings', 'finance-request', 'templates'];

@Component({
  components: {
    HomeStatsWidget,
  },
})
export default class Homepage extends Vue {
  showQuickAccessDialog = false;
  tempSelectedIds: string[] = [];
  selectedQuickAccessIds: string[] = [];
  inklEvents: CalendarEvent[] = [];
  loadingEvents = false;

  async mounted() {
    this.loadQuickAccessSettings();
    await this.loadInklEvents();
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get userName() {
    return this.userProfile?.full_name || 'Mitglied';
  }

  get currentStatus() {
    return this.userProfile?.memberstatus || 'Trainee';
  }

  get currentStatusIndex() {
    return MEMBERSTATUS.indexOf(this.currentStatus);
  }

  get nextStatus() {
    const nextIndex = this.currentStatusIndex + 1;
    return nextIndex < MEMBERSTATUS.length ? MEMBERSTATUS[nextIndex] : null;
  }

  getCurrentStatusColor(): string {
    const colors: MemberStatusColors = {
      'Trainee': '#FF6F00',
      'Junior Consultant': '#1976D2',
      'Consultant': '#7B1FA2',
      'Senior Consultant': '#388E3C',
    };
    return colors[this.currentStatus] || '#757575';
  }

  getCurrentStatusIcon(): string {
    const icons: MemberStatusIcons = {
      'Trainee': 'mdi-school',
      'Junior Consultant': 'mdi-account',
      'Consultant': 'mdi-account-tie',
      'Senior Consultant': 'mdi-trophy',
    };
    return icons[this.currentStatus] || 'mdi-account';
  }

  goToMemberProgressionDetail(): void {
    this.$router.push('/main/member-progression');
  }

  async loadInklEvents(): Promise<void> {
    this.loadingEvents = true;
    try {
      const events = await dispatchGetInklEvents(this.$store);
      this.inklEvents = Array.isArray(events) ? events : [];
    } catch (error) {
      console.error('Fehler beim Laden der Termine:', error);
      this.inklEvents = [];
    } finally {
      this.loadingEvents = false;
    }
  }

  get upcomingEvents(): CalendarEvent[] {
    const now = new Date();
    return this.inklEvents
      .filter((event) => {
        const startDT = new Date(event.start);
        return !isNaN(startDT.getTime()) && startDT >= now;
      })
      .sort((a, b) => {
        const aStart = new Date(a.start);
        const bStart = new Date(b.start);
        return aStart.getTime() - bStart.getTime();
      })
      .slice(0, 3);
  }

  formatEventDateTime(dateStr: string, isAllDay: boolean): string {
    const dt = new Date(dateStr);
    if (isNaN(dt.getTime())) return dateStr;
    
    if (isAllDay) {
      return format(dt, 'dd.MM.yyyy');
    }
    return format(dt, 'dd.MM.yyyy, HH:mm');
  }

  getEventIcon(event: CalendarEvent): string {
    return event.all_day ? 'mdi-calendar-blank' : 'mdi-clock-outline';
  }

  goToEventsDetail(): void {
    this.$router.push('/main/events-overview');
  }

  get calendarViewType(): string {
    return this.$route.params.viewType || 'week';
  }

  get calendarViewDate(): string {
    return this.$route.params.viewDate || 'today';
  }

  get calendarURL(): string {
    return `/main/calendar/${this.calendarViewType}/${this.calendarViewDate}`;
  }

  get towernutzungURL(): string {
    return `/main/towernutzung/${this.calendarViewType}/${this.calendarViewDate}`;
  }

  // Alle verfügbaren Quick Access Items aus dem NavigationDrawer
  get availableQuickAccessItems(): QuickAccessItem[] {
    return [
      // Apps
      { id: 'people', title: 'Mitgliedersuche', subtitle: 'Apps', icon: 'people', color: 'cctBlue', to: '/main/people' },
      { id: 'people-streaks', title: 'Streak Leaderboard', subtitle: 'Apps', icon: 'mdi-fire', color: 'cctOrange', to: '/main/people/streaks' },
      { id: 'project-tender', title: 'Projektausschreibungen', subtitle: 'Apps', icon: 'mdi-account', color: 'cctPurple', to: '/main/project-tender' },
      { id: 'trainings', title: 'Trainings', subtitle: 'Apps', icon: 'mdi-school', color: 'cctOrange', to: '/main/trainings' },
      { id: 'wms-projects', title: 'Projektdokumentation', subtitle: 'Apps', icon: 'mdi-account-tie', color: 'cctPurple', to: '/main/wms/projects' },
      { id: 'wms-meetings', title: 'CCT-Sitzungen', subtitle: 'Apps', icon: 'mdi-human-male-board', color: 'cctGreen', to: '/main/wms/meetings' },
      { id: 'templates', title: 'Vorlagen', subtitle: 'Apps', icon: 'mdi-file-powerpoint', color: 'grey darken-2', to: '/main/wms/documents/templates' },
      { id: 'member-progression', title: 'Mitgliedswerdegang', subtitle: 'Apps', icon: 'mdi-account-arrow-up', color: 'grey darken-2', to: '/main/wms/documents/member-progression' },
      { id: 'recruiting', title: 'Recruiting', subtitle: 'Apps', icon: 'mdi-human-greeting', color: 'grey darken-2', to: '/main/wms/documents/recruiting' },
      { id: 'project-work', title: 'Projektarbeit', subtitle: 'Apps', icon: 'mdi-briefcase', color: 'grey darken-2', to: '/main/wms/documents/project-work' },
      { id: 'public-affairs', title: 'Öffentlichkeitsarbeit', subtitle: 'Apps', icon: 'mdi-earth', color: 'grey darken-2', to: '/main/wms/documents/public-affairs' },
      { id: 'quality-management', title: 'Quality Management', subtitle: 'Apps', icon: 'mdi-check-decagram', color: 'grey darken-2', to: '/main/wms/documents/quality-management' },
      { id: 'wms-boards', title: 'Vorstand', subtitle: 'Apps', icon: 'mdi-crown', color: 'cctOrange', to: '/main/wms/boards' },
      { id: 'finance-request', title: 'Finanzanträge', subtitle: 'Apps', icon: 'mdi-cash', color: 'cctBlue', to: '/main/finance-request' },
      { id: 'qmsa', title: 'QM Checker', subtitle: 'Apps', icon: 'mdi-check-decagram', color: 'grey darken-2', to: '/main/qmsa' },
      { id: 'calendar', title: 'Kalender', subtitle: 'Apps', icon: 'mdi-calendar', color: 'purple', to: this.calendarURL },
      { id: 'towernutzung', title: 'Towernutzung', subtitle: 'Apps', icon: 'mdi-chess-rook', color: 'purple', to: this.towernutzungURL },
      { id: 'tower-anwesenheit', title: 'Tower-Anwesenheit', subtitle: 'Apps', icon: 'mdi-key', color: 'cctOrange', to: '/main/tower-anwesenheit' },
      { id: 'hochladen', title: 'DoSi-Folien hochladen', subtitle: 'Apps', icon: 'upload', color: 'cctGreen', to: '/main/hochladen' },

      // Dienste (External Links)
      { id: 'mail', title: 'Mail', subtitle: 'Dienste', icon: 'mail', color: 'cctBlue', href: 'https://webmail.all-inkl.com/' },
      { id: 'wms', title: 'WMS', subtitle: 'Dienste', icon: 'mdi-folder-open', color: 'cctBlue', href: 'https://wms.cct-ev.de/' },
      { id: 'nextcloud', title: 'Nextcloud', subtitle: 'Dienste', icon: 'cloud', color: 'cctBlue', href: 'https://cloud.cct-ev.de/apps/files/' },
      { id: 'limesurvey', title: 'LimeSurvey', subtitle: 'Dienste', icon: 'mdi-file-document-edit', color: 'cctBlue', href: 'https://www.umfrage.cct-ev.de/index.php/admin/authentication/sa/login' },
      { id: 'wiki', title: 'Wiki', subtitle: 'Dienste', icon: 'mdi-wikipedia', color: 'cctBlue', href: 'https://wiki.cct-ev.de/' },
      { id: 'slack', title: 'Slack', subtitle: 'Dienste', icon: 'mdi-slack', color: 'cctBlue', href: 'https://app.slack.com/client/' },
      { id: 'crm', title: 'CRM-Tool', subtitle: 'Dienste', icon: 'mdi-television', color: 'cctBlue', href: 'https://cct-ev-pm.monday.com' },

      // Weiteres
      { id: 'guide', title: 'CCT-Guide', subtitle: 'Weiteres', icon: 'mdi-file-document', color: 'lime darken-3', to: '/main/guide' },
      { id: 'shop', title: 'CCT-Shop', subtitle: 'Weiteres', icon: 'mdi-tshirt-crew', color: '#00B8D4', to: '/main/shop' },
    ];
  }

  get selectedQuickAccessItems(): QuickAccessItem[] {
    const ids = this.selectedQuickAccessIds;
    return ids
      .map(id => this.availableQuickAccessItems.find(item => item.id === id))
      .filter((item): item is QuickAccessItem => item !== undefined);
  }

  loadQuickAccessSettings(): void {
    const stored = localStorage.getItem(QUICK_ACCESS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.selectedQuickAccessIds = Array.isArray(parsed) ? parsed : [...DEFAULT_QUICK_ACCESS_IDS];
      } catch (error) {
        console.error('Fehler beim Laden der Schnellzugriff-Einstellungen:', error);
        this.selectedQuickAccessIds = [...DEFAULT_QUICK_ACCESS_IDS];
      }
    } else {
      this.selectedQuickAccessIds = [...DEFAULT_QUICK_ACCESS_IDS];
    }
    this.tempSelectedIds = [...this.selectedQuickAccessIds];
  }

  isItemSelected(id: string): boolean {
    return this.tempSelectedIds.includes(id);
  }

  handleItemClick(id: string): void {
    if (this.isItemSelected(id)) {
      // Abwählen ist immer möglich
      this.tempSelectedIds = this.tempSelectedIds.filter(selectedId => selectedId !== id);
    } else if (this.tempSelectedIds.length < 6) {
      // Hinzufügen nur wenn noch Platz ist
      this.tempSelectedIds.push(id);
    }
  }

  saveQuickAccessSettings(): void {
    try {
      localStorage.setItem(QUICK_ACCESS_STORAGE_KEY, JSON.stringify(this.tempSelectedIds));
      this.selectedQuickAccessIds = [...this.tempSelectedIds];
      this.showQuickAccessDialog = false;
    } catch (error) {
      console.error('Fehler beim Speichern der Schnellzugriff-Einstellungen:', error);
    }
  }

  resetToDefaults(): void {
    this.tempSelectedIds = [...DEFAULT_QUICK_ACCESS_IDS];
  }

  openQuickAccessDialog(): void {
    this.tempSelectedIds = [...this.selectedQuickAccessIds];
    this.showQuickAccessDialog = true;
  }
}
</script>

<style scoped lang="scss">
// Widget cards with unified hover effect
.widget-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
  }
}

// Quick access cards with consistent hover
.quick-access-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
  }
}

// Member progression next steps styling
.next-steps {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 8px;
}

// Event items with modern separation
.event-item {
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(25, 118, 210, 0.04);
  }
  
  &.border-bottom {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
}

// Quick access dialog selection cards
.selection-card {
  cursor: pointer;
  transition: all 0.2s ease;

  &.selected-item {
    border-color: var(--v-cctBlue-base);
    background-color: rgba(25, 118, 210, 0.08);
  }

  &.disabled-item {
    opacity: 0.4;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
      border-color: rgba(0, 0, 0, 0.12);
    }
  }
}

</style>
