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
            Allgemeine Informationen zu diesem Projekt
          </p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
          <v-text-field
            label="Titel"
            v-model="project.title"
            class="input-lg"
            prepend-icon="mdi-format-title"
            required
            :rules="[$common.required]" 
          ></v-text-field>
          <editor-component
            v-model="project.description"
            required
            :rules="[$common.required]"
          ></editor-component>

          <v-select
            label="Projektrahmen"
            v-model ="project.type"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            item-text="text"
            :items="$enums('ProjectTypeEnum')"
            :rules="[$common.required]"
          ></v-select>
          
          <v-combobox
            v-model="project.subtype"
            prepend-icon="mdi-animation"
            class="input-lg"
            :items="getAutocompleteItems('subtype').filter(subtype => !subtype.trim().startsWith('old'))"
            :search-input.sync="searchSubType"
            label="Projektart"
            dense
            multiple
            chips
            deletable-chips
            :rules="[$common.required]" 
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    "<strong>{{ searchSubType }}</strong>" nicht gefunden. Drücke <kbd>enter</kbd>, um eine neue Projektart zu erstellen
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>

          <v-combobox
            v-model="project.categories"
            prepend-icon="mdi-animation"
            class="input-lg"
            :items="getAutocompleteItems('categories')"
            :search-input.sync="searchCategories"
            label="Projektunterart"
            dense
            multiple
            chips
            deletable-chips
            :rules="[$common.required]" 
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    "<strong>{{ searchCategories }}</strong>" nicht gefunden. Drücke <kbd>enter</kbd>, um eine neue Unterart zu erstellen
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>

          <!-- Branche des Projekts -->
          <v-select
            label="Branche"
            v-model="project.industry"
            class="input-lg"
            required
            prepend-icon="mdi-factory"
            item-text="text"
            :items="$enums('IndustryEnum')"
            :rules="[$common.required]"
          ></v-select>

          

          <v-combobox
            v-model="project.tags"
            prepend-icon="mdi-tag"
            class="input-lg"
            :items="getAutocompleteItems('tags')"
            :search-input.sync="searchTags"
            label="Tags"
            dense
            multiple
            chips
            deletable-chips
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    "<strong>{{ searchTags }}</strong>" nicht gefunden. Drücke <kbd>enter</kbd>, um einen neuen Tag zu erstellen
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          <v-select
            label="Projektstatus"
            v-model ="project.status"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            item-text="text"
            :items="$enums('ProjectStatusEnum')"
            :rules="[$common.required]"
          ></v-select>
          
        </v-col>
      </v-row>


      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Bewerber</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">
          <v-select
            label="Projektausschreibung"
            v-model="project.project_tender_id"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            :items="projectTenders"
            item-text="title"
            item-value="id"
            clearable
          >
          </v-select>

          <template v-if="projectApplicationsForTender">
            <v-card outlined>
              <v-list>
                <project-application-list-item
                  v-for="application in projectApplicationsForTender"
                  :key="application.id"
                  :projectApplication="application">
                </project-application-list-item>
              </v-list>
            </v-card>
            <v-divider class="my-5"></v-divider>

            <p class="text-body-2 text--secondary">Weitere Bewerber:innen:</p>
          </template>


          <div
            v-for="role in $enums('ProjectRoleEnum')"
            :key="role.value"
          >
            <user-select 
              multiple
              class="input-lg"
              prepend-icon="mdi-school"
              filled
              :label="role.text"
              v-model="project.applications[role.value]">
            </user-select>

          </div>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Projektteam</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">

          <div
            v-for="role in $enums('ProjectRoleEnum')"
            :key="role.value"
          >
            <user-select 
              multiple
              class="input-lg"
              prepend-icon="mdi-school"
              filled
              :label="role.text"
              v-model="project.participants[role.value]">
            </user-select>

          </div>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Qualitätsicherung</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">

          <v-combobox
            v-model="project.methods"
            prepend-icon="mdi-animation"
            class="input-lg"
            :items="getAutocompleteItems('methods')"
            :search-input.sync="searchMethods"
            label="Methoden"
            persistent-hint
            hint=" "
            dense
            multiple
            chips
            deletable-chips
          >
            <template v-slot:message="{ message }">
              <span>{{ message }}</span>
              Wähle den Titel einer Methode aus der 
              <a href="https://wiki.cct-ev.de/index.php/Methodensammlung" target="_blank">
                Methodensammlung
              </a>
            </template>
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                label
                close
                @click:close="parent.selectItem(item)"
              >
                <v-avatar left>
                  <v-btn
                    icon
                    small
                    target="_blank"
                    :href="`https://wiki.cct-ev.de/index.php/${item}`"
                  >
                    <v-icon>mdi-wikipedia</v-icon>
                  </v-btn>
                </v-avatar>
                <span class="pr-2">
                  {{ item }}
                </span>
              </v-chip>
            </template>
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    "<strong>{{ searchMethods }}</strong>" nicht gefunden. Drücke <kbd>enter</kbd>, um eine neue Methode zu erstellen
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>

          <v-checkbox
            v-model="project.approved"
            label="Richtigkeit des Eintrags bestätigt"
            class="input-lg"
            prepend-icon="mdi-check-decagram"
            hint="Durch das Qualitätsmanagement bestätigt"
            persistent-hint
            required
          >
          </v-checkbox>

          <v-checkbox
            v-model="project.qm_feedback"
            label="360° Feedback erfolgt"
            class="input-lg"
            prepend-icon="mdi-check-decagram"
            hint="Durch das Qualitätsmanagement bestätigt"
            required
          >
          </v-checkbox>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Projekt&shy;dokumentation</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">
          <v-checkbox
            v-model="project.nda"
            label="NDA unterschrieben?"
            class="input-lg"
            prepend-icon="mdi-pen-lock"
            required
          >
          </v-checkbox>

          <file-manager 
            v-model="project.files" 
            :folder="project.versioned_folder" 
            :multiple="true"
            :labels="fileLabels"
            :requiredLabels="requiredLabels"
          >
          </file-manager>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Kalkulation</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="4" class="px-5">
          <date-picker-menu
            v-if="project.type != 'internal'"
            v-model ="project.proposal_date"
            defaultPicker="MONTH"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Erstmalige Angebotsabgabe"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="[...attrs.rules, $common.required]"
              ></v-text-field>
            </template>
          </date-picker-menu>

          <date-picker-menu
            v-if="project.type != 'internal'"
            v-model ="project.acceptance_date"
            defaultPicker="MONTH"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Angebotsannahme"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="[...attrs.rules,onlyRequiredIfStatusIsAborted,onlyRequiredIfStatusIsCompleted]"
              ></v-text-field>
            </template>
          </date-picker-menu>

          <date-picker-menu
            v-model ="project.project_start_date_expected"
            defaultPicker="MONTH"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Projektbeginn (soll)"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required, ...attrs.rules]"
              ></v-text-field>
            </template>
          </date-picker-menu>

          <date-picker-menu
            v-model ="project.project_start_date_actual"
            defaultPicker="MONTH"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Projektbeginn (ist)"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[...attrs.rules,onlyRequiredIfStatusIsCompleted,onlyRequiredIfStatusIsAborted]"
              ></v-text-field>
            </template>
          </date-picker-menu>

         
          <date-picker-menu
            v-model ="project.project_end_date_expected"
            defaultPicker="MONTH"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Projektende (soll)"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                required
                :rules="[$common.required, ...attrs.rules,]"
              ></v-text-field>
            </template>
          </date-picker-menu>

          <date-picker-menu
            v-model ="project.project_end_date_actual"
            defaultPicker="MONTH"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Projektende (ist)"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="[...attrs.rules,onlyRequiredIfStatusIsAborted,onlyRequiredIfStatusIsCompleted]"
              ></v-text-field>
            </template>
          </date-picker-menu>
        
          <v-text-field
            label="Anzahl BT (soll)"
            v-model="project.bt_amount_expected"
            class="input-lg"
            prepend-icon="mdi-briefcase"
            suffix="BT"
            required
            :rules="[$common.required, $common.isDecimal]" 
          ></v-text-field>

          <v-text-field
            label="Anzahl BT (ist)"
            v-model="project.bt_amount_actual"
            class="input-lg"
            prepend-icon="mdi-briefcase"
            suffix="BT"
            required
            :rules="[$common.isDecimal,onlyRequiredIfStatusIsCompleted,onlyRequiredIfStatusIsAborted]" 
          ></v-text-field>


          <v-expand-transition>
            <v-text-field
              label="BT-Satz in Euro"
              v-model="project.bt_rate"
              class="input-lg"
              prepend-icon="mdi-tag-text"
              suffix="€"
              required
              v-show="['internal', 'membership_project'].indexOf(project.type || '') === -1 || project.bt_rate"
              :rules="[
                $common.isCurrency,
                v => ['internal', 'membership_project'].indexOf(project.type || '') !== -1 ?
                  $common.isEmpty(v) : $common.required(v)
              ]" 
            ></v-text-field>
          </v-expand-transition>

          <v-text-field
            v-if="project.type !== 'internal'"
            label="Aufwand Angebotserstellung"
            v-model="project.bt_amount_bid_preparation"
            class="input-lg"
            prepend-icon="mdi-briefcase"
            suffix="BT"
            required
            :rules="[$common.isDecimal]" 
          ></v-text-field>

          <!-- Vereinsprovision -->
          <v-text-field
            v-if="project.type !== 'internal'"
            label="Vereinsprovision"
            v-model="project.club_bonus_amount"
            class="input-lg"
            prepend-icon="mdi-percent"
            suffix="%"
            required
            :rules="[$common.isDecimal]"
          ></v-text-field>

          <!-- Akquisebonus -->
          <v-text-field
            v-if="project.type !== 'internal'"
            label="Akquisebonus"
            v-model="project.acquisition_bonus_amount"
            class="input-lg"
            prepend-icon="mdi-percent"
            suffix="%"
            required
            :rules="[$common.isDecimal]"
          ></v-text-field>

          <p 
            v-if="project.type !== 'internal'" 
            class="text-overline">Zuschläge
          </p>
          
          <div 
            v-if="project.type !== 'internal'"
            class="ml-5"
          >
            <v-text-field
              label="PM-Zuschlag"
              v-model="project.surcharge_amount_project_management"
              class="input-lg"
              prepend-icon="mdi-percent"
              suffix="%"
              required
              :rules="[$common.isDecimal]" 
            ></v-text-field>


            <v-text-field
              label="Dokumentationszuschlag"
              v-model="project.surcharge_amount_documentation"
              class="input-lg"
              prepend-icon="mdi-percent"
              suffix="%"
              required
              :rules="[$common.isDecimal]" 
            ></v-text-field>

            <v-text-field
              label="Reisekosten"
              v-model="project.surcharge_amount_travel"
              class="input-lg"
              prepend-icon="mdi-numeric"
              suffix="€"
              required
              :rules="[$common.isCurrency]" 
            ></v-text-field>

            <v-text-field
              label="Zuschlag für Sonstiges"
              v-model="project.surcharge_amount_other"
              class="input-lg"
              prepend-icon="mdi-numeric"
              suffix="€"
              required
              :rules="[$common.isCurrency]" 
            ></v-text-field>
          </div>
        </v-col>

        <v-col md="4">
          <project-calculation :project="newProject" class="mx-auto sticky"></project-calculation>
        </v-col>
      </v-row>


      <v-divider 
        v-if="project.type !== 'internal' 
          && project.type !== 'membership_project'"
        class="my-5"
      ></v-divider>

      <v-row 
        v-if="project.type !== 'internal' 
          && project.type !== 'membership_project'"
      >
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Akquise</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">
          <v-combobox
            v-model="project.customer_name"
            label="Kund:innenname"
            class="input-lg"
            prepend-icon="mdi-account"
            :items="getAutocompleteItems('customer_name')"
            :search-input.sync="searchCustomerName"
            :rules="[
              v => ['internal', 'membership_project'].indexOf(project.type || '') !== -1 ?
                $common.isEmpty(v) : $common.required(v)
            ]" 
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    "<strong>{{ searchCustomerName }}</strong>" nicht gefunden. Drücke <kbd>enter</kbd>, um eine:n neue:n Kund:in zu erstellen
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          
          <v-select
            label="Status der Referenzfreigabe"
            v-model="project.reference_status"
            clearable
            class="input-lg"
            prepend-icon="mdi-account-tie"
            item-text="text"
            :items="$enums('ProjectReferenceStatusEnum')"
          ></v-select>
          <v-expand-transition>
            <v-textarea
              label="Zitat"
              v-model="project.reference_quote"
              class="input-lg"
              prepend-icon="mdi-format-quote-close"
              required
              v-show="project.reference_status === 'extended' || project.reference_quote"
              :rules="[v => project.reference_status !== 'extended' ? $common.isEmpty(v) : $common.required(v)]"
            ></v-textarea>
          </v-expand-transition>

          <v-expand-transition>
            <v-textarea
              label="Grund, wenn Referenzfreigabe nicht erteilt"
              v-model="project.reference_no_approval_cause"
              class="input-lg"
              prepend-icon="mdi-help"
              required
              v-show="project.reference_status === 'basis' || project.reference_no_approval_cause"
              :rules="[v => project.reference_status !== 'basis' ? $common.isEmpty(v) : true]"
            ></v-textarea>
          </v-expand-transition>

          <v-expand-transition>
            <v-textarea
              label="Grund, wenn Referenzfreigabe nicht angefragt"
              v-model="project.reference_no_inquiry_cause"
              class="input-lg"
              prepend-icon="mdi-help"
              required
              v-show="project.reference_status === 'basis' || project.reference_no_inquiry_cause"
              :rules="[v => project.reference_status !== 'basis' ? $common.isEmpty(v) : true]"
            ></v-textarea>
          </v-expand-transition>

          <!-- Referenzfreigabe valide bis: ... -->
          <date-picker-menu
            v-model ="project.reference_approval_valid_until"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '2000-01-01',
              max: '2125-01-01'
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Referenzfreigabe gültig bis"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-range"
                :rules="[...attrs.rules, referenceDaterequired]"
              ></v-text-field>
            </template>
          </date-picker-menu>

          <v-select
            label="KFB Status"
            v-model="project.kfb_status"
            class="input-lg"
            clearable
            prepend-icon="mdi-account-tie"
            item-text="text"
            :items="$enums('KFBStatusEnum')"
          ></v-select>

          <v-expand-transition>
            <v-textarea
              label="Grund, dass KFB nicht versendet"
              v-model="project.kfb_not_sent_cause"
              class="input-lg"
              prepend-icon="mdi-help"
              required
              v-show="project.kfb_status === 'open_status' || project.kfb_not_sent_cause"
              :rules="[v => project.kfb_status !== 'open_status' ? $common.isEmpty(v) : $common.required(v)]"
            ></v-textarea>
          </v-expand-transition>

          <v-expand-transition>
            <v-textarea
              label="Grund, dass KFB abgelehnt"
              v-model="project.kfb_rejected_cause"
              class="input-lg"
              prepend-icon="mdi-help"
              required
              v-show="project.kfb_status === 'rejected_status' || project.kfb_rejected_cause"
              :rules="[v => project.kfb_status !== 'rejected_status' ? $common.isEmpty(v) : $common.required(v)]"
            ></v-textarea>
          </v-expand-transition>

          <v-select
            label="Akquise durch"
            v-model ="project.acquisition_type"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            item-text="text"
            :items="$enums('ProjectAcquisitionType')"
          ></v-select>


          <v-expand-transition>
            <v-text-field
              label="Name externe Person"
              v-model="project.acquisition_by"
              class="input-lg"
              prepend-icon="mdi-account"
              required
              v-show="project.acquisition_type === 'external' || project.acquisition_by"
              :rules="[v => project.acquisition_type !== 'external' ? $common.isEmpty(v) : $common.required(v)]"
            ></v-text-field>
          </v-expand-transition>

          <v-expand-transition>
            <user-select 
              class="input-lg"
              prepend-icon="mdi-account-tie"
              filled
              clearable
              label="Person im Verein"
              v-model="project.acquisition_by_user_id"
              v-show="project.acquisition_type === 'internal' || project.acquisition_by_user_id"
              :rules="[v => project.acquisition_type !== 'internal' ? $common.isEmpty(v) : $common.required(v)]"
            >
            </user-select>
          </v-expand-transition>

          <v-expand-transition>
            <project-select 
              class="input-lg"
              prepend-icon="mdi-account-tie"
              filled
              clearable
              label="Vorheriges Projekt"
              v-model="project.parent_project_id"
              v-show="project.acquisition_type === 'follow_up' || project.parent_project_id"
              :rules="[v => project.acquisition_type !== 'follow_up' ? $common.isEmpty(v) : $common.required(v)]"
            >
            </project-select>
          </v-expand-transition>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel" outlined color="cctOrange">Abbrechen</v-btn>

        <consent-dialog @accept="deleteProject" title="Projekt löschen" content="Wirklich löschen?" v-if="editProject">
          <template v-slot:activator="{ attrs, on }">
            <v-btn 
              v-bind="attrs" 
              v-on="on" 
              color="red" 
              dark
            >
              <v-icon left>
                delete
              </v-icon>
              Projekt löschen
            </v-btn>
          </template>
        </consent-dialog>
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
import { FILE_LABELS, Project, ProjectApplicationUser, ProjectCreate, ProjectCreation, ProjectRoleEnum, ProjectUser } from '../types';
import { dispatchCreateProject, dispatchDeleteProject, dispatchGetAutocompleteValues, dispatchGetOneProject, dispatchUpdateProject } from '../store/actions';
import { readAutocompleteValues, readOneProject } from '../store/getters';
import ProjectCalculation from '../components/ProjectCalculation.vue';
import ProjectSelect from '../components/project-select/ProjectSelect.vue';
import { dispatchGetProjectApplicationsFor, dispatchGetProjectTenders } from '@modules/project-application/store/actions';
import { readProjectTenders, readRouteProjectApplicationsFor } from '@modules/project-application/store/getters';
import ProjectApplicationListItem from '@modules/project-application/components/ProjectApplicationListItem.vue';
import EditorComponent from '@/components/editor/EditorComponent.vue';

