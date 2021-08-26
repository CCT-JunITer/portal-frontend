<template>
  <div>
    <v-chip 
      v-bind="$attrs" 
      v-on="$listeners" 
      :color="filename ? 'cctBlue' : 'red'"
      outlined
    >
      <v-icon left size="20">
        {{ fileIcon }}
      </v-icon>
      <v-avatar left v-if="isDownloading">
        <v-progress-circular
          :size="20"
          :width="3"
          color="deep-purple accent-4"
          indeterminate
        ></v-progress-circular>
      </v-avatar>
      {{ displayName }}
      <v-avatar right>
        <v-btn @click="preview" icon right color="cctBlue" small>
          <v-icon size="20">
            mdi-eye
          </v-icon>
        </v-btn>
      </v-avatar>
      <v-avatar right>
        <v-btn @click="downloadAndSave" icon color="cctBlue" small>
          <v-icon size="20">
            mdi-download
          </v-icon>
        </v-btn>
      </v-avatar>
      <v-avatar right v-if="$listeners['delete-file']">
        <v-btn @click="deleteFile()" icon color="cctBlue" small>
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
          <object :data="fileUrl" width="100%" class="file-chip__preview flex-grow-1">

          </object>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { dispatchDownloadFile } from '@/store/main/actions';
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class FileChip extends Vue {

  public dialog = false;
  public isDownloading = false;
  public fileUrl: string | null = null;

  @Prop()
  public filename!: string;

  @Emit()
  public deleteFile() {
    return this.filename;
  }

  public get displayName() {
    const split = this.filename.indexOf('.')
    return this.filename.substring(split + 1);
  }


  public get fileIcon() {
    switch(this.filename.split('.')[this.filename.split('.').length-1]) {
    case 'pdf':
      return 'mdi-file-pdf';
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
    // rename to original name
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = this.fileUrl!;
    link.setAttribute('type', 'hidden');
    link.setAttribute('download', this.displayName);
    link.click();

    this.dialog = false;
  }

  public async download() {
    this.isDownloading = true;
    const fileBlob = await dispatchDownloadFile(this.$store, { filename: this.filename });
    if(!fileBlob) {
      this.isDownloading = false;
      return;
    }
    this.fileUrl = URL.createObjectURL(fileBlob);
    this.isDownloading = false;
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

</style>