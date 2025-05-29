<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        Dokumentenlenkung
      </v-toolbar-title>
    </v-toolbar>
    <v-container class="mb-0 pb-0">
      <h6 class="text-overline mb-1" v-if="projects.length > 0">Schulungen</h6>
      <v-expansion-panels
        multiple
      >
        <v-expansion-panel v-for="event in trainings" :key="'e'+event.id">
          <v-expansion-panel-header>{{event.title}}({{event.subtype}})</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="text-caption">
              zuletzt bearbeitet
              <span v-if="event.last_updated_by">von <user-chip :user="event.last_updated_by" small></user-chip></span>
              <span v-if="event.date_last_updated">
                {{ $common.format(new Date(event.date_last_updated), `'am' dd.MM.yyyy 'um' HH:mm`) }}
              </span>
            </div>
            <v-row>
              <v-col>{{event.description}}</v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-card outlined>
                  
                  <v-list dense>
                    <div>
                      
                      <v-subheader>Leitung</v-subheader>
                      <user-list-item 
                        v-for="leader in event.leaders" 
                        :key="leader.id"
                        :user="leader"
                        dense
                      >
                      </user-list-item>
                    </div>
                    <div>
                      <v-divider inset></v-divider>
                      <v-subheader>Teilnemende</v-subheader>
                      <user-list-item 
                        v-for="participant in event.participants" 
                        :key="participant.id"
                        :user="participant"
                        dense
                      >
                      </user-list-item>
                    </div>
                  </v-list>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <file-manager v-model="event.files" :folder="event.versioned_folder" :labels="fileLabels" :readonly="true" class="full-height">
                </file-manager>
              </v-col>
              <v-col cols="12" md="4">
                <v-card outlined>
                  
                  <v-list dense>
                    <v-subheader>Agenda</v-subheader>
                    <v-list-item v-for="(element, index) in event.agenda" :key="index">
                      <b>{{ index + 1 }}</b> {{ element }}
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn outlined color="cctGreen" small @click="approveEvent(event.id)">
                Approve <v-icon color="cctGreen" x-small>mdi-check-decagram</v-icon> 
              </v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <v-container class="mb-0 pb-0">
      <h6 class="text-overline mb-1" v-if="projects.length > 0">Sitzungen</h6>
      <v-expansion-panels
        multiple
      >
        <v-expansion-panel v-for="event in meetings" :key="'e'+event.id">
          <v-expansion-panel-header>{{event.title}}({{event.subtype}})</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="text-caption">
              zuletzt bearbeitet
              <span v-if="event.last_updated_by">von <user-chip :user="event.last_updated_by" small></user-chip></span>
              <span v-if="event.date_last_updated">
                {{ $common.format(new Date(event.date_last_updated), `'am' dd.MM.yyyy 'um' HH:mm`) }}
              </span>
            </div>
            <v-row>
              <v-col>{{event.description}}</v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-card outlined>
                  
                  <v-list dense>
                    <div>
                      
                      <v-subheader>Leitung</v-subheader>
                      <user-list-item 
                        v-for="leader in event.leaders" 
                        :key="leader.id"
                        :user="leader"
                        dense
                      >
                      </user-list-item>
                    </div>
                    <div>
                      <v-divider inset></v-divider>
                      <v-subheader>Teilnemende</v-subheader>
                      <user-list-item 
                        v-for="participant in event.participants" 
                        :key="participant.id"
                        :user="participant"
                        dense
                      >
                      </user-list-item>
                    </div>
                  </v-list>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <file-manager v-model="event.files" :folder="event.versioned_folder" :labels="fileLabels" :readonly="true" class="full-height">
                </file-manager>
              </v-col>
              <v-col cols="12" md="4">
                <v-card outlined>
                  
                  <v-list dense>
                    <v-subheader>Agenda</v-subheader>
                    <v-list-item v-for="(element, index) in event.agenda" :key="index">
                      <b>{{ index + 1 }}</b> {{ element }}
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn outlined color="cctGreen" small @click="approveEvent(event.id)">
                Approve <v-icon color="cctGreen" x-small>mdi-check-decagram</v-icon> 
              </v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <v-container class="mb-0 pb-0">
      <h6 class="text-overline mb-1" v-if="projects.length > 0">Projekte</h6>
      <v-expansion-panels
        v-model="panel"
        multiple
      >
        <v-expansion-panel v-for="project in projects" :key="'p'+project.id">
          <v-expansion-panel-header>{{project.title}}({{$enum('ProjectTypeEnum',project.type)}})</v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="text-caption">
              zuletzt bearbeitet
              <span v-if="project.last_updated_by">von <user-chip :user="project.last_updated_by" small></user-chip></span>
              <span v-if="project.date_last_updated">
                {{ $common.format(new Date(project.date_last_updated), `'am' dd.MM.yyyy 'um' HH:mm`) }}
              </span>
            </div>
            <v-row >
              <v-col cols="12" sm="6" lg="3" v-if="project.project_start_date_actual && project.project_end_date_actual">
                <b>Zeitraum IST</b> {{$common.formatDateRange(project.project_start_date_actual,project.project_end_date_actual)}}
              </v-col>
              <v-col cols="12" sm="6" lg="3" v-if="project.project_start_date_expected && project.project_end_date_expected">
                <b>Zeitraum SOLL</b> {{$common.formatDateRange(project.project_start_date_expected,project.project_end_date_expected)}}
              </v-col>
              <v-col cols="12" sm="6" lg="3" v-if="project.proposal_date">
                <b>Angebotsabgabe</b> {{ $common.format(project.proposal_date, `'am' dd.MM.yyyy`) }}
              </v-col>
              <v-col cols="12" sm="6" lg="3" v-if="project.acceptance_date">
                <b>Angebotsannahme</b> {{ $common.format(project.acceptance_date, `'am' dd.MM.yyyy`) }}
              </v-col>
              <v-col cols="12" sm="6" lg="3" v-if="project.bt_amount_expected || project.bt_amount_actual">
                <b>BT-Umfang(Soll)</b>: {{project.bt_amount_expected}} <b>BT-Umfang(Ist)</b>: {{project.bt_amount_actual}}
              </v-col>
              <v-col cols="12" sm="6" lg="3" v-if="project.bt_amount_expected || project.bt_amount_actual">
                <b>Refernzfreigabe</b> {{$enum('ProjectReferenceStatusEnum',project.reference_status) || 'Kein Status'}}
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <p v-if="project.project_tender"><b>Ausschreibung </b>{{ $common.format(new Date(getdatefromtender(project.project_tender)), `'am' dd.MM.yyyy 'um' HH:mm`) }} </p>
                <p v-else><b>Ausschreibung </b> nicht verfügbar</p>
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <p><b>360 Grad Feedback </b>
                  <v-icon v-if="project.qm_feedback" color="cctGreen" >mdi-check-decagram</v-icon> 
                  <v-icon color="red" v-else>mdi-alert-decagram</v-icon>
                </p>
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <p><b>Kunde</b> {{project.customer_name}}</p>
              </v-col>
              <v-col cols="12" sm="6" lg="3">
                <p><b>KFB</b> {{$enum('KFBStatusEnum',project.kfb_status) || 'Kein Status'}} </p>
              </v-col>
              <v-col cols="12" sm="6" lg="3" v-if="project.kfb_not_sent_cause">
                <p><b>KFB nicht Versendet(Grund)</b>{{project.kfb_not_sent_cause}}</p>
              </v-col>
              <v-col cols="12" sm="6" lg="3" v-if="project.kfb_rejected_cause">
                <p><b>KFB nicht Abgelehnt(Grund)</b>{{project.kfb_rejected_cause}}</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined>
                  <v-list dense>
                    <div v-for="([role, projectUsers], index) in Object.entries(project.participants)" :key="role">
                      <v-divider v-if="index !== 0" inset></v-divider>
                      <v-subheader>{{$enum('ProjectRoleEnum', role)}}</v-subheader>
                      <user-list-item 
                        v-for="projectUser in projectUsers"
                        :key="projectUser.participant.id"
                        :user="projectUser.participant"
                        dense
                      >
                      </user-list-item>
                    </div>
                  </v-list>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <file-manager v-model="project.files" :folder="project.versioned_folder" :labels="fileLabels" :readonly="true" class="full-height">
                </file-manager>
              </v-col>
            </v-row>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn outlined color="cctGreen" small @click="approveProject(project.id)">
                Approve <v-icon color="cctGreen" x-small>mdi-check-decagram</v-icon> 
              </v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    <v-container class="mb-0 pb-0" v-for="i of this.$common.DOCUMENT_TYPES" :key="i.value">
      <h6 class="text-overline mb-1" v-if="documents.map(doc => doc.type).includes(i.value)">{{i.name}}</h6>
      <v-row >
        <v-col v-for="document of documents.filter(doc => doc.type === i.value)" :key="document.id" cols="12" md="6">
          <v-card >
            <v-card-title>{{document.title}}</v-card-title>
            <v-card-subtitle>
              <div class="text-caption">
                zuletzt bearbeitet
                <span v-if="document.last_updated_by">von <user-chip :user="document.last_updated_by" small></user-chip></span>
                <span v-if="document.date_last_updated">
                  {{ $common.format(new Date(document.date_last_updated), `'am' dd.MM.yyyy 'um' HH:mm`) }}
                </span>
              </div>
            </v-card-subtitle>
            <v-card-text>
              <p>{{document.description}}</p>
              <file-manager 
                :folder="document.versioned_folder" 
                v-model="document.files"
                :readonly="true">
              </file-manager>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outlined color="cctGreen" small @click="approveDocument(document.id)">
                Approve <v-icon color="cctGreen" x-small>mdi-check-decagram</v-icon> 
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router';
import { dispatchApproveProjects, dispatchGetUnapprovedDocuments, dispatchGetUnapprovedProjects ,dispatchApproveDocuments, dispatchGetUnapprovedEvents,dispatchApproveEvent } from '../store/actions';
import { readUnapprovedDocuments, readUnapprovedEvents, readUnapprovedProjects } from '../store/getters';
import UserChip from '@/components/user-chip/UserChip.vue';
import FileManager from '@/components/file-manager/FileManager.vue';
import UserListItem from '@/components/user-list-item/UserListItem.vue';
import { FILE_LABELS } from '@modules/projects/types';

