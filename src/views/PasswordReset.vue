<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card elevation="10">
            <v-form
              v-model="valid"
              ref="form"
              lazy-validation
              @submit.prevent="submit"
            >
              <v-toolbar dark :color="env === 'production' ? 'cctBlue' : 'cctOrange darken-3'">
                <portal-button></portal-button>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-alert
                  color="cctOrange"
                  border="left"
                  type="warning"
                  outlined
                  text
                >
                  Dein Passwort wird bei allen IT-Diensten zurückgesetzt, außer bei Slack.
                </v-alert>
        
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
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="$router.back()">abbrechen</v-btn>
                <v-btn @click.prevent="submit" type="submit" color="cctGreen" class="white--text" :disabled="!valid">
                  Passwort ändern
                </v-btn>
              </v-card-actions> 
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { env } from '@/env';
import { dispatchResetPassword } from '@/store/main/actions';
import { Vue, Component } from 'vue-property-decorator'
import PortalButton from './main/appbar/components/PortalButton.vue';

@Component({
  components: { PortalButton }
})
export default class UserProfileEditPassword extends Vue {
  public valid = false;
  public password1 = '';
  public password2 = '';
  public token = '';
  public env = env;

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const passwordToken = this.$route.query.token;
      if (passwordToken) {
        await dispatchResetPassword(this.$store, {password:this.password1, token: passwordToken as string})
        await this.$router.push('/login');
      }
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