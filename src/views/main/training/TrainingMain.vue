/* eslint-disable vue/html-indent */
<template>
  <div>
    <v-toolbar flat :class="`elevation-2`">
      <v-toolbar-title>
        Schulungen und Trainings
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctOrange" style="color: white" :to="{name: 'training-create'}">
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
        :items="futureTrainings"
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
        <template v-slot:item.external_trainers="{ item }">
          <span v-if="item.external_trainers === ''">Keine</span>
          <span v-else>{{item.external_trainers}}</span>
        </template>
       
        <template v-slot:item.custom_trainers="{ item }">
          <span 
            v-if="item.trainers.lenght == 0"
          >
            Keine internen Trainer:innen
          </span>
          <v-chip
            class="trainer-chip"
            v-else
            v-for="trainer in item.trainers"
            :key="trainer.id"
            color="lightgrey"
          >
            <v-avatar left>
              <employee-profile-picture
                :employee="trainer"
              ></employee-profile-picture>
            </v-avatar>
            {{ trainer.full_name }}
          </v-chip>
        </template>
        <template v-slot:item.wms_link="{ item }">
          <a :href="item.wms_link"> {{ item.wms_link }}</a>
        </template>
        <template v-slot:item.custom_date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template v-slot:item.custom_time="{ item }">
          {{ formatTime(item.date) }}
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
            @click="openRegisterTraining(item)"
          >
            <v-icon>
              mdi-account-plus
            </v-icon>
          </v-btn>
        </template>

        <template v-slot:item.custom_details="{ item }">
          <v-btn
            color="cctGrey"
            :to="{name: 'trainings-details', params: {id: item.id}}"
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
        :items="pastTrainings"
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
        <template v-slot:item.external_trainers="{ item }">
          <span v-if="item.external_trainers === ''">Keine</span>
          <span v-else>{{item.external_trainers}}</span>
        </template>
       
        <template v-slot:item.custom_trainers="{ item }">
          <span 
            v-if="item.trainers.lenght == 0"
          >
            Keine internen Trainer:innen
          </span>
          <v-chip
            class="trainer-chip"
            v-else
            v-for="trainer in item.trainers"
            :key="trainer.id"
            color="lightgrey"
          >
            <v-avatar left>
              <employee-profile-picture
                :employee="trainer"
              ></employee-profile-picture>
            </v-avatar>
            {{ trainer.full_name }}
          </v-chip>
        </template>
        <template v-slot:item.custom_date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template v-slot:item.custom_time="{ item }">
          {{ formatTime(item.date) }}
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
            :to="{name: 'trainings-details', params: {id: item.id}}"
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
        v-html="training_text_intro">
      </div>
      <div 
        :class="`elevation-2`"
        class="text-field" 
        v-html="training_text_anmedlug_abmeldung">
      </div>
      <div 
        :class="`elevation-2`"
        class="text-field" 
        v-html="training_text_schulung_halten">
      </div>
      <div 
        :class="`elevation-2`"
        class="text-field" 
        v-html="training_text_nicht_erscheinen">
      </div>

    </v-container>

    <v-dialog 
      v-model="dialog_participants" 
      max-width="450px"
      v-if="this.training_details"
    >
      <v-card>
        <v-card-title class="text-h5">Teilnehmerliste: {{ this.training_details.title }}</v-card-title>
        <v-card-text>
          <div>
            <v-list subheader>
              <v-subheader>Teilnehmer:innen</v-subheader>

              <v-list-item
                v-for="participant in this.training_details.participants"
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
      v-if="this.training_details"
    >
      <v-card>
        <v-card-title class="text-h5">Willst du dich verbindlich zu "{{ training_details.title }}" anmelden?</v-card-title>
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
          <v-btn color="cctBlue" text @click="closeRegisterTraining">Abbrechen</v-btn>
          <v-btn color="cctBlue" text @click="registerForTraining()">Ja, weiter!</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readTrainings } from '@/store/training/getters';
import { dispatchCreateTrainingApplication, dispatchGetTrainings } from '@/store/training/actions';
import { ITraining } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { dispatchGetUserProfile, dispatchGetUsers } from '@/store/main/actions';
import { readUserProfile, readUsers } from '@/store/main/getters';

@Component({
  components: {EmployeeProfilePicture},
})
export default class TrainingMain extends Vue {

  today = new Date();

  dialog_register = false

  dialog_participants = false;

  delete_item_id = 0;

