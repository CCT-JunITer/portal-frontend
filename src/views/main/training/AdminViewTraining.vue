<template>
  <div>
    <v-toolbar flat :class="`elevation-2`">
      <v-toolbar-title>
        Schulungen verwalten
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctOrange" style="color: white" :to="{name: 'admin-training-create'}">
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
              Zukünftige Schulungen
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


          <v-tooltip top>
            <span>Löschen</span>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text>
                <v-icon 
                  @click="deleteItem(item)"
                  color="cctGrey"
                >
                  mdi-delete                
                </v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
        <template v-slot:item.custom_edit="{ item }">


          <v-tooltip top>
            <span>Bearbeiten</span>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text :to="{name: 'admin-training-edit', params: {id: item.id}}">
                <v-icon 
                  :to="{name: 'admin-training-edit', params: {id: item.id}}"
                  color="cctGrey"
                >
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
        <template v-slot:item.custom_show_participants="{ item }">
          <v-btn
            color="cctGreen"
            style="color: #fff; margin: 10px;"
            @click="showParticipants(item)"
          >
            <v-icon>
              mdi-account-supervisor
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


          <v-tooltip top>
            <span>Löschen</span>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text>
                <v-icon 
                  @click="deleteItem(item)"
                  color="cctGrey"
                >
                  mdi-delete                
                </v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
        <template v-slot:item.custom_edit="{ item }">


          <v-tooltip top>
            <span>Bearbeiten</span>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" text :to="{name: 'admin-training-edit', params: {id: item.id}}">
                <v-icon 
                  :to="{name: 'admin-training-edit', params: {id: item.id}}"
                  color="cctGrey"
                >
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
          </v-tooltip>
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
  
      </v-data-table>
    </v-container>
    <v-dialog 
      v-model="dialog_delete" 
      max-width="700px"
    >
      <v-card>
        <v-card-title class="text-h5">Bist du dir sicher, dass du dieses Training löschen willst?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cctBlue" text @click="closeDeleteTraining">Abbrechen</v-btn>
          <v-btn color="cctBlue" text @click="deleteTrainingConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog 
      v-model="dialog_participants" 
      max-width="450px"
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


  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readUsers, readTrainings } from '@/store/main/getters';
import { dispatchGetTrainings, dispatchGetUsers } from '@/store/main/actions';
import { dispatchDeleteTraining } from '@/store/admin/actions';
import { ITraining } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';


@Component({
  components: {EmployeeProfilePicture},
})
export default class AdminUsers extends Vue {

  today = new Date();
  training_details: ITraining = {
    title: '',
    type: '',
    is_membership_progression: false,
    topic: '',
    description: '',
    date: '',
    wms_link: '',
    external_trainers: '',
    id: 0,
    author: [],
    trainers: [],
    participants: [],
  }

  dialog_delete = false
  dialog_participants = false;

  delete_item_id = 0;

  public headers = [
    {
      text: 'Schulungs-ID',
      sortable: true,
      value: 'id',
      align: 'center',
    },
    {
      text: 'Titel',
      sortable: false,
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
      text: 'Datum',
      sortable: true,
      value: 'custom_date',
      align: 'left',
    },
    {
      text: 'Uhrzeit',
      sortable: false,
      value: 'custom_time',
      align: 'left',
    },
    {
      text: 'Beschreibung',
      sortable: false,
      value: 'description',
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
      text: 'Teilnehmer:innen',
      value: 'custom_show_participants',
      align: 'center',
      sortable: false,
      
    },
    {
      text: 'Bearbeiten',
      value: 'custom_edit',
      align: 'center',
      sortable: false,
    },
    {
      text: 'Löschen',
      value: 'custom_delete',
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
  
  get users() {
    return readUsers(this.$store);
  }
  get trainings() {
    return readTrainings(this.$store)
  }
  public async mounted() {
    await dispatchGetUsers(this.$store);
    await dispatchGetTrainings(this.$store)
  }

  public deleteItem(item) {
    this.delete_item_id = item.id;
    this.dialog_delete = true;
  }

  public closeDeleteTraining() {
    this.dialog_delete = false;
  }

  public deleteTrainingConfirm() {
    dispatchDeleteTraining(this.$store, this.delete_item_id);
    dispatchGetTrainings(this.$store)
    this.dialog_delete = false
  }

  public formatDate(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('de-DE');
  }

  public formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('de-DE').slice(0,5);
  }
  
  public showParticipants(item) {
    this.training_details = item
    this.dialog_participants = true;
  }

  public closeShowParticipants() {
    this.dialog_participants = false;
  }

}
</script>

<style scoped>
body {
  background-color: #fff !important;
}
.trainer-chip {
  margin: 3px;
}
#second-table {
  margin-top: 15px;
}
</style>
