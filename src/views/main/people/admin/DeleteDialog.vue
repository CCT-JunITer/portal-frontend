<template>
  <v-dialog
    v-model="dialogOpen"
    persistent
    max-width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="cctOrange" outlined v-on="on" v-bind="attrs">
        <v-icon left>
          mdi-school
        </v-icon>
        Alumnisierung und Account
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Alumnisierung</span>
      </v-card-title>
      <v-card-text>
        <v-form lazy-validation ref="groupForm" v-model="valid">
          <v-checkbox
            v-model="skipDeactivate"
            label="IT-Dienste behalten (ausgenommen Portal)"
          >
          </v-checkbox>
          <v-alert
            :type="skipDeactivate ? 'warning' : 'error'"
          >
            <div v-if="!skipDeactivate">
              Der Zugang zu den IT-Diensten wird entzogen. 
              Außerdem wird das Mail-Postfach, und somit alle E-Mails für <b>{{ userProfile.email }}</b>, unwideruflich gelöscht.
              <br />
              <br />
              <b>Folgende Dienste werden gelöscht:</b>
              <br />
              <ul>
                <li>Mail-Postfach</li>
                <li>CCT-Cloud</li>
                <li>BDSU Onedrive</li>
                <li>Limesurvey</li>
                <li>Slack</li>
                <li>Wiki</li>
              </ul>
            </div>
            <div v-else>
              <b>Portal-Zugang wird deaktiviert.</b>
              <br />
              <br />
              <b>Folgende Dienste bleiben erhalten:</b>
              <br />
              <ul>
                <li>Mail-Postfach</li>
                <li>CCT-Cloud</li>
                <li>BDSU Onedrive</li>
                <li>Limesurvey</li>
                <li>Slack</li>
                <li>Wiki</li>
              </ul>
            </div>
          </v-alert>
          <span>
            Das Löschen des Accounts kann durch Hinzufügen der <tt>aktiv</tt> Gruppe rückgängig gemacht werden. 
            <br />
            <br />
            Bitte gib zur Bestätigung folgendes ein:
            <br />
            <pre class="text-h6"><b>{{ userProfile.full_name }}</b></pre>
          </span>

          <v-text-field
            required
            :rules="[$common.required, isName]"
            outlined
            dense
            label="Bestätigung Name"
          >
          </v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="cctBlue darken-1"
              dark
              @click="deleteAccount()"
              :disabled="!valid"
            >
              Alumnisieren
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-title>
        Aktivierung
      </v-card-title>

      <v-card-text>
        <v-form lazy-validation ref="activateForm" v-model="validActivate">
          <v-alert
            outlined
            type="warning"
          >
            Der Zugang zu den IT-Diensten wird wiederhergestellt (außer Slack). 
            <br />
            <br />
            Bitte gib ein neues Passwort ein.
            <br />
            Dem Account muss unter Umständen die Gruppe <tt>aktiv</tt> zugewiesen werden.
          </v-alert>
          <v-text-field
            v-model="password"
            required
            :rules="[$common.required]"
            outlined
            dense
            label="Neues Passwort"
          >
          </v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="cctOrange darken-1"
              dark
              @click="activate()"
              :disabled="!validActivate"
            >
              Aktivieren
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>


      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          @click="dialogOpen = false"
        >
          Abbrechen
        </v-btn>
      </v-card-actions>
    </v-card>  
  </v-dialog>
</template>

<script lang="ts">
import { Group, IUserProfile } from '@/interfaces';
import { dispatchDeleteUser, dispatchUpdateUserState } from '@/store/admin/actions';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class DeleteDialog extends Vue {

  public valid = false;
  public skipDeactivate = false;
  public validActivate = false;
  public dialogOpen = false;
  public group: Group | null = null;
  public password = '';

  public isName(v: string) {
    return this.userProfile.full_name === v || 'Name ungültig'
  }

  @Prop()
  public userProfile!: IUserProfile;

  public async deleteAccount() {
    if ((this.$refs.groupForm as HTMLFormElement).validate()){
      await dispatchDeleteUser(this.$store, this.userProfile.id)
      if (!this.skipDeactivate) {
        await dispatchUpdateUserState(this.$store, { id: this.userProfile.id, state: 'deactivate' })
      }
      this.dialogOpen = false;
    }
  }

  public async activate() {
    if ((this.$refs.activateForm as HTMLFormElement).validate()){
      await dispatchUpdateUserState(this.$store, { id: this.userProfile.id, state: 'activate', new_password: this.password })
      this.dialogOpen = false;
    }
  }

  public async deactivate() {
    if ((this.$refs.deactivateForm as HTMLFormElement).validate()){
      await dispatchUpdateUserState(this.$store, { id: this.userProfile.id, state: 'deactivate' })
      this.dialogOpen = false;
    }
  }

}
</script>

<style lang="scss">

</style>