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
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
      >
        <v-card v-if="this.files">
          <v-card-title>
            <span class="text-h5">Datei umbenennen</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-for="file in this.files"
              :key="file.key"
              label="Dateiname"
              v-model="file.fileName"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="uploadFiles"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div>
      <p v-if="!this.value.length">
        Noch keine Dateien hochgeladen
      </p>

      <file-chip-group v-else>
        <file-chip :key="file" :filename="file" v-for="file in value" @[readonly?null:`delete-file`]="removeFile">
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
  public dialog = false;
  public files: { file: File; fileName: string; key: number }[] | null = null;

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

  public onFileChanged(files: File[]) {
    this.files = files.map((file, i) => ({ file, fileName: file.name, key: i }));
    this.dialog = true;
  }

  public async uploadFiles() {
    if (!this.files) {
      return;
    }
    this.isUploading = true;
    this.dialog = false;
    for(const { file, fileName } of this.files) {
      const response = await dispatchUploadFile(this.$store, {
        file,
        fileName
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