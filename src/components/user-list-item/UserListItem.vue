<template>
  <v-list-item @click="goToProfile" v-bind="$attrs" v-on="$listeners">
    <employee-profile-picture
      :employee="user"
      component="v-list-item-avatar"
      size="24"
    ></employee-profile-picture>

    <v-list-item-content>
      <v-list-item-title v-text="user.full_name"></v-list-item-title>
      <v-list-item-subtitle v-text="user.ressort"></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <slot name="actions"></slot>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { IUserProfile } from '@/interfaces'
import { Vue, Component, Prop } from 'vue-property-decorator'
import EmployeeProfilePicture from '../employee/EmployeeProfilePicture.vue';

@Component({
  components: { EmployeeProfilePicture }
})
export default class UserListItem extends Vue {

  @Prop()
  public user!: IUserProfile;

  public goToProfile() {
    return this.$router.push({ path: '/main/people/profile/view/' + this.user.id })
  }

}
</script>

<style lang="scss">

</style>