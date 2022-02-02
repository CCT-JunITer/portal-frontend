<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-form
            v-model="valid"
            ref="form"
            lazy-validation
            @submit.prevent="submit"
          >
            <v-card elevation="10">
              <v-toolbar dark :color="env === 'production' ? 'cctBlue' : 'cctOrange darken-3'">
                <v-btn icon to="/login">
                  <v-icon>
                    mdi-arrow-left
                  </v-icon>
                </v-btn>
                <portal-button></portal-button>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-text-field
                  v-model="email"
                  prepend-icon="person"
                  label="E-Mail"
                  name="login"
                  type="text"
                  :rules="[$common.required]">
                </v-text-field>
                <!-- Render non-visible password field, so the email is autocompleted -->
                <v-text-field 
                  v-show="false" 
                  prepend-icon="lock" 
                  name="password" 
                  label="Password" 
                  id="password"
                  type="password"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click.prevent="submit" color="cctGreen" class="white--text" :disabled="!valid">Reset</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readLoginError } from '@/store/main/getters';
import { dispatchPasswordRecovery } from '@/store/main/actions';
import PortalButton from './main/appbar/components/PortalButton.vue';
import { env } from '@/env';

@Component({
  components: { PortalButton }
})
export default class RequestPasswordReset extends Vue {
  public email = '';
  public env = env;
  public valid = false;

  public get loginError() {
    return readLoginError(this.$store);
  }

  public submit() {
    if ((this.$refs.form as HTMLFormElement).validate()){
      dispatchPasswordRecovery(this.$store, {username: this.email});
    }
  }
}
</script>

<style>
</style>
