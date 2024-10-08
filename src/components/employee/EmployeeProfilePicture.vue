<template>
  <component
    :size="small ? undefined : size"
    :color="imageSrc || loadingPicture ? 'grey lighten-2' : 'cctOrange'"
    class="avatar"
    v-bind:is="component"
  >
    <v-img :src="imageSrc" v-if="imageSrc"></v-img>
    <span v-else-if="!this.loadingPicture" v-text="initials" class="white--text text-h5"></span>
  </component>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IUserProfile } from '@/interfaces';
import { dispatchDownloadFile } from '@/store/main/actions';

@Component({})
export default class EmployeeProfilePicture extends Vue {
  @Prop()
  readonly employee!: IUserProfile;

  @Prop({ required: false })
  readonly src?: string | Blob | null;

  @Prop({default: 'v-avatar'})
  readonly component!: string;

  @Prop({default: 96})
  readonly size!: number | string;

  @Prop({default: false, type: Boolean})
  readonly small!: boolean;

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

<style lang="scss" scoped>
.avatar {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
