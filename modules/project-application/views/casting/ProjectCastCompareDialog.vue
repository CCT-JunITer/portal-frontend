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
        <div class="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Bewerber:in</th>
                <th v-for="application in applications" :key="application.id">
                  <div>
                    <project-application-list-item :project-application="application"></project-application-list-item>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
              </tr>
              <tr v-for="question in projectTender.questions" :key="question.id">
                <td>{{ question.title }}</td>
                <td v-for="application in applications" :key="application.id">
                  <div class="pre-formatted text-body-2">{{ getAnswer(application, question.id) }}</div>
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
            </tbody>
          </table>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import FileManager from '@/components/file-manager/FileManager.vue';
import ProjectApplicationListItem from '@modules/project-application/components/ProjectApplicationListItem.vue';
import ProjectAvailableTime from '@modules/project-application/components/ProjectAvailableTime.vue';
import { ProjectApplication, ProjectTender } from '@modules/project-application/types';
import { weeksArray } from '@modules/project-application/util';
import { Vue, Component, Prop, VModel } from 'vue-property-decorator'

@Component({
  components: { ProjectApplicationListItem, FileManager, ProjectAvailableTime }
})
export default class ProjectCastCompareDialog extends Vue{

  @VModel()
  public dialog!: boolean;

  @Prop()
  public applications!: ProjectApplication[];

  @Prop()
  public projectTender!: ProjectTender;

  public get weeks() {
    return weeksArray(this.projectTender.project_start_date_expected, this.projectTender.project_end_date_expected);
  }

  public getAnswer(application: ProjectApplication, questionId: number) {
    return application.answered_questions.find(answer => answer.project_tender_question_id === questionId)?.answer || 'keine Antwort';
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

</style>