<template>
  <v-card outlined max-width="1200px">
    <v-card-text>
      <h2 class="text-h6 mb-2">
        <v-icon>
          mdi-filter
        </v-icon>
        Projektrolle
      </h2>
      <v-chip-group
        v-model="filterRole"
        :multiple="true"
        column
        active-class="cctOrange--text"
      >
        <v-chip
          outlined
          filter
          v-for="value in $enums('ProjectRoleEnum')"
          :key="value.value"
          :value="value.value"
        >
          {{ value.text }}
        </v-chip>
      </v-chip-group>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-text>
      <v-timeline
        :dense="$vuetify.breakpoint.mdAndDown"
        v-if="projects && projects.length"
        align-top
      >
        <v-timeline-item
          v-for="project in projects"
          :key="project.id"
          color="cctPurple"
          fill-dot
          icon="mdi-book"
        >
          <template v-slot:opposite>
            <span class="text-h6 font-weight-bold cctPurple--text align-top">
              {{ project.bt_amount_actual ? $common.decimal2Text(project.bt_amount_actual) + ' BT' : $common.decimal2Text(project.bt_amount_expected) + ' BT (soll)'}}
            </span>
          </template>
          <project-card :project="project" :is-user-profile="true">
            <template v-slot:prepend>
              <div>
                <span 
                  class="text-body-2"
                  v-for="(role, index) in getRolesForUser(project)" 
                  :key="role">
                  {{ index !== 0 ? 'und ' : 'als '}}
                  {{$enum('ProjectRoleEnum', role)}}
                </span>
              </div>
            </template>
          </project-card>
        </v-timeline-item>
      </v-timeline>
      <div v-else>
        Keine Projekte gefunden
      </div>
    </v-card-text>
  </v-card>
</template>


<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { readRouteUser } from '@/store/main/getters';
import { dispatchGetProjectsFor } from '@modules/projects/store/actions';
import { readProjectsForRoute } from '@modules/projects/store/getters';
import ProjectCard from '@modules/projects/components/ProjectCard.vue';
import { compareDesc } from 'date-fns';
import { Project } from '@modules/projects/types';
import UserChip from '@/components/user-chip/UserChip.vue';

@Component({
  components: { ProjectCard, UserChip }
})
export default class UserProfileProjects extends Vue {

  public filterRole: string[] = [];

  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }

  getRolesForUser(project: Project) {
    return Object.entries(project.participants!).reduce((arr, [role, projectUsers]) => {
      const projectUser = projectUsers.find(pu => pu.participant.id === this.userProfile?.id);
      if (projectUser) {
        arr.push(role);
      }
      return arr;
    }, [] as string[]);
  }

  get projects() {
    return readProjectsForRoute(this.$store)(this.$route)
      .filter(project => !this.filterRole.length || this.filterRole.some(role => project?.participants![role]?.find(pu => pu.participant.id === this.userProfile?.id)))
      .sort((a, b) => compareDesc(new Date(a.acceptance_date), new Date(b.acceptance_date)));
  }

  @Watch('userProfile.id', { immediate: true })
  public async onRouteChange(userId?: number, oldUserId?: number) {
    if (!userId || userId === oldUserId) {
      return;
    }
    await dispatchGetProjectsFor(this.$store, userId);
  }

}
</script>
<style lang="scss">
.v-timeline-item__opposite {
  align-self: unset!important;
}
</style>