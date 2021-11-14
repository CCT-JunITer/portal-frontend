/* eslint-disable vue/html-indent */
<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4 text--primary mb-3"> 
          Finanzantrag
          <span v-if="this.isEdit"> bearbeiten</span>
          <span v-else> erstellen</span>
        </h4>
        <p class="text-body-2 text--secondary">Hier kannst du dir dein Geld zurück holen.</p>
      </v-col>
      <v-col cols="12" md="8">
        <v-form
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-select
            label="Kostenart"
            v-model ="type"
            class="input-lg"
            required
            prepend-icon="mdi-animation"
            :items="$common.KOSTENART"
            :rules="[$common.required]"
          ></v-select>
          <div class="d-flex justify-content-between align-center" style="width:100%">
            <v-checkbox
              v-model="isRessortBudget"
              style="display: inline"
            >
            </v-checkbox>
            <span>
              Ausgabe Teil eines Ressortbudgets
            </span>
          </div>
          <div v-if="isRessortBudget">
            <v-select
              label="Ressort"
              v-model ="association"
              class="input-lg"
              prepend-icon="mdi-animation"
              :items="$common.RESSORTS"
            ></v-select>
            <v-alert
              prominent
              dense
              type="info"
              class="input-lg"
            >
              Ressortsbudgets werden nicht vom Finazvorstand geprüft und müssen vorher unbedingt mit dem Ressortleiter abgesprochen werden.
            </v-alert>
          </div>  

          <v-text-field
            label="Betrag"
            v-model="amount"
            prepend-icon="mdi-account-arrow-left"
            class="input-lg"
            persistent-hint
            type="number"
            required
            :rules="[$common.required]"
          ></v-text-field>

          <v-text-field
            label="IBAN"
            v-model="iban"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="IBAN"
            required
            :rules="[$common.required]"
          ></v-text-field>

          <v-textarea
            label="Verwendungszweck"
            v-model="purpose"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="Hier soll eine kurze Beschreibung der Ausgabe eingegeben werden."
            required
            :rules="[$common.required]"
          ></v-textarea>

          <v-textarea
            v-if="isAdmin"
            label="Ablehnungsnachricht manuell bearbeiten"
            v-model="this.message"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="Nachricht"
          ></v-textarea>

          <v-select
            v-if="isAdmin"
            label="Status manuell bearbeiten"
            v-model ="this.status"
            class="input-lg"
            prepend-icon="mdi-animation"
            :items="$common.FINANCE_REQUEST_STATUS"
          ></v-select>
          
          <div v-if="isAdmin">
            <div class="text-subtitle-2 mb-2">Rechnungen hochladen</div>
            <upload-button
              :loading="this.isUploading"
              :disabled="this.isUploading"
              outlined
              class="my-1"
              color="primary"
              accept=".pdf,.pptxm.,.ppt,.docx,.doc,.jgp,.jpeg"
              style="max-width: 340px !important"
              @files="onFileChanged"
            >
              <v-icon left>
                cloud_upload
              </v-icon>
              Rechnung hochladen
            </upload-button>
            <div>
              <p v-if="!this.files.length">
                Noch keine Dateien hochgeladen
              </p>
              <file-chip-group v-else>
                <file-chip :key="file" :filename="file" v-for="file in files" @delete-file="removeFile">
                </file-chip>
              </file-chip-group>
            </div>
          </div>
          
          <v-spacer class="my-4"></v-spacer>

          <v-alert
            v-if="isEdit && isAdmin"
            prominent
            dense
            type="info"
            class="input-lg"
          >
            Wenn du den Finazantrag bearbeitest, muss er den Genehmigungsprozess von vorne durchlaufen.
          </v-alert>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" text color="secondary">Abbrechen</v-btn>
          <v-btn
            @click="submit"
            color="primary"
            :disabled="isIbanMissing"
          >
            Antrag speichern
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
    
    <div class="text-center">
      <v-dialog
        v-model="ibanDialog"
        width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Hinweis
          </v-card-title>

          <v-card-text class="mt-2">
            Bevor du einen Finanzantrag stellen kannst, musst du deine IBAN im Profil hinzufügen.
            <!-- Input Feld mit IBAN -->
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="ibanDialog = false"
            >
              Verstanden
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { dispatchGetUsers, dispatchUploadFile } from '@/store/main/actions';
import { readUserProfile, } from '@/store/main/getters';
import { IFinanceRequest, IFinanceRequestCreate, IFinanceRequestStatus, IFinanceRequestUpdate } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import FileChipGroup from '@/components/file-chip/FileChipGroup.vue';
import FileChip from '@/components/file-chip/FileChip.vue';
import { dispatchAddFinanceRequest, dispatchUpdateFinanceRequest, dispatchUpdateFinanceRequestStateType } from '@/store/finance_request/actions';
import { readOneFinanceRequestMe } from '@/store/finance_request/getters';
import { FinanceRequestState } from '@/store/finance_request/state';
import { readAdminOneFinanceRequest } from '@/store/admin/getters';
@Component({
  components: {VueTelInputVuetify, UploadButton, DatePickerMenu, EmployeeProfilePicture, FileChipGroup, FileChip},
})
export default class AdminViewTraining extends Vue {

