<template>
  <v-container v-if="this.event">
    <div>
      <h1 class="text-h2 text--primary mb-3">
        <v-icon v-if="this.event.approved" color="cctGreen" x-large>mdi-check-decagram</v-icon>
        {{this.event.title}}
      </h1>
      <v-divider class="my-5"></v-divider>
      <div class="d-flex align-center">
        <div>
          <div class="text-caption mb-2">
            erstellt von <user-chip :user="event.author" small></user-chip>
          </div>
          <div class="text-caption" v-if="event.last_updated_by">
            zuletzt bearbeitet von <user-chip :user="event.last_updated_by" small></user-chip> {{ $common.format(new Date(event.date_last_updated), `'am' dd.MM.yyyy 'um' HH:mm`) }}
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="cctOrange" outlined :to="{ name: 'event-edit', params: { id: this.event.id } }">
          <v-icon left>
            edit
          </v-icon>
          Event bearbeiten
        </v-btn>
      </div> 

      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Allgemeines</h2>
          <p class="text-body-2 text--secondary">
            Allgemeine Informationen zu diesem Event
          </p>
          <event-code-display :event="event"></event-code-display>
        </v-col>
        <v-col cols="12" md="8" class="px-5">  
          <v-row v-for="item in eventDetails" :key="item.name" class="my-3">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              {{ item.name }}
            </span>

            <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1">
              {{ item.key }}
            </span>
          </v-row>
          <v-row class="my-3" v-if="event.protocol">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              Protokollant:in
            </span>

            <div class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1">
              <user-chip :user="event.protocol"></user-chip>
            </div>
          </v-row>
          <v-row class="my-3" v-if="event.wms_link">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              WMS-Link
            </span>

            <a class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" :href="event.wms_link">
              {{ event.wms_link }}
            </a>
          </v-row>
          <v-row>
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              Agenda
            </span>

            <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1">
              <div 
                v-for="(element, index) in event.agenda"
                :key="index"
                class="rounded my-2"
              >
                <div class="flex-center">
                  <span class="agenda-item rounded">
                    <b>{{ index + 1 }}</b> {{ element }}
                  </span>
                </div>
              </div>
            </span>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Dokumente</h2>
          <p class="text-body-2 text--secondary">
            Dokumente zu diesem Event
          </p>
        </v-col>
        <v-col cols="12" md="8">  
          <file-manager v-model="this.event.files" :folder="this.event.versioned_folder" :labels="fileLabels" :readonly="true">
          </file-manager>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <div v-if="isSuperuser">
        <v-row>
          <v-col cols="12" md="4" class="px-5">
            <h2 class="text-h4 text--primary mb-3">Anmeldungen</h2>
            <p class="text-body-2 text--secondary">
              Anmeldungen
            </p>
          </v-col>
          <v-col cols="12" md="8">  
            <p v-if="this.eventApplications.length == 0">
              Noch keine Anmeldungen
            </p>
            <v-row v-else>
              <v-col cols="12" md="12" lg="6" xl="6" sm="12" class="px-5"
                     v-for="application in this.eventApplications"
                     :key="application.id"
              >
                <event-application-card :application="application" outlined>
                
                  <template v-slot:actions>
                    <div class="d-flex justify-center flex-column flex-sm-row justify-sm-space-around">
                      <v-btn
                        text
                        color="green"
                        small
                        @click="updateApplication(application, 'accepted')"
                      >
                        <v-icon left>
                          mdi-account-check
                        </v-icon>
                        annehmen
                      </v-btn>
                        
                      <v-btn
                        text
                        color="red"
                        small
                        @click="updateApplication(application, 'denied')"
                      >
                        <v-icon left>
                          mdi-account-cancel
                        </v-icon>
                        ablehnen
                      </v-btn>
                    
                      <v-btn
                        text
                        color="orange"
                        small
                        @click="updateApplication(application, 'waiting')"
                      >
                        <v-icon left>
                          mdi-account-clock
                        </v-icon>
                        Warteliste
                      </v-btn>
                    </div>
                  </template>
                </event-application-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <v-row>
          <v-col cols="12" md="4" class="px-5">
            <h2 class="text-h4 text--primary mb-3">Warteliste</h2>
            <p class="text-body-2 text--secondary">
              Warteliste
            </p>
          </v-col>
          <v-col cols="12" md="8"> 
            <p v-if="this.waitingApplications.length == 0">
              Die Warteliste ist leer
            </p> 
            <v-row>
              <v-col cols="12" md="12" lg="6" xl="6" sm="12" class="px-5"
                     v-for="application in this.waitingApplications"
                     :key="application.id"
              >
                <event-application-card :application="application" outlined>
                
                  <template v-slot:actions>
                    <div class="d-flex justify-center flex-column flex-sm-row justify-sm-space-around">
                      <v-btn
                        text
                        color="green"
                        small
                        @click="updateApplication(application, 'accepted')"
                      >
                        <v-icon left>
                          mdi-account-check
                        </v-icon>
                        annehmen
                      </v-btn>
                        
                      <v-btn
                        text
                        color="red"
                        small
                        @click="updateApplication(application, 'denied')"
                      >
                        <v-icon left>
                          mdi-account-cancel
                        </v-icon>
                        ablehnen
                      </v-btn>
                    </div>
                  </template>
                </event-application-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider class="my-5"></v-divider>
      </div>



      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Sitzungsleiter:innen</h2>
          <p class="text-body-2 text--secondary">
            Sizungsleiter:innen
          </p>
        </v-col>

        <v-col cols="12" md="8">  

          <v-list style="background-color: #FAFAFA;">

            <v-list-item
              v-for="leader in this.event.leaders"
              :key="leader.id"
            >
              <employee-profile-picture
                :employee="leader"
                component="v-list-item-avatar"
                size="40"
              ></employee-profile-picture>

              <v-list-item-content>
                <v-list-item-title v-text="leader.full_name"></v-list-item-title>
                <v-list-item-subtitle v-text="leader.ressort"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Teilnehmer:innen</h2>
          <p class="text-body-2 text--secondary">
            Teilnehmer:innen
          </p>
        </v-col>

        <v-col cols="12" md="8">  

          <v-list style="background-color: #FAFAFA;">

            <v-list-item
              v-for="participant in this.event.participants"
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
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  readUserProfile,
} from '@/store/main/getters';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { format } from 'date-fns';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import { readEventsApplicationsFor, readRouteEvent } from '@/store/event/getters';
import { dispatchGetEventApplications, dispatchGetOneEvent, dispatchUpdateEventApplication } from '@/store/event/actions';
import FileChip from '@/components/file-chip/FileChip.vue';
import EventApplicationCard from '@/components/event-application/EventApplicationCard.vue';
import { IEvent, IEventApplication, IEventApplicationStatus } from '@/interfaces';
import FileManager from '@/components/file-manager/FileManager.vue';
import { Route } from 'vue-router';
import EventCodeDisplay from './EventCodeDisplay.vue';
import UserChip from '@/components/user-chip/UserChip.vue';

