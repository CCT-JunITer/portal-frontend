<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <v-card v-if="syncedFiles">
      <v-card-title>
        <span class="text-h5">Dateien umbenennen</span>
      </v-card-title>
      <v-card-text>
        <v-alert type="info" text dense v-if="labels">
          Du kannst den Dateien <code>labels</code> zuordnen, indem du auf die Dateivorschau klickst.
        </v-alert>
        <file-chip-group>
          <v-form v-model="file.formValid" ref="forms" v-for="file in syncedFiles" :key="file.key">
            <v-menu
              :close-on-content-click="false"
              v-model="file.menu"
              bottom
              right
              transition="scale-transition"
              offset-y
              eager
            >
              <template v-slot:activator="{ on, attrs}">
                <v-chip 
                  v-bind="attrs"
                  v-on="on"
                  :color="file.formValid ? 'cctBlue' : 'error'"
                  outlined
                >
                  <v-icon left size="20">
                    mdi-file
                  </v-icon>
                  <span class="text-truncate file-chip__label" v-if="file.label">
                    {{ file.label + '/'}}
                  </span>
                  <span class="text-truncate file-chip__displayname">
                    {{ file.fileName }}.{{ file.fileExtention }}
                  </span>
                </v-chip>
              </template>
              <v-card>
                <v-card-text>
                  <v-select
                    label="Label"
                    filled
                    v-model="file.label"
                    :items="labels"
                    v-if="labels && labels.length"
                    :rules="[$common.required]"
                  >
                  </v-select>
                  <v-text-field
                    label="Dateiname"
                    filled
                    v-model="file.fileName"
                    :rules="[$common.required]"
                  >
                    <template #append>
                      <span class="text-button">.{{file.fileExtention}}</span>
                    </template>
                  </v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="syncedFiles = syncedFiles.filter(f => f.key !== file.key)" color="red">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    :disabled="!file.formValid"
                    @click="file.menu = false"
                  >
                    Speichern
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-form>
        </file-chip-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="uploadFiles"
        >
          Hochladen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script lang="ts">
import { Vue, Component, Prop, VModel, PropSync } from 'vue-property-decorator'
import FileChipGroup from '../file-chip/FileChipGroup.vue';

@Component({
  components: { FileChipGroup }
})
export default class FileUploadDialog extends Vue {

  @VModel()
  public dialog!: boolean;

  @PropSync('files')
  public syncedFiles!: any[];

  @Prop()
  public labels!: any[];


  public uploadFiles() {
    const valid = (this.$refs as any).forms.every(form => form.validate())
    if (!valid) {
      return;
    }
    this.$emit('uploadFiles');
  }
}
</script>

<style lang="scss">

</style>