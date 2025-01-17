<template>
  
  <v-container v-if="this.financeRequest">    
    <v-btn v-if="isAdmin" class="bck-btn" color="secondary" :to="{ name: 'main-admin-finanz-request',}">Zurück</v-btn>
    <div>
      <div class="d-flex">
        
        <h1 class="text-md-h2 text-sm-h3 text-h4 text--primary mb-3">Finanzantrag</h1>
        <v-spacer></v-spacer>
        <div class="d-flex align-center">
          <v-btn 
            v-if="!isCurrentStatus(['file_accepted']) || isAdmin"
            class="mx-1"
            color="cctOrange" 
            outlined 
            fab
            small
            :to="{ name: 'finance-request-edit', params: { id: this.financeRequest.id } }">
            <v-icon>
              edit
            </v-icon>
          </v-btn>
          <v-btn 
            v-if="!isCurrentStatus(['file_accepted']) || isAdmin"
            class="mx-1"
            color="#EF5350" 
            outlined
            fab
            small
            @click="deleteFinanceRequest()"
          >
            <v-icon>
              delete
            </v-icon>
          </v-btn>
        </div>
      </div>
      

      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Allgemeines</h2>
          <p class="text-body-2 text--secondary">
            Allgemeine Informationen zu diesem Antrag
          </p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">  
          <v-row v-for="item in financeRequestDetails" :key="item.name" class="my-4">
            <span class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-0">
              {{ item.name }}
            </span>
            <span class="col-xs-12 col-md-6 col-lg-8 col-xl-9 my-0 py-0 font-weight-medium">
              {{ item.key }}
            </span>
          </v-row>

          <v-row class="my-4" v-if="this.financeRequest.association">
            <span justify="center" class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-0">
              Ressortbudget für
            </span>
            <v-list-item justify="center" class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-0 font-weight-medium">
              {{this.financeRequest.association}}
            </v-list-item>
          </v-row>

          <v-row class="my-4">
            <span justify="center" class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-0">
              Antragsteller
            </span>
            <v-list-item justify="center" class="col-xs-12 col-md-6 col-lg-4 col-xl-3 my-0 py-0">
              <employee-profile-picture :employee="this.financeRequest.author" component="v-list-item-avatar" small></employee-profile-picture>
              <v-list-item-content>
                <v-list-item-title v-text="this.financeRequest.author.full_name"></v-list-item-title>
                <v-list-item-subtitle v-text="this.financeRequest.author.ressort"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-row>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>
      
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Status</h2>
          <p class="text-body-2 text--secondary">
            Der aktuelle Status deines Antrags
          </p>
        </v-col>
        
        <v-col cols="12" md="8">  
          
          <v-stepper alt-labels>
            <v-stepper-header>
              <v-stepper-step
                v-if="!isCurrentStatus(['request_rejected'])"
                step="1"
                :complete="isCurrentStatus(['created', 'request_rejected', 'request_accepted', 'file_uploaded', 'file_rejected', 'file_accepted'])"
              >
                Budget angefragt
              
              </v-stepper-step>
              <v-stepper-step
                v-if="isCurrentStatus(['request_rejected'])"
                step="1"
                :rules="[() => false]"
              >
                Budget angefragt
                <small>Nicht akzeptiert</small>
              </v-stepper-step>



              <v-divider></v-divider>
              <v-stepper-step
                step="2"
                :complete="isCurrentStatus(['request_accepted', 'file_uploaded', 'file_rejected', 'file_accepted'])"
              >
                Budget genehmigt
              </v-stepper-step>
              <v-divider></v-divider>

              <!-- check for error -->
              <v-stepper-step
                v-if="!isCurrentStatus(['file_rejected'])"
                step="3"
                :complete="isCurrentStatus(['file_uploaded', 'file_rejected', 'file_accepted'])"
              >
                Rechnung hochgeladen
              </v-stepper-step>
              <v-stepper-step
                v-if="isCurrentStatus(['file_rejected'])"
                step="3"
                :rules="[() => false]"
              >
                Rechnung hochgeladen
                <small>Nicht akzeptiert</small>
              </v-stepper-step>


              <v-divider></v-divider>
              <v-stepper-step 
                step="4"
                :complete="isCurrentStatus(['file_accepted'])"
              >
                Antrag archiviert
              </v-stepper-step>
            </v-stepper-header>
          </v-stepper>

        </v-col>
      </v-row>


      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Aktionen</h2>
          <p class="text-body-2 text--secondary">
            Nächste Aktion im Workflow
          </p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
          <div style="max-width: 400px" class="">
            
            
            <div v-if="isAdmin && isCurrentStatus(['created'])">
              <!-- created -->
              <v-alert
                prominent
                dense
                type="info"
              >
                {{this.financeRequest.author.full_name}} hat einen Finanzantrag gestellt. Prüfe die Angaben und drücke auf annehmen/ablehnen.
              </v-alert>
              <div class="d-flex justify-space-around">
                <v-btn outlined large :class="{'btn-accept-active': isAccepted}" color="#66BB6A" small @click="isAccepted = true">
                  Annehmen
                </v-btn>
                <v-btn outlined large color="#EF5350" :class="{'btn-decline-active': !isAccepted}" small @click="isAccepted = false">
                  Ablehnen
                </v-btn>
              </div>
              
              <v-textarea 
                :disabled="isAccepted"
                placeholder="Ablehnungsgrund"
                v-model="message_request"
              ></v-textarea>
              
              <div class="d-flex justify-end">
                <v-btn color="primary" @click="changeStatusCreated()">
                  Abschicken
                </v-btn>
              </div>
            </div>

            
            <div v-if="isMyFinanceRequest && isCurrentStatus(['request_rejected'])">
              <!-- requst-rejected -->
              <v-alert 
                type="error"
                prominent
                dense
              >
                Das Budget wurde nicht genehmigt
              </v-alert>
              <div class="text-overline">Ablehnungsgrund:</div>
              <p v-text="this.financeRequest.message_request"></p>
              <v-alert 
                type="info"
                prominent
                dense
              >
                <v-row align="center">
                  <v-col class="grow">
                    Bearbeite deinen Finanzantrag entsprechend des Kommentars und er wird erneut geprüft
                  </v-col>
                  <v-col class="shrink">
                    <v-btn
                      class="mx-2"
                      :to="{ name: 'finance-request-edit', params: { id: this.financeRequest.id } }"
                      fab 
                      small
                      color="white"
                      style="color: #2196F3"
                    >
                      <v-icon dark>
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-alert>
            </div>

            
            <div v-if="isMyFinanceRequest && isCurrentStatus(['request_accepted'])">
              <!-- request_accepted -->
              <v-alert 
                type="info"
                prominent
                dense
              >
                Dein Budget wurde genehmigt. Lade deine Rechnung(en) hier hoch.
              </v-alert>
              <div>
                <file-manager v-model="files" :multiple="true" class="my-2"></file-manager>
                <v-btn
                  color="#66BB6A"
                  dark 
                  @click="changeStatusRequestAccepted()">
                  Rechnungen absenden
                </v-btn>
              </div>
            </div>

            <div v-if="isAdmin && isCurrentStatus(['file_uploaded'])">
              <!-- file_uploaded -->
              <v-alert
                prominent
                type="info"
                dense
              >
                Bitte überprüfe die Rechnung(en) und drücke auf annehmen/ablehnen
              </v-alert>
              <file-manager :value="this.currentFiles" class="my-2" :readonly="true" v-if="this.financeRequest.files"></file-manager>
              <div class="d-flex justify-space-around">
                <v-btn outlined large :class="{'btn-accept-active': isAccepted}" color="#66BB6A" small @click="isAccepted = true">
                  Annehmen
                </v-btn>
                <v-btn outlined large color="#EF5350" :class="{'btn-decline-active': !isAccepted}" small @click="isAccepted = false">
                  Ablehnen
                </v-btn>
              </div>
              <v-textarea 
                :disabled="isAccepted"
                placeholder="Ablehnungsgrund"
                v-model="message_file"
              ></v-textarea>
              <div class="d-flex justify-end">
                <v-btn color="primary" @click="changeStatusFileUploaded()">
                  Abschicken
                </v-btn>
              </div>
            </div>

            <div v-if="isMyFinanceRequest && isCurrentStatus(['file_rejected'])">
              <!-- file_rejected -->
              <v-alert
                prominent
                type="error"
                dense
              >
                Die Rechnun(en) wurden nicht akzeptiert. Bitte lies dir die Begründung durch und lade sie erneut hoch. Die alten Rechnungen werden beim Abschicken entfernt.
              </v-alert>
              <div class="text-overline">Ablehnungsgrund:</div>
              <p v-text="this.financeRequest.message_file"></p>

              <file-manager v-model="files" :multiple="true" class="my-2"></file-manager>

              <div class="d-flex justify-start">
                <v-btn color="primary" @click="changeStatusFileRejected()">
                  Abschicken
                </v-btn>
              </div>
            </div>

            <div v-if="isCurrentStatus(['file_accepted'])">
              <!-- file_accepted -->
              <v-alert
                type="success"
                class="my-2"
                prominent
                dense
              >
                Der Finanzantrag wurde erfolgreich bearbeitet.
              </v-alert>
            </div>

            <div v-if="!isAdmin && isMyFinanceRequest && isCurrentStatus(['created', 'file_uploaded'])">
              <!-- created, file_uploaded -->
              <v-alert 
                type="info" 
                class="my-2"
                prominent
                dense
              >
                Warte auf Bearbeitung vom Finanzvorstand
              </v-alert>
            </div>

            <div v-if="isAdmin && !isMyFinanceRequest && isCurrentStatus(['request_accepted', 'request_rejected', 'file_rejected'])">
              <!-- request_accepted, request_rejected, file_rejected, -->
              <v-alert type="info" class="my-2">
                Warten auf Antragsteller
              </v-alert>
            </div>
          </div>
      
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Rechnungen</h2>
          <p class="text-body-2 text--secondary">
            Dokumente zu diesem Finanzantrag
          </p>
        </v-col>
        
        <v-col cols="12" md="8">  
          <file-manager :value="this.currentFiles" class="my-2" :readonly="true" v-if="this.financeRequest.files"></file-manager>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

    </div>
  </v-container>
  <loading-page v-else></loading-page>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readHasAnyPermission, readUserProfile } from '@/store/main/getters';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { format } from 'date-fns';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import FileChip from '@/components/file-chip/FileChip.vue';
