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
        <span class="text-h5">Alumnisiserung</span>
      </v-card-title>
      <v-card-text>
        <span>
          Account löschen <b>{{ userProfile.full_name }}</b>
        </span>
        <v-container>
          <v-form lazy-validation ref="groupForm">
            <v-text-field
              v-model="name"
              required
              :rules="[$common.required, isName]"
              label="Name"
            >

            </v-text-field>
          </v-form>
        </v-container>
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

  public dialogOpen = false;
  public group: Group | null = null;
  public name = '';

  public isName(v: string) {
    return this.userProfile.full_name === v || 'Name ungültig'
  }

  @Prop()
  public userProfile!: IUserProfile;

  public async deleteAccount() {
    await dispatchDeleteUser(this.$store, this.userProfile.id)
  }

}
</script>

<style lang="scss">

</style>