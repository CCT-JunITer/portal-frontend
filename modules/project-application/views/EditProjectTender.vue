<template>
  <v-container v-if="!isLoading">
    <v-form
      v-model="valid"
      ref="form"
    >
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Allgemeines</h2>
          <p class="text-body-2 text--secondary">
            Allgemeine Informationen zu dieser Projektausschreibung
          </p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
          <v-text-field
            label="Titel"
            v-model="projectTender.title"
            class="input-lg"
            prepend-icon="mdi-format-title"
            required
            :rules="[$common.required]" 
          ></v-text-field>

          <editor-component v-model="projectTender.description" placeholder="Beschreibung" />

          <v-text-field
            label="Anzahl BT (minimal)"
            v-model="projectTender.min_bt"
            class="input-lg"
            prepend-icon="mdi-briefcase"
            suffix="BT"
            required
            :rules="[$common.required, $common.isDecimal]" 
          ></v-text-field>

          <v-text-field
            label="Anzahl BT (maxmimal)"
            v-model="projectTender.max_bt"
            class="input-lg"
            prepend-icon="mdi-briefcase"
            suffix="BT"
            required
            :rules="[$common.required, $common.isDecimal]" 
          ></v-text-field>



          <v-expand-transition>
            <v-text-field
              label="BT-Satz in Euro"
              v-model="projectTender.bt_rate"
              class="input-lg"
              prepend-icon="mdi-tag-text"
              suffix="€"
              required
              v-show="['internal', 'membership_project'].indexOf(projectTender.type || '') === -1 || projectTender.bt_rate"
              :rules="[
                $common.isCurrency,
                v => ['internal', 'membership_project'].indexOf(projectTender.type || '') !== -1 ?
                  $common.isEmpty(v) : $common.required(v)
              ]" 
            ></v-text-field>
          </v-expand-transition>

          <v-select
            label="Projektrahmen"
            v-model ="projectTender.type"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            item-text="text"
            :items="$enums('ProjectTypeEnum')"
            :rules="[$common.required]"
          ></v-select>

          <date-time-picker-menu
            v-model ="projectTender.date_deadline"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '2000-01-01',
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Deadline"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="attrs.rules"
              ></v-text-field>
            </template>
          </date-time-picker-menu>

          <date-picker-menu
            v-model ="projectTender.project_start_date_expected"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '2000-01-01',
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Geplanter Projektstart"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="attrs.rules"
              ></v-text-field>
            </template>
          </date-picker-menu>

          <date-picker-menu
            v-model ="projectTender.project_end_date_expected"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '2000-01-01',
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Geplantes Projektende"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="attrs.rules"
              ></v-text-field>
            </template>
          </date-picker-menu>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>
      
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Fragen</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">
          <v-expansion-panels multiple>
            <v-expansion-panel
              v-for="question in projectTender.questions"
              :key="question.id"

            >
              <v-expansion-panel-header>
                <template v-slot:default="{  }">
                  <v-row no-gutters>
                    <v-col cols="4">
                      {{ question.title }}
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-text-field
                  v-model="question.title"
                  placeholder="Titel"
                ></v-text-field>
                <v-text-field
                  v-model="question.description"
                  placeholder="Beschreibung"
                ></v-text-field>
                <v-checkbox 
                  v-model="question.required" 
                  label="Pflichtfeld"
                >
                </v-checkbox>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="error"
                    @click="deleteQuestion(question)"
                  >
                    Löschen
                  </v-btn>
                </v-card-actions>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <v-btn @click="addQuestion" class="ma-2" color="cctGreen" dark>Frage hinzufügen</v-btn>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Dateien</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
          <file-manager
            v-model="projectTender.files"
            :folder="projectTender.versioned_folder"
          >
          </file-manager>
        </v-col>
      </v-row>


      <v-divider class="my-5"></v-divider>
      
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Gesuchte Bewerber</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">

          <div
            v-for="role in $enums('ProjectRoleEnum')"
            :key="role.value"
          >
            <v-text-field
              :label="role.text"
              value="0"
              v-model="projectTender.needed_project_roles_counts[role.value]"
            >
            </v-text-field>
          </div>
        </v-col>
      </v-row>
      
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel" outlined color="cctOrange">Abbrechen</v-btn>

        <v-btn
          @click="submit"
          color="cctGreen"
          dark
        >
          Projekt speichern
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
  <loading-page v-else></loading-page>
