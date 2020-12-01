<template>
  <component
    :size="$props.small ? undefined : $props.size"
    :color="imageSrc ? '' : 'cctOrange'"
    class="avatar"
    v-bind:is="component"
    v-bind="$attrs"
  >
    <v-img :src="imageSrc" v-if="imageSrc"></v-img>
    <span v-else v-text="initials" class="white--text headline"></span>
  </component>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';
import { IUserProfile } from '@/interfaces';

@Component({
  props: {
    component: {
      default: 'v-avatar',
      type: String,
    },
    size: {
      type: [Number, String],
      default: 96,
    },
    small: {
      type: Boolean,
      default: false,
    }
  }
})
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
    if(this.$props.small) {
      return this.employee.full_name.toUpperCase().charAt(0);
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
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
