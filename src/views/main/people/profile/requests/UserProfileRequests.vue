<template>
  <v-container>
    <div class="d-flex">
      <v-flex>
        <h4 class="text-h4 my-5">Meine Anträge</h4>
      </v-flex>
      <div class="d-flex align-center">
        <!--<v-btn outlined color="cctBlue" :to="{ name: 'profile-request-create' }">
          <v-icon left>
            mdi-clipboard-text
          </v-icon>
          Antrag stellen
        </v-btn>-->
      </div>
    </div>
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
      <v-col v-for="request in requests" :key="request.id" cols="12" sm="6" lg="3">
        <request-card :request="request" outlined></request-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import RequestCard from '@/components/request/RequestCard.vue';
import { dispatchGetMyRequests } from '@/store/main/actions';
import { readMyRequests } from '@/store/main/getters';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: { RequestCard }
})
export default class UserProfileRequests extends Vue {

  public showCompleted = false;

  get requests() {
    return readMyRequests(this.$store).filter(request => this.showCompleted || request.status === 'in progress');
  }

  mounted() {
    dispatchGetMyRequests(this.$store);
  }

}
</script>

<style>
</style>