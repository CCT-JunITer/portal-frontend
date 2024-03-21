<template>
  <v-container>
    <v-row class="my-3" v-if="hasProjectTenderPermission()">
      <v-col cols="12" class="text-center">
        <v-btn large color="cctPurple" dark :to="{name: 'project-tender-create'}">Projektausschreibung erstellen</v-btn>
      </v-col>
    </v-row>

    <v-row v-for="[key, tenders] in Object.entries(projectTenders)" :key="key">
      <v-col cols="12">
        <h6 class="text-overline mb-1">
          {{ key === 'passed' ? 'Abgelaufene Ausschreibungen' : 'Laufende Ausschreibungen'}}
        </h6>
      </v-col>
      <template
        v-if="tenders && tenders.length"
      >
        <v-col
          cols="12"
          md="6"
          v-for="projectTender in tenders"
          :key="projectTender.id"
        >
          <project-tender-card :project-tender="projectTender">
          </project-tender-card>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
          <v-alert color="cctGrey" dark outlined>
            Keine 
            {{ key === 'passed' ? 'abgelaufenen Ausschreibungen' : 'laufenden Ausschreibungen'}}
            vorhanden
          </v-alert>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Backdrop from '@/components/Backdrop.vue';
import { readHasAnyPermission } from '@/store/main/getters';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router';
import ProjectTenderCard from '../components/ProjectTenderCard.vue';
import { dispatchGetProjectTenders } from '../store/actions';
import { readProjectTenders } from '../store/getters'
import { ProjectTender } from '../types';

@Component({
  components: { ProjectTenderCard, Backdrop }
})
export default class ProjectApplicationList extends Vue {

  public get projectTenders() {
    const projectTenders = readProjectTenders(this.$store);
    const compare = (asc: boolean) => (a: ProjectTender, b: ProjectTender) => (new Date(b.date_deadline).getTime() - new Date(a.date_deadline).getTime()) * (asc ? 1 : -1);

    return {
      running: projectTenders?.sort(compare(false)).filter(tender => !tender.is_deadline_passed),
      passed: projectTenders?.sort(compare(true)).filter(tender => tender.is_deadline_passed),
    }
  }

  public hasProjectTenderPermission() {
    return readHasAnyPermission(this.$store)(['portal.project-tender.create']);
  }

  @Watch('$route', { immediate: true })
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute !== oldRoute) {
      await dispatchGetProjectTenders(this.$store);
    }
  }


}
</script>

<style lang="scss">

</style>