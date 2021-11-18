<template>
  <v-sheet v-bind="$attrs" class="root px-3" color="gray lighten-5">
    <div class="d-flex my-2">
      <div class="text-overline mb-2">Dateimanager</div>
      <v-spacer></v-spacer>

      <upload-button
        v-if="!readonly"
        :loading="this.isUploading"
        :disabled="this.isUploading"
        :multiple="multiple"
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
        @files="onFileChanged"
        class="upload-button"
        color="cctOrange"
        depressed
        outlined
        rounded
        small
      >
        <v-icon left>
          cloud_upload
        </v-icon>
        Datei{{ multiple ? 'en' : '' }} hochladen
      </upload-button>
    </div>
    <div>
      <p v-if="!this.value.length">
        Noch keine Dateien hochgeladen
      </p>

      <file-chip-group v-else>
        <file-chip :key="file" :filename="file" v-for="file in value" @delete-file="removeFile">
        </file-chip>
      </file-chip-group>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { dispatchUploadFile } from '@/store/main/actions';
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import FileChip from '../file-chip/FileChip.vue';
import FileChipGroup from '../file-chip/FileChipGroup.vue';
import UploadButton from '../UploadButton.vue';

@Component({
  components: { FileChipGroup, FileChip, UploadButton }
})
export default class FileManager extends Vue {

  public isUploading = false;

  @Prop({ default: false })
  public multiple!: boolean;

  @Prop({ default: false })
  public readonly!: boolean;

  @Prop({ default: [] })
  public value!: string[];

  @Emit()
  public input(value: string[]) {
    return value;
  }

  public async onFileChanged(files: File[]) {
    this.isUploading = true;
    for(const file of files) {
      const response = await dispatchUploadFile(this.$store, {
        file: file,
      });
      if (response) {
        this.input([...this.value, response.filename]);
      }
    }
    this.isUploading = false;
  }


  public removeFile(file: string) {
    this.input(this.value.filter(f => f !== file))
  }
}
</script>

<style lang="scss" scoped>
.root {
  border: 1px dashed rgb(78, 78, 78);
  border-radius: 8px;
  width: 100%;
  position: relative;
}

</style>