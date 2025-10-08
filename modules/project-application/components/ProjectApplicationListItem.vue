<template>
  <v-list-item v-bind="$attrs" v-on="$listeners" three-line>
    <employee-profile-picture
      :employee="projectApplication.participant"
      component="v-list-item-avatar"
      size="24"
    ></employee-profile-picture>

    <v-list-item-content>
      <v-list-item-title>{{ projectApplication.participant.full_name }}</v-list-item-title>
      <v-list-item-subtitle v-for="role in projectApplication.roles" :key="role">{{ $enum('ProjectRoleEnum', role) }}</v-list-item-subtitle>
      <v-list-item-subtitle><v-chip small>{{ $enum('ProjectApplicationStatusEnum', projectApplication.status) }}</v-chip></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        v-if="isProjektmanager"
        icon
        small
        color="cctOrange"
        :to="{ name: 'pm-user-detail', params: { id: projectApplication.participant.id.toString() } }"
        title="PM-Profil anzeigen"
      >
        <v-icon small>mdi-account-details</v-icon>
      </v-btn>
      <slot name="actions"></slot>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ProjectApplication } from '../types'
import { readIsProjektmanager } from '@/store/main/getters'

@Component({
  components: { EmployeeProfilePicture }
})
export default class ProjectApplicationListItem extends Vue {

  @Prop()
  public projectApplication!: ProjectApplication;

  public get isProjektmanager() {
    return readIsProjektmanager(this.$store);
  }

}
</script>

<style lang="scss">

</style>