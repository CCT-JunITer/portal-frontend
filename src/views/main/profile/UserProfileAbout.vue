<template>
  <v-card outlined>
    <v-card-title>
      Profil
    </v-card-title>
    <v-card-text>
      <v-row
        align="center"
        no-gutters
        dense
        v-for="item in items"
        :key="item.key"
      >
        <v-col cols="6">
          <div class="ma-2 text--secondary text-caption">
            {{ item.text }}
          </div>
        </v-col>

        <v-col cols="6">
          <div class="text--primary text-body-1">
            {{ userProfile[item.key] }}
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readAdminOneUser, readUserProfile } from '@/store/main/getters';
import { IUserProfile } from '@/interfaces';

@Component({})
export default class UserProfileAbout extends Vue {

  private items: {
    key: keyof IUserProfile;
    text: string;
  }[] = [
    {
      text: 'Mitgliedsstatus',
      key: 'memberstatus'
    },
    {
      text: 'Eintrittsdatum',
      key: 'entrydate',
    },
    {
      text: 'Studiengang',
      key: 'major',
    },
    {
      text: 'Universität',
      key: 'university',
    },
    {
      text: 'Hochschulgrad des Studiums',
      key: 'studylevel',
    },
    {
      text: 'Bezirk',
      key: 'district'
    },
    {
      text: 'Geburtstag',
      key: 'birthdate'
    },
    
  ];

  get isMe() {
    const id = this.$route.params.id;
    return id === 'me';
  }

  get userProfile() {
    if (this.isMe) {
      return readUserProfile(this.$store) || {};
    }
    const id = this.$route.params.id;
    return readAdminOneUser(this.$store)(parseInt(id)) || {};
  }

}
</script>
