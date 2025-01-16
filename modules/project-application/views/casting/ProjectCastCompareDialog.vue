<template>
  <v-dialog v-model="dialog" scrollable transition="dialog-bottom-transition" class="mx-0">
    <v-card>
      <v-toolbar
        dark
        color="cctBlue"
        class="toolbar"
      >
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Vergleich</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <div class="overflow-x-auto ma-3 d-flex justify-center">
          <div class="d-flex flex-column ga-3">
            <div class="filter-container">
              <v-select
                multiple
                label="Rollen"
                hint="Filtere nach Rollen"
                persistent-hint
                v-model="selectedRoles"
                :items="allRoles"
                chips
                clearable
                deletable-chips
                class="role-filter"
              >
                <template v-slot:prepend-item>
                  <v-list-item
                    ripple
                    @mousedown.prevent
                    @click="toggle"
                  >
                    <v-list-item-action>
                      <v-icon :color="selectedRoles.length > 0 ? 'indigo darken-4' : ''">
                        {{ selectedRoles.length > 0 ? 'mdi-checkbox-outline' : 'mdi-checkbox-blank-outline' }}
                      </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>
                        Alle Selektieren
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider class="mt-2"></v-divider>
                </template>
              </v-select>
            </div>
            <table v-if="filteredApplications.length > 0">
              <thead>
                <tr>
                  <th>Bewerber:in</th>
                  <th v-for="application in filteredApplications" :key="application.id">
                    <div>
                      <project-application-list-item :project-application="application"></project-application-list-item>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                </tr>
                <tr v-for="question in sortedQuestions" :key="question.id">
                  <td>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div class="text-body-2" v-on="on" v-bind="attrs">
                          {{ question.title }}
                        </div>
                      </template>
                      <span>
                        <view-component :value="question.description">
                        </view-component>
                      </span>
                    </v-tooltip>
                  </td>
                  <td v-for="application in applications" :key="application.id">
                    <div v-if="application.status != 'interest'" class="pre-formatted text-body-2">{{ getAnswer(application, question.id) }}</div>
                  </td>
                </tr>
                <tr>
                  <td>Dateien</td>
                  <td v-for="application in applications" :key="application.id">
                    <file-manager
                      v-model="application.files"
                      :folder="application.versioned_folder"
                      :readonly="true"
                      :noManager="true"
                    >
                    </file-manager>
                  </td>
                </tr>
                <tr v-for="week in weeks" :key="week.value">
                  <td>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div class="text-body-2 nowrap ml-5" v-on="on" v-bind="attrs">
                          {{ week.label }}
                        </div>
                      </template>
                      <span>
                        {{ $common.format(week.start, 'dd.MM.yyyy') }} - {{ $common.format(week.end, 'dd.MM.yyyy') }}
                      </span>
                    </v-tooltip>
                  </td>
                
                  <td v-for="application in applications" :key="application.id">
                    <div class="text-body-2">
                      {{ $common.decimal2Text(application.available_time && (application.available_time[week.value]), 1) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Anmerkungen</td>
                  <td v-for="application in applications" :key="application.id">
                    <div class="pre-formatted text-body-2">
                      {{  application.available_time['Anmerkungen'] || "" }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <v-alert type="info" outlined>
                Keine Bewerbungen vorhanden oder keine Bewerbungen für die ausgewählten Rollen.
              </v-alert>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import ViewComponent from '@/components/editor/ViewComponent.vue';
import FileManager from '@/components/file-manager/FileManager.vue';
import ProjectApplicationListItem from '@modules/project-application/components/ProjectApplicationListItem.vue';
import ProjectAvailableTime from '@modules/project-application/components/ProjectAvailableTime.vue';
import { ProjectApplication, ProjectTender } from '@modules/project-application/types';
import { weeksArray } from '@modules/project-application/util';
import { Vue, Component, Prop, VModel } from 'vue-property-decorator'
import { ProjectRoleEnum } from '@modules/projects/types';
import { DocEnum } from '@/interfaces';

@Component({
  components: { ProjectApplicationListItem, FileManager, ProjectAvailableTime, ViewComponent }
})
export default class ProjectCastCompareDialog extends Vue{

  @VModel()
  public dialog!: boolean;

  @Prop()
  public applications!: ProjectApplication[];

  @Prop()
  public projectTender!: ProjectTender;

  public get sortedQuestions() {
    return this.projectTender.questions.sort((a, b) => a.order - b.order);
  }

  public get weeks() {
    return weeksArray(this.projectTender.project_start_date_expected, this.projectTender.project_end_date_expected);
  }

  get filteredApplications() {
    return this.applications.filter(application => this.selectedRoles.some(selectedRole => application.roles.includes(selectedRole)));
  }

  public getAnswer(application: ProjectApplication, questionId: number) {
    return application.answered_questions.find(answer => answer.project_tender_question_id === questionId)?.answer || 'keine Antwort';
  }

  allRoles: DocEnum[] = this.$enums('ProjectRoleEnum');

  selectedRoles: ProjectRoleEnum[] = this.allRoles.map((role: DocEnum) => role.value) as ProjectRoleEnum[];

  public toggle() {
    if (this.selectedRoles.length === this.allRoles.length) {
      this.selectedRoles = [];
    } else {
      this.selectedRoles = this.allRoles.map((role: DocEnum) => role.value) as ProjectRoleEnum[];
    }
  }
}
</script>

<style lang="scss" scoped>

.toolbar {
  z-index: 100;
}

.pre-formatted {
  white-space: pre-wrap;
}

table {
  white-space: nowrap;
  border-collapse: collapse;
  table-layout: fixed;
}
td, th {
  padding: 2px 4px;
  border-right: 1px solid rgb(228, 228, 228);
  border-left: 1px solid rgb(228, 228, 228);
}
table thead th {
  padding: 3px;
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
  font-weight: unset;
}

thead {
  border-top: 1px solid rgb(228, 228, 228);
}

table td {
  background: #fff;
  padding: 4px 5px;
  text-align: center;
}
table tr {
  border-bottom: 1px solid rgb(228, 228, 228);
}

table tbody th {
  font-weight: 100;
  font-style: italic;
  text-align: left;
  position: relative;

}
table th:first-child,td:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  border-right: 1px solid rgb(228, 228, 228);
}
table tbody th {
  position: sticky;
  left: 0;
  background: white;
  z-index: 1;
}

.filter-container {
  .role-filter {
    min-width: 737px;
  }
}

</style>