import FileChipGroup from '@/components/file-chip/FileChipGroup.vue';
import { IFinanceRequest } from '@/interfaces';
import { readOneFinanceRequestMe } from '@/store/finance_request/getters';
import { dispatchDeleteFinanceRequest, dispatchGetMyFinanceRequests, dispatchUpdateFinanceRequestState, dispatchUpdateFinanceRequestStateFile } from '@/store/finance_request/actions';
import { financeRequestNextStep, translateFinanceRequestStatus } from '@/utils';
import { dispatchGetUserProfile } from '@/store/main/actions';
import UploadButton from '@/components/UploadButton.vue';
import { dispatchAdminFinanceRequests } from '@/store/admin/actions';
import { readAdminOneFinanceRequest } from '@/store/admin/getters';
import FileManager from '@/components/file-manager/FileManager.vue';

@Component({
  components: { EmployeeProfilePicture, EmployeeCard, FileChip, FileChipGroup, UploadButton, FileManager },
})
export default class AdminUsers extends Vue {
  
  public message_file = '';
  public message_request = '';
  public isAccepted = true;
  public isUploading = false;
  public files: string | null = null;
  

  get financeRequest() {
    if(this.isAdmin) return readAdminOneFinanceRequest(this.$store)(+this.$router.currentRoute.params.id) as IFinanceRequest;
    else return readOneFinanceRequestMe(this.$store)(+this.$router.currentRoute.params.id) as IFinanceRequest
  }

