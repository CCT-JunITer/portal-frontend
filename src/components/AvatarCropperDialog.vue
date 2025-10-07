<template>
  <v-dialog v-bind="$attrs" max-width="380">
    <v-card>
      <v-card-title>
        <span class="text-h5">Avatar ändern</span>
      </v-card-title>
      <v-card-text>
        <cropper
          v-if="this.compressedInputAvatar"
          class="cropper"
          :src="this.compressedInputAvatar"
          stencil-component="circle-stencil"
          backgroundClass="background"
          :stencil-props="{
            aspectRatio: 1,
          }"
          @change="changeCropper"
        ></cropper>
        <v-skeleton-loader type="card" v-else class="mx-auto"></v-skeleton-loader>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" right text color="cctOrange darken-2">Abbrechen</v-btn>
        <v-btn :loading="!croppedAvatar" @click="avatar" right text color="cctGreen darken-2">Hochladen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import Compressor from 'compressorjs';
import { commitAddNotification } from '@/store/main/mutations';


@Component({
  components: {Cropper, CircleStencil}
})
export default class AvatarCropperDialog extends Vue {
  @Prop({ default: null })
  private inputAvatar!: Blob | null;
  private compressedInputAvatar: string | null = null;
  private compressedBlob?: Blob;
  private croppedAvatar: Blob | null = null;

  @Watch('inputAvatar', { immediate: true })
  public onInputAvatarChange(newAvatar: Blob | null, oldAvatar: Blob | null) {
    if(newAvatar !== oldAvatar) {
      if (newAvatar) {
        new Compressor(newAvatar, {
          strict: true,
          maxWidth: 512,
          maxHeight: 512,
          success: (file: Blob) => {
            if (file.size > 2000 * 1000) {
              commitAddNotification(this.$store, { content: 'Datei ist zu groß', color: 'red' });
              return;
            }
            this.compressedBlob = file;
            const fileReader = new FileReader();
            fileReader.onloadend = (e) => {
              this.croppedAvatar = null;
              this.compressedInputAvatar = e.target?.result as string;
            }
            fileReader.readAsDataURL(file);
          }
        });
      } else {
        this.compressedInputAvatar = null;
        this.croppedAvatar = null;
      }
    }
  }

  @Emit()
  public close(e) {
    return e;
  }

  @Emit()
  public avatar() {
    return this.croppedAvatar;
  }

  private changeCropper(e) {
    e.canvas.toBlob((blob: Blob) => {
      this.croppedAvatar = blob;
    }, this.compressedBlob?.type);
  }

}
</script>

<style scoped>
.cropper {
  height: 300px;
}
.background {
  background-color: white;
}
</style>
