<template>
  <div class="root">
    <v-container v-if="userProfile">
      <v-row>
        <v-col sm="8" cols="12" order="last" order-sm="first">
          <h5 class="text-h6">Alumnisierung</h5>
          <v-form
            v-model="valid"
            ref="form"
            lazy-validation
          >

            <v-text-field
              label="Adresse"
              type="text"
              v-model="address"
              required
              :rules="[$common.required]"
            >
            </v-text-field>
            <v-text-field
              label="PLZ"
              v-model="postcode"
              required
              :rules="[$common.required, $common.isNumber, v => v.length === 5 || v.length === 4 || 'PLZ ungültig']"
            >
            </v-text-field>

            <v-select
              label="Kontaktmöglichkeit"
              multiple
              chips
              deletable-chips
              required
              v-model="contact"
              :items="contactOptions"
              :rules="[$common.required, v => v.length > 0]"
            >

            </v-select>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="submit">
                Absenden
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-col>

        <v-col sm="4" cols="12" v-if="userProfile.groups">
          <h5 class="text-h6">Aktuell</h5>
          <user-group-card
            class="my-2"
            v-for="group in userProfile.groups"
            outlined
            :key="group.id"
            :group="group"
          ></user-group-card>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import UserGroupCard from '@/components/user-group/UserGroupCard.vue';
import { Group, RequestCreate } from '@/interfaces';
import { dispatchAddRequestMe, dispatchGetGroups } from '@/store/main/actions';
import { readGroups, readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { UserGroupCard }
})
export default class UserProfileRessortChange extends Vue {

  public valid = false;
  public address = '';
  public postcode = null;
  public contact = null;

  public contactOptions = [
    'Alumni Newsletter / Hinweise zu CCT Events',
    'Einladungen zu Events',
    'Get Togethers',
    'Persönliche Kontaktaufnahme',
    'Alumni Networking 4.0 Gruppe LinkedIn',
    'Facebook Gruppe'
  ]


  public async submit() {

    if ((this.$refs.form as HTMLFormElement).validate()) {
      //
      const requestCreate: RequestCreate = {
        description: `Adresse: ${this.address}\nPLZ: ${this.postcode}\nKontakt: ${this.contact}`,
        groups: [
          {
            mode: 'remove',
            group_id: this.activeGroup!.id,
            is_primary: true,
          }
        ]
      };

      await dispatchAddRequestMe(this.$store, requestCreate);
      this.$router.push('/main/people/profile/requests');
    }
  }

  get activeGroup() {
    return readGroups(this.$store).find((group) => group.name === 'aktiv')
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  async mounted() {
    await dispatchGetGroups(this.$store);
  }

  get groups() {
    return readGroups(this.$store);
  }

}
</script>

<style lang="scss" scoped>

</style>