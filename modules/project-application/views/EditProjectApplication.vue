<template>
  <v-container v-if="projectTender && projectApplication">
    <v-form
      v-model="valid"
      ref="form"
    >
      <project-tender-detail-component :projectTender="projectTender"></project-tender-detail-component> 
      
      <v-divider class="my-5"></v-divider>

      <div class="d-flex">
        <div class="px-5 flex">
          <h4 class="text-h4 text--primary mb-3">Bewerbung</h4>
          <p class="text-subtitle-1">
          </p>
        </div>
        
      </div>
      <div class="pa-5">
        <v-select
          outlined
          v-model="projectApplication.role"
          label="Projektrolle"
          :items="filteredRoles"
          class="input-lg"
        >
        </v-select>

        <v-alert 
          dense
          text
          border="left"
          :type="projectApplication.status == 'draft' ? 'warning' : 'success'"
        > 
          {{ {
            'draft': 'Die Projektbewerbung befindet sich im Entwurf',
            'interest': 'Die Bewerbung wird als Interesse bekundet',
            'completed': 'Die Bewerbung wird vollständig abgegeben'
          }[projectApplication.status || ''] }}
        </v-alert>

        <v-btn-toggle
          v-model="projectApplication.status"
          class="input-lg"
          color="cctGreen"
          mandatory
          dense>
          <v-btn
            v-for="status in ['draft', 'interest', 'completed']"
            :key="status"
            :value="status"
            :disabled="status === 'draft' ? editProjectApplication && editProjectApplication.status !== 'draft' || projectTender.is_deadline_passed : false"
          >
            {{ {
              'draft': 'Entwurf',
              'interest': 'Interesse bekunden',
              'completed': 'vollständig Bewerben'
            }[status] }}
          </v-btn>
        </v-btn-toggle>


        <v-divider class="my-5"></v-divider>

        <p class="text-h6">
          Projektbewerbungsfragen
        </p>

        <template v-if="projectApplication.status === 'completed' || projectApplication.status === 'draft'">
          <div>
            <v-card
              v-for="question in projectApplication.answered_questions"
              :key="question.project_tender_question_id"
              outlined
              class="ma-1"
            >
              <v-card-title>
                {{ question.project_tender_question.title }}
              </v-card-title>
              <v-card-subtitle>
                <view-component :value="question.project_tender_question.description"></view-component>
              </v-card-subtitle>
              <v-card-text>
                <v-textarea
                  v-model="question.answer"
                  filled
                  placeholder="Hier antworten"
                  :rules="[$common.getRequired(question.project_tender_question.required)]"
                >
                </v-textarea>
              </v-card-text>
            </v-card>
          </div>

          <v-divider class="my-5"></v-divider>

          <file-manager
            v-model="projectApplication.files"
            :folder="projectApplication.versioned_folder"
          >
          </file-manager>

          <v-divider class="my-5"></v-divider>

        </template>

        <project-available-time
          :fromDate="projectTender.project_start_date_expected"
          :toDate="projectTender.project_end_date_expected"
          v-model="projectApplication.available_time"
          outlined
        >
        </project-available-time>


        <div v-if="!projectTender.is_deadline_passed" class="d-flex">
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            class="ma-2" 
            large 
            :disabled="!valid"
            @click="submit" 
          >
            {{ projectApplication.status === 'draft' ? 'Entwurf speichern' : 'Bewerbung abschicken' }}
          </v-btn>
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import UserChip from '@/components/user-chip/UserChip.vue';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router';
import { dispatchCreateProjectApplication, dispatchGetProjectApplication, dispatchUpdateProjectApplication } from '../store/actions';
import { readRouteProjectApplication } from '../store/getters';
import { ProjectApplication, ProjectApplicationCreate, ProjectApplicationStatusEnum } from '../types';
import ViewComponent from '@/components/editor/ViewComponent.vue';
import ProjectAvailableTime from '../components/ProjectAvailableTime.vue';
import ProjectTenderDetailComponent from './tender/ProjectTenderDetailComponent.vue';
import FileManager from '@/components/file-manager/FileManager.vue';

@Component({
  components: { UserChip, ViewComponent, ProjectAvailableTime, ProjectTenderDetailComponent, FileManager }
})
export default class EditProjectApplication extends Vue {

  public projectApplication: ProjectApplicationCreate | null = null;
  public valid = false;
  public menu = false;

  public get projectTender() {
    return this.editProjectApplication?.project_tender;
  }

  public get editProjectApplication() {
    return readRouteProjectApplication(this.$store)(this.$route);
  }
  
  public get filteredRoles() {
    return Object.entries(this.projectTender?.needed_project_roles_counts || {})
      .filter(([_, count]) => count > 0)
      .map(([role, _]) => (this.$enums('ProjectRoleEnum') || []).find(r => r.value === role));
  }

  @Watch('$route', { immediate: true })
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params?.id && newRoute?.params?.id !== oldRoute?.params?.id) {
      await dispatchGetProjectApplication(this.$store, +newRoute.params.id);
      this.reset();
    }
  }

  public reset() {
    if (this.editProjectApplication) {
      const newAnsweredQuestions = [...this.editProjectApplication.answered_questions];
      // add this.editProjectApplication.project_tender_questions without duplicates
      this.editProjectApplication.project_tender.questions.forEach(question => {
        if (!newAnsweredQuestions.find(aq => aq.project_tender_question_id === question.id)) {
          newAnsweredQuestions.push({
            project_tender_question_id: question.id!,
            answer: '',
            project_tender_question: question,
          });
        }
      });

      // add order to questions
      newAnsweredQuestions.sort((a, b) => a.project_tender_question.order - b.project_tender_question.order);

      this.projectApplication = {
        ...this.editProjectApplication,
        answered_questions: newAnsweredQuestions,
      };
    }
  }

  public async submit() {
    if (!this.projectApplication) return;
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const newProjectApplication = { ...this.projectApplication };
      let projectApplication: ProjectApplication | undefined;
      if (this.editProjectApplication?.id) {
        projectApplication = await dispatchUpdateProjectApplication(this.$store, {id: this.editProjectApplication.id, data: newProjectApplication});
      } else {
        projectApplication = await dispatchCreateProjectApplication(this.$store, newProjectApplication);
      }
      this.reset();
    }
  }
}
</script>

<style lang="scss">

</style>