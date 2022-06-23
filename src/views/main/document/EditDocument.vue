<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4 text--primary mb-3">Neues Dokument hinzufügen</h4>
        <!-- <p class="text-body-2 text--secondary">Hier kannst du ein neues Dokument hinzufügen</p> -->
      </v-col>

      <v-col cols="12" md="8" class="px-5">
        <v-form
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-text-field
            label="Titel"               
            v-model="document.title"
            class="input-lg"
            prepend-icon="mdi-format-title"
            required
            :rules="[$common.required]"            
          ></v-text-field>
          <v-text-field
            label="Beschreibung"
            v-model="document.description"
            class="input-lg"
            prepend-icon="mdi-card-text"
            hint="Hier soll eine kurze Beschreibung zum Dokument eingegeben werden."
            required
            :rules="[$common.required]"
          ></v-text-field>
          <v-checkbox
            v-model="document.approved"
            label="Bestätigt"
            class="input-lg"
            prepend-icon="mdi-check-decagram"
            hint="Durch das Qualitätsmanagement bestätigt"
            persistent-hint
            required
          >
          </v-checkbox>
          <v-select
            label="Typ"
            v-model="document.type"
            class="input-lg"
            prepend-icon="mdi-collage"
            required
            item-value="value"
            item-text="name"
            :items="$common.DOCUMENT_TYPES" 
            :rules="[$common.required]"
          ></v-select>
          
          <file-manager 
            :folder="document.versioned_folder" 
            v-model="document.files">
          </file-manager>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" outlined color="cctOrange">Abbrechen</v-btn>
          <consent-dialog @accept="deleteDocument" title="Dokument löschen" content="Wirklich löschen?" v-if="editDocument">
            <template v-slot:activator="{ attrs, on }">
              <v-btn 
                v-bind="attrs" 
                v-on="on" 
                color="red" 
                dark
              >
                <v-icon left>
                  delete
                </v-icon>
                Löschen
              </v-btn>
            </template>
          </consent-dialog>
          <v-btn
            @click="submit"
            color="cctGreen"
            dark
          >
            Dokument speichern
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { IDocument, IDocumentCreate } from '@/interfaces';
import { dispatchCreateDocument, dispatchGetOneDocument, dispatchUpdateDocument, dispatchDeleteDocument } from '@/store/document/actions';
import { Vue, Component, Watch} from 'vue-property-decorator';
import { readOneDocument, readRouteDocument } from '@/store/document/getters';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import FileManager from '@/components/file-manager/FileManager.vue';
import DateTimePickerMenu from '@/components/DateTimePickerMenu.vue';
import { Route } from 'vue-router';
import ConsentDialog from '@/components/consent-dialog/ConsentDialog.vue';

@Component({
  components: {VueTelInputVuetify, UploadButton, DateTimePickerMenu, EmployeeProfilePicture, FileManager, ConsentDialog },
})
export default class EditDocument extends Vue {
  public valid = false;
  public document: Partial<IDocumentCreate> = {}

  get documentInfo(): IDocument {
    return readRouteDocument(this.$store)(this.$route) as IDocument;
  }

  async deleteDocument() {
    const oldDocument = this.documentInfo;
    await dispatchDeleteDocument(this.$store, this.documentInfo.id);
    this.$router.push(`/main/wms/documents/${oldDocument.type}`);
  }

  @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params.id !== oldRoute?.params.id) {
      await dispatchGetOneDocument(this.$store, +this.$route.params.id)
      this.reset();
    }
  }

  public reset() {
    if(this.editDocument) {
      this.document = {
        ...this.editDocument, 

      };
    }
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const new_document = {
        ...this.document,
      } as IDocumentCreate;

      let document: IDocument | undefined;
      if (this.editDocument?.id) {
        document = await dispatchUpdateDocument(this.$store, {id: this.editDocument.id, document: new_document});
      } else {
        document = await dispatchCreateDocument(this.$store, new_document);
      }
      this.$router.push(`/main/wms/documents/${document.type}`);
    }
  }

  get editDocument() {
    return readOneDocument(this.$store)(+this.$router.currentRoute.params.id);
  }

}
</script>

<style lang="sass" scoped>
</style>