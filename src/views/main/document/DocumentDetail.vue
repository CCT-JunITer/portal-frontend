<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4 text--primary mb-3">{{getDocumentName(document.type)}} Dokument </h4>
        <!-- <p class="text-body-2 text--secondary">Hier kannst du ein neues Dokument hinzufügen</p> -->
      </v-col>

      <v-col cols="12" md="8" class="px-5">
        <h1 class="text-h2 text--primary mb-3">
          <!-- <v-icon v-if="this.board.approved" color="cctGreen" x-large>mdi-check-decagram</v-icon> -->
          {{ document.title }}
        </h1>
        <div class="d-flex align-center">
          <div>
            <div class="text-caption mb-1" v-if="document.author">
              erstellt von <span v-if="document.last_updated_by">
                <v-chip
                  class="trainer-chip"
                  color="lightgrey"
                >
                  <v-avatar left>
                    <employee-profile-picture
                      :employee="document.last_updated_by"
                    ></employee-profile-picture>
                  </v-avatar>
                  {{ document.last_updated_by.full_name }}
                </v-chip>
              </span>
            </div>
            <div class="text-caption">
              zuletzt bearbeitet
              <span v-if="document.last_updated_by">von <user-chip :user="document.last_updated_by" small></user-chip></span>
              <!-- <span v-if="board.approved_by && board.approved">
              und zuletzt bestätigt durch <user-chip :user="board.approved_by" small></user-chip>
            </span> -->
              <span v-if="document.date_last_updated">
                {{ $common.format(new Date(document.date_last_updated), `'am' dd.MM.yyyy 'um' HH:mm`) }}
              </span>
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn color="cctOrange" class="button_top" outlined :to="{ name: 'document-edit', params: { id: document.id } }">
            <v-icon left>
              edit
            </v-icon>
            Dokument bearbeiten
          </v-btn>
        </div> 

        <p>
          {{document.description}}
        </p>
          
        <file-manager 
          :folder="document.versioned_folder" 
          v-model="document.files"
          :readonly="true">
        </file-manager>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { IDocument, IDocumentCreate } from '@/interfaces';
import { dispatchGetOneDocument} from '@/store/document/actions';
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
  public document: Partial<IDocument> = {};

  get documentInfo(): IDocument {
    return readRouteDocument(this.$store)(this.$route) as IDocument;
  }

  public getDocumentName(value) {
    const document = this.$common.DOCUMENT_TYPES.find(doc => doc.value === value);
    return document ? document.name : null;
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

  get editDocument() {
    return readOneDocument(this.$store)(+this.$router.currentRoute.params.id);
  }

}
</script>

<style>

.button_top{
  position: absolute;
  top: 3%;
  right: 5%;
}

</style>