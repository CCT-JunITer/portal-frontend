<template>
  <v-container v-if="project">
    <div>
      <h1 class="text-h2 text--primary mb-3">
        <v-icon v-if="this.project.approved" color="cctGreen" x-large>mdi-check-decagram</v-icon>
        {{ project.title }}
      </h1>
      <view-component :value="project.description">
      </view-component>
      <v-chip
        v-for="category in project.categories" 
        :key="category"
        class="mx-1"
        pill
      >
        {{ category }}
      </v-chip>
      <v-chip
        label
        v-for="method in project.methods"
        :key="method"
        class="mx-1"
        pill
      >
        <v-avatar left>
          <v-btn
            icon
            small
            target="_blank"
            :href="`https://wiki.cct-ev.de/index.php/${method}`"
          >
            <v-icon>mdi-wikipedia</v-icon>
          </v-btn>
        </v-avatar>
        <span class="pr-2">
          {{ method }}
        </span>
      </v-chip>
      <v-divider class="my-3"></v-divider>
      <div class="d-flex align-center">
        <div>
          <div class="text-caption mb-1" v-if="project.author">
            erstellt von <user-chip :user="project.author" small></user-chip>
          </div>
          <div class="text-caption mb-1">
            zuletzt bearbeitet
            <span v-if="project.last_updated_by">von <user-chip :user="project.last_updated_by" small></user-chip></span>
            <span v-if="project.approved_by && project.approved">
              und zuletzt bestätigt durch <user-chip :user="project.approved_by" small></user-chip>
            </span>
            <span v-if="project.date_last_updated">
              {{ $common.format(new Date(project.date_last_updated), `'am' dd.MM.yyyy 'um' HH:mm`) }}
            </span>
          </div>
          <div class="text-caption" v-if="project.project_tender">
            und wurde im Portal ausgeschrieben <v-chip color="cctPurple" dark small :to="{ name: 'project-tender-detail', params: { id: project.project_tender_id}}">Projektausschreibung: {{ project.project_tender.title }}</v-chip>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="cctOrange" outlined :to="{ name: 'project-edit', params: { id: this.project.id } }" v-if="hasEditPermission()">
          <v-icon left>
            edit
          </v-icon>
          Projekt bearbeiten
        </v-btn>
      </div> 

      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Allgemeines</h2>
          <p class="text-body-2 text--secondary">
            Allgemeine Informationen zu diesem Projekt
          </p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">  
          <v-row v-for="item in projectDetail" :key="item.name" class="my-3">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              {{ item.name }}
            </span>

            <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1">
              {{ item.key }}
            </span>
          </v-row>
          <v-row class="my-3" v-if="project.wms_link">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              WMS-Link
            </span>

            <a class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1" :href="project.wms_link">
              {{ project.wms_link }}
            </a>
          </v-row>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Projektteam</h2>
          <p class="text-body-2 text--secondary"></p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
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
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Dokumente</h2>
          <p class="text-body-2 text--secondary">
            Dokumente zu diesem Projekt
          </p>
        </v-col>
        <v-col cols="12" md="8">  
          <file-manager v-model="this.project.files" :folder="this.project.versioned_folder" :labels="fileLabels" :readonly="true">
          </file-manager>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Kalkulation</h2>
          <p class="text-body-2 text--secondary"></p>
        </v-col>
        <v-col cols="12" md="4" class="px-5">  
          <v-row v-for="item in calculationDetails" :key="item.name" class="my-3">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              {{ item.name }}
            </span>

            <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1">
              {{ item.key }}
            </span>
          </v-row>
        </v-col>
        <v-col md="4" class="px-5">
          <project-calculation :project="project" class="sticky"></project-calculation>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Akquise</h2>
          <p class="text-body-2 text--secondary"></p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
          <v-row v-for="item in acquisitionDetails" :key="item.name" class="my-3">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              {{ item.name }}
            </span>

            <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1">
              {{ item.key }}
            </span>
          </v-row>
          <v-row v-if="project.acquisition_type">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-1" style="font-weight: 300; font-size: 0.9rem;">
              Akquise durch
            </span>

            <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-1">
              <p>{{ $enum('ProjectAcquisitionType', project.acquisition_type)}}</p>
              <p>
                <v-chip v-if="project.acquisition_by">{{ project.acquisition_by }}</v-chip>
                <user-chip :user="project.acquisition_by_user" v-if="project.acquisition_by_user"></user-chip>
                <project-card
                  :project="project.parent_project"
                  outlined
                ></project-card>
              </p>
            </span>
          </v-row>
          <v-row v-if="project.sub_projects && project.sub_projects.length">
            <span class="col-12" style="font-weight: 300; font-size: 0.9rem;">
              Folgeprojekte
            </span>
            <v-col
              v-for="p in project.sub_projects"
              :key="p.id"
              cols="12"
              md="6"
            >
              <project-card
                :project="p"
                outlined
              >
              </project-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
  <loading-page v-else></loading-page>
</template>

<script lang="ts">
import ProjectCard from '../components/ProjectCard.vue'
import { Component, Vue, Watch } from 'vue-property-decorator';
import { readHasAnyPermission, readUserProfile } from '@/store/main/getters';
import FileManager from '@/components/file-manager/FileManager.vue';
import { Route } from 'vue-router';
import UserChip from '@/components/user-chip/UserChip.vue';
import { FILE_LABELS, Project } from '../types';
import { dispatchGetOneProject } from '../store/actions';
import { readRouteProject } from '../store/getters';
import UserListItem from '@/components/user-list-item/UserListItem.vue';
import ProjectCalculation from '../components/ProjectCalculation.vue';
import ViewComponent from '@/components/editor/ViewComponent.vue';

