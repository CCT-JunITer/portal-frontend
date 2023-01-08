<template>
  <v-card v-bind="$attrs" v-on="$listeners" v-if="project">
    <v-card-text>
      <slot name="prepend"></slot>
      <p class="text-h5 text--primary">
        {{ project.title }}
      </p>
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
          <div v-for="[role, projectUsers] in Object.entries(project.participants)" :key="role">
            <div class="text-overline">{{$enum('ProjectRoleEnum', role)}}</div>
            <user-chip
              v-for="projectUser in projectUsers"
              :key="projectUser.participant.id"
              :user="projectUser.participant"
              small
            >
            </user-chip>
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

}
</script>

<style lang="scss">

</style>