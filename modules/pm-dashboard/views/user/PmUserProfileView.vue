<template>
  <v-container fluid class="pm-user-profile pa-4 pa-md-8">
    <template v-if="loading">
      <v-skeleton-loader type="article, list-item-three-line, table" class="mb-4" />
    </template>

    <template v-else>
      <div v-if="!profile" class="text-center py-10">
        <v-icon x-large color="grey lighten-1">mdi-account-search</v-icon>
        <div class="mt-4 text-subtitle-1">Kein Benutzer gefunden (ID: {{ routeUserId }})</div>
      </div>
      <template v-else>
        <!-- HEADER / PRIMARY INFO -->
        <v-row dense class="profile-header mb-6" align="stretch">
          <v-col cols="12" md="4">
            <v-card outlined class="h-100 d-flex flex-column">
              <v-card-text class="pb-0 d-flex align-start">
                <employee-profile-picture 
                  size="96" 
                  :employee="profile"
                  class="mr-5 elevation-2">
                </employee-profile-picture>
                <div class="flex-grow-1">
                  <div class="d-flex align-center flex-wrap">
                    <h2 class="font-weight-medium mr-3 mb-1">{{ profile.full_name || 'Unbekannt' }}</h2>
                    <v-chip v-for="chip in statusChips" :key="chip.text" :color="chip.color" small outlined class="mr-1 mb-1">
                      {{ chip.text }}
                    </v-chip>
                  </div>
                  <div class="text--secondary mb-2">{{ profile.email || 'keine E-Mail hinterlegt' }}</div>
                  <div class="d-flex align-center flex-wrap">
                    <v-btn v-if="profile.email" :href="`mailto:${profile.email}`" icon small :title="'E-Mail an ' + profile.full_name">
                      <v-icon small>mdi-email-outline</v-icon>
                    </v-btn>
                    <v-btn v-if="profile.phonenumber" :href="`tel:${profile.phonenumber}`" icon small :title="'Anrufen'">
                      <v-icon small>mdi-phone</v-icon>
                    </v-btn>
                    <v-btn icon small @click="refresh" :title="'Aktualisieren'">
                      <v-icon small>mdi-refresh</v-icon>
                    </v-btn>
                    <v-btn v-if="canManagePMNotes" icon small @click="scrollToNotes" :title="'Notiz hinzufügen'">
                      <v-icon small>mdi-note-edit-outline</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions class="pt-0">
                <div class="text-caption grey--text">ID: {{ profile.id }}</div>
                <v-spacer></v-spacer>
                <div class="text-caption grey--text">Zuletzt aktualisiert: {{ relativeDate(lastUpdated) }}</div>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- QUICK STATS -->
          <v-col cols="12" md="4">
            <v-card outlined class="h-100">
              <v-card-title class="pb-1">Kurzüberblick</v-card-title>
              <v-card-text class="pt-0">
                <v-row dense>
                  <v-col v-for="stat in quickStats" :key="stat.label" cols="6" sm="4" class="py-2">
                    <div class="text-caption text--secondary mb-1">{{ stat.label }}</div>
                    <div class="stat-value">{{ stat.value }}</div>
                    <div v-if="stat.hint" class="text-caption grey--text mt-1">{{ stat.hint }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- AVAILABILITY -->
          <v-col cols="12" md="4">
            <v-card outlined class="h-100">
              <v-card-title class="pb-1">Verfügbarkeit</v-card-title>
              <v-card-text class="pt-0 flex-grow-1 d-flex flex-column">
                <div class="mb-2">Aktuelle Auslastung</div>
                <v-progress-linear :value="(profile.utilization || 0) * 100" color="cctGreen" height="14" rounded>
                  <template v-slot:default>
                    <strong class="white--text text-caption">{{ ((profile.utilization || 0) * 100).toFixed(0) }}%</strong>
                  </template>
                </v-progress-linear>
                <div class="text-caption grey--text mt-2">Zielauslastung: {{ profile.target_utilization ? (profile.target_utilization * 100).toFixed(0) : '—' }}%</div>
                <v-divider class="my-3" />
                <div class="text-caption grey--text mb-1">Verfügbare Wochentage</div>
                <div v-if="!availabilityWeekdaysFormatted.length" class="text-caption grey--text">Keine Verfügbarkeit hinterlegt</div>
                <div v-else class="d-flex flex-wrap">
                  <v-chip small v-for="day in availabilityWeekdaysFormatted" :key="day" class="mr-1 mb-1" color="cctGreen lighten-4" label>{{ day }}</v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- SECTIONS GRID -->
        <div class="sections-grid">
          <!-- Membership -->
          <v-card outlined class="grid-card">
            <v-card-title class="pb-1">Mitgliedschaft</v-card-title>
            <v-card-text class="pt-0 flex-grow-1">
              <table class="dense-table">
                <tbody>
                  <tr v-for="row in membershipRows" :key="row.label">
                    <td class="label">{{ row.label }}</td>
                    <td class="value">{{ row.value }}</td>
                  </tr>
                </tbody>
              </table>
            </v-card-text>
          </v-card>

          <!-- Education -->
          <v-card outlined class="grid-card">
            <v-card-title class="pb-1">Ausbildung</v-card-title>
            <v-card-text class="pt-0 flex-grow-1">
              <table class="dense-table">
                <tbody>
                  <tr v-for="row in educationRows" :key="row.label">
                    <td class="label">{{ row.label }}</td>
                    <td class="value">{{ row.value }}</td>
                  </tr>
                </tbody>
              </table>
            </v-card-text>
          </v-card>

          <!-- Skills -->
          <v-card outlined class="grid-card span-full">
            <v-card-title class="pb-1 d-flex align-center">
              Kompetenzen
              <v-spacer></v-spacer>
              <v-chip small outlined color="cctGreen" v-if="skills.length">{{ skills.length }} Skills</v-chip>
            </v-card-title>
            <v-card-text class="pt-0 flex-grow-1">
              <div v-if="!skills.length" class="text-caption grey--text">Noch keine Skills hinterlegt – Platzhalter</div>
              <div v-else class="d-flex flex-wrap">
                <v-chip v-for="skill in skills" :key="skill.name" class="mr-1 mb-1" :color="skillColor(skill.level)" small label dark>
                  {{ skill.name }}<span v-if="skill.level" class="ml-1">({{ $enum('SkillLevelEnum', skill.level) }})</span>
                </v-chip>
              </div>
            </v-card-text>
          </v-card>

          <!-- Work Experience -->
          <v-card outlined class="grid-card span-full">
            <v-card-title class="pb-1 d-flex align-center">
              Berufserfahrung
              <v-spacer></v-spacer>
              <v-chip small outlined color="cctGreen" v-if="workExperiences.length">{{ workExperiences.length }} Positionen</v-chip>
            </v-card-title>
            <v-card-text class="pt-0 flex-grow-1">
              <div v-if="!workExperiences.length" class="text-caption grey--text">Noch keine Berufserfahrung hinterlegt</div>
              <div v-else>
                <v-row dense>
                  <v-col v-for="(exp, index) in workExperiences" :key="exp.id || `exp-${index}`" cols="12" sm="6" md="4">
                    <div class="font-weight-medium">{{ exp.position_title }}</div>
                    <div class="text-caption grey--text">{{ exp.company_name }} · {{ formatEmploymentType(exp.employment_type) }}</div>
                    <div class="text-caption">{{ formatDate(exp.start_date) }} – {{ exp.end_date ? formatDate(exp.end_date) : 'Aktuell' }}</div>
                    <div v-if="exp.description" class="text-body-2 mt-1">{{ exp.description }}</div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>

          <!-- Project History (span full width for better visibility) -->
          <v-card outlined class="grid-card span-full">
            <v-card-title class="pb-1 d-flex align-center">
              Projekt Historie
              <v-spacer></v-spacer>
              <v-chip small outlined color="cctGreen" v-if="projectHistory.length">{{ projectHistory.length }} Projekte</v-chip>
            </v-card-title>
            <v-card-text class="pt-0 flex-grow-1">
              <v-data-table
                :headers="projectHistoryHeaders"
                :items="projectHistory"
                :items-per-page="10"
                :footer-props="{
                  'items-per-page-options': [5, 10, 25, -1]
                }"
                dense
                class="project-history-table"
              >
                <template #item.name="{ item }">
                  <span 
                    @click="navigateToProject(item.projectId)"
                    class="clickable-name"
                  >
                    {{ item.name }}
                  </span>
                </template>
                <template #item.typeSortValue="{ item }">
                  <v-chip x-small :color="item.typeColor" dark label>
                    {{ item.type }}
                  </v-chip>
                </template>
                <template #item.roleSortValue="{ item }">
                  {{ $enum('ProjectRoleEnum', item.role) }}
                </template>
                <template #item.statusSortValue="{ item }">
                  <v-chip x-small :color="item.statusColor" dark label>
                    {{ item.status }}
                  </v-chip>
                </template>
                <template #no-data>
                  <div class="text-caption grey--text py-4">Keine Projekte hinterlegt – Platzhalter</div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>

          <!-- Panels (span full width) -->
          <v-card outlined class="grid-card span-full">
            <v-card-text class="pa-0">
              <v-expansion-panels v-model="expandedPanels" multiple focusable accordion>
                <v-expansion-panel v-if="canManagePMNotes">
                  <v-expansion-panel-header>Interne Notizen (nur PM)</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div v-if="loadingNotes" class="text-center py-4">
                      <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                    <div v-else>
                      <!-- Add new note -->
                      <v-card outlined class="mb-3">
                        <v-card-text>
                          <v-textarea
                            ref="noteTextarea"
                            v-model="newNoteContent"
                            label="Neue Notiz hinzufügen"
                            rows="3"
                            outlined
                            dense
                            hide-details
                          ></v-textarea>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="primary"
                            small
                            :disabled="!newNoteContent.trim()"
                            @click="addNote"
                          >
                            <v-icon left small>mdi-plus</v-icon>
                            Notiz hinzufügen
                          </v-btn>
                        </v-card-actions>
                      </v-card>

                      <!-- List of existing notes -->
                      <div v-if="!pmNotes.length" class="text-caption grey--text text-center py-4">
                        Noch keine Notizen vorhanden.
                      </div>
                      <v-card v-for="note in pmNotes" :key="note.id" outlined class="mb-2">
                        <v-card-text>
                          <div v-if="editingNoteId === note.id">
                            <v-textarea
                              v-model="editNoteContent"
                              outlined
                              dense
                              auto-grow
                              rows="2"
                            ></v-textarea>
                          </div>
                          <div v-else class="text-body-2">{{ note.content }}</div>
                          <div class="text-caption grey--text mt-2">
                            {{ formatDate(note.created_at) }} · {{ note.author?.full_name || 'Unbekannt' }}
                            <span v-if="note.updated_at !== note.created_at"> · bearbeitet {{ relativeDate(note.updated_at) }}</span>
                          </div>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <template v-if="editingNoteId === note.id">
                            <v-btn text small @click="cancelEditNote">Abbrechen</v-btn>
                            <v-btn text small color="primary" @click="saveEditNote(note.id)">Speichern</v-btn>
                          </template>
                          <template v-else>
                            <v-btn icon small @click="startEditNote(note)">
                              <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon small color="error" @click="deleteNote(note.id)">
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </template>
                        </v-card-actions>
                      </v-card>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </div>
      </template>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { readRouteUser, readHasAnyPermission } from '@/store/main/getters';
