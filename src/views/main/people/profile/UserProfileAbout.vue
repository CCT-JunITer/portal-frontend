<template>
  <v-card outlined v-if="userProfile">
    <v-card-title>
      Profil
    </v-card-title>
    <v-card-text>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.text"
        >
          <td class="text--secondary text-caption pa-2 pr-5">{{ item.text }}</td>
          <td width="100%" class="text--primary text-body-1 pa-2">{{ item.key }}</td>
        </tr>
      </tbody>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readRouteUser } from '@/store/main/getters';
import { format } from 'date-fns';
import { de } from 'date-fns/locale'

@Component({})
export default class UserProfileAbout extends Vue {

  get items() { 
    return [
      {
        text: 'Mitgliedsstatus',
        key: this.userProfile?.memberstatus
      },
      {
        text: 'Eintrittsdatum',
        key: this.userProfile && format(new Date(this.userProfile.entrydate), 'dd. MMMM yyyy', { locale: de }),
      },
      {
        text: 'Studiengang',
        key: this.userProfile?.major,
      },
      {
        text: 'Universität',
        key: this.userProfile?.university,
      },
      {
        text: 'Hochschulgrad des Studiums',
        key: this.userProfile?.studylevel,
      },
      {
        text: 'Geburtstag',
        key: this.userProfile && format(new Date(this.userProfile.birthdate), 'dd. MMMM yyyy', { locale: de }),
      },  
    ]; 
  }

  get userProfile() {
    return readRouteUser(this.$store)(this.$route);
  }

}
</script>
