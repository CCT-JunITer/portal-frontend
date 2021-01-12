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
  private employee!: IUserProfile;

  @Prop()
  private src!: string | Blob | null;

  public pictureUrl = '';

  public loadingPicture = true;

  @Watch('src', {immediate: true})
  public onSrcChange(newSrc?: Blob, oldSrc?: Blob) {
    if (typeof newSrc?.arrayBuffer === 'function' && newSrc !== oldSrc) {
      this.fetchImage(newSrc);
    }
  }

  @Watch('employee', { immediate: true })
  public onEmployeeChange(newVal: IUserProfile, oldVal: IUserProfile | undefined) {
    if (newVal?.profile_picture !== oldVal?.profile_picture) {
      if (this.src) {
        return;
      }
      this.fetchImage(newVal.profile_picture);
    }
  }

  private async fetchImage(input: string | Blob) {
    if (this.pictureUrl) {
      URL.revokeObjectURL(this.pictureUrl);
    }
    this.pictureUrl = '';
    if (!input) {
      this.loadingPicture = false;
      return;
    }
    this.loadingPicture = true;

    let imageBlob: Blob;
    if (typeof input === 'string') {
      imageBlob = await dispatchDownloadFile(this.$store, { filename: input });
    } else {
      imageBlob = input;
    }
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
    if (this.src === null || (this.src && typeof this.src === 'string')) {
      return this.src;
    }
    return this.pictureUrl;
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
