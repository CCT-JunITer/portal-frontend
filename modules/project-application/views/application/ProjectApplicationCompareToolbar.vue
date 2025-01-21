<template>
  <v-toolbar
    v-if="projectApplications && projectApplications.length"
    :color="comparingApplications.length ? 'cctPurple' : 'grey'"
    v-bind="$attrs"
    v-on="$listeners"
    dark
  >
    <v-btn icon v-if="!comparingApplications.length" @click="comparingApplications = projectApplications || []">
      <v-icon>mdi-checkbox-blank-outline</v-icon>
    </v-btn>

    <v-btn
      v-else
      icon
      @click="comparingApplications = []"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-chip-group
      v-if="filtersValue"
      :value="filtersValue"
      @change="$emit('update:filters', $event)"
      multiple
      active-class="purple text--white"
    >
      <v-chip
        v-for="status in $enums('ProjectApplicationStatusEnum')"
        :key="status.value"
        :value="status.value"
        small
        color="cctGray"
      >
        {{ status.text }}
      </v-chip>
    </v-chip-group>
    <v-toolbar-title>{{ comparingApplications.length ? `${comparingApplications.length} ausgewählt` : 'Projektbewerbungen vergleichen' }}</v-toolbar-title>


    <v-spacer></v-spacer>
    <v-btn
      v-if="comparingApplications.length >= 1"
      text
      outlined
      @click="$emit('compare')">Vergleichen</v-btn>
  </v-toolbar>
  <div v-else class="no-applications-message">
    <p>Keine Bewerbungen vorhanden</p>
  </div>
</template>

<script lang="ts">
import { ProjectApplication, ProjectApplicationStatusEnum } from '@modules/project-application/types';
import { Vue, Component, Prop, ModelSync } from 'vue-property-decorator'

@Component
export default class ProjectApplicationCompareToolbar extends Vue {

  @ModelSync('compareApplications', 'update:compareApplications') comparingApplications!: ProjectApplication[];
  
  @ModelSync('filters', 'update:filters') filtersValue?: ProjectApplicationStatusEnum[];

  @Prop() projectApplications!: ProjectApplication[];

}
</script>

<style lang="scss">
.no-applications-message {
  text-align: center;
  color: grey;
  padding: 20px;
  font-weight: bold;  /* Fett gedruckt */
  font-size: 18px;    /* Schriftgröße etwas erhöht */
}
</style>