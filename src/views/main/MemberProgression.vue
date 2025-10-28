<template>
  <v-container fluid class="pa-4">
    <v-btn text class="mb-4" @click="$router.back()">
      <v-icon left>mdi-arrow-left</v-icon>
      Zurück
    </v-btn>

    <h2 class="text-h4 mb-4">Dein Mitgliedswerdegang</h2>

    <v-row>
      <!-- Current Status & Next Steps -->
            <!-- Main Content Area -->
      <v-col cols="12">
        <!-- Status Overview Card -->
        <v-card elevation="2" class="mb-4">
          <v-card-text class="pa-4">
            <v-row no-gutters>
              <!-- Current Status -->
              <v-col cols="12" md="6" class="px-3 py-4">
                <div class="d-flex flex-column align-center">
                  <v-avatar
                    :color="getCurrentStatusColor()"
                    size="80"
                    class="mb-3"
                  >
                    <v-icon size="45" color="white">{{ getCurrentStatusIcon() }}</v-icon>
                  </v-avatar>
                  <div class="text-overline text--secondary mb-1">Aktueller Status</div>
                  <div class="text-h5 font-weight-bold text-center">{{ currentStatus }}</div>
                  <div class="text-caption text--secondary mt-2 text-center">{{ getStatusDescription() }}</div>
                </div>
              </v-col>

              <!-- Vertical Divider on Mobile / Horizontal on Desktop -->
              <v-divider vertical class="d-none d-md-block"></v-divider>
              <v-divider class="d-md-none mx-4"></v-divider>

              <!-- Next Status -->
              <v-col cols="12" md="6" class="px-3 py-4">
                <div class="d-flex flex-column align-center">
                  <v-avatar
                    :color="nextStatus ? 'orange darken-2' : 'grey'"
                    size="80"
                    class="mb-3"
                  >
                    <v-icon size="45" color="white">{{ nextStatus ? 'mdi-flag-checkered' : 'mdi-trophy' }}</v-icon>
                  </v-avatar>
                  <div class="text-overline text--secondary mb-1">
                    {{ nextStatus ? 'Nächster Schritt' : 'Ziel erreicht' }}
                  </div>
                  <div class="text-h5 font-weight-bold text-center">
                    {{ nextStatus || 'Senior Consultant' }}
                  </div>
                  <div class="text-caption text--secondary mt-2 text-center">
                    {{ nextStatus ? getStatusDescription(nextStatus) : 'Teile dein Wissen und werde zur Legende! 🎉' }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Requirements Card -->
        <v-card elevation="2" class="mt-4" v-if="nextStatus">
          <v-card-title class="text-h6 pb-2">Anforderungen für {{ nextStatus }}</v-card-title>
          <v-card-text>
            <v-list dense class="pa-0">
              <v-list-item
                v-for="(requirement, index) in getRequirements(nextStatus)"
                :key="index"
                class="px-0"
              >
                <v-list-item-icon class="mr-3">
                  <v-icon color="cctOrange">mdi-check-circle-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="text-body-2">{{ requirement }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Timeline -->
        <v-card elevation="2" class="mt-4">
          <v-card-title>
            <v-icon left>mdi-timeline</v-icon>
            Mitgliedswerdegang
          </v-card-title>
          <v-card-text>
            <v-timeline dense>
              <v-timeline-item
                v-for="(status, index) in MEMBERSTATUS"
                :key="status"
                :color="getTimelineColor(index)"
                :icon="getTimelineIcon(index)"
                fill-dot
                small
              >
                <v-card :color="index === currentStatusIndex ? 'blue lighten-5' : ''" elevation="1">
                  <v-card-title class="text-subtitle-1 py-2">
                    {{ status }}
                    <v-chip v-if="index === currentStatusIndex" x-small color="cctBlue" class="white--text ml-2">
                      Aktuell
                    </v-chip>
                    <v-chip v-if="index < currentStatusIndex" x-small color="cctGreen" class="white--text ml-2">
                      <v-icon x-small left>mdi-check</v-icon>
                      Erreicht
                    </v-chip>
                  </v-card-title>
                  <v-card-text class="py-2">
                    <p class="text-body-2 mb-0">{{ getStatusLongDescription(status) }}</p>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { readUserProfile } from '@/store/main/getters';
import { MEMBERSTATUS } from '@/common';

@Component
export default class MemberProgression extends Vue {
  MEMBERSTATUS = MEMBERSTATUS;

  get userProfile() {
    return readUserProfile(this.$store);
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
    const colors: { [key: string]: string } = {
      'Trainee': '#FF6F00',
      'Junior Consultant': '#1976D2',
      'Consultant': '#7B1FA2',
      'Senior Consultant': '#388E3C',
    };
    return colors[this.currentStatus] || '#757575';
  }

  getCurrentStatusIcon(): string {
    const icons: { [key: string]: string } = {
      'Trainee': 'mdi-school',
      'Junior Consultant': 'mdi-account',
      'Consultant': 'mdi-account-tie',
      'Senior Consultant': 'mdi-trophy',
    };
    return icons[this.currentStatus] || 'mdi-account';
  }

  getStatusDescription(status?: string): string {
    const targetStatus = status || this.currentStatus;
    const descriptions: { [key: string]: string } = {
      'Trainee': 'Du beginnst deine Reise im CCT',
      'Junior Consultant': 'Du hast die Grundlagen gemeistert',
      'Consultant': 'Du bist ein erfahrenes Mitglied',
      'Senior Consultant': 'Du bist ein Experte und Mentor',
    };
    return descriptions[targetStatus] || '';
  }

  getStatusLongDescription(status: string): string {
    const descriptions: { [key: string]: string } = {
      'Trainee': 'Nach erfolgreicher Teilnahme am Assessment Center beginnst du deine Reise im CCT. Du wirst einem Ressort zugewiesen, erhältst einen Buddy und arbeitest an vereinsinternen Aufgaben. Die Internes-Schulung und ein Kennenlerngespräch mit der Ressortleitung sind Teil deiner Einarbeitung.',
      'Junior Consultant': 'Nach erfolgreichem Abschluss des Mitgliedsprojekts, einer durchlaufenen Angebotsphase und den Gesprächen mit Ressortleitung und Vorstand wirst du Junior Consultant. Du kannst nun an externen Projekten teilnehmen (Richtwert: 15,00 €/h) und sammelst weitere praktische Erfahrung.',
      'Consultant': 'Als Consultant hast du den Mitgliedswerdegang erfolgreich abgeschlossen und bist Vollmitglied. Du hast volles Stimmrecht, kannst unbegrenzt an externen Projekten arbeiten (Richtwert: 20,50 €/h) und Vorstands- bzw. Ressortleitungspositionen bekleiden.',
      'Senior Consultant': 'Der Senior Consultant Status ist eine Auszeichnung für besonders engagierte und qualifizierte CCTler:innen. Du übernimmst in Zusammenarbeit mit den Projektmanager:innen selbstständig Aufgaben in der Projektakquise und im Kundenkontakt.',
    };
    return descriptions[status] || '';
  }

  getRequirements(status: string): string[] {
    const requirements: { [key: string]: string[] } = {
      'Trainee': [
        'Assessment Center erfolgreich bestanden',
        'Ressort zugewiesen bekommen',
        'Buddy zugeteilt bekommen',
        'Verschwiegenheitserklärung unterschrieben',
      ],
      'Junior Consultant': [
        'Mitgliedsprojekt erfolgreich abgeschlossen',
        'Angebotsphase durchlaufen (Projektschulung oder externes Projekt)',
        'Kennenlerngespräch mit Ressortleitung geführt',
        'Abschlussgespräch mit dem Vorstand geführt',
      ],
      'Consultant': [
        'Alle Anforderungen als Junior Consultant erfüllt',
        'Mitgliedswerdegang in angemessener Zeit abgeschlossen',
        'Motivation und Engagement nachgewiesen',
        'Kein begründetes Veto von Vorstand oder Mitgliedern',
      ],
      'Senior Consultant': [
        'Status als Consultant erreicht',
        'Besondere Qualifikation und Engagement nachgewiesen',
        'Fähigkeit zur selbstständigen Projektakquise',
        'Aktive Übernahme von Kundenkontakt und Projektmanagementaufgaben',
      ],
    };
    return requirements[status] || [];
  }

  getTimelineColor(index: number): string {
    if (index < this.currentStatusIndex) return 'cctGreen';
    if (index === this.currentStatusIndex) return 'cctBlue';
    return 'grey';
  }

  getTimelineIcon(index: number): string {
    if (index < this.currentStatusIndex) return 'mdi-check';
    if (index === this.currentStatusIndex) return 'mdi-account';
    return 'mdi-lock';
  }
}
</script>

<style scoped lang="scss">
// CCT Brand colors
.cctBlue {
  background-color: #1976D2 !important;
}

.cctOrange {
  background-color: #FF6F00 !important;
}

.cctPurple {
  background-color: #7B1FA2 !important;
}

.cctGreen {
  background-color: #388E3C !important;
}
</style>
