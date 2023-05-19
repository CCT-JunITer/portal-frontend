<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card elevation="10">
            <v-form @submit.prevent="submit">
              <custom-app-bar dark>
                <portal-button></portal-button>
                <v-spacer></v-spacer>
              </custom-app-bar>
              <v-card-text>
                <v-text-field
                  prepend-icon="person" 
                  v-model="email"
                  name="login" 
                  label="E-Mail"
                  type="text"
                  :rules="[$common.required, $common.isEmail]">
                </v-text-field>
                <v-text-field 
                  prepend-icon="lock"
                  v-model="password"
                  name="password" 
                  label="Password" 
                  id="password" 
                  type="password">
                </v-text-field>
                <div v-if="env !== 'production'">
                  <v-combobox
                    v-model="apiUrl"
                    label="Backend URL"
                    prepend-icon="mdi-earth"
                    :items="environments"
                    item-text="name"
                    item-value="external_url"
                    :return-object="false"
                  >
                    <template v-slot:append-outer>
                      <v-btn small @click="loadUrls" color="cctGreen" dark>
                        Load URLs
                      </v-btn>
                    </template>
                  </v-combobox>
                </div>
                <v-alert :value="loginError" transition="fade-transition" type="error">
                  Incorrect email or password
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn :to="{name: 'request-password-reset'}" text color="red">Passwort vergessen</v-btn>
                <v-btn type="submit" depressed>Login</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readLoginError } from '@/store/main/getters';
import { dispatchLogIn } from '@/store/main/actions';
import PortalButton from './main/appbar/components/PortalButton.vue';
import CustomAppBar from './main/appbar/components/CustomAppBar.vue';
import { apiUrl, changeApi, env } from '@/env';
import axios from 'axios';

@Component({
  components: { PortalButton, CustomAppBar }
})
export default class Login extends Vue {
  public email = '';
  public password = '';
  private environments = [];
  public env = env;

  public get apiUrl() {
    return apiUrl;
  }

  public set apiUrl(value) {
    changeApi(value);
  }

  public async loadUrls() {
    const token = process.env.VUE_APP_GITLAB_TOKEN;
    const response = await axios.get('https://gitlab.cct-ev.de/api/v4/projects', { 
      headers: {
        'PRIVATE-TOKEN': token
      },
      params: {
        search: 'backend'
      }
    });
    
    for (const project of response.data) {
      const response = await axios.get(`https://gitlab.cct-ev.de/api/v4/projects/${project.id}/environments`, { 
        headers: {
          'PRIVATE-TOKEN': token
        },
        params: {
          states: 'available'
        }
      });
      const environments = response.data.filter(env => env.external_url);
      this.environments = environments;
      break;
    }
  }

  public get loginError() {
    return readLoginError(this.$store);
  }

  public submit() {
    dispatchLogIn(this.$store, {username: this.email, password: this.password});
  }
}
</script>

<style>
</style>
