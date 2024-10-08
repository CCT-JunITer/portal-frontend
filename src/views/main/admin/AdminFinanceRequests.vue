<template>
  <div>
    
    <v-toolbar
      class=""
      flat
      color="#eee"
    >
      <v-toolbar-title class="text-h5">Alle Finanzanträge</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn outlined color="cctBlue" @click="exportAsCsv">
        <v-icon left>
          mdi-clipboard-text
        </v-icon>
        exportieren
      </v-btn>
    </v-toolbar>
    <v-container> 
      <h4 class="text-h4 mb-3 mt-5">Offene Anträge</h4>
      
      <v-select
        :items="statuslist"
        label="Status"
        v-model="filterkey"
      ></v-select>


      <div v-if="filterkey == 'all'">
        <v-row>
          <v-col v-for="financeRequest in openFinanceRequests" :key="financeRequest.id" cols="12" md="6" lg="4">
            <admin-finance-request-card class="my-2" :request="financeRequest">
              <template v-slot:actions>
              </template>
            </admin-finance-request-card>
          </v-col>
        </v-row>
      </div>
      
      <div>
        <v-row>
          <v-col v-for="financeRequest in openFinanceRequests.filter(request => request.status == this.filterkey)" :key="financeRequest.id" cols="12" md="6" lg="4">
            <admin-finance-request-card class="my-2" :request="financeRequest">
              <template v-slot:actions>
              </template>
            </admin-finance-request-card>
          </v-col>
        </v-row>
      </div>

      <h4 class="text-h4 mb-3 mt-5">Archivierte Anträge</h4>
      <v-data-table
        @click:row="handleClickRow"
        :headers="headers"
        :items="archivedFinanceRequests"
      >
        <template v-slot:item.date_created="{ item }">
          {{ format(new Date(String(item.date_created)), 'dd.MM.yyyy - HH:mm') }}
        </template>
        <template v-slot:item.date_last_update="{ item }">
          {{ format(new Date(String(item.date_last_update)), 'dd.MM.yyyy - HH:mm') }}
        </template>
        <template v-slot:item.association="{ item }">
          <span v-if="item.association">
            {{ item.association }}
          </span>
          <span v-else class="font-weight-medium">X</span>
        </template>
      </v-data-table>
    </v-container> 
  </div>
</template>

<script lang="ts">
import AdminFinanceRequestCard from '@/components/request/AdminFinanceRequestCard.vue';
import { dispatchAdminFinanceRequests } from '@/store/admin/actions';
import { readAdminFinanceRequests } from '@/store/admin/getters';
import { dispatchSaveAsCsv } from '@/store/main/actions';
import { format, isAfter } from 'date-fns';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    AdminFinanceRequestCard
  },
  methods: {
    format
  }
})
export default class AdminFinanceRequests extends Vue {

  public filterkey = 'all';
  public statuslist = ['all', 'created','request_rejected', 'request_accepted', 'file_uploaded', 'file_rejected', 'file_accepted'];

  public handleClickRow(value) {
    this.$router.push({ name: 'finance-request-detail', params: { id: value.id } })
  }
 
  get openFinanceRequests() {
    return readAdminFinanceRequests(this.$store)
      .filter(request => request.status !== 'file_accepted')
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

  public async exportAsCsv() {
    await dispatchSaveAsCsv(this.$store, {
      data: this.archivedFinanceRequests,
      fileName: 'Finanzanträge',
      headers: ['id','Name','IBAN','Betrag','Verwendungszweck',''],
      renderRow: (item) => [String(item.id), item.author.full_name, String(item.iban) , String(item.amount), item.purpose]
    });
  }


  public headers =  [
    { text: 'ID', align: 'center', filterable: true, value: 'id' },
    { text: 'Antragssteller', align: 'left', filterable: true, value: 'author.full_name' },
    { text: 'Typ', align: 'left', filterable: true, value: 'type' },
    { text: 'Verwendungszweck', align: 'left', filterable: false, value: 'purpose' },
    { text: 'Betrag', align: 'center', filterable: true, value: 'amount' },
    { text: 'Ressortbudget', align: 'center', filterable: true, value: 'association' },
    { text: 'Status', align: 'left', filterable: true, value: 'status' },
    { text: 'Erstellungsdatum', align: 'left', filterable: true, value: 'date_created' },
    { text: 'zuletzte bearbeitet', align: 'left', filterable: true, value: 'date_last_update' },
    { text: 'IBAN', align: 'left', filterable: false, value: 'iban' },
  ]


}
</script>

<style>

</style>