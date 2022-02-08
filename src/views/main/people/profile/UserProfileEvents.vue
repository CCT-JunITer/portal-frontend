<template>
  <div>
    <v-card outlined v-if="userProfile">
      <v-card-title>
        Pflichtschulungen
      </v-card-title>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="event in this.mandatoryEvents"
          :key="event.id"
        >
          <v-expansion-panel-header>
            {{ event.title }} - {{ formatDate(event.date) }}
            <template v-slot:actions>
              <v-icon v-if="(eventIsDone(event.date))" color="green">
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
            Beschreibung: {{ event.description }}
            <br/>
            <br/>
            <v-icon>
              mdi-school
            </v-icon>
            Trainer:innen:
            <span>
              {{ event.trainers.map(trainer => trainer.full_name).join(', ') }}
            </span> 
            <br />
            <v-icon>
              mdi-account-supervisor
            </v-icon>
            
            Teilnehmer:innen: 
            <span>
              {{ event.participants.map(participant => participant.full_name).join(', ') }}
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
          v-for="event in this.optionalEvents"
          :key="event.id"
        >
          <v-expansion-panel-header>
            {{ event.title }} - {{ formatDate(event.date) }}
            <template v-slot:actions>
              <v-icon v-if="(eventIsDone(event.date))" color="green">
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
            Beschreibung: {{ event.description }}
            <br/>
            <br/>
            <v-icon>
              mdi-school
            </v-icon>
            Trainer:innen:
            <span>
              {{ event.trainers.map(trainer => trainer.full_name).join(', ') }}
            </span> 
            <br />
            <v-icon>
              mdi-account-supervisor
            </v-icon>
            
            Teilnehmer:innen: 
            <span>
              {{ event.participants.map(participant => participant.full_name).join(', ') }}
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
import { readRouteUser } from '@/store/main/getters';
import { format, isAfter } from 'date-fns';
import { readEventsForRoute } from '@/store/event/getters';
import { dispatchGetEventsFor } from '@/store/event/actions';

@Component({})
export default class UserProfileEvents extends Vue {

  public eventIsDone(dateTimeStr: string) {
    const event_date = new Date(dateTimeStr);
    return isAfter(event_date, new Date());
  }

  get mandatoryEvents() {
    return this.events.filter(event => event.subtype == 'Pflichtschulung');
  }

  get optionalEvents() {
    return this.events.filter(event => event.subtype != 'Pflichtschulung');
  }

  get events() {
    return readEventsForRoute(this.$store)(this.$route);
  }

  async mounted() {
    await dispatchGetEventsFor(this.$store, Number(this.userProfile?.id));
  }

  public formatDate(date: string) {
    return format(new Date(date), 'dd.MM.yyyy HH:mm')
  }


  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }
}
</script>