  get user() {
    return readUserProfile(this.$store);
  }

  get currentFiles() {
    return this.financeRequest.files;
  }

  public get isMyFinanceRequest() {
    return readUserProfile(this.$store)?.id == this.financeRequest?.author.id;
  }

  public get isAdmin() {
    return readHasAnyPermission(this.$store)(['portal.finance.admin'])
  }

  public async changeStatusCreated() {
    const message = this.message_request;
    let newStatus = 'request_rejected';
    if (this.isAccepted) newStatus = 'request_accepted'
    await dispatchUpdateFinanceRequestState(this.$store, {financeId: this.financeRequest.id, updated_status: newStatus, updated_message_file: '', updated_message_request: message });
    await this.loadFinanceRequests();
  }

  public async changeStatusRequestAccepted() {
    const newStatus = 'file_uploaded';
    await dispatchUpdateFinanceRequestStateFile(this.$store, {financeId: this.financeRequest.id, updated_status: newStatus, updated_receipt: this.files });
    await this.loadFinanceRequests();
  }

  public async changeStatusFileUploaded() {
    const message = this.message_file;
    let newStatus = 'file_rejected';
    if (this.isAccepted) newStatus = 'file_accepted'
    await dispatchUpdateFinanceRequestState(this.$store, {financeId: this.financeRequest.id, updated_status: newStatus, updated_message_file: message, updated_message_request: '' });
    await this.loadFinanceRequests();
  }
  