  training_details: ITraining | null = null;

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
      value: 'type',
      align: 'left',
    },
    {
      text: 'Thema',
      sortable: true,
      value: 'topic',
      align: 'left',
    },
    {
      text: 'Beschreibung',
      sortable: false,
      value: 'description',
      align: 'left',
    },
    {
      text: 'Datum',
      sortable: true,
      value: 'custom_date',
      align: 'left',
    },
    {
      text: 'Uhrzeit',
      sortable: true,
      value: 'custom_time',
      align: 'left',
    },
    {
      text: 'Ext. Trainer:innen',
      value: 'external_trainers',
      sortable: false,
    },
    {
      text: 'Trainer:innen',
      value: 'custom_trainers',
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


  get futureTrainings() {
    return this.trainings.filter(training => new Date(training.date) > this.today)
  }

  get pastTrainings() {
    return this.trainings.filter(training => new Date(training.date) <= this.today)
  }
  
  get userProfile() {
    return readUserProfile(this.$store);
  }

  get users() {
    return readUsers(this.$store);
  }
  get trainings() {
    return readTrainings(this.$store)
  }
  public async mounted() {
    await dispatchGetUsers(this.$store);
    await dispatchGetTrainings(this.$store)
    await dispatchGetUserProfile(this.$store)
  }

  public openRegisterTraining(training): void {
    this.dialog_register = true;
    this.training_details = training
  }


  public async registerForTraining() {
    dispatchCreateTrainingApplication(this.$store, { trainingId: this.training_details!.id, application: { description:  this.application_text} });
    this.closeRegisterTraining();
  }


  public isParticipant(item: ITraining): boolean {
    console.log(this.userProfile?.id);
    return item.participants.some(participant => participant.id == this.userProfile?.id);
  }

  public closeRegisterTraining(): void {
    this.dialog_register = false;
  }

  public formatDate(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('de-DE');
  }

  public formatTime(dateTimeStr: string): string {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('de-DE').slice(0,5);
  }
  
  public showParticipants(item: ITraining): void {
    this.training_details = item
    this.dialog_participants = true;
  }

  public closeShowParticipants(): void {
    this.dialog_participants = false;
  }

  training_text_intro = `
    <h1 style="font-weight: 400;">Schulungen und Trainings</h1>
    <p>Für deine persönliche Weiterentwicklung und erfolgreiche Laufbahn im CCT benötigst du eine Teilnahme an folgenden acht Pflichtschulungen: <b>Internes-Schulung, BDSU-Schulung, Finanzen und Recht, Qualitätsmanagement, Coporate Design, Projektmanagement, Angebotserstellung und Präsentationstechniken</b>. Diese Schulungen werden einmal pro Semester vom CCT angeboten.<br/>
    Neben den Pflichtschulungen bietet das CCT seinen Mitgliedern weitere Zusatzschulungen und – trainings. Diese werden von unterschiedlichen Trainern durchgeführt: BDSU-Trainerakademie, Alumni, Externe oder CCTlerInnen.<br/>
    <b>Bitte beachte die Regelungen zur An- und Abmeldungen weiter unten.</p>`;
  training_text_anmedlug_abmeldung = `
    <h2 style="color: #1E467D; font-weight: 500;">An- und Abmeldung von Veranstaltungen:</h2>
    <p>Die An- und Abmeldeverfahren sind bei Zusatztrainings und Pflichtschulungen leicht verschieden.<br/></p>
    <p>Pflichtschulungen:</p>
    <ul>
    <li>Alle, die die Schulung noch absolvieren müssen, sind automatisch angemeldet.</li>
    <li>Eine <b>Abmeldung</b> ist spätestens <b>48 Stunden (2 Tage)</b> auf Slack über den RelayBot an den Channel <b>hr-mitgliederförderung</b> zu senden</li>
    </ul>
    <br/>
    <p>Zusatztrainings:</p>
    <ul>
    <li>Ihr meldet euch so an, wie es in der Schulungsausschreibung beschrieben ist. Zum Beispiel: 1st-come-1st-served-Prinzip, Motivationsschreiben etc.</li>
    <li>Eine <b>Abmeldung</b> kann <b>spätestens 3 Tage</b>  vorher via hr-mitgliederförderung erfolgen</li>
    </ul>
    <br/>
    <p><span style:"color: #FF6400;">Wichtig:</span> Ab sofort gilt, um die Qualität zu sichern: <b>eine nicht ausgefüllte Evaluation ist gleichbedeutend wie eine nicht-Teilnahme!</p>`;
  training_text_schulung_halten = `
    <h2 style="color: #1E467D; font-weight: 500;">Du möchtest eine Schulung halten?</h2>
    <p>Großartig! Es gibt einige Formalien, die eine Schulung erfüllen muss, damit du sie als Teil deines Mitgliedswerdegangs einreichen kannst. In jedem Fall gilt: eine Schulung muss immer <b>spätestens 2 Wochen</b> vor anvisierten Termin mit HR abgesprochen werden.<br/></p>
    <p>Hier sind die Trainingskriterien:</p>
    <ul>
    <li>90 min. Dauer oder länger</li>
    <li>Inhalte werden nicht durch (Pflicht-)schulungen aus diesem Semester abgedeckt. (Gerne kannst du sie erweitern und vertiefen!)</li>
    <li>Schulung ist offen für den ganzen Verein und wird 2 Wochen vorher angekündigt</li>
    <li>mind. 1/3 der Zeit ist interaktiv (Übungen, Workshop, Diskussion etc.)</li>
    <li>Handout oder Foliensatz</li>
    <li>Evaluationsergebnis besser als 2,0 (Schulnote)</li>
    <li>Die Evaluation wird ausgewertet</li>
    </ul>`;
  training_text_nicht_erscheinen = `
    <h2 style="color: #1E467D; font-weight: 500;">Was passiert, wenn ich nicht zur Schulung erscheine?</h2>
    <p>Eine Schulung zu planen nimmt immer viel Zeit in Anspruch. Auch das Organisieren, WMS-Einträge, Teilnehmerlisten und Evaluationsauswertungen tragen dazu bei, dass der Aufwand, der hinter einem Veranstaltungsangebot steckt, hoch ist.<br/>
    Daher ist es immer erforderlich, sich rechtzeitig (s.o.) von einem Training abzumelden, auch, weil bei den beliebten Schulungen Restplätze an Wartelisten vergeben werden.</p>
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