import { dispatchGetPMNotes, dispatchCreatePMNote, dispatchUpdatePMNote, dispatchDeletePMNote, dispatchGetOneUser } from '@/store/main/actions';
import { IUserProfile, PMNote } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';

@Component({
  components: { EmployeeProfilePicture }
})
export default class PmUserProfileView extends Vue {
  // STATE
  private loading = true;
  private lastUpdated: Date = new Date();

  // PM Notes state
  private pmNotes: PMNote[] = [];
  private loadingNotes = false;
  private newNoteContent = '';
  private editingNoteId: number | null = null;
  private editNoteContent = '';
  private expandedPanels: number[] = [];

  // Weekday mapping (no backend enum available, hardcoded like in UserProfileEdit.vue)
  private weekdayMap: Record<string, string> = {
    'monday': 'Mo',
    'tuesday': 'Di',
    'wednesday': 'Mi',
    'thursday': 'Do',
    'friday': 'Fr',
    'saturday': 'Sa',
    'sunday': 'So',
  };

  // ---- ROUTE / PROFILE ACCESS ----
  // Route parameter is defined as :id in pm-dashboard routes
  get routeUserId(): string | undefined {
    return this.$route.params.id as string;
  }

  get profile(): IUserProfile | undefined {
    // reuse existing getter pattern (resolves by param name internally)
    const p = readRouteUser(this.$store)(this.$route) as IUserProfile | undefined;
    return p;
  }