@Component({
  components: { FileManager, UserChip, UserListItem, ProjectCalculation, ProjectCard, ViewComponent },
})
export default class ProjectDetail extends Vue {

  public fileLabels = FILE_LABELS;
  public error = false;
  
  public hasEditPermission() {
    if (this.user?.id === this.project?.author?.id) {
      return true;
    }
    return readHasAnyPermission(this.$store)(['project.project.admin']);
  }

  get project() {
    return readRouteProject(this.$store)(this.$route) as Project;
  }

  get user() {
    return readUserProfile(this.$store);
  }

  public get isSuperuser() {
    return (
      readUserProfile(this.$store)?.id == this.project?.author?.id
    );
  }


  @Watch('$route', { immediate: true} )
  public async onRouteChange(newRoute: Route, oldRoute?: Route) {
    if (newRoute?.params.id !== oldRoute?.params.id && +newRoute.params.id) {
      await dispatchGetOneProject(this.$store, +newRoute.params.id)
    }
  }

  get projectDetail() {
    return [
      {
        name: 'Projektrahmen',
        key: this.$enum('ProjectTypeEnum', this.project.type),
      },
      {
        name: 'Projektart',
        key: this.project.subtype?.join(', '),
      },
      {
        name: 'Projektstatus',
        key: this.$enum('ProjectStatusEnum', this.project.status),
      },
      {
        name: `Projektgröße (${this.project.status === 'completed' ? 'ist' : 'soll'})`,
        key: this.$common.decimal2Text(this.project.status === 'completed' ? this.project.bt_amount_actual : this.project.bt_amount_expected) + ' BT',
      },
      {
        name: 'Zeitraum',
        key: this.project.acceptance_date && this.project.project_end_date_expected && this.$common.formatDateRange(this.project.acceptance_date, this.project.project_end_date_actual || this.project.project_end_date_expected),
      },
    ].filter(c => c);
  }

  get calculationDetails() {
    return [
      {
        name: 'Erstmalige Angebotsabgabe',
        key: this.$common.format(this.project.proposal_date),
        value: this.project.proposal_date,
      },
      {
        name: 'Angebotsannahme',
        key: this.$common.format(this.project.acceptance_date),
        value: this.project.acceptance_date,
      },
      {
        name: 'Projektstart (soll)',
        key: this.$common.format(this.project.project_start_date_expected),
        value: this.project.project_start_date_expected,
      },
      {
        name: 'Projektstart (ist)',
        key: this.$common.format(this.project.project_start_date_actual),
        value: this.project.project_start_date_actual,
      },
      {
        name: 'Projektende (soll)',
        key: this.$common.format(this.project.project_end_date_expected),
        value: this.project.project_end_date_expected,
      },
      {
        name: 'Projektende (ist)',
        key: this.$common.format(this.project.project_end_date_actual),
        value: this.project.project_end_date_actual,
      },
      {
        name: 'Anzahl BT (soll)',
        key: this.$common.decimal2Text(this.project.bt_amount_expected) + ' BT',
        value: this.project.bt_amount_expected,
      },
      {
        name: 'Anzahl BT (ist)',
        key: this.$common.decimal2Text(this.project.bt_amount_actual) +  ' BT',
        value: this.project.bt_amount_actual,
      },
      {
        name: 'BT-Satz in Euro',
        key: this.$common.decimal2Text(this.project.bt_rate, 2) + '€',
        value: this.project.bt_rate,
      },
      {
        name: 'PM-Zuschlag',
        key: this.$common.decimal2Text(this.project.surcharge_amount_project_management) + '%',
        value: this.project.surcharge_amount_project_management,
      },
      {
        name: 'Dokumentationszuschlag',
        key: this.$common.decimal2Text(this.project.surcharge_amount_documentation) + '%',
        value: this.project.surcharge_amount_documentation,
      },
      {
        name: 'Reisekosten',
        key: this.$common.decimal2Text(this.project.surcharge_amount_travel) + '€',
        value: this.project.surcharge_amount_travel,
      },
      {
        name: 'Zuschlag durch Sonstiges',
        key: this.$common.decimal2Text(this.project.surcharge_amount_other) + '€',
        value: this.project.surcharge_amount_other,
      },
      {
        name: 'Aufwand Angebotserstellung (BT)',
        key: this.$common.decimal2Text(this.project.bt_amount_bid_preparation) +  ' BT',
        value: this.project.bt_amount_bid_preparation,
      },
    ].filter(c => c && c.value);
  }

  get acquisitionDetails() {
    return [
      {
        name: 'Kund:innenname',
        key: this.project.customer_name,
        value: this.project.customer_name,
      },
      {
        name: 'Status der Referenzfreigabe',
        key: this.$enum('ProjectReferenceStatusEnum', this.project.reference_status),
        value: this.project.reference_status,
      },
      {
        name: 'Grund, wenn Referenzfreigabe nicht erteilt',
        key: this.project.reference_no_approval_cause,
        value: this.project.reference_no_approval_cause,
      },
      {
        name: 'Grund, wenn Referenzfreigabe nicht angefragt',
        key: this.project.reference_no_inquiry_cause,
        value: this.project.reference_no_inquiry_cause,
      },
      {
        name: 'KFB Status',
        key: this.$enum('KFBStatusEnum', this.project.kfb_status),
        value: this.project.kfb_status,
      },
      {
        name: 'Grund, dass KFB nicht versendet',
        key: this.project.kfb_not_sent_cause,
        value: this.project.kfb_not_sent_cause,
      },
      {
        name: 'Grund, dass KFB abgelehnt',
        key: this.project.kfb_rejected_cause,
        value: this.project.kfb_rejected_cause,
      },
    ].filter(c => c && c.value);
  }
  
}
</script>

<style lang="sass" scoped>

</style>