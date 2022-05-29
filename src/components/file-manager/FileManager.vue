<template>
  <v-sheet v-bind="$attrs" class="root px-3" color="gray lighten-5" v-if="!noManager">
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
            <div
              v-for="file in this.files"
              :key="file.key"
            >
              <v-text-field
                label="Label"
                v-model="file.label"
              >
              </v-text-field>
              <v-text-field
                label="Dateiname"
                v-model="file.fileName"
                required
              ></v-text-field>
            </div>
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


      <file-chip-group 
        v-else 
        v-for="[category, files] of Object.entries(effectiveFiles)"
        :label="category"
        :key="category">
        <file-chip :key="file.file_id" :file="file" v-for="file in files" @[readonly?null:`delete-file`]="removeFile" :noLabel="true">
        </file-chip>
      </file-chip-group>
    </div>
  </v-sheet>
  <div v-else-if="versionedFolder">
    <file-chip-group 
      v-for="[category, files] of Object.entries(effectiveFiles)"
      :label="category"
      :key="category">
      <file-chip :key="file.file_id" :file="file" v-for="file in files" :noLabel="true">
      </file-chip>
    </file-chip-group>
  </div>
</template>

<script lang="ts">
import { LabelledFile, VersionedFolder } from '@/interfaces';
import { dispatchAddFileToVersionedFolder, dispatchCreateVersionedFolder, dispatchDeleteFileFromVersionedFolder, dispatchGetUsers, dispatchGetVersionedFolder, dispatchUploadFile } from '@/store/main/actions';
import { readUsers } from '@/store/main/getters';
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
  public files: { file: File; fileName: string; key: number; label?: string }[] | null = null;

  public versionedFolder: VersionedFolder | null = null;
  public showHistory = false;

  get effectiveFiles(): { [k: string]: LabelledFile[] } {
    return this.versionedFolder?.effective_files.reduce((prev, curr) => {
      const files = prev[curr.label || ''] || []
      files.push(curr)
      prev[curr.label || ''] = files
      return prev;
    }, {}) || {}
  }

  @Watch('showHistory')
  public async onOpenHistory(showHistory: boolean) {
    if (showHistory && !readUsers(this.$store).length) {
      await dispatchGetUsers(this.$store);
    }
  }

  @Prop({ default: false })
  public multiple!: boolean;

  @Prop({ default: false })
  public readonly!: boolean;

  @Prop({ default: false })
  public noManager!: boolean;

  @Prop({ })
  public value?: string;

  @Prop({ required: false })
  public folder?: VersionedFolder;

  @Watch('folder', { immediate: true })
  public onFolderChange(newFolder?: VersionedFolder, oldFolder?: VersionedFolder) {
    if (newFolder?.id !== oldFolder?.id && newFolder) {
      this.versionedFolder = newFolder;
    }
  }

  @Watch('value', { immediate: true })
  public async onValueChange(newValue: string | null, oldValue: string | null) {
    if (this.folder) {
      return;
    }
    if (!newValue) {
      this.versionedFolder = null;
    }
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
            // this.versionedFolder = await dispatchCreateVersionedFolder(this.$store, { fileIds: fileIds });
            // this.input(this.versionedFolder.id);
            this.versionedFolder = { id: '', effective_files: fileIds.map(id => ({ file_id: id })), file_changes: []}
          }
          console.warn('Using old file-manager, consider using versioned files')
          return;
        }
      }
      if (this.versionedFolder?.id !== newValue) {
        this.versionedFolder = await dispatchGetVersionedFolder(this.$store, { folderId: newValue });
        console.warn('Had to fetch versioned folder, consider joining versioned files in backend and using prop "folder"')
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
    const files: LabelledFile[] = [];

    for(const { file, fileName, label } of this.files) {
      try {
        const response = await dispatchUploadFile(this.$store, {
          file,
          fileName
        });
        if (response) {
          files.push({ file_id: response.filename, label: label })
        } 
      } catch(e) {
        continue;
      }
    }
    if (!this.versionedFolder?.id) {
      this.versionedFolder = await dispatchCreateVersionedFolder(this.$store, { files: [...(this.versionedFolder?.effective_files || []), ...files] })
    } else {
      this.versionedFolder = await dispatchAddFileToVersionedFolder(this.$store, { folderId: this.versionedFolder.id, files: files})
    }
    this.input(this.versionedFolder.id)
    this.isUploading = false;
  }


  public async removeFile(file: string) {
    this.versionedFolder = await dispatchDeleteFileFromVersionedFolder(this.$store, { folderId: this.versionedFolder!.id, files: [file] })
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