<template>
  <div>
    


    <v-toolbar
      class=""
      flat
      color="#eee"
    >
      <v-toolbar-title class="text-h4">Alle Finanzanträge</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--
      <v-btn x-large icon color="cctGrey">
        <v-icon> mdi-help-circle</v-icon>
      </v-btn>
      -->
      <v-btn outlined color="cctBlue" @click="exportAsCsv">
        <v-icon left>
          mdi-clipboard-text
        </v-icon>
        exportieren
      </v-btn>
    </v-toolbar>
    <v-container> 
      <!--
      <v-divider></v-divider>
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
      -->
      <v-row>
        <v-col v-for="financeRequest in openFinanceRequests" :key="financeRequest.id" cols="12" md="6" lg="4">
          <admin-finance-request-card class="my-2" :request="financeRequest">
            <template v-slot:actions>
            </template>
          </admin-finance-request-card>
        </v-col>
      </v-row>

      <h4 class="text-h4 mb-3 mt-5">Archivierte Anträge</h4>

      <v-data-table
        
        :headers="headers"
        :items="archivedFinanceRequests"
      ></v-data-table>
    </v-container> 
  </div>
</template>

<script lang="ts">
import AdminFinanceRequestCard from '@/components/request/AdminFinanceRequestCard.vue';
import { dispatchAdminFinanceRequests } from '@/store/admin/actions';
import { readAdminFinanceRequests } from '@/store/admin/getters';
import { dispatchUpdateFinanceRequestState } from '@/store/finance_request/actions';
import { isAfter } from 'date-fns';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    AdminFinanceRequestCard
  }
})
export default class AdminFinanceRequests extends Vue {

  public showCompleted = false;

  

  get openFinanceRequests() {
    return readAdminFinanceRequests(this.$store)
      .filter(request => this.showCompleted || request.status !== 'file_accepted')
      .sort(function(a,b) {
        if(isAfter(new Date(a.date_last_update), new Date(b.date_last_update))) 
          return -1;
        else return 1;
      });
  }

  get archivedFinanceRequests() {
    return readAdminFinanceRequests(this.$store)
      .filter(request => request.status === 'file_accepted')
      .sort(function(a,b) {
        if(isAfter(new Date(a.date_last_update), new Date(b.date_last_update))) 
          return -1;
        else return 1;
      });
  }

  async created() {
    await dispatchAdminFinanceRequests(this.$store);
  }
  
  async applyRequest(financeId: number, accepted: boolean) {
    let updated_status = '';
    if(accepted) updated_status = 'request_accepted';
    else updated_status = 'request_rejected';
    await dispatchUpdateFinanceRequestState(this.$store, { financeId, updated_status });
  }

  public exportAsCsv() {
    this.showCompleted = true;

    // file name
    const date: Date = new Date;
    const filename: string = date.toISOString().split('T')[0].replace('-','').replace('-','') + '_finanzanträge_PT' + '.csv';
    
    // column names
    const rows = [
      ['id','Name','IBAN','Betrag','Verwendungszweck','']
    ];
    
    // create Array
    this.archivedFinanceRequests.forEach(function (item) {
      const row: string[] = [String(item.id), item.author.full_name, String(item.iban) , String(item.amount), item.purpose]
      rows.push(row)
    });

    // create CSV
    const csvContent = 'data:text/csv;charset=utf-8,'
      + rows.map(e => e.join(',')).join('\n');

    // download file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  }


  public headers =  [
    {
      text: 'ID',
      align: 'center',
      filterable: false,
      value: 'id',
    },
    { text: 'Antragssteller', value: 'author.full_name' },
    { text: 'Typ', value: 'type' },
    { text: 'Verwendungszweck', value: 'purpose' },
    { text: 'Betrag', align: 'center', value: 'amount' },
    { text: 'Irgendwas', value: 'association' },
    //{ text: 'Erstellungsdatum', value: 'date_created' },
    //{ text: 'zuletzt bearbeitet', value: 'date_last_updated' },
  ]


}
</script>

<style>

</style>