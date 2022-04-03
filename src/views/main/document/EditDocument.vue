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
          <v-select
            label="Typ"
            v-model="document.type"
            class="input-lg"
            prepend-icon="mdi-collage"
            required
            :items="$common.DOKUMENT_TYP" 
            :rules="[$common.required]"
          ></v-select>      
          <v-text-field
            label="Kategorie"
            v-model="document.categories"
            class="input-lg"
            prepend-icon="mdi-animation"
            multiple
            required
            :rules="[$common.required]"
          ></v-text-field>
          
          <!-- <file-manager></file-manager> -->

        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" outlined color="cctOrange">Abbrechen</v-btn>
          <v-btn
            @click="submit"
            color="cctGreen"
            style="color: #ffffff"
          >
            Schulung speichern
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { IDocument, IDocumentCreate } from '@/interfaces';
import { dispatchCreateDocument, dispatchGetOneDocument, dispatchUpdateDocument } from '@/store/document/actions';
import { Vue, Component, Watch} from 'vue-property-decorator';
import { format } from 'date-fns';
import { readOneDocument, readRouteDocument } from '@/store/document/getters';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import FileManager from '@/components/file-manager/FileManager.vue';
import DateTimePickerMenu from '@/components/DateTimePickerMenu.vue';
import { Route } from 'vue-router';

@Component({
  components: {VueTelInputVuetify, UploadButton, DateTimePickerMenu, EmployeeProfilePicture, FileManager},
})
export default class EditDocument extends Vue {
  public valid = false;
  public document: Partial<IDocumentCreate> = {}

  get documentInfo(): IDocument {
    return readRouteDocument(this.$store)(this.$route) as IDocument;
  }

  /* @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params.id !== oldRoute?.params.id) {
      await dispatchGetOneDocument(this.$store, +this.$route.params.id)
      this.reset();
    }
  } */

  /* public reset() {
    if(this.editDocument) {
      this.document = {
        ...this.editDocument, 

      };
  } */

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
      this.$router.push('/main/wms/documents');
    }
  }

  get editDocument() {
    return readOneDocument(this.$store)(+this.$router.currentRoute.params.id);
  }

  get documentDetails() {
    return [
      {
        name: 'Kategorie',
        key: this.documentInfo?.categories,
      },
      {
        name: 'Typ',
        key: this.documentInfo?.type,
      },
      {
        name: 'Datum',
        key: format(new Date(String(this.documentInfo?.date_last_updated)), 'dd.MM.yyyy HH:mm'),
      },
      {
        name: 'Titel',
        key: this.documentInfo?.title,
      },
      {
        name: 'Beschreibung',
        key: this.documentInfo?.description,
      },
    ];
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important
</style>