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
        ref="fileUpload"
        v-if="!readonly"
        :loading="this.isUploading"
        :disabled="this.isUploading"
        :multiple="multiple"
        accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.xlsx,.xls,.pptx,.ppt,.zip"
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
      <file-upload-dialog
        v-model="dialog"
        :files="files"
        @uploadFiles="uploadFiles"
        :labels="labels"
      >
      </file-upload-dialog>
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
      <div v-if="readonly">
        <file-chip-group 
          v-for="[category, files] of Object.entries(effectiveFiles)"
          :label="category"
          :key="category">
          <file-chip :key="file.file_id" :file="file" v-for="file in files" @[readonly?null:`delete-file`]="removeFile" :noLabel="true">
          </file-chip>
        </file-chip-group>
      </div>
      <template v-else>
        <div
          v-for="category of allLabels"
          :key="category"
        >
          <file-chip-group 
            :label="category">
            <file-chip
              :key="file.file_id"
              :file="file"
              v-for="file in effectiveFiles[category]"
              @[readonly?null:`delete-file`]="removeFile"
              :noLabel="true"
            >
            </file-chip>
          </file-chip-group>
          <div class="d-flex align-center ml-3">
            <v-btn
              small
              rounded
              color="cctOrange"
              outlined
              @click="(defaultLabel = category) && $refs.fileUpload.trigger()"
            >
              <v-icon left>
                cloud_upload
              </v-icon>
              Datei{{ multiple ? 'en' : '' }} hochladen
            </v-btn>
            <template
              v-if="!effectiveFiles[category] && requiredLabels && requiredLabels.indexOf(category) !== -1"
            >
              <span class="mx-4 text-caption">oder</span>
              <v-text-field
                v-model="missingFiles[category]"
                outlined
                label="Grund für fehlende Datei"
                dense
                :rules="[v => !!v || 'Diese Datei wird benötigt']"
              >
                <template v-slot:append-outer>
                  <v-btn
                    :disabled="!missingFiles[category]" 
                    icon
                    color="green"
                    @click="addMissingFile(category, missingFiles[category])">
                    <v-icon>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </template>
          </div>
        </div>
      </template>
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
import FileUploadDialog from './FileUploadDialog.vue';

@Component({
  components: { FileChipGroup, FileChip, UploadButton, FileChangeComponent, FileUploadDialog }
})
export default class FileManager extends Vue {

  public isUploading = false;
  public dialog = false;
  public files: { file: File; fileName: string; fileExtention: string; key: number; label?: string; formValid: boolean }[] | null = null;

  public versionedFolder: VersionedFolder | null = null;
  public showHistory = false;
  public defaultLabel = '';
  public missingFiles = {};

  get allLabels() {
    return new Set(
      [...(this.labels || []), ...(this.versionedFolder?.effective_files.map(file => file.label) || [])]
        .filter(c => c !== null)
    )
  }

  get effectiveFiles() {
    if (!this.versionedFolder) {
      return {};
    }
    if (!this.labels) {
      return { '': this.versionedFolder.effective_files };
    }
    return this.versionedFolder.effective_files.reduce((prev, curr) => {
      if (this.labels && !this.labels.includes(curr.label || '')) {
        return prev;
      }
      const label = curr.label || 'Sonstige'
      const files = prev[label] || []
      files.push(curr)
      prev[label] = files
      return prev;
    }, {} as { [k: string]: LabelledFile[] }) || {}
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

  @Prop({ required: false })
  public labels?: string[];

  @Prop({ required: false })
  public requiredLabels?: string[];

  @Prop({ default: false })
  public noManager!: boolean;

  @Prop({ })
  public value?: string;

  @Prop({ required: false })
  public folder?: VersionedFolder;

  @Watch('folder', { immediate: true })
  public onFolderChange(newFolder?: VersionedFolder) {
    if (newFolder) {
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
    if (newValue !== oldValue && newValue && this.versionedFolder?.id !== newValue) {
      this.versionedFolder = await dispatchGetVersionedFolder(this.$store, { folderId: newValue });
      console.warn('Had to fetch versioned folder, consider joining versioned files in backend and using prop "folder"')
    }
  }

  @Emit()
  public input(value: string) {
    return value;
  }

  public onFileChanged(files: File[]) {
    this.files = files.map((file, i) => {
      const fileExtentionIndex = file.name.lastIndexOf('.');
      const fileName = file.name.substring(0, fileExtentionIndex);
      const fileExtention = file.name.substring(fileExtentionIndex + 1);
      return { file, fileName, fileExtention, key: i, label: this.defaultLabel, formValid: false }
    });
    this.defaultLabel = '';
    this.dialog = true;
  }

  async addMissingFile(category: string, cause: string) {
    this.isUploading = true;
    const files = [{
      cause: cause,
      label: category
    }]

    if (!this.versionedFolder?.id) {
      this.versionedFolder = await dispatchCreateVersionedFolder(this.$store, { files: [...(this.versionedFolder?.effective_files || []), ...files] })
    } else {
      this.versionedFolder = await dispatchAddFileToVersionedFolder(this.$store, { folderId: this.versionedFolder.id, files: files})
    }
    this.input(this.versionedFolder.id)
    this.isUploading = false;
  }

  public async uploadFiles() {

    if (!this.files) {
      return;
    }
    this.isUploading = true;
    this.dialog = false;
    const files: LabelledFile[] = [];

    for(const { file, fileName, fileExtention, label } of this.files) {
      const fullFileName = fileName + '.' + fileExtention;
      try {
        const response = await dispatchUploadFile(this.$store, {
          file,
          fileName: fullFileName
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


  public async removeFile(file: LabelledFile) {
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
