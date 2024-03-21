<template>
  <v-container v-if="projectCasts && projectTender" class="project-tender-cast">
    <v-form
      v-model="valid"
      ref="form"
    >
      <div class="d-flex">
        <div class="flex">
          <div class="text-subtitle">Finale Auswahl für</div>
          <h1 class="text-h2 text--primary mb-3">
            {{ projectTender.title }}
          </h1>
          <user-chip :user="projectTender.author"></user-chip>
        </div>
        <div>
          <v-btn color="cctGreen" outlined class="ma-2" @click="createProject" :disabled="!valid">
            finale Auswahl in neues Projekt übernehmen
          </v-btn>
        </div>
      </div>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Projektteambesetzung</h4>
          <p class="text-body-2 text--secondary">Erstelle einen Vorschlag für die finale Auswahl</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card>
            <project-cast-compare-dialog :applications="comparingApplications" :projectTender="projectTender" v-model="comparing"></project-cast-compare-dialog>

            <project-application-compare-toolbar 
              :compareApplications.sync="comparingApplications"
              :filters.sync="projectApplicationStatusEnumFilter"
              :projectApplications="projectApplications"
              :projectTender="projectTender"
              flat
              @compare="comparing = true"
            >
            </project-application-compare-toolbar> 
          </v-card>

          <v-card>
            <v-simple-table v-if="extendedProjectCasts">
              <thead>
                <tr>
                  <th style="width: 0;"></th>
                  <th v-for="cast in projectCasts" :key="cast.id">
                    <user-chip :user="cast.author" @click="() => {}"></user-chip>
                  </th>
                  <th>
                    Finale Auswahl
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="role in [''].concat(projectRoles)" :key="role">
                  <td class="vertical-text">
                    {{ $enum('ProjectRoleEnum', role) || 'nicht besetzt' }}
                    <template v-if="role">
                      ({{ finalSelection[role].length }}/{{ projectTender.needed_project_roles_counts[role] || 0 }})
                    </template>
                    <template v-else>
                      ({{ unassignedProjectApplications.length || 0 }})
                    </template>
                  </td>
                  <td :colspan="extendedProjectCasts.length" v-if="!role">
                    <v-list class="list">
                      <draggable class="list-group" v-model="unassignedProjectApplications" :group="{ name: 'people', pull: 'clone', put: 'false'}">
                        <project-application-list-item
                          class="list-group-item"
                          :data-id="application.project_application_id"
                          v-for="application in unassignedProjectApplications" 
                          :key="application.project_application_id"
                          :projectApplication="application.project_application"
                        >
                          <template v-slot:actions>
                            <v-checkbox @change="changeComparing($event, application.project_application)" :input-value="!!comparingApplications.find(a => a.id === application.project_application_id)">Vergleichen</v-checkbox>
                          </template>
                        </project-application-list-item>
                      </draggable>
                    </v-list>
                  </td>
                  <template v-else>
                    <td v-for="(cast, i) in extendedProjectCasts" :key="cast.id">
                      <v-list class="list">
                        <draggable class="list-group" v-model="cast.cast_applications[role]" :group="{ name: 'people', pull: 'clone', put: 'false'}">
                          <project-application-list-item
                            class="list-group-item"
                            :data-id="application.project_application_id"
                            v-for="application in filteredProjectCastsApplications[i][role]" 
                            :key="application.project_application_id"
                            :projectApplication="application.project_application"
                          >
                            <template v-slot:actions>
                              <v-checkbox @change="changeComparing($event, application.project_application)" :input-value="!!comparingApplications.find(a => a.id === application.project_application_id)">Vergleichen</v-checkbox>
                            </template>
                          </project-application-list-item>
                        </draggable>
                      </v-list>
                    </td>
                  </template>

                  <td class="final-td">
                    <v-list class="list" v-if="role">
                      <draggable class="list-group" v-model="finalSelection[role]" :group="{ name: 'people', put: canPut}">
                        <project-application-list-item
                          class="list-group-item"
                          :data-id="application.project_application_id"
                          v-for="application in finalSelection[role]"
                          :key="application.project_application_id"
                          :projectApplication="application.project_application"
                        >
                          <template v-slot:actions>
                            <v-btn icon @click="removeFromFinalSelection(role, application)">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </template>
                        </project-application-list-item>
                      </draggable>
                    </v-list>
                    <v-list class="list" v-else>
                      <project-application-list-item
                        class="list-group-item"
                        v-for="application in finalUnassignedProjectApplications" 
                        :key="application.project_application_id"
                        :projectApplication="application.project_application">
                      </project-application-list-item>
                    </v-list>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import UserChip from '@/components/user-chip/UserChip.vue';
import ProjectApplicationListItem from '@modules/project-application/components/ProjectApplicationListItem.vue';
import { dispatchGetProjectApplicationsFor, dispatchGetProjectCast, dispatchGetProjectCastsFor, dispatchGetProjectTender } from '@modules/project-application/store/actions';
import { readRouteProjectApplicationsFor, readRouteProjectCastsFor, readRouteProjectTender } from '@modules/project-application/store/getters';
import { ProjectApplication, ProjectApplicationStatusEnum, ProjectCast, ProjectCastParticipant } from '@modules/project-application/types';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router';
import ProjectApplicationCompareToolbar from '../application/ProjectApplicationCompareToolbar.vue';
import ProjectCastCompareDialog from './ProjectCastCompareDialog.vue';
import Draggable from 'vuedraggable'
import { dispatchCreateProject } from '@modules/projects/store/actions';
import { Project, ProjectCreate, ProjectUser } from '@modules/projects/types';

