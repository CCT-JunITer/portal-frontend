<template>
  <v-card 
    v-bind="$attrs"
    v-on="$listeners"
    outlined>
    <v-card-text>
      <v-list-item three-line class="align-start">
        <div class="flex-1"> 
          <h5 class="text-h5 mb-1">
            {{ projectTender.title }}
          </h5>
          <div>
            <user-chip :user="projectTender.author"></user-chip>
          </div>
        </div>

        <div class="ml-4">
          <div>
            <v-icon small>mdi-bell</v-icon>
            <span class="text-caption">{{ $common.format(projectTender.date_deadline, 'dd.MM.yyyy - HH:mm') }}</span>
          </div>
          <div>
            <v-icon small>mdi-clock</v-icon>
            <span class="text-caption">{{ $common.formatDateRange(projectTender.project_start_date_expected, projectTender.project_end_date_expected) }}</span>
          </div>
          <div>
            <v-icon small>mdi-briefcase</v-icon>
            <span class="text-caption">{{ projectTender.min_bt + 'BT' }} {{ (projectTender.max_bt && projectTender.max_bt !== projectTender.min_bt) ? (' - ' +  projectTender.max_bt + 'BT') : '' }}</span>
          </div>
        </div>
      </v-list-item>
    </v-card-text>
    <div class="pa-2">
      <view-component :value="projectTender.description" style="max-height: 200px; overflow: auto; font-size: unset;"/>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small outlined color="cctPurple" :to="{ name: 'project-tender-detail', params: { id: projectTender.id }}">
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import ViewComponent from '@/components/editor/ViewComponent.vue';
import UserChip from '@/components/user-chip/UserChip.vue';
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ProjectTender } from '../types'

@Component({
  components: { UserChip, ViewComponent }
})
export default class ProjectTenderCard extends Vue {
  @Prop()
  public projectTender!: ProjectTender;
}
</script>

<style lang="scss">

</style>