  public async changeStatusFileRejected() {
    const newStatus = 'file_uploaded';
    await dispatchUpdateFinanceRequestStateFile(this.$store, {financeId: this.financeRequest.id, updated_status: newStatus, updated_receipt: this.files });
    await this.loadFinanceRequests();
  }
  
  public isCurrentStatus(statusArr: string[]): boolean {
    return statusArr.indexOf(this.financeRequest.status) !== -1;
  }

  public async deleteFinanceRequest() {
    await dispatchDeleteFinanceRequest(this.$store, this.financeRequest.id);
    this.$router.back();
  }

  public async loadFinanceRequests() {
    if(this.isAdmin)
      await dispatchAdminFinanceRequests(this.$store);
    else await dispatchGetMyFinanceRequests(this.$store);

  }

  public async mounted() {
    await dispatchGetUserProfile(this.$store);
    await this.loadFinanceRequests();
  }


  get financeRequestDetails() {
    return [
      {
        name: 'ID',
        key: this.financeRequest.id,
      },
      {
        name: 'Ausgabetyp',
        key: this.financeRequest.type,
      },
      {
        name: 'Verwendungszweck',
        key: this.financeRequest.purpose,
      },
      {
        name: 'Betrag',
        key: this.financeRequest.amount.toFixed(2).replace('.', ',') + '€',
      },
      {
        name: 'Erstellungsdatum',
        key: format(new Date(String(this.financeRequest.date_created)), 'dd.MM.yyyy - HH:mm'),
      },
      {
        name: 'Zuletzt geändert am',
        key: format(new Date(String(this.financeRequest.date_last_update)), 'dd.MM.yyyy - HH:mm'),
      },
      {
        name: 'Status',
        key: translateFinanceRequestStatus(this.financeRequest.status) + ' -- ' + financeRequestNextStep(this.financeRequest.status),
      },
      {
        name: 'IBAN',
        key: this.financeRequest.iban,
      },
    ];
  }
}
</script>

<style scoped>
.bck-btn{
  position:sticky;
  top: 7%;
  left: 1%;
}

.btn-accept-active {
  background: #66BB6A;
  color: white !important;
}
.btn-decline-active {
  background: #EF5350
 ;
  color: white !important;
}
</style>