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
        Alumnisierung
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Alumnisierung</span>
      </v-card-title>
      <v-card-text>
        <v-alert
          outlined
          type="error"
        >
          Der Zugang zu den IT-Diensten wird entzogen. 
          Außerdem wird das Mail-Postfach, und somit alle E-Mails für <b>{{ userProfile.email }}</b>, unwideruflich gelöscht.
        </v-alert>
        <span>
          Das Löschen des Accounts kann <b>nicht rückgängig</b> gemacht werden. 
          <br />
          <br />
          Bitte gib zur Bestätigung folgendes ein:
          <br />
          <pre class="text-h6"><b>{{ userProfile.full_name }}</b></pre>
        </span>
        <v-divider class="my-5"></v-divider>

        <v-form lazy-validation ref="groupForm" v-model="valid">
          <v-text-field
            v-model="name"
            required
            :rules="[$common.required, isName]"
            outlined
            dense
          >

          </v-text-field>
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
        <v-btn
          color="cctBlue darken-1"
          text
          @click="deleteAccount()"
          :disabled="!valid"
        >
          Alumnisieren
        </v-btn>
      </v-card-actions>
    </v-card>  
  </v-dialog>
</template>

<script lang="ts">
import { Group, IUserProfile } from '@/interfaces';
import { dispatchDeleteUser } from '@/store/admin/actions';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class DeleteDialog extends Vue {

  public valid = false;
  public dialogOpen = false;
  public group: Group | null = null;
  public name = '';

  public isName(v: string) {
    return this.userProfile.full_name === v || 'Name ungültig'
  }

  @Prop()
  public userProfile!: IUserProfile;

  public async deleteAccount() {
    if ((this.$refs.groupForm as HTMLFormElement).validate()){
      await dispatchDeleteUser(this.$store, this.userProfile.id)
      this.dialogOpen = false;
    }
  }

}
</script>

<style lang="scss">

</style>