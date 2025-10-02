<template>
  <v-container v-if="projectCast && projectTender">
    <v-form
      v-model="valid"
      ref="form"
    >
      <div class="d-flex">
        <div class="flex">
          <div class="text-subtitle">Projektbesetzung für</div>
          <h1 class="text-h2 text--primary mb-3">
            {{ projectTender.title }}
          </h1>
          <user-chip :user="projectTender.author"></user-chip>
        </div>
        <div>
          <v-btn color="cctPurple" dark class="ma-2" large :to="{ name: 'project-tender-cast', params: { id: projectTender.id }}">
            Projektbesetzung vergleichen
          </v-btn>
          <v-btn color="primary" class="ma-2" large @click="submit" :disabled="!valid">
            speichern
          </v-btn>
        </div>
      </div>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" lg="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Projektteambesetzung</h4>
          <p class="text-body-2 text--secondary">Erstelle einen Vorschlag für die finale Auswahl</p>
        </v-col>
        <v-col cols="12" lg="8">
          <v-card
            class="mx-auto"
            outlined
          >
            <project-cast-compare-dialog :applications="comparingApplications" :projectTender="projectTender" v-model="comparing"></project-cast-compare-dialog>

            <project-application-compare-toolbar 
              :compareApplications.sync="comparingApplications"
              :filters.sync="projectApplicationStatusEnumFilter"
              :projectApplications="projectApplications"
              flat
              @compare="comparing = true"
            >
            </project-application-compare-toolbar> 

            <v-divider></v-divider>
          
            <div class="container">
              <div class="row g-3">
                <div class="col-12 col-md-6" v-for="role in Object.keys(filteredProjectCasts)" :key="role" style="min-width: 300px;">
                  <v-card outlined>
                    <v-list v-if="projectCast">
                      <v-subheader>{{ $enum('ProjectRoleEnum', role) || 'Nicht besetzt' }} ({{ projectCast.cast_applications[role].length }}{{ projectTender.needed_project_roles_counts[role] ? ('/' + projectTender.needed_project_roles_counts[role]) : '' }})</v-subheader>
                      <draggable class="list-group" v-model="projectCast.cast_applications[role]" group="people">
                        <project-application-list-item
                          class="list-group-item"
                          v-for="application in filteredProjectCasts[role]" 
                          :key="application.project_application_id"
                          :projectApplication="application.project_application"
                        >
                          <template v-slot:actions>
                            <v-checkbox @change="changeComparing($event, application.project_application)" :input-value="!!comparingApplications.find(a => a.id === application.project_application_id)">Vergleichen</v-checkbox>
                          </template>
                        </project-application-list-item>
                      </draggable>
                    </v-list>
                  </v-card>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import UserChip from '@/components/user-chip/UserChip.vue';
import Draggable from 'vuedraggable'
import { dispatchCreateProjectCast, dispatchGetProjectApplicationsFor, dispatchGetProjectCast, dispatchUpdateProjectCast } from '@modules/project-application/store/actions';
import { readRouteProjectApplicationsFor, readRouteProjectCast } from '@modules/project-application/store/getters';
import { ProjectApplication, ProjectApplicationStatusEnum, ProjectCast, ProjectCastCreate, ProjectCastParticipant } from '@modules/project-application/types';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router';
import ProjectApplicationListItem from '@modules/project-application/components/ProjectApplicationListItem.vue';
import ProjectCastCompareDialog from './ProjectCastCompareDialog.vue';
import ProjectApplicationCompareToolbar from '../application/ProjectApplicationCompareToolbar.vue';

@Component({
  components: {
    UserChip,
    ProjectApplicationListItem,
    ProjectCastCompareDialog,
    Draggable,
    ProjectApplicationCompareToolbar,
  },
})
export default class ProjectCastEdit extends Vue {
  public projectCast: ProjectCast | null = null;
  public valid = false;
  public comparingApplications: ProjectApplication[] = [];
  public comparing = false;
  public projectApplicationStatusEnumFilter: ProjectApplicationStatusEnum[] = this.$enums('ProjectApplicationStatusEnum').map(e => e.value).filter(c => c !== 'draft') as ProjectApplicationStatusEnum[];

  changeComparing(event: boolean, application: ProjectApplication) {
    if (event) {
      this.comparingApplications.push(application);
    } else {
      this.comparingApplications = this.comparingApplications.filter(a => a.id !== application.id);
    }
  }

  public get filteredProjectCasts() {
    if (!this.projectApplicationStatusEnumFilter.length) {
      return this.projectCast?.cast_applications || {};
    }
    return Object.fromEntries(Object.entries(this.projectCast?.cast_applications || {})
      .map(([role, applications]) => ([role, applications.filter(application => this.projectApplicationStatusEnumFilter.includes(application.project_application.status))]))
    )
  }


  public get projectTender() {
    return this.editProjectCast?.project_tender;
  }

  public get projectApplications() {
    return readRouteProjectApplicationsFor(this.$store)(this.projectTender!.id)
  }

  public get editProjectCast() {
    return readRouteProjectCast(this.$store)(this.$route);
  }

  @Watch('$route', { immediate: true })
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params?.id && newRoute?.params?.id !== oldRoute?.params?.id) {
      const projectCast = await dispatchGetProjectCast(this.$store, +newRoute.params.id);
      await dispatchGetProjectApplicationsFor(this.$store, projectCast.project_tender_id);
      this.reset();
    }
  }

  public reset() {
    if (this.editProjectCast) {
      const newProjectApplications = {'': [] as ProjectCastParticipant[], ...this.editProjectCast.cast_applications };
      // make sure that all project roles are present in the project applications
      Object.keys(this.projectTender!.needed_project_roles_counts).forEach(projectRole => newProjectApplications[projectRole] = newProjectApplications[projectRole] || [])

      // add all project applications that are not assigned to a project role
      this.projectApplications?.forEach((projectApplication) => {
        if(!Object.values(newProjectApplications).flatMap(c => c).find(application => application.project_application_id === projectApplication.id)) {
          newProjectApplications[''] = [...(newProjectApplications[''] || []), { project_application_id: projectApplication.id, project_application: projectApplication}]; 
        }
      })

      this.projectCast = {
        ...this.editProjectCast,
        cast_applications: newProjectApplications,
      };
    }
  }

  public async submit() {
    if (!this.projectCast) return;
    if ((this.$refs.form as HTMLFormElement).validate()) {
      try {
        const newProjectCast: ProjectCastCreate = {
          ...this.projectCast, 
          applications_ids: Object.fromEntries(Object.entries(this.projectCast.cast_applications)
            .filter(([k, _]) => !!k)
            .map(([k,v]) => [k, v.map(application => application.project_application_id)])
          ) 
        };
        let projectCast: ProjectCast | undefined;
        if (this.editProjectCast?.id) {
          projectCast = await dispatchUpdateProjectCast(this.$store, {id: this.editProjectCast.id, data: newProjectCast});
        } else {
          projectCast = await dispatchCreateProjectCast(this.$store, newProjectCast);
        }
        this.reset();
      } catch (error) {
        // Error notification is already shown by apiCallNotify
        console.error('Failed to save project cast:', error);
      }
    }
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
  min-height: 100px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}
</style>