  // ---- DERIVED DATA ----
  get statusChips() {
    const chips: { text: string; color: string }[] = [];
    if (this.profile?.memberstatus) chips.push({ text: this.profile.memberstatus, color: 'cctBlue' });
    if (this.profile?.is_passive) chips.push({ text: 'Passiv', color: 'cctOrange' });
    if (this.profile?.ressort) chips.push({ text: this.profile.ressort, color: 'cctPurple' });
    return chips;
  }

  get quickStats() {
    return [
      { label: 'Bewerbungen', value: this.profile?.amount_applications ?? '—', hint: 'Gesamt' },
      { label: 'Positionen besetzt', value: this.profile?.amount_positions_filled ?? '—' },
      { label: 'Höchste Rolle', value: this.profile?.highest_project_position || '—' },
      { label: 'Externe BT', value: this.profile?.total_external_bt ?? '—' },
      { label: 'Aktive Projekte', value: this.profile?.active_projects_count ?? '—' },
      { label: 'Projekte realisiert', value: this.profile?.amount_projects_realized ?? '—' },
    ];
  }

  get membershipRows() {
    return [
      { label: 'Eintrittsdatum', value: this.formatDate(this.profile?.entrydate) },
      { label: 'Mitgliedsstatus', value: this.profile?.memberstatus || '—' },
      { label: 'Ressort', value: this.profile?.ressort || '—' },
      { label: 'Ist passiv', value: this.profile?.is_passive ? 'Ja' : 'Nein' },
      { label: 'Letzte Aktivität', value: this.profile?.last_active_at ? this.relativeDate(this.profile.last_active_at) : '—' },
    ];
  }

