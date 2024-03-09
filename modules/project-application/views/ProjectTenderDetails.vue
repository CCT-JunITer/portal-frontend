<template>
  <v-container v-if="projectTender">
    <project-tender-detail-component :projectTender="projectTender">
      <template v-slot:actions>
        <v-btn outlined color="cctPurple" class="ma-2" dark @click="createProjectCast()" v-if="hasCastPermission()">
          Besetzen
        </v-btn>
        <v-btn outlined color="cctGreen" class="ma-2" :to="{ name: 'project-tender-edit', params: { id: `${projectTender.id}`} }" v-if="hasTenderPermission()">
          Bearbeiten          
        </v-btn>
        <v-btn depressed color="cctBlue" dark class="ma-2" large @click="createApplication()" v-if="!projectTender.is_deadline_passed">
          Bewerben
        </v-btn>
      </template>
    </project-tender-detail-component>

    <template v-if="projectApplications !== null && hasApplicationPermission()">
      <v-divider class="my-5"></v-divider>

      <v-row class="mt-5">
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Bewerbungen</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">
          <v-card outlined>
            <project-cast-compare-dialog :applications="comparingApplications" :projectTender="projectTender" v-model="comparing"></project-cast-compare-dialog>

            <project-application-compare-toolbar 
              :compareApplications.sync="comparingApplications" 
              :projectTender="projectTender" 
              :projectApplications="projectApplications"
              flat
              @compare="comparing = true"
            >
            </project-application-compare-toolbar> 

            <v-list color="white">
              <project-application-list-item
                v-for="application in projectApplications" 
                :key="application.id"
                :projectApplication="application"
              >
                <template v-slot:actions>
                  <v-checkbox @change="changeComparing($event, application)" :input-value="!!comparingApplications.find(a => a.id === application.id)">Vergleichen</v-checkbox>
                </template>
              </project-application-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
  <loading-page v-else></loading-page>
</template>

<script lang="ts">
import UserChip from '@/components/user-chip/UserChip.vue';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router';
import { dispatchCreateProjectApplication, dispatchCreateProjectCast, dispatchGetProjectApplicationsFor, dispatchGetProjectTender } from '../store/actions';
import { readRouteProjectApplicationsFor, readRouteProjectTender } from '../store/getters'
import ViewComponent from '@/components/editor/ViewComponent.vue';
import ProjectApplicationListItem from '../components/ProjectApplicationListItem.vue';
import { ProjectApplication } from '../types';
import ProjectApplicationCompareToolbar from './application/ProjectApplicationCompareToolbar.vue';
import ProjectCastCompareDialog from './casting/ProjectCastCompareDialog.vue';
import { formatDistanceStrict } from 'date-fns';
import ProjectTenderDetailComponent from './tender/ProjectTenderDetailComponent.vue';
import { readHasAnyPermission } from '@/store/main/getters';

@Component({
  components: { UserChip, ViewComponent, ProjectApplicationListItem, ProjectApplicationCompareToolbar, ProjectCastCompareDialog, ProjectTenderDetailComponent },
})
export default class ProjectApplicationDetails extends Vue {

  public formatDistanceStrict = formatDistanceStrict;
  public comparingApplications: ProjectApplication[] = [];
  public comparing = false;

  changeComparing(event: boolean, application: ProjectApplication) {
    if (event) {
      this.comparingApplications.push(application);
    } else {
      this.comparingApplications = this.comparingApplications.filter(a => a.id !== application.id);
    }
  }


  public get projectTender() {
    return readRouteProjectTender(this.$store)(this.$route);
  }

  public hasApplicationPermission() {
    return readHasAnyPermission(this.$store)(['portal.project-application.admin']);
  }

  public hasTenderPermission() {
    return readHasAnyPermission(this.$store)(['portal.project-tender.create']);
  }

  public hasCastPermission() {
    return readHasAnyPermission(this.$store)(['portal.project-tender.cast']);
  }

  public get projectApplications() {
    return readRouteProjectApplicationsFor(this.$store)(+this.$route.params?.id);
  }

  @Watch('$route', { immediate: true })
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params?.id && newRoute?.params?.id !== oldRoute?.params?.id) {
      dispatchGetProjectTender(this.$store, +newRoute.params.id);
      this.hasApplicationPermission() && dispatchGetProjectApplicationsFor(this.$store, +newRoute.params.id);
    }
  }

  public async createApplication() {
    const application = await dispatchCreateProjectApplication(this.$store, { project_tender_id: this.projectTender!.id, role: 'worker' });
    this.$router.push({ name: 'project-application-edit', params: { id: `${application.id}`}});
  }

  public async createProjectCast() {
    const projectCast = await dispatchCreateProjectCast(this.$store, { project_tender_id: this.projectTender!.id });
    this.$router.push({ name: 'project-cast-edit', params: { id: `${projectCast.id}`}});
  }
}
</script>

<style lang="scss">

</style>