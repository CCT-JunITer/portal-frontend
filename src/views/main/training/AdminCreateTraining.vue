/* eslint-disable vue/html-indent */
<template>
  <v-container>



    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4 text--primary mb-3">Neue Schulung anlegen</h4>
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
            v-model="training_titel"
            class="input-lg"
            prepend-icon="mdi-format-title"
            required
            :rules="[$common.required]"            
          ></v-text-field>
          <!-- Woher kommt die Leertaste? -->

          <v-select
            label="Schulungsart"
            v-model ="training_type"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            :items="$common.SCHULUNGSART"
            :rules="[$common.required]"
          ></v-select>    
          <v-select
            label="Schulungsthema"
            v-model="training_topic"
            :items="$common.SCHULUNGSTHEMA"
            prepend-icon="mdi-collage"
            class="input-lg"
            required
            :rules="[$common.required]"
          ></v-select>         
          <v-textarea
            label="Beschreibung"
            v-model="training_description"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="Hier soll eine kurze Beschreibung der Schulung eingegeben werden."
            required
            :rules="[$common.required]"
          ></v-textarea>

          <date-picker-menu
            v-model ="training_date"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '2000-01-01',
              max: '2025-01-01'
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Datum"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required]"
              ></v-text-field>
            </template>
          </date-picker-menu>
          

          <v-menu
            class="input-lg"
            ref="menu"
            v-model="time_menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                icon
                class="input-lg"
                v-model="training_time"
                label="Picker in menu"
                prepend-icon="mdi-clock-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              color="cctBlue"
              class="input-lg"  
              v-if="time_menu"
              v-model="training_time"
              format="24hr"
              full-width
            ></v-time-picker>
          </v-menu>

          <v-text-field
            label="Externe Trainer:innen"
            v-model="training_external_trainers"
            prepend-icon="mdi-account-arrow-left"
            class="input-lg"
            persistent-hint
          ></v-text-field>

          

          <v-autocomplete
            v-model="training_trainers"
            :items="this.userProfiles"
            filled
            chips
            class="input-lg"
            prepend-icon="mdi-school"
            label="Trainer:innen"
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
            v-model="training_participants"
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
import { Vue, Component} from 'vue-property-decorator';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { dispatchGetUsers } from '@/store/main/actions';
import { readAdminOneTraining, readAdminUsers,} from '@/store/main/getters';
import { ITrainingCreate } from '@/interfaces';
import { dispatchCreateTraining, dispatchUpdateTraining } from '@/store/admin/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';

@Component({
  components: {VueTelInputVuetify, DatePickerMenu, EmployeeProfilePicture},
})
export default class AdminViewTraining extends Vue {

  public time_menu = false;


  public valid = false;
  public training_titel = '';
  public training_type = '';
  public training_is_membership_progression = true;
  public training_topic = '';
  public training_description = ''; 
  public training_date = '';
  public training_time = '';
  public training_wms_link = 'https://wms.cct-ev.de/node/';
  public training_external_trainers = '';
  public training_trainers: number[] = [];
  public training_participants: number[] = [];


  get userProfiles() {
    return readAdminUsers(this.$store);
  }

  get trainingDate() {
    return this.training_date + 'T' + this.training_time;
  }

  public async mounted() {
    this.reset();
    await dispatchGetUsers(this.$store);
    this.valid = false;
  }
  public removeTrainer(item) {
    const index = this.training_trainers.indexOf(item.id);
    if (index >= 0) this.training_trainers.splice(index, 1);
  }

  public removeParticipant(item) {
    const index = this.training_participants.indexOf(item.id);
    if (index >= 0) this.training_participants.splice(index, 1);
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const new_training: ITrainingCreate = {
        title: this.training_titel,
        type: this.training_type,
        is_membership_progression: this.training_is_membership_progression,
        topic: this.training_topic,
        description: this.training_description,
        date: this.trainingDate,
        wms_link: this.training_wms_link,
        external_trainers: this.training_external_trainers,
        trainer_ids: this.training_trainers,
        participant_ids: this.training_participants,
      };

      if(this.editTraining?.id) {
        await dispatchUpdateTraining(this.$store, {id: this.editTraining.id, training: new_training});
      }
      else {
        await dispatchCreateTraining(this.$store, new_training);
      }
      this.$router.push('/main/admin/training');
      
    }
  }

  get editTraining() {
    return readAdminOneTraining(this.$store)(+this.$router.currentRoute.params.id);
  }
  public reset() {
    if(this.editTraining) {

      const trainer_ids: number[] = this.editTraining.trainers.map(trainer => trainer.id);
      const participant_ids: number[] = this.editTraining.participants.map(participant => participant.id);
      const date_only = this.editTraining.date.split('T')[0];
      const time = this.editTraining.date.split('T')[1].substring(0,5);

      this.training_titel = this.editTraining.title;
      this.training_type = this.editTraining.type;
      this.training_is_membership_progression = this.editTraining.is_membership_progression;
      this.training_topic = this.editTraining.topic;
      this.training_description = this.editTraining.description;
      this.training_date = date_only
      this.training_time = time;      
      this.training_wms_link = this.editTraining.wms_link;
      this.training_external_trainers = this.editTraining.external_trainers;
      this.training_trainers = trainer_ids;
      this.training_participants = participant_ids;
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>