  get educationRows() {
    return [
      { label: 'Studiengang', value: this.profile?.major || '—' },
      { label: 'Universität', value: this.profile?.university || '—' },
      { label: 'Hochschulgrad', value: this.profile?.studylevel || '—' },
      { label: 'Geburtstag', value: this.formatDate(this.profile?.birthdate) },
      { label: 'Alter', value: this.estimateAge(this.profile?.birthdate) },
    ];
  }

  get availabilityWeekdaysFormatted(): string[] {
    const weekdays = this.profile?.availability_weekdays || [];
    return weekdays.map(day => this.weekdayMap[day] || day);
  }

  get canManagePMNotes(): boolean {
    // Check if user has permission to manage PM notes
    const hasPermission = readHasAnyPermission(this.$store)(['portal.users.pm.notes']);
    return hasPermission;
  }

  get skills(): { name: string; level?: string }[] {
    // Map UserSkill[] to expected format
    return this.profile?.user_skills?.map(s => ({
      name: s.skill_name,
      level: s.skill_level
    })) || [];
  }

  get workExperiences() {
    return this.profile?.work_experiences || [];
  }

  get projectHistory(): { id: string | number; projectId: number; name: string; type: string; typeColor: string; typeSortValue: number; role: string; roleSortValue: number; status: string; statusColor: string; statusSortValue: number; period: string }[] {
    // Use project_history from backend
    return this.profile?.project_history?.map((p, index) => ({
      id: `${p.project_id}-${index}`,
      projectId: p.project_id,
      name: p.project_title,
      type: this.getProjectTypeLabel(p.project_type),
      typeColor: this.getProjectTypeColor(p.project_type),
      typeSortValue: this.getProjectTypeSortValue(p.project_type),
      role: p.role,
      roleSortValue: this.getProjectRoleSortValue(p.role),
      status: this.getProjectStatusLabel(p.project_status, p.project_type),
      statusColor: this.getProjectStatusColor(p.project_status, p.project_type),
      statusSortValue: this.getProjectStatusSortValue(p.project_status, p.project_type),
      period: this.composePeriod(p.start_date, p.end_date),
    })) || [];
  }

