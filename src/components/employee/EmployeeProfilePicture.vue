<template>
  <v-avatar :size="$attrs.size || 96" :color="imageSrc ? '' : 'cctOrange'" v-bind="$attrs" class="avatar">
    <v-img :src="imageSrc" v-if="imageSrc"></v-img>
    <span v-else v-text="initials" class="white--text headline"></span>
  </v-avatar>
</template>

<script lang="ts">

import {Component, Prop, Vue} from 'vue-property-decorator';
import {IUserProfile} from '@/interfaces';

@Component
export default class EmployeeProfilePicture extends Vue {
  @Prop()
  private employee: IUserProfile | undefined;

  @Prop()
  private src: string | undefined;

  public get imageSrc() {
    return this.src || this.employee?.profile_picture;
  }

  public get initials() {
    if (!this.employee?.full_name) {
      return '';
    }
    const split = this.employee.full_name.split(' ');
    if (!split.length) {
      return '';
    }
    return (split[0][0] + split[split.length - 1][0]).toUpperCase();
  }
}

</script>

<style lang="css">
.avatar {
  border: 1px solid rgba(0,0,0,0.1);
}
</style>
