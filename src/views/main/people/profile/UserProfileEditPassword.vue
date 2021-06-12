<template>
  <v-container>

    <v-alert
      color="cctOrange"
      border="left"
      type="warning"
      outlined
      text
    >
      Dein Passwort wird bei allen IT-Diensten zurückgesetzt, außer bei Slack.
    </v-alert>
    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4 text--primary mb-3">Passwort</h4>
        <p class="text-body-2 text--secondary">Ändere dein Passwort</p>
      </v-col>

      <v-col cols="12" md="8">
        
        <v-form
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-text-field
            type="password"
            ref="password"
            label="Passwort"
            class="input-lg"
            v-model="password1"
            :rules="[v => v && v.length >= 8 || 'Das Passwort muss mindestens 8 Zeichen lang sein']"
          >
          </v-text-field>
          <v-text-field
            type="password"
            ref="password"
            label="Passwort wiederholen"
            class="input-lg"
            v-model="password2"
            :rules="[v => v == password1 || 'Die Passwörter müssen identisch sein']"
          >
          </v-text-field>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="$router.back()">abbrechen</v-btn>
          <v-btn @click="submit" color="cctGreen" class="white--text" :disabled="!valid">
            Passwort ändern
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
import { IUserProfileUpdate } from '@/interfaces';
import { dispatchUpdateUserProfile } from '@/store/main/actions';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class UserProfileEditPassword extends Vue {

  public valid = false;
  public password1 = '';
  public password2 = '';

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const updateProfile: IUserProfileUpdate = { password: this.password1 };

      await dispatchUpdateUserProfile(this.$store, updateProfile);
      this.$router.push('/main/people/profile');
    }
  }
}
</script>

<style lang="sass">

@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important

</style>