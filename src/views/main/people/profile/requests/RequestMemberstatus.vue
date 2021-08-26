<template>
  <div class="root">
    <v-container v-if="userProfile">
      <v-row>
        <v-col sm="8" cols="12" order="last" order-sm="first">
          <h5 class="text-h6">Antrag zum Mitgliederwerdegang</h5>
          <v-form
            v-model="valid"
            ref="form"
            lazy-validation
          >

            <v-select
              label="Neuer Mitgliedsstatus"
              v-model="memberstatus"
              class="input-lg"
              required
              item-text="name"
              return-object
              :items="memberstatuses"
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

        <v-col sm="4" cols="12" v-if="memberstatusGroups">
          <h5 class="text-h6">Mitgliedsstatus</h5>
          <user-group-card
            class="my-2"
            v-for="group in memberstatusGroups"
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
import { dispatchAddRequestMe, dispatchGetGroups } from '@/store/main/actions';
import { readGroups, readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { UserGroupCard }
})
export default class UserProfileRessortChange extends Vue {

  public valid = false;
  public memberstatus: Group | null = null;
  public description = '';


  public async submit() {

    if ((this.$refs.form as HTMLFormElement).validate()) {
      const dontKeep = this.currentMemberstatusGroups.map(group => {
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
            group_id: this.memberstatus!.id,
            is_primary: true,
          },
          ...dontKeep
        ]
      };

      await dispatchAddRequestMe(this.$store, requestCreate);
      this.$router.push('/main/people/profile/requests');
    }
  }

  get memberstatusGroups() {
    return this.userProfile?.groups
      .filter(group => group.group.type === 'memberstatus')
  }

  get currentMemberstatusGroups() {
    return this.userProfile?.groups
      .filter(group => group.group.type === 'memberstatus' && group.is_active)
      .map(group => group.group) || []
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  async mounted() {
    await dispatchGetGroups(this.$store);
  }

  get memberstatuses() {
    return this.groups
      .filter(group => group.type === 'memberstatus')
      .filter(group => !this.userProfile?.active_groups.find(g => g.id === group.id))
  }

  get groups() {
    return readGroups(this.$store);
  }

}
</script>

<style lang="scss" scoped>

</style>