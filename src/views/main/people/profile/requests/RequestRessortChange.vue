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
              label="In Ressort bleiben"
              v-model="keepRessorts"
              class="input-lg"
              item-text="name"
              multiple
              return-object
              :items="currentRessortGroups"
            >

            </v-select>

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

            <v-checkbox
              v-if="ressort && keepRessorts.length"
              :label="`${ressort.name || 'Neues Ressort'} ist neues primäres Ressort`"
              v-model="newPrimary"
            >

            </v-checkbox>

            <v-textarea
              label="Beschreibung"
              rows="4"
              v-model="description"
            >
            </v-textarea>

            <v-card-actions>
              <v-alert
                v-if="showValidationError"
                type="error"
                dense
                outlined
                class="mb-0 mr-3 flex-grow-1"
              >
                Bitte überprüfen Sie Ihre Eingaben. Einige Pflichtfelder sind nicht korrekt ausgefüllt.
              </v-alert>
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
import { Group, RequestCreate, RequestGroup } from '@/interfaces';
import { dispatchAddRequestMe } from '@/store/main/actions';
import { readGroups, readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { UserGroupCard }
})
export default class UserProfileRessortChange extends Vue {

  public valid = false;
  public showValidationError = false;
  public ressort: Group | null = null;
  public keepRessorts: Group[] = [];
  public newPrimary = true;
  public description = '';


  public async submit() {

    this.showValidationError = false;
    if ((this.$refs.form as HTMLFormElement).validate()) {
      if (!this.keepRessorts.length) {
        this.newPrimary = true;
      }

      const dontKeep = this.currentRessortGroups.filter((group) => {
        return !this.keepRessorts.find((keep) => keep.id === group.id)
      }).map(group => {
        return {
          mode: 'remove',
          group_id: group.id,
          is_primary: false,
        } as RequestGroup
      });


      //
      const requestCreate: RequestCreate = {
        description: this.description,
        groups: [
          {
            mode: 'add',
            group_id: this.ressort!.id,
            is_primary: this.newPrimary,
          },
          ...dontKeep
        ]
      };

      await dispatchAddRequestMe(this.$store, requestCreate);
      this.$router.push('/main/people/profile/requests');
    } else {
      this.showValidationError = true;
    }
  }

  get currentRessortGroups() {
    return this.userProfile?.groups
      .filter(group => group.group.type === 'ressort' && group.is_active)
      .map(group => group.group) || [];
  }

  get ressortGroups() {
    return this.userProfile?.groups
      .filter(group => group.group.type === 'ressort')
  }

  get userProfile() {
    return readUserProfile(this.$store);
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