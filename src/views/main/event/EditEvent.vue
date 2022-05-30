/* eslint-disable vue/html-indent */
<template>
  <v-container>



    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4 text--primary mb-3">Neue {{ {'meeting': 'Meeting', 'training': 'Training'}[type] }} anlegen</h4>
        <p class="text-body-2 text--secondary">Jede Schulung kann hier dokumentiert werden.</p>
      </v-col>

      <v-col cols="12" md="8">
        <v-form
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-text-field
            label="Titel"               
            v-model="event.title"
            class="input-lg"
            prepend-icon="mdi-format-title"
            required
            :rules="[$common.required]"            
          ></v-text-field>
          <!-- Woher kommt die Leertaste? -->

          <v-select
            label="Schulungsart"
            v-if="type === 'training'"
            v-model ="event.subtype"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            :items="$common.SCHULUNGSART"
            :rules="[$common.required]"
          ></v-select>    
          <v-select
            label="Schulungsthema"
            v-if="type === 'training'"
            v-model="event.topic"
            :items="$common.SCHULUNGSTHEMA"
            prepend-icon="mdi-collage"
            class="input-lg"
            required
            :rules="[$common.required]"
          ></v-select>         
          <v-textarea
            label="Beschreibung"
            v-model="event.description"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="Hier soll eine kurze Beschreibung der Schulung eingegeben werden."
            required
            :rules="[$common.required]"
          ></v-textarea>

          <div class="input-lg rounded mb-4 agenda-wrapper">
            <div class="text-overline">Agenda</div>
            <div class="flex-center">
              <v-text-field
                @keydown.enter="addToAgenda"
                label="Neuer Agendapunkt"               
                v-model="newAgendaItem"
                prepend-icon="mdi-format-title"            
              ></v-text-field>
              <v-btn x-large icon color="cctOrange" @click="addToAgenda">
                <v-icon> mdi-plus-circle</v-icon>
              </v-btn>
            </div>
            <draggable v-model="agendaList" group="people" @start="drag=true" @end="drag=false">
              <div 
                v-for="(element, index) in agendaList" 
                :key="index"
                class="agenda-item rounded my-2"
              >
                <div class="flex-center">
                  <div>
                    <b>{{ index + 1 }}</b> {{ element }}
                  </div>
                  <v-btn large icon color="cctGrey" @click="removeItemFromAgenda(index)">
                    <v-icon> mdi-minus-circle</v-icon>
                  </v-btn>
                </div>
              </div>
            </draggable>
            <small><v-icon size="17px">mdi-information-outline</v-icon> Agendapunkte können per Drag and Drop verschoben werden</small>
          </div>

          <date-time-picker-menu
            v-model ="event.date_from"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '2000-01-01',
              max: '2025-01-01'
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Datum von"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required]"
              ></v-text-field>
            </template>
          </date-time-picker-menu>
          
          <date-time-picker-menu
            v-model ="event.date_to"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '2000-01-01',
              max: '2025-01-01'
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Datum bis"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required]"
              ></v-text-field>
            </template>
          </date-time-picker-menu>

          <v-text-field
            label="Externe Personen"
            v-model="event.external"
            prepend-icon="mdi-account-arrow-left"
            class="input-lg"
            persistent-hint
          ></v-text-field>

          <v-checkbox
            v-model="event.approved"
            label="Bestätigt"
            class="input-lg"
            prepend-icon="mdi-check-decagram"
            hint="Durch das Qualitätsmanagement bestätigt"
            persistent-hint
            required
          >
          </v-checkbox>

          <v-checkbox
            v-model="event.application_possible"
            label="Anmeldung möglich"
            class="input-lg"
            prepend-icon="mdi-account-plus"
            hint="Anmeldung möglich"
            persistent-hint
            required
          >
          </v-checkbox>

          <v-autocomplete
            v-model="event.leader_ids"
            :items="this.userProfiles"
            filled
            chips
            class="input-lg"
            prepend-icon="mdi-school"
            label="Sitzungsleiter:innen"
            item-text="full_name"
            item-value="id"
            multiple
          >
            <template v-slot:selection="data">
              <v-chip
                color="cctGreen"
                text-color="white"
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="removeTrainer(data.item)"
              >
                <v-avatar left>
                  <employee-profile-picture
                    :employee="data.item"
                  ></employee-profile-picture>
                </v-avatar>
                {{ data.item.full_name }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template>
                <employee-profile-picture
                  :employee="data.item"
                  component="v-list-item-avatar"
                  size="40"
                ></employee-profile-picture>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.full_name"></v-list-item-title>
                  <v-list-item-subtitle v-html="data.item.ressort"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
            
          </v-autocomplete>


          <v-autocomplete
            v-model="event.participant_ids"
            :items="this.userProfiles"
            filled
            chips
            class="input-lg"
            label="Teilnehmer:innen"
            item-text="full_name"
            prepend-icon="mdi-account"
            item-value="id"
            multiple
          >
            <template v-slot:selection="data">
              <v-chip
                color="cctBlue"
                text-color="white"
                v-bind="data.attrs"
                :input-value="data.selected"
                close
                @click="data.select"
                @click:close="removeParticipant(data.item)"
              >
                <v-avatar left>
                  <employee-profile-picture
                    :employee="data.item"
                  ></employee-profile-picture>
                </v-avatar>
                {{ data.item.full_name }}
              </v-chip>
            </template>
            <template v-slot:item="data">
              <template>
                
                <employee-profile-picture
                  :employee="data.item"
                  component="v-list-item-avatar"
                  size="40"
                ></employee-profile-picture>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.full_name"></v-list-item-title>
                  <v-list-item-subtitle v-html="data.item.ressort"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
          <file-manager v-model="event.files" :multiple="true"></file-manager>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" outlined color="cctOrange">Abbrechen</v-btn>
          <v-btn
            @click="submit"
            color="cctGreen"
            style="color: #ffffff"
          >
            Schulung speichern
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Watch} from 'vue-property-decorator';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import { dispatchGetUsers } from '@/store/main/actions';
import { readUsers,} from '@/store/main/getters';
import { IEvent, IEventCreate, IEventType } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import { readOneEvent } from '@/store/event/getters';
import { dispatchCreateEvent, dispatchGetOneEvent, dispatchUpdateEvent } from '@/store/event/actions';
import FileManager from '@/components/file-manager/FileManager.vue';
import DateTimePickerMenu from '@/components/DateTimePickerMenu.vue';
import { Route } from 'vue-router';
import Draggable from 'vuedraggable'


