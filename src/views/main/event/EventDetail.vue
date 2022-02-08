<template>
  <v-container>
    <div>

      <div class="d-flex">
        <h1 class="text-h2 text--primary mb-3">{{this.event.title}}</h1>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          <v-btn color="cctOrange" outlined :to="{ name: 'event-edit', params: { id: this.event.id } }">
            <v-icon left>
              edit
            </v-icon>
            Schulung bearbeiten
          </v-btn>
        </div>
      </div>
      

      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Allgemeines</h2>
          <p class="text-body-2 text--secondary">
            Allgemeine Informationen zu diesem Event
          </p>
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
          <file-chip-group class="d-flex flex-wrap space-between" v-if="this.event.files">
            <file-chip :key="file" :filename="file" v-for="file in this.event.files.split(',')"></file-chip>
          </file-chip-group>
        </v-col>
      </v-row>
      <div v-if="isSuperuser">
        <v-divider class="my-5"></v-divider>
        <v-row>
          <v-col cols="12" md="4" class="px-5">
            <h2 class="text-h4 text--primary mb-3">Anmeldungen</h2>
            <p class="text-body-2 text--secondary">
              Anmeldungen
            </p>
          </v-col>
          <v-col cols="12" md="8">  
            <p v-if="this.eventApplications.length == 0">
              Noch keine Schulungsanmeldungen
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
          <h2 class="text-h4 text--primary mb-3">Trainer:innen</h2>
          <p class="text-body-2 text--secondary">
            Trainer:innen
          </p>
        </v-col>

        <v-col cols="12" md="8">  

          <v-list style="background-color: #FAFAFA;">

            <v-list-item
              v-for="trainer in this.event.trainers"
              :key="trainer.id"
            >
              <employee-profile-picture
                :employee="trainer"
                component="v-list-item-avatar"
                size="40"
              ></employee-profile-picture>

              <v-list-item-content>
                <v-list-item-title v-text="trainer.full_name"></v-list-item-title>
                <v-list-item-subtitle v-text="trainer.ressort"></v-list-item-subtitle>
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
import { Component, Vue } from 'vue-property-decorator';
import {
  readUserProfile,
} from '@/store/main/getters';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { format } from 'date-fns';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import { readEventsApplicationsFor, readRouteEvent } from '@/store/event/getters';
import { dispatchGetEventApplications, dispatchGetEvents, dispatchGetOneEvent, dispatchUpdateEventApplication } from '@/store/event/actions';
import FileChip from '@/components/file-chip/FileChip.vue';
import EventApplicationCard from '@/components/event-application/EventApplicationCard.vue';
import FileChipGroup from '@/components/file-chip/FileChipGroup.vue';
import { IEvent, IEventApplication, IEventApplicationStatus } from '@/interfaces';


@Component({
  components: { EmployeeProfilePicture, EmployeeCard, FileChip, EventApplicationCard, FileChipGroup },
})
export default class AdminUsers extends Vue {
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

  public async mounted() {
    if (+this.$route.params.id) {
      await dispatchGetOneEvent(this.$store, +this.$route.params.id)
      await dispatchGetEventApplications(this.$store, +this.$route.params.id);
    }
  }


  get eventDetails() {
    return [
      {
        name: 'Schulungsart',
        key: this.event?.subtype,
      },
      {
        name: 'Datum',
        key: format(new Date(String(this.event?.date_from)), 'dd.MM.yyyy HH:mm') + ' - ' + format(new Date(String(this.event?.date_to)), 'dd.MM.yyy HH:mm'),
      },
      {
        name: 'Thema',
        key: this.event?.topic,
      },
      {
        name: 'Beschreibung',
        key: this.event?.description,
      },
    ];
  }
}
</script>

<style scoped>


</style>