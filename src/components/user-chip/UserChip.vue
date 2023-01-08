<template>
  <v-chip
    v-bind="$attrs"
    v-on="$listeners"
    v-if="user"
    @click="goToProfile"
  >
    <v-avatar left>
      <employee-profile-picture
        :employee="user"
      ></employee-profile-picture>
    </v-avatar>
    {{ user.full_name || user.email }}
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

  public goToProfile() {
    return this.$router.push({ path: '/main/people/profile/view/' + this.user.id })
  }



}
</script>

<style lang="scss">

</style>