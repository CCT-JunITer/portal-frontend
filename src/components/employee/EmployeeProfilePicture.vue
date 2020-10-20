<template>
  <v-avatar :size="$attrs.size || 96" color="cctOrange" v-bind="$attrs">
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

  public get imageSrc() {
    return null;
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