  get projectHistoryHeaders() {
    return [
      {
        text: 'Projekt',
        value: 'name',
        sortable: true,
      },
      {
        text: 'Typ',
        value: 'typeSortValue',
        sortable: true,
        sort: (a: number, b: number) => a - b,
      },
      {
        text: 'Rolle',
        value: 'roleSortValue',
        sortable: true,
        sort: (a: number, b: number) => a - b,
      },
      {
        text: 'Status',
        value: 'statusSortValue',
        sortable: true,
        sort: (a: number, b: number) => a - b,
      },
      {
        text: 'Zeitraum',
        value: 'period',
        sortable: true,
      },
    ];
  }

  // ---- METHODS ----
  private formatDate(date: string | Date | null | undefined): string {
    if (!date) return '—';
    try { return format(new Date(date), 'dd. MMM yyyy', { locale: de }); } catch { return '—'; }
  }

  private relativeDate(date: string | Date | null | undefined): string {
    if (!date) return '—';
    try { return formatDistanceToNow(new Date(date), { addSuffix: true, locale: de }); } catch { return '—'; }
  }

  private estimateAge(date: string | Date | null | undefined): string {
    if (!date) return '—';
    try {
      const dob = new Date(date);
      const diff = Date.now() - dob.getTime();
      const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      return isFinite(age) ? age + ' Jahre' : '—';
    } catch { return '—'; }
  }

  private composePeriod(start?: string | null, end?: string | null) {
    const s = this.formatDate(start);
    const e = end ? this.formatDate(end) : 'laufend';
    if (s === '—' && e === '—') return '—';
    return `${s} – ${e}`;
  }

  private skillColor(level?: string) {
    if (!level) return 'grey darken-1';
    switch (level.toLowerCase()) {
    case 'expert': return 'deep-purple darken-1';
    case 'advanced': return 'indigo darken-1';
    case 'intermediate': return 'blue darken-1';
    case 'beginner': return 'cyan darken-1';
    default: return 'grey darken-1';
    }
  }

  private formatEmploymentType(type: string) {
    return this.$enum('EmploymentTypeEnum', type) || type;
  }

  private getProjectStatusLabel(status?: string, type?: string): string {
    // Check for internal projects first (MP/ISP)
    if (type === 'internal' || type === 'membership_project') {
      return 'MP/ISP';
    }
    
    // Use backend enum for status labels
    return status ? (this.$enum('ProjectStatusEnum', status) || status) : '—';
  }

  private getProjectStatusColor(status?: string, type?: string): string {
    // Internal projects (MP/ISP) - use purple
    if (type === 'internal' || type === 'membership_project') {
      return 'cctPurple';
    }
    
    // Status-based colors
    const colorMap: Record<string, string> = {
      'running': 'cctGreen',
      'completed': 'cctBlue',
      'aborted': 'cctOrange',
      'rejected': 'red',
    };
    return status ? (colorMap[status] || 'grey') : 'grey';
  }

  private getProjectTypeLabel(type?: string): string {
    return type ? (this.$enum('ProjectTypeEnum', type) || type) : '—';
  }

  private getProjectTypeColor(type?: string): string {
    const colorMap: Record<string, string> = {
      'external': 'cctBlue',
      'internal': 'cctPurple',
      'membership_project': 'cctPurple',
      'staffing': 'cctGrey',
    };
    return type ? (colorMap[type] || 'grey') : 'grey';
  }

  private getProjectTypeSortValue(type?: string): number {
    // external (1) > internal/membership_project (2) > staffing (3)
    const sortMap: Record<string, number> = {
      'external': 1,
      'internal': 2,
      'membership_project': 2,
      'staffing': 3,
    };
    return type ? (sortMap[type] || 99) : 99;
  }

  private getProjectRoleSortValue(role?: string): number {
    // committee (1) > leader (2) > controller (3) > expert (4) > worker (5)
    const sortMap: Record<string, number> = {
      'committee': 1,
      'leader': 2,
      'controller': 3,
      'expert': 4,
      'worker': 5,
    };
    return role ? (sortMap[role] || 99) : 99;
  }

  private getProjectStatusSortValue(status?: string, type?: string): number {
    // Internal projects (MP/ISP) always come first (0)
    if (type === 'internal' || type === 'membership_project') {
      return 0;
    }
    
    // running (1) > completed (2) > aborted (3) > rejected (4)
    const sortMap: Record<string, number> = {
      'running': 1,
      'completed': 2,
      'aborted': 3,
      'rejected': 4,
    };
    return status ? (sortMap[status] || 99) : 99;
  }