@Component({
  components: { EmployeeProfilePicture, EmployeeCard, FileChip, EventApplicationCard, FileManager, EventCodeDisplay, UserChip },
})
export default class TrainingDetail extends Vue {
  public today = new Date();

  get event(): IEvent {
    return readRouteEvent(this.$store)(this.$route) as IEvent;
  }

  public get eventApplications() {
    // return this.event.applications.filter(application => application.status === 'in progress');
    return readEventsApplicationsFor(this.$store)(this.event.id)
      .filter(application => application.status === 'in progress');
  }



  public get waitingApplications() {
    // return this.event.applications.filter(application => application.status === 'waiting');
    return readEventsApplicationsFor(this.$store)(this.event.id)
      .filter(application => application.status === 'waiting');
  }

  get user() {
    return readUserProfile(this.$store);
  }

  public get isSuperuser() {
    return (
      this.user?.is_superuser ||
      readUserProfile(this.$store)?.id == this.event?.author.id
    );
  }


  public async updateApplication(application: IEventApplication, status: IEventApplicationStatus) {
    await dispatchUpdateEventApplication(this.$store, { application_id: application.id, application: { status } });
  }

  @Watch('$route', { immediate: true} )
  public async onRouteChange(newRoute: Route, oldRoute?: Route) {
    if (newRoute?.params.id !== oldRoute?.params.id && +newRoute.params.id) {
      await dispatchGetOneEvent(this.$store, +newRoute.params.id)
      await dispatchGetEventApplications(this.$store, +newRoute.params.id);
    }
  }

  get fileLabels() {
    if (this.event.type === 'training') {
      return ['Evaluationsauswertung', 'Schulungsmaterial', 'Teilnahmeliste']
    } else if(this.event.type === 'meeting') {
      return ['Präsentation', 'Protokoll'];
    }
  }




  get eventDetails() {
    return [
      {
        name: 'Art',
        key: this.event?.subtype,
      },
      {
        name: 'Datum',
        key: this.event?.timed ? this.$common.formatRange(this.event.date_from, this.event.date_to) : this.$common.format(new Date(this.event.date_from), 'dd.MM.yyyy')
      },
      this.event.type === 'training' && {
        name: 'Thema',
        key: this.event?.topic,
      },
      {
        name: 'Beschreibung',
        key: this.event?.description,
      },
    ].filter(c => c);
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

.agenda-wrapper 
  border: 1px solid #999
  padding: 10px

.agenda-item
  padding: 7px 25px
  background: #eee
  padding-left: 10px

.flex-center
  display: flex
  justify-content: space-between
  align-items: center

</style>