@Component({
  components: { DatePickerMenu, DateTimePickerMenu, FileManager, UserSelect, ConsentDialog, ProjectCalculation, ProjectSelect, ProjectApplicationListItem, EditorComponent },
})
export default class EditProject extends Vue {

  public get fileLabels() {
    if (this.project.type === 'internal') {
      const onlyOptions = ['Abschlussdokumentation'];
      return FILE_LABELS.filter(label => onlyOptions.includes(label));
    }
    return FILE_LABELS;
  }
  public valid = true;
  public project: Partial<ProjectCreation> = {
    participants: {},
    applications: {},
  }

  public searchSubType = '';
  public searchCustomerName = '';
  public searchCategories = '';
  public searchMethods = '';
  public searchTags = '';

  public get requiredLabels() {
    if(this.project.type === 'membership_project' && this.project.status === 'completed'){
      return this.fileLabels.filter(label => label !== 'KFB' && label !== 'Referenzfreigabe' && label !== 'Referenzfolien')
    }
    if (this.project.nda && this.project.status !== 'completed') {
      return [];
    }

    if (this.project.nda) {
      return this.fileLabels.filter(label => label !== 'Angebotspräsentation' && label !== 'Referenzfreigabe' && label !== 'Referenzfolien').filter(label => (label === 'KFB'? this.project.kfb_status === 'closed_status':true));
    }

    if (this.project.status !== 'completed') {
      return this.fileLabels.filter(label => label === 'Angebotspräsentation');
    }

    return this.fileLabels.filter(label => (label === 'KFB'? this.project.kfb_status === 'closed_status':true));
  }


