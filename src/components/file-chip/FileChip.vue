<template>
  <div class="flex-1">
    <v-chip 
      v-bind="$attrs" 
      v-on="$listeners" 
      :color="file && file.file_id ? (!error ? color : 'error') : 'cctPurple'"
      outlined
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon left size="20" v-on="on" v-bind="attrs">
            {{ fileIcon }}
          </v-icon>
        </template>
        {{ file.cause && 'Grund für fehlende Datei' }}
      </v-tooltip>
      <v-avatar left v-if="isDownloading">
        <v-progress-circular
          :size="20"
          :width="3"
          color="deep-purple accent-4"
          indeterminate
        ></v-progress-circular>
      </v-avatar>
      <span class="text-truncate file-chip__label" v-if="file.label && !noLabel">
        {{ file.label + '/'}}
      </span>
      <span class="text-truncate file-chip__displayname">
        {{ displayName }}
      </span>
      <v-avatar right v-if="isPreviewable">
        <v-btn @click="preview" icon right style="color: currentColor;" small>
          <v-icon size="20">
            mdi-eye
          </v-icon>
        </v-btn>
      </v-avatar>
      <v-avatar right v-if="isDownloadable">
        <v-btn @click="downloadAndSave" icon style="color: currentColor;" small>
          <v-icon size="20">
            mdi-download
          </v-icon>
        </v-btn>
      </v-avatar>
      <v-avatar right v-if="$listeners['delete-file']">
        <v-btn @click="deleteFile()" icon style="color: currentColor;" small>
          <v-icon size="20">
            delete
          </v-icon>
        </v-btn>
      </v-avatar>
    </v-chip>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="d-flex flex-column">
        <v-toolbar
          dark
          color="cctGreen"
          class="flex-grow-0"
          dense
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ displayName }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="save"
            >
              Speichern
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <div class="flex-grow-1 d-flex flex-column">
          <iframe v-if="!error" :src="fileUrl" width="100%" class="file-chip__preview flex-grow-1" />
          <div v-else>
            <v-icon color="error" x-large>
              error
            </v-icon>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { LabelledFile } from '@/interfaces';
import { dispatchDownloadFile } from '@/store/main/actions';
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class FileChip extends Vue {

  public dialog = false;
  public isDownloading = false;
  public fileUrl: string | null = null;
  public error = false;

  @Prop({ default: false })
  public noLabel!: boolean;

  @Prop()
  public file!: LabelledFile;


  @Prop({ default: 'cctBlue' }) 
  public color!: string;

  @Emit()
  public deleteFile() {
    return this.file;
  }

  public get isDownloadable() {
    return this.file.file_id && !this.error;
  }
  
  public get isPreviewable() {
    if(!this.file.file_id) {
      return false;
    }
    switch(this.file.file_id.split('.')[this.file.file_id.split('.').length-1]) {
    case 'pdf':
      return true && !this.error;
    }
    return false;
  }

  public get displayName() {
    if(!this.file.file_id) {
      return this.file.cause;
    }
    const split = this.file.file_id.indexOf('.')
    return this.file.file_id.substring(split + 1);
  }


  public get fileIcon() {
    if (!this.file.file_id) {
      return 'mdi-file-alert';
    }
    switch(this.file.file_id.split('.')[this.file.file_id.split('.').length-1]) {
    case 'pdf':
      return 'mdi-file-document';
    case 'ppt':
    case 'pptx': 
      return 'mdi-file-powerpoint';
    case 'doc':
    case 'docx':
      return 'mdi-file-word';
    case 'xlsx':
    case 'xlsm':
      return 'mdi-file-excel'; 
    case undefined:
      return 'error';
    default:
      return 'mdi-file';

    }
  }

  public async downloadAndSave() {
    await this.download();
    this.save()
  }

  public save() {
    if (!this.fileUrl) {
      return;
    }
    // rename to original name
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = this.fileUrl;
    link.setAttribute('type', 'hidden');
    link.setAttribute('download', this.displayName || 'unknown');
    link.click();

    this.dialog = false;
  }

  public async download() {
    if (!this.file.file_id) {
      return;
    }
    this.isDownloading = true;
    this.error = false;
    try {
      const fileBlob = await dispatchDownloadFile(this.$store, { filename: this.file.file_id });
      if(!fileBlob) {
        this.isDownloading = false;
        return;
      }
      this.fileUrl = URL.createObjectURL(fileBlob);
      this.isDownloading = false;
    } catch(e) {
      this.isDownloading = false;
      this.error = true;
    }
  }

  public async preview() {
    await this.download();
    this.dialog = true;
  }

}
</script>

<style lang="scss">

.file-chip__preview {
  outline: none;
  border: none;
}
.file-chip__displayname {
  font-size: 14px;
}

.file-chip__label {
  font-size: 11px;
  font-weight: bolder;
}

</style>