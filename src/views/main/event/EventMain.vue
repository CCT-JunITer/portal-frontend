/* eslint-disable vue/html-indent */
<template>
  <div>
    <v-toolbar flat :class="`elevation-2`">
      <v-toolbar-title>
        Schulungen und Events
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctOrange" style="color: white" :to="{name: 'event-create'}">
        <v-icon left>
          mdi-school
        </v-icon>
        Neue Schulung
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-data-table
        :class="`elevation-2`"
        :headers="headers" 
        :items="futureEvents"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              Kommende Schulungen
            </v-toolbar-title>
            
          </v-toolbar>
        </template>
        <template v-slot:item.custom_title="{ item }">
          <span style="font-weight: 500;">{{ item.title }}</span>
        </template>
        <template v-slot:item.external="{ item }">
          <span v-if="item.external === ''">Keine</span>
          <span v-else>{{item.external}}</span>
        </template>
       
        <template v-slot:item.custom_trainers="{ item }">
          <v-chip
            class="trainer-chip"
            v-for="leader in item.leaders"
            :key="leader.id"
            color="lightgrey"
          >
            <v-avatar left>
              <employee-profile-picture
                :employee="leader"
              ></employee-profile-picture>
            </v-avatar>
            {{ leader.full_name }}
          </v-chip>
        </template>
        <template v-slot:item.wms_link="{ item }">
          <a :href="item.wms_link"> {{ item.wms_link }}</a>
        </template>
        <template v-slot:item.date_from="{ item }">
          {{ $common.format(new Date(item.date_from), 'dd.MM.yyyy HH:mm') }}
        </template>
        <template v-slot:item.date_to="{ item }">
          {{ $common.format(new Date(item.date_to), 'dd.MM.yyyy HH:mm') }}
        </template>

        
        <template v-slot:item.custom_show_participants="{ item }">
          <v-btn
            color="cctBlue"
            style="color: #fff; margin: 10px;"
            @click="showParticipants(item)"
          >
            <v-icon>
              mdi-account-supervisor
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:item.custom_register="{ item }">
          <v-btn
            v-if="isParticipant(item)"
            disabled
            style="margin: 10px;"
          >
            <v-icon>
              mdi-account-check
            </v-icon>
          </v-btn>
          <v-btn
            v-else
            color="cctGreen"
            style="color: #fff; margin: 10px;"
            @click="openRegisterEvent(item)"
          >
            <v-icon>
              mdi-account-plus
            </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.custom_details="{ item }">
          <v-btn
            color="cctGrey"
            :to="{name: 'events-details', params: {id: item.id}}"
            style="color:#fff;"
          >
            <v-icon>
              mdi-text
            </v-icon>
          </v-btn>
        </template>



      </v-data-table>


      <v-data-table 
        :class="`elevation-2`"
        id="second-table"
        :headers="headers" 
        :items="pastEvents"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              Vergangene Schulungen
            </v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.custom_title="{ item }">
          <span style="font-weight: 500;">{{ item.title }}</span>
        </template>
        <template v-slot:item.external="{ item }">
          <span v-if="item.external === ''">Keine</span>
          <span v-else>{{item.external}}</span>
        </template>
       
        <template v-slot:item.custom_leaders="{ item }">
          <v-chip
            class="trainer-chip"
            v-for="leader in item.leaders"
            :key="leader.id"
            color="lightgrey"
          >
            <v-avatar left>
              <employee-profile-picture
                :employee="leader"
              ></employee-profile-picture>
            </v-avatar>
            {{ leader.full_name }}
          </v-chip>
        </template>
        <template v-slot:item.date_from="{ item }">
          {{ $common.format(new Date(item.date_from), 'dd.MM.yyyy HH:mm') }}
        </template>
        <template v-slot:item.date_to="{ item }">
          {{ $common.format(new Date(item.date_to), 'dd.MM.yyyy HH:mm') }}
        </template>

        <template v-slot:item.custom_delete="{ item }">
          <v-icon
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.custom_edit="{ item }">
          <v-icon
            @click="deleteItem(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
        <template v-slot:item.custom_show_participants="{ item }">
          <v-btn
            color="cctBlue"
            style="color: #fff; margin: 10px;"
            @click="showParticipants(item)"
          >
            <v-icon>
              mdi-account-supervisor
            </v-icon>
          </v-btn>
        </template>
        <template v-slot:item.custom_register="{ item }">
          <v-btn
            v-if="isParticipant(item)"
            disabled
            style="margin: 10px;"
          >
            <v-icon>
              mdi-account-check
            </v-icon>
          </v-btn>
          <v-btn
            v-else
            disabled
            style="margin: 10px;"
          >
            <v-icon>
              mdi-account-cancel
            </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.custom_details="{ item }">
          <v-btn
            color="cctGrey"
            :to="{name: 'events-details', params: {id: item.id}}"
            style="color:#fff;"
          >
            <v-icon>
              mdi-text
            </v-icon>
          </v-btn>
        </template>

  
      </v-data-table>
      
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

    </v-container>

    <v-dialog 
      v-model="dialog_participants" 
      max-width="450px"
      v-if="this.event_details"
    >
      <v-card>
        <v-card-title class="text-h5">Teilnehmerliste: {{ this.event_details.title }}</v-card-title>
        <v-card-text>
          <div>
            <v-list subheader>
              <v-subheader>Teilnehmer:innen</v-subheader>

              <v-list-item
                v-for="participant in this.event_details.participants"
                :key="participant.id"
              >
                <employee-profile-picture
                  :employee="participant"
                  component="v-list-item-avatar"
                  size="40"
                ></employee-profile-picture>

                <v-list-item-content>
                  <v-list-item-title v-text="participant.full_name"></v-list-item-title>
                  <v-list-item-subtitle v-text="participant.ressort"></v-list-item-subtitle>
                </v-list-item-content>

              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cctBlue" text @click="closeShowParticipants">Schließen</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>


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
import { IEvent } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { dispatchGetUserProfile, dispatchGetUsers } from '@/store/main/actions';
import { readUserProfile, readUsers } from '@/store/main/getters';
import { isAfter } from 'date-fns';