  async deleteProject() {
    if (!this.editProject) {
      return;
    }
    await dispatchDeleteProject(this.$store, this.editProject.id);
    this.$router.replace('/main/wms/projects');
  }
  
  getAutocompleteItems(property: string) {
    return readAutocompleteValues(this.$store)(property);
  }

  get userProfiles() {
    return readUsers(this.$store);
  }

  get projectTenders() {
    return readProjectTenders(this.$store);
  }

  @Watch('project.project_tender_id', {immediate: true})
  public async fetchProjectApplications() {
    if (this.project.project_tender_id) {
      await dispatchGetProjectApplicationsFor(this.$store, this.project.project_tender_id);
    }
  }

  public get projectApplicationsForTender() {
    if (!this.project.project_tender_id) {
      return null;
    }
    return readRouteProjectApplicationsFor(this.$store)(this.project.project_tender_id);
  }

  @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params.from !== oldRoute?.params.from && newRoute?.params.from) {
      this.project = this.convertToProjectCreation(JSON.parse(newRoute.params.from));
      return;
    }
    if (newRoute?.params.id !== oldRoute?.params.id) {
      await dispatchGetOneProject(this.$store, +this.$route.params.id)
      this.reset();
    }
  }


  public async mounted() {
    await dispatchGetUsers(this.$store);
    await dispatchGetAutocompleteValues(this.$store);
    await dispatchGetProjectTenders(this.$store);
    this.valid = false;
  }

  public cancel() {
    this.$router.back();
  }

  public get newProject() {
    const newProject: ProjectCreate = {
      ...this.project as ProjectCreation,
      participant_ids: this.project.participants!,
      applications_ids: this.project.applications!,
      bt_amount_expected: this.$common.text2Decimal(this.project.bt_amount_expected), // Anzahl BT(soll)
      bt_amount_actual: this.$common.text2Decimal(this.project.bt_amount_actual), // Anzahl BT(ist)
      bt_rate: this.$common.text2Decimal(this.project.bt_rate),
      club_bonus_amount: this.$common.text2Decimal(this.project.club_bonus_amount),
      acquisition_bonus_amount: this.$common.text2Decimal(this.project.acquisition_bonus_amount),
      surcharge_amount_project_management: this.$common.text2Decimal(this.project.surcharge_amount_project_management), // PM - Zuschla,
      surcharge_amount_documentation: this.$common.text2Decimal(this.project.surcharge_amount_documentation), // Dokumentationzuschla,
      surcharge_amount_travel: this.$common.text2Decimal(this.project.surcharge_amount_travel), // Reisekostenzuschla,
      surcharge_amount_other: this.$common.text2Decimal(this.project.surcharge_amount_other), // Sonstige,
      bt_amount_bid_preparation: this.$common.text2Decimal(this.project.bt_amount_bid_preparation),
    };
    return newProject;
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const newProject = this.newProject;
      let project: Project | undefined;
      if (this.editProject?.id) {
        project = await dispatchUpdateProject(this.$store, {id: this.editProject.id, project: newProject});
      } else {
        project = await dispatchCreateProject(this.$store, newProject);
      }
      this.$router.replace(`/main/wms/projects/${project?.id}`);
      
    }
  }

  public get isLoading() {
    const projectId = +this.$route.params.id
    return projectId && this.editProject?.id !== projectId;
  }

  get editProject() {
    return readOneProject(this.$store)(+this.$router.currentRoute.params.id);
  }

  public reset() {
    if (this.editProject) {
      this.project = this.convertToProjectCreation(this.editProject); 
    }
  }

  public convertToProjectCreation(project: Project) {
    return {
      ...project,
      participants: Object.fromEntries(Object.entries(project.participants || {}).map(([k,v]) => [k, v.map(u => u.participant.id)])),
      applications: this.convertApplicationsToRoleIds(project.applications || []),
      bt_amount_expected: this.$common.decimal2Text(project.bt_amount_expected), // Anzahl BT(soll)
      bt_amount_actual: this.$common.decimal2Text(project.bt_amount_actual), // Anzahl BT(ist)
      bt_rate: this.$common.decimal2Text(project.bt_rate, 2),
      club_bonus_amount: this.$common.decimal2Text(project.club_bonus_amount),
      acquisition_bonus_amount: this.$common.decimal2Text(project.acquisition_bonus_amount),
      surcharge_amount_project_management: this.$common.decimal2Text(project.surcharge_amount_project_management), // PM - Zuschla,
      surcharge_amount_documentation: this.$common.decimal2Text(project.surcharge_amount_documentation), // Dokumentationzuschla,
      surcharge_amount_travel: this.$common.decimal2Text(project.surcharge_amount_travel, 2), // Reisekostenzuschla,
      surcharge_amount_other: this.$common.decimal2Text(project.surcharge_amount_other, 2), // Sonstige,
      bt_amount_bid_preparation: this.$common.decimal2Text(project.bt_amount_bid_preparation),
    };
  }

  convertApplicationsToRoleIds(projectUser: ProjectApplicationUser[]) {
    const applications: {[key: string]: number[]} = {};
    for (const role of this.$enums('ProjectRoleEnum')) {
      applications[role.value] = projectUser.filter(user => user.roles.includes(role.value as ProjectRoleEnum)).map(user => user.participant_id);
    }
    return applications;
  }

  public get onlyRequiredIfStatusIsCompleted(){
    return this.project.status === 'completed'
      ? this.$common.required
      : v => true;
  }
  public get onlyRequiredIfStatusIsAborted(){
    return this.project.status === 'aborted'
      ? this.$common.required
      : v => true;
  }
  public get referenceDaterequired(){
    return (this.project.reference_status !== 'contradiction' && this.project.reference_status !== 'missing_approval' && this.project.status === 'completed' && this.project.type!=='internal' && this.project.type!=='membership_project')
      ? this.$common.required
      : v => true;
  }

  public get onlyRequiredIfExternal(){
    return (this.project.type === 'external' || this.project.type === 'staffing')
      ? this.$common.required
      : v => true;
  }
  
}
</script>

<style lang="scss" scoped>
.sticky {
  position: sticky;
  top: 64px;
}
</style>