  public type = '';
  public amount = 0;
  public purpose = '';
  public files: string[] = [];
  public association = '';
  public status: IFinanceRequestStatus = 'created';
  public iban = '';
  public message = ''

  
  public isRessortBudget = false;
  public valid = false;
  public ibanDialog = false;
  public isEdit = false;
  public isUploading = false;
  

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get isIbanMissing() {
    // change to iban
    if(this.userProfile?.full_name)
      return false;
    else {
      this.ibanDialog = true;
      return true; 
    }  
  }

  public get isAdmin() {
    return Boolean(this.userProfile?.is_superuser);
  }

  public async onFileChanged(files: File[]) {
    this.isUploading = true;
    const response = await dispatchUploadFile(this.$store, {
      file: files[0],
    });
    this.isUploading = false;
    
    if (response)
      this.files.push(response.filename);
  }

  public removeFile(file: string) {
    this.files = this.files.filter((f) => f !== file);
  }


  public async mounted() {
    await dispatchGetUsers(this.$store);
    this.reset();
  }


  public cancel() {
    this.$router.back();
  }

  public async submit() {
    let newAssociation = '';
    if(this.association) newAssociation = this.association;

    let newStatus = this.status;
    newStatus = 'created'; 
    //if(this.isAdmin) {
    //  newStatus = this.editFinanceRequest?.status as IFinanceRequestStatus;
    //}
    

    if ((this.$refs.form as HTMLFormElement).validate()) {
      const newFinanceRequest: IFinanceRequestCreate = {
        amount: this.amount,
        type: this.type,
        purpose: this.purpose,
        files: this.files.join(','),
        message: this.message,
        association: newAssociation,
        iban: this.iban,
      };
      const updatedFinanceRequest: IFinanceRequestUpdate = {
        amount: this.amount,
        type: this.type,
        purpose: this.purpose,
        files: this.files.join('/'),
        status: newStatus, 
        message: this.message, 
        association: newAssociation,
        date_last_update: '2021-11-01T00:51:12.865Z',
        iban: this.iban,
      };
      // change to IBAN
      if(this.userProfile?.full_name) {
        if (this.editFinanceRequest) {
          await dispatchUpdateFinanceRequest(this.$store, {id: this.editFinanceRequest.id, financeRequest: updatedFinanceRequest});
        } else {
          await dispatchAddFinanceRequest(this.$store, newFinanceRequest);
        }
      } else {
        this.ibanDialog = true;
      }
      this.$router.back();
    }
  }

  get editFinanceRequest() {
    if(this.isAdmin) return readAdminOneFinanceRequest(this.$store)(+this.$router.currentRoute.params.id) as IFinanceRequest;
    else return readOneFinanceRequestMe(this.$store)(+this.$router.currentRoute.params.id) as IFinanceRequest
  }
  public reset() {
    if(this.editFinanceRequest) {
      this.isEdit = true;
      if(this.editFinanceRequest.association) {
        this.isRessortBudget = true;
        this.association = this.editFinanceRequest.association;
      }
      this.amount = this.editFinanceRequest.amount;
      this.type = this.editFinanceRequest.type;
      this.purpose = this.editFinanceRequest.purpose;
      this.files = this.editFinanceRequest.files ? this.editFinanceRequest.files.split('/') : []
      this.message = this.editFinanceRequest.message;
      this.status = this.editFinanceRequest.status;
      this.iban = this.editFinanceRequest.iban;
    }
  }
}
</script>

<style lang="sass" scoped>
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important
</style>