<template>
  <v-chip
    color="lightgrey"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-avatar left>
      <employee-profile-picture
        :employee="user"
      ></employee-profile-picture>
    </v-avatar>
    {{ user.full_name }}
  </v-chip>
</template>

<script lang="ts">
import { IUserProfile } from '@/interfaces'
import { Vue, Component, Prop } from 'vue-property-decorator'
import EmployeeProfilePicture from '../employee/EmployeeProfilePicture.vue';

@Component({ 
  components: { 
    EmployeeProfilePicture  
  }
})
export default class UserChip extends Vue {

  @Prop()
  public user!: IUserProfile;

}
</script>

<style lang="scss">

</style>