<template>
  <div>
    <v-card outlined v-if="userProfile">
      <v-card-title>
        Pflichtschulungen
      </v-card-title>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="training in this.mandatoryTrainings"
          :key="training.id"
        >
          <v-expansion-panel-header>
            {{ training.title }} - {{ formatDate(training.date) }} {{ formatTime(training.date) }}
            <template v-slot:actions>
              <v-icon v-if="(trainingIsDone(training.date))" color="green">
                mdi-check
              </v-icon>
              <v-icon v-else color="cctGrey">
                mdi-calendar
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-icon>
              mdi-text
            </v-icon>
            Beschreibung: {{ training.description }}
            <br/>
            <br/>
            <v-icon>
              mdi-school
            </v-icon>
            Trainer:innen:
            <span>
              {{ training.trainers.map(trainer => trainer.full_name).join(',') }}
            </span> 
            <br />
            <v-icon>
              mdi-account-supervisor
            </v-icon>
            
            Teilnehmer:innen: 
            <span>
              {{ training.participants.map(participant => participant.full_name).join(',') }}
            </span>  
            <br/>
            <br/>
            <v-spacer></v-spacer>
          </v-expansion-panel-content>
        </v-expansion-panel>
        


      </v-expansion-panels>
    </v-card>
    <v-card outlined v-if="userProfile">
      <v-card-title>
        Zusatzschulungen
      </v-card-title>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="training in this.optionalTrainings"
          :key="training.id"
        >
          <v-expansion-panel-header>
            {{ training.title }} - {{ formatDate(training.date) }} {{ formatTime(training.date) }}
            <template v-slot:actions>
              <v-icon v-if="(trainingIsDone(training.date))" color="green">
                mdi-check
              </v-icon>
              <v-icon v-else color="cctGrey">
                mdi-calendar
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-icon>
              mdi-text
            </v-icon>
            Beschreibung: {{ training.description }}
            <br/>
            <br/>
            <v-icon>
              mdi-school
            </v-icon>
            Trainer:innen:
            <span>
              {{ training.trainers.map(trainer => trainer.full_name).join(',') }}
            </span> 
            <br />
            <v-icon>
              mdi-account-supervisor
            </v-icon>
            
            Teilnehmer:innen: 
            <span>
              {{ training.participants.map(participant => participant.full_name).join(',') }}
            </span>  
            <br/>
            <br/>
            <v-spacer></v-spacer>
          </v-expansion-panel-content>
        </v-expansion-panel>
        
        


      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readPersonalTrainings, readRouteUser } from '@/store/main/getters';
import { dispatchGetPersonalTrainings } from '@/store/main/actions';

@Component({})
export default class UserProfileTrainings extends Vue {

  public trainingIsDone(dateTimeStr) {
    const training_date = new Date(dateTimeStr);
    const today = new Date();
    return training_date <= today;
  }

  get mandatoryTrainings() {
    return this.trainings.filter(training => training.type == 'Pflichtschulung');
  }

  get optionalTrainings() {
    return this.trainings.filter(training => training.type != 'Pflichtschulung');
  }

  get trainings() {
    return readPersonalTrainings(this.$store);
  }

  mounted() {
    dispatchGetPersonalTrainings(this.$store, Number(this.userProfile?.id));
  }

  public formatDate(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('de-DE');
  }

  public formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('de-DE').slice(0,5);
  }

  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }
}
</script>
