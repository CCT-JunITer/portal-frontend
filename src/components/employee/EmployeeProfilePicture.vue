<template>
  <component
    :size="$props.small ? undefined : $props.size"
    :color="imageSrc || loadingPicture ? 'grey lighten-2' : 'cctOrange'"
    class="avatar"
    v-bind:is="component"
    v-bind="$attrs"
  >
    <v-img :src="imageSrc" v-if="imageSrc"></v-img>
    <span v-else-if="!this.loadingPicture" v-text="initials" class="white--text headline"></span>
  </component>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IUserProfile } from '@/interfaces';
import { dispatchDownloadFile } from '@/store/main/actions';

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
  private src: string | null | undefined;

  public pictureUrl = '';

  public loadingPicture = true;


  @Watch('employee', { immediate: true })
  public onEmployeeChange(newVal: IUserProfile, oldVal: IUserProfile | undefined) {
    if (newVal?.profile_picture !== oldVal?.profile_picture) {
      this.fetchProfilePicture();
    }
  }

  private async fetchProfilePicture() {
    if (!this.employee?.profile_picture) {
      if (this.pictureUrl) {
        URL.revokeObjectURL(this.pictureUrl);
      }
      this.pictureUrl = '';
      this.loadingPicture = false;
      return;
    }
    this.loadingPicture = true;
    const imageBlob = await dispatchDownloadFile(this.$store, { filename: this.employee.profile_picture });
    if (imageBlob) {
      this.pictureUrl = URL.createObjectURL(imageBlob);
    } else {
      this.pictureUrl = '';
    }
    this.loadingPicture = false;
  }

  public destroyed() {
    if (this.pictureUrl) {
      URL.revokeObjectURL(this.pictureUrl);
    }
  }

  public get imageSrc() {
    return (this.src === null || this.src) ? this.src : this.pictureUrl;
  }

  public get initials() {
    if (!this.employee?.full_name) {
      return '';
    }
    if (this.$props.small) {
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
