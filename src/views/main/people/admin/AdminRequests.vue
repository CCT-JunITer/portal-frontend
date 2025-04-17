<template>
  <div>
    <v-container>
      <h4 class="text-h4 my-5">Anträge</h4>
        
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-checkbox 
          label="abgeschlossene anzeigen"
          dense
          color="cctGreen"
          v-model="showCompleted"
        >
        </v-checkbox>
      </v-card-actions>
      <v-row>
        <v-col v-for="request in requests" :key="request.id" cols="12" md="6">
          <request-card :request="request">
            <template v-slot:actions v-if="request.description !=='requestype: Alumnisierung'">
              <v-btn outlined color="green" small @click="applyRequest(request, true)">
                Annehmen
              </v-btn>
              <v-btn outlined color="red" small @click="applyRequest(request, false)">
                Ablehnen
              </v-btn>
            </template>
            <template v-slot:actions v-else>
              <delete-dialog :userProfile="request.user" :request="request"/>
            </template>
          </request-card>
        </v-col>
      </v-row>
    </v-container> 
  </div>
</template>

<script lang="ts">
import DeleteDialog from './DeleteDialog.vue'
import RequestCard from '@/components/request/RequestCard.vue';
import { dispatchAdminRequests, dispatchApplyRequest } from '@/store/admin/actions';
import { readAdminRequests } from '@/store/admin/getters';
import { Vue, Component } from 'vue-property-decorator';
import { Request } from '@/interfaces';


@Component({
  components: {
    RequestCard, DeleteDialog
  }
})
export default class AdminRequests extends Vue {

  public showCompleted = false;

  get requests() {
    return readAdminRequests(this.$store)
      .filter(request => this.showCompleted || request.status === 'in progress');
  }

  async created() {
    await dispatchAdminRequests(this.$store, undefined);
  }

  async applyRequest(request: Request, accepted: boolean) {
    
    await dispatchApplyRequest(this.$store, { requestId: request.id, accepted });
  }
}
</script>

<style>

</style>