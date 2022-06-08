/* eslint-disable vue/html-indent */
<template>
  <div>
    <v-toolbar flat :class="`elevation-2`">
      <v-toolbar-title>
        {{ this.typeName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctOrange" style="color: white" :to="{name: 'event-create-' + type}">
        <v-icon left>
          mdi-school
        </v-icon>
        Neues {{ this.typeName }}
      </v-btn>
    </v-toolbar>
    <div class="px-1">
      
      <event-table :items="futureEvents" :type="type">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              Kommende {{ typeName }}s
            </v-toolbar-title>
          </v-toolbar>
        </template>
      </event-table>
      <event-table :items="pastEvents" :type="type">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              Vergangene {{ typeName }}s
            </v-toolbar-title>
          </v-toolbar>
        </template>
      </event-table>
      
      <div v-if="type === 'training'">
        <div 
          :class="`elevation-2`"
          class="text-field" 
          v-html="event_text_intro">
        </div>
        <div 
          :class="`elevation-2`"
          class="text-field" 
          v-html="event_text_anmedlug_abmeldung">
        </div>
        <div 
          :class="`elevation-2`"
          class="text-field" 
          v-html="event_text_schulung_halten">
        </div>
        <div 
          :class="`elevation-2`"
          class="text-field" 
          v-html="event_text_nicht_erscheinen">
        </div>
      </div>

    </div>

    


    <v-dialog 
      v-model="dialog_register" 
      max-width="700px"
      v-if="this.event_details"
    >
      <v-card>
        <v-card-title class="text-h5">Willst du dich verbindlich zu "{{ event_details.title }}" anmelden?</v-card-title>
        <v-spacer></v-spacer>
        <v-card-subtitle>Die Anmeldung muss durch das HR Ressort freigeschaltet werden</v-card-subtitle>
        <v-card-text>
          <v-textarea
            solo
            v-model="application_text"
            label="Nachricht/Bewerbung an das HR Schulungsteam"
          >
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cctBlue" text @click="closeRegisterEvent">Abbrechen</v-btn>
          <v-btn color="cctBlue" text @click="registerForEvent()">Ja, weiter!</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readEvents } from '@/store/event/getters';
import { dispatchCreateEventApplication, dispatchGetEvents } from '@/store/event/actions';
import { IEvent, IEventType } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { dispatchGetUserProfile, dispatchGetUsers } from '@/store/main/actions';
import { readUserProfile, readUsers } from '@/store/main/getters';
import { isAfter } from 'date-fns';
import FileManager from '@/components/file-manager/FileManager.vue';
import EventTable from './EventTable.vue';

@Component({
  components: {EmployeeProfilePicture, FileManager, EventTable },
})
export default class EventMain extends Vue {


  public get type() {
    return this.$route.meta?.event_type as IEventType;
  }

  public get typeName() {
    return {
      'training': 'Training',
      'meeting': 'Meeting'
    }[this.type];
  }

  today = new Date();

  dialog_register = false

  dialog_participants = false;

  delete_item_id = 0;

  event_details: IEvent | null = null;

  application_text = '';


  get futureEvents() {
    if(!this.events) {
      return null;
    }
    return this.events.filter(event => isAfter(new Date(event.date_from), this.today))
  }

  get pastEvents() {
    if(!this.events) {
      return null;
    }
    return this.events.filter(event => isAfter(this.today, new Date(event.date_from)))
  }
  
  get userProfile() {
    return readUserProfile(this.$store);
  }

  get users() {
    return readUsers(this.$store);
  }
  get events() {
    return readEvents(this.$store)(this.type);
  }
  public async mounted() {
    await dispatchGetUsers(this.$store);
    await dispatchGetEvents(this.$store, this.$route.meta?.event_type);
    await dispatchGetUserProfile(this.$store)
  }

  public openRegisterEvent(event): void {
    this.dialog_register = true;
    this.event_details = event
  }


  public async registerForEvent() {
    dispatchCreateEventApplication(this.$store, { eventId: this.event_details!.id, application: { description:  this.application_text} });
    this.closeRegisterEvent();
  }



  public closeRegisterEvent(): void {
    this.dialog_register = false;
  }

  public showParticipants(item: IEvent): void {
    this.event_details = item
    this.dialog_participants = true;
  }

  public closeShowParticipants(): void {
    this.dialog_participants = false;
  }

  event_text_intro = `
    <h1 style="font-weight: 400;">Schulungen und Events</h1>
    <p>Für deine persönliche Weiterentwicklung und erfolgreiche Laufbahn im CCT benötigst du eine Teilnahme an folgenden acht Pflichtschulungen: <b>Internes-Schulung, BDSU-Schulung, Finanzen und Recht, Qualitätsmanagement, Coporate Design, Projektmanagement, Angebotserstellung und Präsentationstechniken</b>. Diese Schulungen werden einmal pro Semester vom CCT angeboten.<br/>
    Neben den Pflichtschulungen bietet das CCT seinen Mitgliedern weitere Zusatzschulungen und – events. Diese werden von unterschiedlichen Trainern durchgeführt: BDSU-Trainerakademie, Alumni, Externe oder CCTlerInnen.<br/>
    <b>Bitte beachte die Regelungen zur An- und Abmeldungen weiter unten.</p>`;
  event_text_anmedlug_abmeldung = `
    <h2 style="color: #1E467D; font-weight: 500;">An- und Abmeldung von Veranstaltungen:</h2>
    <p>Die An- und Abmeldeverfahren sind bei Zusatzevents und Pflichtschulungen leicht verschieden.<br/></p>
    <p>Pflichtschulungen:</p>
    <ul>
    <li>Alle, die die Schulung noch absolvieren müssen, sind automatisch angemeldet.</li>
    <li>Eine <b>Abmeldung</b> ist spätestens <b>48 Stunden (2 Tage)</b> auf Slack über den RelayBot an den Channel <b>hr-mitgliederförderung</b> zu senden</li>
    </ul>
    <br/>
    <p>Zusatzevents:</p>
    <ul>
    <li>Ihr meldet euch so an, wie es in der Schulungsausschreibung beschrieben ist. Zum Beispiel: 1st-come-1st-served-Prinzip, Motivationsschreiben etc.</li>
    <li>Eine <b>Abmeldung</b> kann <b>spätestens 3 Tage</b>  vorher via hr-mitgliederförderung erfolgen</li>
    </ul>
    <br/>
    <p><span style:"color: #FF6400;">Wichtig:</span> Ab sofort gilt, um die Qualität zu sichern: <b>eine nicht ausgefüllte Evaluation ist gleichbedeutend wie eine nicht-Teilnahme!</p>`;
  event_text_schulung_halten = `
    <h2 style="color: #1E467D; font-weight: 500;">Du möchtest eine Schulung halten?</h2>
    <p>Großartig! Es gibt einige Formalien, die eine Schulung erfüllen muss, damit du sie als Teil deines Mitgliedswerdegangs einreichen kannst. In jedem Fall gilt: eine Schulung muss immer <b>spätestens 2 Wochen</b> vor anvisierten Termin mit HR abgesprochen werden.<br/></p>
    <p>Hier sind die Eventskriterien:</p>
    <ul>
    <li>90 min. Dauer oder länger</li>
    <li>Inhalte werden nicht durch (Pflicht-)schulungen aus diesem Semester abgedeckt. (Gerne kannst du sie erweitern und vertiefen!)</li>
    <li>Schulung ist offen für den ganzen Verein und wird 2 Wochen vorher angekündigt</li>
    <li>mind. 1/3 der Zeit ist interaktiv (Übungen, Workshop, Diskussion etc.)</li>
    <li>Handout oder Foliensatz</li>
    <li>Evaluationsergebnis besser als 2,0 (Schulnote)</li>
    <li>Die Evaluation wird ausgewertet</li>
    </ul>`;
  event_text_nicht_erscheinen = `
    <h2 style="color: #1E467D; font-weight: 500;">Was passiert, wenn ich nicht zur Schulung erscheine?</h2>
    <p>Eine Schulung zu planen nimmt immer viel Zeit in Anspruch. Auch das Organisieren, WMS-Einträge, Teilnehmerlisten und Evaluationsauswertungen tragen dazu bei, dass der Aufwand, der hinter einem Veranstaltungsangebot steckt, hoch ist.<br/>
    Daher ist es immer erforderlich, sich rechtzeitig (s.o.) von einem Event abzumelden, auch, weil bei den beliebten Schulungen Restplätze an Wartelisten vergeben werden.</p>
    <p>Folgende Regelung gilt daher:</p>
    <ul>
    <li>Eine <b>verspätete Abmeldung zählt als unentschuldigte Nicht-Teilnahme.</b></li>
    <li>Fehlst du ohne/mit verspäteter Abmeldung schreiben wir dich zukünftig erstmal nur auf die Warteliste, sollte es limitierte Platzanzahl bei den Schulungen geben.</li>
    <li>Handelt es sich um eine externe Schulungsleitung, können andere Maßnahmen in einem persönlichen Gespräch besprochen werden.</li>
    <li><b>Ausgenommen</b> hiervon sind wichtige Gründe: unvorhersehbare Ereignisse, wie Unfälle, Krankheit etc.</li>
    </ul>
    <br/>
    <p>Für weitere Fragen stehen wir euch natürlich gerne zur Verfügung!</br></p>
    <p>Eure HR-Force One!</p>`;
}
</script>

<style scoped>
.v-container {
  background-color: white;
}

.trainer-chip {
  margin: 3px;
}
#second-table {
  margin-top: 15px;
}
.text-blue {
  color: #1E467D;
}
.text-field {
  background-color: #fff !important;
  padding: 15px;
  margin-top: 15px;
  border-radius: 5px;
}
.data-table-header {
  border-top-left-radius: 5px !important;
  border-top-right-radius: 5px !important;
}
</style>
