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

        <span>Anforderungen an den Beleg</span>
        <ul class="text--secondary" style="font-size: 16px">
          <li>Optimal ist eine richtige Rechnung, diese enthält:</li>
        
          <li>Optimal ist eine richtige Rechnung, diese enthält:</li>
          <ul>
            <li>Rechnungsnummer</li>
            <li>Steuernummer</li>
            <li>Rechnungsanschrift</li> 
            <li>Datum</li>
            <li>Rechnungssumme brutto & netto</li> 
          </ul>
          <li>Mindestens braucht es eine Quittung, diese enthält:</li>
          <ul>
            <li>Bestätigung der erhaltenen Leistung</li>
            <li>gezahlten Betrag</li> 
            <li>Datum</li>
            <li>Unterschrift</li>
          </ul>
        </ul>
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
            item-text="name"
            return-object
            :items="$common.KOSTENART"
            :rules="[$common.required]"
          ></v-select>
          <div v-if="type && type.associations.length">
            <v-select
              label="Ressort"
              v-model ="association"
              class="input-lg"
              prepend-icon="mdi-animation"
              :items="type.associations"
            ></v-select>
            <v-alert
              prominent
              dense
              type="info"
              class="input-lg"
            >
              Ressortsbudgets werden nicht vom Finanzvorstand geprüft und müssen vorher unbedingt mit dem Ressortleiter abgesprochen werden.
            </v-alert>
          </div>  

          <v-text-field
            label="Betrag"
            v-model="amount"
            prepend-icon="mdi-account-arrow-left"
            class="input-lg"
            persistent-hint
            prefix="€"
            required
            :rules="[$common.required, $common.isCurrency]" 
          ></v-text-field>

          <v-text-field
            label="IBAN"
            v-model="iban"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="IBAN"
            required
            :rules="[$common.required, $common.isIBAN]"
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
            label="Budget Ablehnungsnachricht manuell bearbeiten"
            v-model="message_request"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="Nachricht"
          ></v-textarea>

          <v-textarea
            v-if="isAdmin"
            label="Rechnung Ablehnungsnachricht manuell bearbeiten"
            v-model="message_file"
            prepend-icon="mdi-text-subject"
            class="input-lg"
            hint="Nachricht"
          ></v-textarea>

          <v-select
            v-if="isAdmin"
            label="Status manuell bearbeiten"
            v-model ="status"
            class="input-lg"
            prepend-icon="mdi-animation"
            :items="$common.FINANCE_REQUEST_STATUS"
          ></v-select>
          
          <div v-if="isAdmin">
            <div class="text-subtitle-2 mb-2">Rechnungen manuell hochladen</div>
            <file-manager v-model="files" :multiple="true"></file-manager>
          </div>
          
          <v-spacer class="my-4"></v-spacer>

          <v-alert
            v-if="isEdit && !isAdmin"
            prominent
            dense
            type="info"
            class="input-lg"
          >
            Wenn du den Finanzantrag bearbeitest, muss er den Genehmigungsprozess von vorne durchlaufen.
          </v-alert>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" text color="secondary">Abbrechen</v-btn>
          <v-btn
            @click="submit"
            color="primary"
          >
            Antrag speichern
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { dispatchGetUsers } from '@/store/main/actions';
import { readUserProfile, } from '@/store/main/getters';
import { IFinanceRequest, IFinanceRequestCreate, IFinanceRequestStatus, IFinanceRequestUpdate } from '@/interfaces';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import { dispatchAddFinanceRequest, dispatchUpdateFinanceRequest, dispatchUpdateFinanceRequestStateType } from '@/store/finance_request/actions';
import { readOneFinanceRequestMe } from '@/store/finance_request/getters';
import { readAdminOneFinanceRequest } from '@/store/admin/getters';
import FileManager from '@/components/file-manager/FileManager.vue';

@Component({
  components: {VueTelInputVuetify, UploadButton, DatePickerMenu, EmployeeProfilePicture, FileManager },
})
export default class CreateFinanceRequest extends Vue {

  public type: null | {name: string; associations: string[]} = null;
  public amount = '';
  public purpose = '';
  public files: string[] = [];
  public association = '';
  public status = '';
  public iban = '';
  public message_file = ''
  public message_request = ''

  
  public isRessortBudget = false;
  public valid = false;
  

  get userProfile() {
    return readUserProfile(this.$store);
  }

  public get isAdmin() {
    return this.userProfile?.active_groups.map(group => group.name).includes('Finanzvorstand');
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
    if(this.association && this.type?.associations.length) newAssociation = this.association;

    if ((this.$refs.form as HTMLFormElement).validate()) {
      const newFinanceRequest: IFinanceRequestCreate = {
        amount: +this.amount.replace(',', '.'),
        type: this.type?.name || 'unknown',
        purpose: this.purpose,
        files: this.files.join('/'),
        
        association: newAssociation,
        iban: this.iban,
      };
      const updatedFinanceRequest: IFinanceRequestUpdate = {
        amount: +this.amount.replace(',', '.'),
        type: this.type?.name || 'unknown',
        purpose: this.purpose,
        files: this.files.join('/'),
        status: this.status as IFinanceRequestStatus, 
        message_file: this.message_file,
        message_request: this.message_request,
        association: newAssociation,
        iban: this.iban,
      };
      if (this.editFinanceRequest) {
        await dispatchUpdateFinanceRequest(this.$store, {id: this.editFinanceRequest.id, financeRequest: updatedFinanceRequest});
      } else {
        await dispatchAddFinanceRequest(this.$store, newFinanceRequest);
      }
      if(this.isRessortBudget) {
        //changeStatusRessortBudget();
      }
      this.$router.back();
    }
  }

  get editFinanceRequest() {
    if (!this.$route.params.id) {
      return null;
    }
    if (this.isAdmin) return readAdminOneFinanceRequest(this.$store)(+this.$route.params.id) as IFinanceRequest;
    else return readOneFinanceRequestMe(this.$store)(+this.$route.params.id) as IFinanceRequest
  }

  get isEdit() {
    return !!this.editFinanceRequest;
  }

  public reset() {
    if (this.userProfile?.iban){
      this.iban = this.userProfile.iban;
    }
    if (this.editFinanceRequest) {
      if(this.editFinanceRequest.association) {
        this.isRessortBudget = true;
        this.association = this.editFinanceRequest.association;
      }
      this.amount = this.editFinanceRequest.amount.toFixed(2).replace('.', ',');
      this.type = this.$common.KOSTENART.find(o => o.name === this.editFinanceRequest?.type) || { name: this.editFinanceRequest.type, associations: [] };
      this.purpose = this.editFinanceRequest.purpose;
      this.files = this.editFinanceRequest.files ? this.editFinanceRequest.files.split('/') : []
      this.message_request = this.editFinanceRequest.message_request;
      this.message_file = this.editFinanceRequest.message_file; 
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