@Component({
  components: {
    UserChip,
    ProjectApplicationCompareToolbar,
    ProjectCastCompareDialog,
    ProjectApplicationListItem,
    Draggable
  }
})
export default class ProjectTenderCast extends Vue {

  public valid = false;
  public comparingApplications: ProjectApplication[] = [];
  public finalSelection: { [role: string]: ProjectCastParticipant[] } = {};
  public comparing = false;
  public projectApplicationStatusEnumFilter: ProjectApplicationStatusEnum[] = [];
  public extendedProjectCasts: ProjectCast[] | null = null;
  public unassignedProjectApplications: ProjectCastParticipant[] | null = [];

  changeComparing(event: boolean, application: ProjectApplication) {
    if (event) {
      this.comparingApplications.push(application);
    } else {
      this.comparingApplications = this.comparingApplications.filter(a => a.id !== application.id);
    }
  }

  public canPut(to, from, dragEl, event) {
    for (let i = 0; i < to.el.children.length; i++) { 
      if (to.el.children[i].getAttribute('data-id') === dragEl.getAttribute('data-id')) {
        return false
      }
    }
    return true
  }

  public removeFromFinalSelection(role: string, application: ProjectCastParticipant) {
    this.finalSelection[role] = this.finalSelection[role].filter(a => a.project_application_id !== application.project_application_id);
  }

  @Watch('projectApplications', { immediate: true })
  @Watch('projectCasts', { immediate: true })
  public updateProjectCasts() {
    
    this.extendedProjectCasts = this.projectCasts?.map(cast => {
      const newProjectApplications = { ...cast.cast_applications };
      // make sure that all project roles are present in the project applications
      Object.keys(this.projectTender!.needed_project_roles_counts).forEach(projectRole => newProjectApplications[projectRole] = newProjectApplications[projectRole] || [])

      return {
        ...cast,
        cast_applications: newProjectApplications,
      };
    }) || null;
    
    this.unassignedProjectApplications = this.projectApplications?.filter(application => 
      !this.extendedProjectCasts?.flatMap(cast => Object.values(cast.cast_applications)).flat().find(castApplication => castApplication.project_application_id === application.id)
    ).map(application => ({project_application_id: application.id, project_application: application})) || [];

    this.finalSelection = Object.fromEntries((this.extendedProjectCasts || []).flatMap(cast => Object.keys(cast.cast_applications)).map(role => [role, []]));
  }

  public get projectRoles() {
    return Array.from(new Set(this.extendedProjectCasts?.flatMap(cast => Object.keys(cast.cast_applications))))
  }

  public get filteredProjectCastsApplications() {
    if (!this.projectApplicationStatusEnumFilter.length) {
      return this.extendedProjectCasts?.map(cast => cast.cast_applications);
    }
    const filterCast = (cast: ProjectCast) => Object.fromEntries(Object.entries(cast.cast_applications || {})
      .map(([role, applications]) => ([role, applications.filter(application => this.projectApplicationStatusEnumFilter.includes(application.project_application.status))]))
    )

    return this.extendedProjectCasts?.map(filterCast);
  }

  public get finalUnassignedProjectApplications(): ProjectCastParticipant[] {
    return this.projectApplications?.filter(application => !Object.values(this.finalSelection).flatMap(c => c).find(a => a.project_application_id === application.id))
      .map(application => ({ project_application: application, project_application_id: application.id })) || [];
  }


  @Watch('$route', { immediate: true })
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params?.id && newRoute?.params?.id !== oldRoute?.params?.id) {
      await dispatchGetProjectTender(this.$store, +newRoute.params.id);
      await dispatchGetProjectCastsFor(this.$store, +newRoute.params.id);
      await dispatchGetProjectApplicationsFor(this.$store, +newRoute.params.id);
    }
  }

  public get projectTender() {
    return readRouteProjectTender(this.$store)(this.$route);
  }

  public get projectCasts() {
    return readRouteProjectCastsFor(this.$store)(this.$route);
  }

  public get projectApplications() {
    return readRouteProjectApplicationsFor(this.$store)(+this.$route.params.id);
  }

  


  public async createProject() {
    if (!this.projectTender) {
      return;
    }
    const project_create: Partial<Project> = {
      project_tender_id: this.projectTender.id,
      title: this.projectTender.title,
      type: this.projectTender.type,
      description: this.projectTender.description,
      participants: Object.fromEntries(Object.entries(this.finalSelection).map(([role, applications]) => [role, applications.map(a => ({ role, participant: a.project_application.participant } as ProjectUser))])),
      status: 'running',
      bt_amount_expected: this.projectTender.max_bt,
      bt_rate: this.projectTender.bt_rate,
      project_start_date_expected: this.projectTender.project_start_date_expected,
      project_end_date_expected: this.projectTender.project_end_date_expected,
    }
    this.$router.push({ name: 'project-create', params: { from: JSON.stringify(project_create) } });  
  }
  

}
</script>

<style lang="scss">
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  height: 100%;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

.project-tender-cast {
  .final-td {
    background-color: #f5f5f5;
  }

  .vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  .list {
    height: 100%;
    background: none;
  }

  td {
    height: unset!important;
    padding: 8px!important;
    background: white;
  }

  table {
    height: 1px;
    width: 100%;
    table-layout: fixed;
    min-width: 1000px;
    overflow-y: auto;
  }
}
</style>