  async mounted() {
    await this.refresh();
  }

  async refresh() {
    this.loading = true;
    // Load detailed user data
    if (this.routeUserId && +this.routeUserId) {
      await dispatchGetOneUser(this.$store, { userId: +this.routeUserId });
    }
    this.lastUpdated = new Date();
    this.loading = false;
    if (this.canManagePMNotes && this.routeUserId) {
      await this.loadPMNotes();
    }
  }

  // ---- PM NOTES METHODS ----
  async loadPMNotes() {
    if (!this.routeUserId) return;
    this.loadingNotes = true;
    try {
      const response = await dispatchGetPMNotes(this.$store, parseInt(this.routeUserId));
      this.pmNotes = response.data;
    } catch (error) {
      console.error('Failed to load PM notes:', error);
    } finally {
      this.loadingNotes = false;
    }
  }

  async addNote() {
    if (!this.newNoteContent.trim() || !this.routeUserId) return;
    try {
      await dispatchCreatePMNote(this.$store, {
        userId: parseInt(this.routeUserId),
        data: { content: this.newNoteContent.trim() }
      });
      this.newNoteContent = '';
      await this.loadPMNotes();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  }

  startEditNote(note: PMNote) {
    this.editingNoteId = note.id;
    this.editNoteContent = note.content;
  }

  cancelEditNote() {
    this.editingNoteId = null;
    this.editNoteContent = '';
  }

  async saveEditNote(noteId: number) {
    if (!this.editNoteContent.trim() || !this.routeUserId) return;
    try {
      await dispatchUpdatePMNote(this.$store, {
        userId: parseInt(this.routeUserId),
        noteId,
        data: { content: this.editNoteContent.trim() }
      });
      this.editingNoteId = null;
      this.editNoteContent = '';
      await this.loadPMNotes();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  }

  async deleteNote(noteId: number) {
    if (!this.routeUserId) return;
    if (!confirm('Möchten Sie diese Notiz wirklich löschen?')) return;
    try {
      await dispatchDeletePMNote(this.$store, {
        userId: parseInt(this.routeUserId),
        noteId
      });
      await this.loadPMNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }

  scrollToNotes() {
    // First, ensure the expansion panel is opened (index 0 since it's the first/only panel)
    if (!this.expandedPanels.includes(0)) {
      this.expandedPanels.push(0);
    }
    
    // Wait for the panel to expand, then scroll and focus
    this.$nextTick(() => {
      // Small delay to ensure panel animation completes
      setTimeout(() => {
        // Scroll to bottom of page
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
        
        // Focus the textarea after scrolling completes
        setTimeout(() => {
          const textarea = this.$refs.noteTextarea as Vue & { focus: () => void };
          if (textarea && textarea.focus) {
            textarea.focus();
          }
        }, 500);
      }, 300);
    });
  }

  navigateToProject(projectId: number) {
    this.$router.push({ name: 'project', params: { id: projectId.toString() } });
  }

  @Watch('$route.params.id')
  async onUserIdChange() {
    await this.refresh();
  }
}
</script>

<style lang="scss" scoped>
.pm-user-profile {
  .profile-header h2 { font-size: 1.6rem; }
  .sections-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 16px;
    align-items: stretch;
    margin-bottom: 1.5rem;
    
    @media (max-width: 959px) {
      grid-template-columns: 1fr;
    }
  }
  .sections-grid .grid-card {
    display: flex;
    flex-direction: column;
  }
  .sections-grid .grid-card .v-card-text {
    display: flex;
    flex-direction: column;
  }
  .sections-grid .span-full {
    grid-column: 1 / -1;
  }
  .dense-table {
    width: 100%;
    border-collapse: collapse;
    td { padding: 4px 6px; vertical-align: top; }
    .label { width: 50%; color: rgba(0,0,0,0.54); font-size: 0.75rem; text-transform: uppercase; letter-spacing: .5px; }
    .value { font-size: 0.85rem; }
  }
  .stat-value { font-weight: 600; font-size: 1.05rem; }
  
  .clickable-row {
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  }

  .clickable-name {
    cursor: pointer;
    color: #1976d2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .project-history-table {
    ::v-deep tbody tr:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  }
}
</style>