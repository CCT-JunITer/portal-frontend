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
          <div class="ma-2 text--secondary text-body-2">
            {{ item.text }}
          </div>
        </v-col>

        <v-col cols="6">
          {{ userProfile[item.key] }}
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
export default class UserProfileInformation extends Vue {

  private items: {
    key: keyof IUserProfile;
    text: string;
  }[] = [
    {
      text: 'Bezirk',
      key: 'district'
    },
    {
      text: 'Geburtstag',
      key: 'birthdate'
    },
    {
      text: 'Eintrittsdatum',
      key: 'entrydate',
    }
  ];

  get isMe() {
    const id = this.$route.params.id;
    return id === 'me';
  }

  get userProfile() {
    if (this.isMe) {
      return readUserProfile(this.$store);
    }
    const id = this.$route.params.id;
    return readAdminOneUser(this.$store)(parseInt(id));
  }

}
</script>
