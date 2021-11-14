<template>
  <div>
    <v-toolbar
      class=""
      flat
      color="#eee"
    >
      <v-toolbar-title class="text-h4">Finanzanträge</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--
      <v-btn x-large icon color="cctGrey">
        <v-icon> mdi-help-circle</v-icon>
      </v-btn>
      -->
      <v-btn x-large icon :disabled="isIbanMissing" color="cctOrange" :to="{ name: 'finance-request-create' }">
        <v-icon> mdi-plus-circle</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-checkbox 
          label="abgeschlossene anzeigen"
          dense
          color="primary"
          v-model="showCompleted"
        >
        </v-checkbox>
      </v-card-actions>
      <v-row>
        <v-col v-for="financeRequest in financeRequests" :key="financeRequest.id" cols="12" sm="6" lg="4">
          <finance-request-card class="my-2" :request="financeRequest" outlined></finance-request-card>
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
  </div>
</template>

<script lang="ts">
import FinanceRequestCard from '@/components/request/FinanceRequestCard.vue';
import { dispatchGetMyFinanceRequests } from '@/store/finance_request/actions';
import { readFinanceRequestsMe } from '@/store/finance_request/getters';
import { readUserProfile } from '@/store/main/getters';
import { isAfter } from 'date-fns';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: { FinanceRequestCard }
})
export default class UserProfileRequests extends Vue {

  public showCompleted = false;

  public ibanDialog = false;


  get isIbanMissing() {
    // change to iban
    if(this.userProfile?.full_name)
      return false;
    else {
      this.ibanDialog = true;
      return true; 
    }  
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get financeRequests() {
    return readFinanceRequestsMe(this.$store)
      .filter(request => this.showCompleted || request.status !== 'file_accepted')
      .sort(function(a,b) {
        if(isAfter(new Date(a.date_last_update), new Date(b.date_last_update))) 
          return -1;
        else return 1;
      });
  }

  mounted() {
    dispatchGetMyFinanceRequests(this.$store);
  }

}
</script>

<style scoped>
#lateral .v-btn--example {
    bottom: 0;
    position: absolute;
    margin: 0 0 16px 16px;
  }
</style>