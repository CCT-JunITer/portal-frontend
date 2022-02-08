<template>
  <v-sheet v-bind="$attrs" class="root px-3" color="gray lighten-5">
    <div class="d-flex my-2">
      <div class="text-overline mb-2">Dateimanager</div>
      <v-spacer></v-spacer>
      <v-btn small text rounded @click="showHistory = !showHistory">
        <v-icon left>
          mdi-history
        </v-icon>
        Historie
      </v-btn>
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
      <v-expand-transition>
        <v-sheet v-show="showHistory" v-if="versionedFolder">
          <div
            v-for="(change, i) in versionedFolder.file_changes"
            :key="i"
          >
            <file-change-component
              :fileChange="change"
            ></file-change-component>
          </div>
        </v-sheet>
      </v-expand-transition>
      <p v-if="!this.versionedFolder || !this.versionedFolder.effective_files.length">
        Noch keine Dateien hochgeladen
      </p>

      <file-chip-group v-else>
        <file-chip :key="file" :filename="file" v-for="file in versionedFolder.effective_files" @[readonly?null:`delete-file`]="removeFile">
        </file-chip>
      </file-chip-group>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import { VersionedFolder } from '@/interfaces';
import { dispatchAddFileToVersionedFolder, dispatchCreateVersionedFolder, dispatchDeleteFileFromVersionedFolder, dispatchGetVersionedFolder, dispatchUploadFile } from '@/store/main/actions';
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import FileChip from '../file-chip/FileChip.vue';
import FileChipGroup from '../file-chip/FileChipGroup.vue';
import UploadButton from '../UploadButton.vue';
import FileChangeComponent from './FileChangeComponent.vue';

@Component({
  components: { FileChipGroup, FileChip, UploadButton, FileChangeComponent }
})
export default class FileManager extends Vue {

  public isUploading = false;
  public dialog = false;
  public files: { file: File; fileName: string; key: number }[] | null = null;

  public versionedFolder: VersionedFolder | null = null;
  public showHistory = false;

  @Prop({ default: false })
  public multiple!: boolean;

  @Prop({ default: false })
  public readonly!: boolean;

  @Prop({ })
  public value?: string;

  @Watch('value', {immediate: true})
  public async onValueChange(newValue: string | null, oldValue: string | null) {
    if (newValue !== oldValue && newValue) {
      let value = newValue;
      if (value) {
        if (Array.isArray(value)) {
          value = value.join(',');
        }
        const isNewFormat = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
        if (!isNewFormat) {
          const files = value.split('/').flatMap(v => v.split(',')).filter(i => i)
          const fileIds: string[] = [];
          for (const file of files) {
            fileIds.push(file);
          }
          if (fileIds.length) {
            this.versionedFolder = await dispatchCreateVersionedFolder(this.$store, { fileIds: fileIds });
            this.input(this.versionedFolder.id);
          }
          return;
        }
      }
      if (this.versionedFolder?.id !== newValue) {
        this.versionedFolder = await dispatchGetVersionedFolder(this.$store, { folderId: newValue });
      }
    }
  }

  @Emit()
  public input(value: string) {
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
    const fileIds: string[] = [];

    for(const { file, fileName } of this.files) {
      const response = await dispatchUploadFile(this.$store, {
        file,
        fileName
      });
      if (response) {
        fileIds.push(response.filename)
      } 
    }
    if (!this.versionedFolder) {
      this.versionedFolder = await dispatchCreateVersionedFolder(this.$store, { fileIds: fileIds })
    } else {
      this.versionedFolder = await dispatchAddFileToVersionedFolder(this.$store, { folderId: this.versionedFolder.id, fileIds: fileIds})
    }
    this.input(this.versionedFolder.id)
    this.isUploading = false;
  }


  public async removeFile(file: string) {
    this.versionedFolder = await dispatchDeleteFileFromVersionedFolder(this.$store, { folderId: this.versionedFolder?.id, fileIds: [file] })
    this.input(this.versionedFolder.id);
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