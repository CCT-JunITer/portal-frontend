<template>
  <div>
    <div class="d-flex">
      <div class="flex">
        <h1 class="text-h2 text--primary mb-3">
          {{ projectTender.title }}
        </h1>
        <user-chip :user="projectTender.author"></user-chip>
      </div>

      <div>
        <slot name="actions"></slot>

        <div>
          <v-icon small>mdi-bell</v-icon>
          <span class="text-caption">{{ $common.format(projectTender.date_deadline, 'dd.MM.yyyy - HH:mm') }} ({{ formatDistanceStrict(new Date(projectTender.date_deadline), new Date(), { locale: $common.de, addSuffix: true }) }})</span>
        </div>
        <div>
          <v-icon small>mdi-clock</v-icon>
          <span class="text-caption">{{ $common.formatDateRange(projectTender.project_start_date_expected, projectTender.project_end_date_expected) }}</span>
        </div>
        <div>
          <v-icon small>mdi-briefcase</v-icon>
          <span class="text-caption">{{ projectTender.min_bt + 'BT' }} {{ (projectTender.max_bt && projectTender.max_bt !== projectTender.min_bt) ? (' - ' +  projectTender.max_bt + 'BT') : '' }}</span>
        </div>
        <div v-if="projectTender.offer_needed">
          <v-icon small>mdi-presentation</v-icon>
          <span class="text-caption">Angebot notwendig</span>
        </div>
        <div>
          <v-icon small>mdi-briefcase-download</v-icon>
          <span class="text-caption">{{ (((projectTender.min_bt + projectTender.max_bt)/2)/sumRoles(projectTender)).toFixed(2) }} BT/Person</span>
        </div>
      </div>
    </div>

    <div class="mt-5">
      <view-component :value="projectTender.description" view></view-component>
      <file-manager
        v-model="projectTender.files"
        :folder="projectTender.versioned_folder"
        :readonly="true"
        :noManager="true"
      >
      </file-manager>
    </div>
  </div>
</template>

<script lang="ts">
import { ProjectTender } from '@modules/project-application/types';
import { formatDistanceStrict } from 'date-fns';
import { Vue, Component, Prop } from 'vue-property-decorator'
import FileManager from '@/components/file-manager/FileManager.vue';
import UserChip from '@/components/user-chip/UserChip.vue';
import ViewComponent from '@/components/editor/ViewComponent.vue';

@Component({
  components: { FileManager, UserChip, ViewComponent }
})
export default class ProjectTenderDetailComponent extends Vue {

  public formatDistanceStrict = formatDistanceStrict;

  public sumRoles = (tender:ProjectTender): number => {
    let sum  = 0;
    const x = tender.needed_project_roles_counts;
    Object.keys(x).forEach(key => {
      sum += x[key]
    });
    return sum;
  };

  @Prop()
  public projectTender!: ProjectTender;

}
</script>

<style lang="scss">

</style>