@Component({
  components: {VueTelInputVuetify, UploadButton, DateTimePickerMenu, EmployeeProfilePicture, FileManager, Draggable},
})
export default class AdminViewEvent extends Vue {

  public time_menu = false;
  public valid = false;
  public event: Partial<IEventCreate> = {}
  public agendaList: string[] = [];
  public drag = false;
  public newAgendaItem = '';


  public get type() {
    return (this.$route.meta?.event_type || this.event?.type || 'training') as IEventType;
  }


  get userProfiles() {
    return readUsers(this.$store);
  }

  @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params.id !== oldRoute?.params.id) {
      await dispatchGetOneEvent(this.$store, +this.$route.params.id)
      this.reset();
    }
  }



  public addToAgenda() {
    if (this.newAgendaItem.length > 0) {
      this.agendaList.push(this.newAgendaItem);
      this.newAgendaItem = '';
    }  
  }

  public removeItemFromAgenda(index) {
    this.agendaList.splice(index, 1)
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
    this.valid = false;
  }

  public removeTrainer(item) {
    if (!this.event.leader_ids) {
      return;
    }
    const index = this.event.leader_ids.indexOf(item.id);
    if (index >= 0) this.event.leader_ids.splice(index, 1);
  }

  public removeParticipant(item) {
    if (!this.event.participant_ids) {
      return;
    }
    const index = this.event.participant_ids.indexOf(item.id);
    if (index >= 0) this.event.participant_ids.splice(index, 1);
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const new_event = {
        ...this.event,
        type: this.type,
        agenda: this.agendaList,
      } as IEventCreate;

      let event: IEvent | undefined;
      if (this.editEvent?.id) {
        event = await dispatchUpdateEvent(this.$store, {id: this.editEvent.id, event: new_event});
      } else {
        event = await dispatchCreateEvent(this.$store, new_event);
      }
      this.$router.push(`/main/events/${event?.id}`);
      
    }
  }

  get editEvent() {
    return readOneEvent(this.$store)(+this.$router.currentRoute.params.id);
  }
  public reset() {
    if(this.editEvent) {
      this.event = {
        ...this.editEvent, 
        participant_ids: this.editEvent.participants.map(u => u.id),
        leader_ids: this.editEvent.leaders.map(u => u.id),
      };
      if(this.editEvent.agenda != null && this.editEvent.agenda != undefined)
        this.agendaList = this.editEvent.agenda;

      // const trainer_ids: number[] = this.editEvent.leaders.map(trainer => trainer.id);
      // const participant_ids: number[] = this.editEvent.participants.map(participant => participant.id);
      // const date_only = this.editEvent.date.split('T')[0];
      // const time = this.editEvent.date.split('T')[1].substring(0,5);
      
      // this.event_titel = this.editEvent.title;
      // this.event_type = this.editEvent.type;
      // this.event_topic = this.editEvent.topic;
      // this.event_description = this.editEvent.description;
      // this.event_date = date_only
      // this.event_time = time;      
      // this.event_wms_link = this.editEvent.wms_link;
      // this.event_external_trainers = this.editEvent.external_trainers;
      // this.event_trainers = trainer_ids;
      // this.event_participants = participant_ids;
      // this.event_files = this.editEvent.files ? this.editEvent.files.split(',') : []
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

.agenda-wrapper
  border: 1px solid #999
  padding: 10px

.agenda-item
  background: #eee
  padding-left: 10px

.flex-center
  display: flex
  justify-content: space-between
  align-items: center

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>