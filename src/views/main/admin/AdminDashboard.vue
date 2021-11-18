<template>
  <div class="root">
    <v-container>
      <h2 class="text-h2 my-5">Admin Dashboard</h2>
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="5">
            <v-img
              height="250"
              :src="require('@/assets/mitgliederverwalten_img.jpg')"
            ></v-img>
            <v-card-title>
              <v-icon left>people</v-icon>
              Mitglieder verwalten
            </v-card-title>
            <v-card-text>Hier kannst du bestehende Mitgliederaccounts verändern und verwalten.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text to="/main/people/admin" color="cctOrange">Verwalten</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card elevation="5">
            <v-img
              height="250"
              :src="require('@/assets/interessen_img.jpg')"
            ></v-img>
            <v-card-title>
              <v-icon left>mdi-account-multiple-plus</v-icon>
              Interessenten einladen
            </v-card-title>
            <v-card-text>Lade zum Semesterstart neue Interessenten zum Assessment Center ein.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text to="/main/admin/user-invite" color="cctGreen">Einladen</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card elevation="5">
            <v-img
              height="250"
              :src="require('@/assets/anfragenbearbeiten_img.jpg')"
            ></v-img>
            <v-card-title>
              <v-icon left>mdi-wrench</v-icon>
              Anfragen bearbeiten
            </v-card-title>
            <v-card-text>Hier können Anfragen zur Alumnisierung oder Passivierung verwaltet werden.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text to="/main/people/admin/requests" color="cctBlue">Bearbeiten</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card elevation="5">
            <v-img
              height="250"
              :src="require('@/assets/schulungenanlegen_img.jpeg')"
            ></v-img>
            <v-card-title>
              <v-icon left>lightbulb</v-icon>
              Schulung anlegen
            </v-card-title>
            <v-card-text>Hier können neue Pflicht- oder Zusatzschulungsformate angelegt werden.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text to="/main/admin/training" color="cctBlue">Anlegen</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4" v-if="isFinanzvorstand()">
          <v-card elevation="5">
            <v-img
              height="250"
              :src="require('@/assets/admin_finanzantrag.jpg')"
            ></v-img>
            <v-card-title>
              <v-icon left>mdi-cash</v-icon>
              Finanzanträge verwalten
            </v-card-title>
            <v-card-text>Hier können eingegangene Finanzanträge verwaltet werden.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text to="/main/admin/finance-requests" color="cctBlue">Verwalten</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { dispatchGetUserProfile } from '@/store/main/actions';
import { readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class AdminDashboard extends Vue {

  get user() {
    return readUserProfile(this.$store)
  }
  public isFinanzvorstand() {
    return this.user?.active_groups.map(group => group.name).includes('Finanzvorstand');
  }
  async mounted() {
    await dispatchGetUserProfile(this.$store);
  }
    

}
</script>

<style lang="scss" scoped>

</style>