</template>

<script lang="ts">
import { Vue, Component, Watch} from 'vue-property-decorator';
import { dispatchGetUsers } from '@/store/main/actions';
import { readUsers } from '@/store/main/getters';
import FileManager from '@/components/file-manager/FileManager.vue';
import DateTimePickerMenu from '@/components/DateTimePickerMenu.vue';
import { Route } from 'vue-router';
import UserSelect from '@/components/user-select/UserSelect.vue';
import ConsentDialog from '@/components/consent-dialog/ConsentDialog.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { dispatchCreateProjectTender, dispatchGetProjectTender, dispatchUpdateProjectTender } from '../store/actions';
import { ProjectTender, ProjectTenderCreate, ProjectTenderCreation, ProjectTenderQuestion } from '../types';
import { readOneProjectTender } from '../store/getters';
import { dispatchGetAutocompleteValues } from '@modules/projects/store/actions';
import { ProjectRoleEnum } from '@modules/projects/types';
import EditorComponent from '@/components/editor/EditorComponent.vue';

@Component({
  components: { DatePickerMenu, DateTimePickerMenu, FileManager, UserSelect, ConsentDialog, EditorComponent },
})
export default class EditProjectTender extends Vue {

  public valid = true;
  public projectTender: Partial<ProjectTenderCreation> = {
    needed_project_roles_counts: {},
    questions: [
      { title: '', description: '', required: false}
    ],
  }

  public addQuestion() {
    this.projectTender?.questions?.push({ title: '', description: '', required: false });
  }

  public deleteQuestion(question: ProjectTenderQuestion) {
    this.projectTender?.questions?.splice(this.projectTender.questions.indexOf(question), 1);
  }

  get userProfiles() {
    return readUsers(this.$store);
  }

  @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params.id !== oldRoute?.params.id) {
      await dispatchGetProjectTender(this.$store, +this.$route.params.id)
      this.reset();
    }
  }


  public async mounted() {
    await dispatchGetUsers(this.$store);
    await dispatchGetAutocompleteValues(this.$store);
    this.valid = false;
  }

  public cancel() {
    this.$router.back();
  }

  public get newProjectTender() {
    const newProjectTender: ProjectTenderCreate = {
      ...this.projectTender as ProjectTenderCreate,
      max_bt: this.$common.text2Decimal(this.projectTender.max_bt),
      min_bt: this.$common.text2Decimal(this.projectTender.min_bt),
      bt_rate: this.$common.text2Decimal(this.projectTender.bt_rate),

      needed_project_roles_counts: Object.fromEntries(
        Object.entries(this.projectTender.needed_project_roles_counts!)
          .map(([key, value]) => ([key, +value]))
          .filter(([_, value]) => value > 0)
      ) as { [key in ProjectRoleEnum]: number },
    };
    return newProjectTender;
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const newProjectTender = this.newProjectTender;
      let project: ProjectTender | undefined;
      if (this.editProjectTender?.id) {
        project = await dispatchUpdateProjectTender(this.$store, {id: this.editProjectTender.id, data: newProjectTender});
      } else {
        project = await dispatchCreateProjectTender(this.$store, newProjectTender);
      }
      this.$router.push({ name: 'project-tender-detail', params: { id: `${project?.id}` } });
      
    }
  }

  public get isLoading() {
    const projectId = +this.$route.params.id
    return projectId && this.editProjectTender?.id !== projectId;
  }

  get editProjectTender() {
    return readOneProjectTender(this.$store)(+this.$router.currentRoute.params.id);
  }

  public reset() {
    if (this.editProjectTender) {
      this.projectTender = {
        ...this.editProjectTender,
        max_bt: this.$common.decimal2Text(this.editProjectTender.max_bt),
        min_bt: this.$common.decimal2Text(this.editProjectTender.min_bt),
        bt_rate: this.$common.decimal2Text(this.editProjectTender.bt_rate, 2),
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.sticky {
  position: sticky;
  top: 64px;
}
</style>