@Component({
  components:{UserChip,FileManager,UserListItem}
})
export default class DokumentenlenkungView extends Vue {

  public fileLabels = FILE_LABELS;
  public panel =[];
  public panel2 =[];

  get documents() {
    return readUnapprovedDocuments(this.$store);
  }
  get projects(){
    return readUnapprovedProjects(this.$store);
  }
  get trainings(){
    return readUnapprovedEvents(this.$store).filter(event => event.type === 'training');
  }
  get meetings(){
    return readUnapprovedEvents(this.$store).filter(event => event.type === 'meeting');
  }

  public async approveProject(projectid:number){
    await dispatchApproveProjects(this.$store,projectid);
  }
  public async approveDocument(documentId:number){
    await dispatchApproveDocuments(this.$store,documentId);
  }
  public async approveEvent(eventId:number){
    await dispatchApproveEvent(this.$store,eventId);
  }

  public getdatefromtender(tender:any){
    if(tender){
      return tender.date_deadline
    }
    return new Date()
  }

  
  @Watch('$route', { immediate: true })
  public async onRouteChange(newRoute?: Route) {
    if (newRoute) {
      await dispatchGetUnapprovedDocuments(this.$store);
      await dispatchGetUnapprovedProjects(this.$store);
      await dispatchGetUnapprovedEvents(this.$store);
    }
  }

}
</script>

<style lang="scss">

.full-height{
  height: 100%;
}
.agenda-wrapper{
  border: 1px solid #999;
  padding: 10px;
}
  

.agenda-item{
  padding: 7px 25px;
  background: #eee;
  padding-left: 10px;
}
  

.flex-center{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
  


</style>