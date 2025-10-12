<template>
  <v-card 
    v-bind="$attrs" 
    v-on="$listeners" 
    v-if="project"
    :class="{ 
      'rejected-project': isUserProfile && project.status === 'rejected',
      'aborted-project': isUserProfile && project.status === 'aborted',
      'completed-project': isUserProfile && project.status === 'completed',
      'running-project': isUserProfile && project.status === 'running'
    }"
  >
    <v-card-text>
      <slot name="prepend"></slot>
      <div class="d-flex align-center">
        <p class="text-h5 text--primary mb-0">
          {{ project.title }}
        </p>
        <v-chip
          v-if="isUserProfile"
          class="ml-2"
          :color="statusChipColor"
          outlined
          small
        >
          <v-icon small left>{{ statusIcon }}</v-icon>
          {{ statusText }}
        </v-chip>
      </div>
      <span class="text-overline purple--text">
        {{ $enum('ProjectTypeEnum', project.type) }}
      </span>
      <v-chip
        v-for="category in project.categories" 
        :key="category"
        class="ma-1"
        pill
        small
      >
        {{ category }}
      </v-chip>
    </v-card-text>
    <v-card-text>
      <slot name="append"></slot>
      {{ project.acceptance_date && $common.formatDateRange(project.acceptance_date, project.project_end_date_actual || project.project_end_date_expected || '') }}
      {{ project.bt_amount_actual ? $common.decimal2Text(project.bt_amount_actual) + ' BT' : $common.decimal2Text(project.bt_amount_expected) + ' BT (soll)'}}
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="orange lighten-2"
        text
        :to="{ name: 'project', params: { id: project.id} }"
      >
        Details
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text>      
          {{ project.description }}
          <div v-for="[role, projectUsers] in Object.entries(project.participants || {})" :key="role">
            <div class="text-overline">{{$enum('ProjectRoleEnum', role)}}</div>
            <div class="d-flex flex-wrap align-center">
              <div
                v-for="projectUser in projectUsers"
                :key="projectUser.participant.id"
                class="mr-2 mb-2 d-flex align-center"
              >
                <user-chip
                  :user="projectUser.participant"
                  small
                  class="mr-1"
                ></user-chip>
                <v-chip
                  v-if="projectUser.bt_amount"
                  x-small
                  color="cctBlue"
                  outlined
                >
                  {{ $common.decimal2Text(projectUser.bt_amount) }} BT
                </v-chip>
              </div>
            </div>
          </div>

          
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import UserChip from '@/components/user-chip/UserChip.vue';
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Project } from '../types'

@Component({ 
  components: { UserChip },
})
export default class ProjectCard extends Vue {

  public show = false;

  @Prop()
  public project!: Project;

  @Prop({ default: false })
  public isUserProfile!: boolean;

  get statusChipColor() {
    const statusColors = {
      running: 'primary',
      completed: 'cctGreen',
      aborted: 'cctOrange',
      rejected: 'error'
    };
    return statusColors[this.project.status] || 'grey';
  }

  get statusIcon() {
    const statusIcons = {
      running: 'mdi-play-circle',
      completed: 'mdi-check-circle',
      aborted: 'mdi-stop-circle',
      rejected: 'mdi-close-circle'
    };
    return statusIcons[this.project.status] || 'mdi-help-circle';
  }

  get statusText() {
    const statusTexts = {
      running: 'Laufend',
      completed: 'Abgeschlossen',
      aborted: 'Abgebrochen',
      rejected: 'Abgelehnt'
    };
    return statusTexts[this.project.status] || this.project.status;
  }

}
</script>

<style lang="scss">
.rejected-project {
  opacity: 0.7;
  border-left: 4px solid var(--v-error-base) !important;
  background-color: rgba(244, 67, 54, 0.05);
}

.aborted-project {
  opacity: 0.75;
  border-left: 4px solid var(--v-cctOrange-base) !important;
  background-color: rgba(255, 100, 0, 0.05);
}

.completed-project {
  border-left: 4px solid var(--v-cctGreen-base) !important;
  background-color: rgba(62, 138, 131, 0.05);
}

.running-project {
  border-left: 4px solid var(--v-primary-base) !important;
  background-color: rgba(29, 69, 124, 0.05);
}
</style>