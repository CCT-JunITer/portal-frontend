/* eslint-disable vue/html-indent */
<template>
  <v-container>



    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4 text--primary mb-3">Neues {{ {'meeting': 'Meeting', 'training': 'Training'}[type] }} anlegen</h4>
        <p class="text-body-2 text--secondary">Jedes {{ {'meeting': 'Meeting', 'training': 'Training'}[type] }} kann hier dokumentiert werden.</p>
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
          <v-select
            :label="type === 'meeting' ? 'Meetingart': 'Schulungsart'"
            v-model ="subtype"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            return-object
            item-text="type"
            :items="type === 'meeting' ? $common.MEETINGMAPPING : $common.SCHULUNGSMAPPING"
            :rules="[$common.required]"
          ></v-select>
          <div v-if="subtype && subtype.topics && subtype.topics.length">
            <v-select
              label="Schulungsthema"
              v-model ="event.topic"
              class="input-lg"
              prepend-icon="mdi-collage"
              :items="subtype.topics"
              :rules="[$common.required]"
            ></v-select>
          </div>
          <v-textarea
            label="Beschreibung"
            v-model="event.description"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="Hier soll eine kurze Beschreibung der Schulung eingegeben werden."
            required
            :rules="[$common.required]"
          ></v-textarea>

          <agenda-component v-model="event.agenda" class="input-lg">
          </agenda-component>

          <component
            :is="!allday ? 'date-time-picker-menu' : 'date-picker-menu'"
            v-model ="event.date_from"
            defaultPicker="MONTH"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Datum von"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required, ...attrs.rules]"
              ></v-text-field>
            </template>
          </component>
          
          <component
            :is="!allday ? 'date-time-picker-menu' : 'date-picker-menu'"
            v-model ="event.date_to"
            defaultPicker="MONTH"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                label="Datum bis"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required, ...attrs.rules]"
              ></v-text-field>
            </template>
          </component>

          <v-checkbox
            v-model="allday"
            label="Ganztägig"
            prepend-icon="mdi-clock"
            class="input-lg"
            persistent-hint
            required
          >
          </v-checkbox>


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
          ></v-checkbox>
          <v-alert
            type="info"
            outlined
            dense
            class="input-lg"
            v-if="isDonnerstagssitzung"
          >Bei Donnerstagssitzungen: Der Haken wird automatisch gesetzt sobald Agenda, Protokoll und Präsentation/Folien vorhanden sind. Manuelles Setzen ist weiterhin möglich.</v-alert>

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


          <user-select
            v-model="event.protocol_id"
            class="input-lg"
            prepend-icon="mdi-file"
            filled
            label="Protokollant:in"
            :userChipProps="{
              color: 'cctGreen',
              dark: true,
            }"
          >
          </user-select>
          <user-select
            v-model="event.leader_ids"
            multiple
            class="input-lg"
            prepend-icon="mdi-school"
            filled
            label="Sitzungsleiter:innen"
            :userChipProps="{
              color: 'cctGreen',
              dark: true,
            }"
          >
          </user-select>

          <user-select
            v-model="event.participant_ids"
            multiple
            class="input-lg"
            prepend-icon="mdi-account"
            filled
            label="Teilnehmer:innen"
            :userChipProps="{
              color: 'cctBlue',
              dark: true,
            }"
          >
          </user-select>
          
          <file-manager v-model="event.files" :folder="event.versioned_folder" :multiple="true" :labels="fileLabels"></file-manager>
        </v-form>
        <v-card-actions>
          <v-alert
            v-if="showValidationError"
            type="error"
            dense
            outlined
            class="mb-0 mr-3 flex-grow-1"
          >
            Bitte überprüfen Sie Ihre Eingaben. Einige Pflichtfelder sind nicht korrekt ausgefüllt.
          </v-alert>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" outlined color="cctOrange">Abbrechen</v-btn>

          <consent-dialog @accept="deleteEvent" title="Dokument löschen" content="Wirklich löschen?" v-if="editEvent">
            <template v-slot:activator="{ attrs, on }">
              <v-btn 
                v-bind="attrs" 
                v-on="on" 
                color="red" 
                dark
              >
                <v-icon left>
                  delete
                </v-icon>
                Event löschen
              </v-btn>
            </template>
          </consent-dialog>
          <v-btn
            @click="submit"
            color="cctGreen"
            style="color: #ffffff"
          >
            Event speichern
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
import { dispatchCreateEvent, dispatchDeleteEvent, dispatchGetOneEvent, dispatchUpdateEvent } from '@/store/event/actions';
import FileManager from '@/components/file-manager/FileManager.vue';
import DateTimePickerMenu from '@/components/DateTimePickerMenu.vue';
import { Route } from 'vue-router';
import AgendaComponent from '@/components/agenda/AgendaComponent.vue';
import UserSelect from '@/components/user-select/UserSelect.vue';
import ConsentDialog from '@/components/consent-dialog/ConsentDialog.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';