@Component({
  components: {EmployeeProfilePicture},
})
export default class EventMain extends Vue {

  today = new Date();

  dialog_register = false

  dialog_participants = false;

  delete_item_id = 0;

  event_details: IEvent | null = null;

  application_text = '';

  public headers = [
    {
      text: 'Titel',
      sortable: true,
      value: 'custom_title',
      align: 'left',
    },
    {
      text: 'Schulungstyp',
      sortable: true,
      value: 'subtype',
      align: 'left',
    },
    {
      text: 'Thema',
      sortable: true,
      value: 'topic',
      align: 'left',
    },
    // {
    //   text: 'Beschreibung',
    //   sortable: false,
    //   value: 'description',
    //   align: 'left',
    // },
    {
      text: 'Datum von',
      sortable: true,
      value: 'date_from',
      align: 'left',
    },
    {
      text: 'Datum bis',
      sortable: true,
      value: 'date_to',
      align: 'left',
    },
    {
      text: 'Ext. Trainer:innen',
      value: 'external',
      sortable: false,
    },
    {
      text: 'Trainer:innen',
      value: 'custom_leaders',
      align: 'center',
      sortable: false,
    },
    {
      text: 'Anmelden',
      value: 'custom_register',
      align: 'center',
      sortable: false,
    },
    
    {
      text: 'Teilnehmer:innen',
      value: 'custom_show_participants',
      align: 'center',
      sortable: false,
      
    },
    {
      text: 'Details',
      value: 'custom_details',
      align: 'center',
      sortable: false,
      
    },
  ];


  get futureEvents() {
    return this.events.filter(event => isAfter(new Date(event.date_from), this.today))
  }

  get pastEvents() {
    return this.events.filter(event => isAfter(this.today, new Date(event.date_from)))
  }
  
  get userProfile() {
    return readUserProfile(this.$store);
  }

  get users() {
    return readUsers(this.$store);
  }
  get events() {
    return readEvents(this.$store)
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


  public isParticipant(item: IEvent): boolean {
    console.log(this.userProfile?.id);
    return item.participants.some(participant => participant.id == this.userProfile?.id);
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
