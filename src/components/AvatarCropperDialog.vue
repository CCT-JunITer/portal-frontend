<template>
  <v-dialog v-bind="$attrs" max-width="380">
    <v-card>
      <v-card-title>
        <span class="headline">Avatar ändern</span>
      </v-card-title>
      <v-card-text>
        <cropper
          class="cropper"
          :src="this.inputAvatar"
          stencil-component="circle-stencil"
          backgroundClass="background"
          :stencil-props="{
            aspectRatio: 1,
          }"
          @change="changeCropper"
        ></cropper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" right text color="cctOrange darken-2">Abbrechen</v-btn>
        <v-btn @click="avatar" right text color="cctGreen darken-2">Hochladen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';

@Component({
  components: {Cropper, CircleStencil}
})
export default class AvatarCropperDialog extends Vue {
  @Prop()
  private inputAvatar: string | null = null;
  private croppedAvatar: string | null = null;

  @Emit()
  public close(e) {
    return e;
  }

  @Emit()
  public avatar(e) {
    return this.croppedAvatar;
  }

  private changeCropper(e) {
    this.croppedAvatar = e.canvas.toDataURL('image/png')
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