@Component({
  components: {VueTelInputVuetify, UploadButton, DatePickerMenu, DateTimePickerMenu, EmployeeProfilePicture, FileManager, AgendaComponent, UserSelect, ConsentDialog },
})
export default class AdminViewEvent extends Vue {

  public time_menu = false;
  public valid = false;
  public showValidationError = false;
  public event: Partial<IEventCreate> = {}
  public subtype: null | {type: string; topics?: string[]} = null;
  public allday = false;

  public get type() {
    return (this.$route.meta?.event_type || this.event?.type || 'training') as IEventType;
  }

  async deleteEvent() {
    if (!this.editEvent) {
      return;
    }
    try {
      const oldEvent = this.editEvent;
      await dispatchDeleteEvent(this.$store, oldEvent.id);
      if (oldEvent.type === 'training') {
        this.$router.push('/main/trainings');
      } else {
        this.$router.push('/main/wms/meetings');
      }
    } catch (error) {
      // Error notification is already shown by apiCallNotify
      console.error('Failed to delete event:', error);
    }
  }

  get fileLabels() {
    if (this.type === 'training') {
      return ['Evaluationsauswertung', 'Schulungsmaterial', 'Teilnahmeliste']
    } else if(this.type === 'meeting') {
      return ['Präsentation', 'Protokoll'];
    }
    return [];
  }


  get userProfiles() {
    return readUsers(this.$store);
  }

  @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    // reset sub-type
    this.subtype = null;
    if (newRoute?.params.id !== oldRoute?.params.id) {
      await dispatchGetOneEvent(this.$store, +this.$route.params.id)
      this.reset();
    }
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
    this.showValidationError = false;
    if ((this.$refs.form as HTMLFormElement).validate()) {
      try {
        const new_event = {
          ...this.event,
          timed: !this.allday,
          type: this.type,
          subtype: this.subtype && this.subtype.type,
        } as IEventCreate;

        let event: IEvent | undefined;
        if (this.editEvent?.id) {
          event = await dispatchUpdateEvent(this.$store, {id: this.editEvent.id, event: new_event});
        } else {
          event = await dispatchCreateEvent(this.$store, new_event);
        }
        this.$router.push(`/main/events/${event?.id}`);
      } catch (error) {
        // Error notification is already shown by apiCallNotify
        console.error('Failed to save event:', error);
      }
    } else {
      this.showValidationError = true;
    }
  }

  get editEvent() {
    return readOneEvent(this.$store)(+this.$router.currentRoute.params.id);
  }
  get isDonnerstagssitzung() {
    return (this.subtype?.type || this.event.subtype) === 'Donnerstagssitzung';
  }
  public reset() {
    if(this.editEvent) {
      this.event = {
        ...this.editEvent,
        participant_ids: this.editEvent.participants.map(u => u.id),
        leader_ids: this.editEvent.leaders.map(u => u.id),
      };
      this.allday = !this.event.timed;

      if (this.event.subtype) {
        this.subtype = (this.event.type === 'meeting' ? this.$common.MEETINGMAPPING : this.$common.SCHULUNGSMAPPING).find(o => o.type === this.event?.subtype) || { type: this.event.subtype, topics: [] };
        
      }

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