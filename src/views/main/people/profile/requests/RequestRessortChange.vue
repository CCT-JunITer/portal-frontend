<template>
  <div class="root">
    <v-container v-if="userProfile">
      <v-row>
        <v-col sm="8" cols="12" order="last" order-sm="first">
          <h5 class="text-h6">Antrag auf Ressortwechsel</h5>
          <v-form
            v-model="valid"
            ref="form"
            lazy-validation
          >

            <v-select
              label="Neues Ressort"
              v-model="ressort"
              class="input-lg"
              required
              item-text="name"
              return-object
              :items="ressorts"
              :rules="[$common.required]"
            ></v-select>

            <v-textarea
              label="Beschreibung"
              rows="4"
              v-model="description"
            >
            </v-textarea>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="submit">
                Absenden
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-col>

        <v-col sm="4" cols="12" v-if="ressortGroups">
          <h5 class="text-h6">Aktuelle Ressorts</h5>
          <user-group-card
            class="my-2"
            v-for="group in ressortGroups"
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
  public ressort: Group | null = null;
  public description = '';


  public async submit() {

    if ((this.$refs.form as HTMLFormElement).validate()) {
      //
      const requestCreate: RequestCreate = {
        mode: 'add',
        description: this.description,
        group_id: this.ressort!.id
      };

      await dispatchAddRequestMe(this.$store, requestCreate);
      this.$router.push('/main/people/profile/requests');
    }
  }

  get ressortGroups() {
    return this.userProfile?.groups
      .filter(group => group.group.type === 'ressort')
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  async mounted() {
    await dispatchGetGroups(this.$store);
  }

  get ressorts() {
    return this.groups
      .filter(group => group.type === 'ressort')
      .filter(group => !this.userProfile?.active_groups.find(g => g.id === group.id))
  }

  get groups() {
    return readGroups(this.$store);
  }

}
</script>

<style lang="scss" scoped>

</style>