<template>
  <v-dialog
    v-model="addToGroupDialog"
    persistent
    max-width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="cctGreen" outlined v-on="on" v-bind="attrs">
        <v-icon left>
          mdi-plus
        </v-icon>
        Benutzer zur Gruppe hinzufügen
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Benutzer hinzufügen</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form lazy-validation ref="groupForm">
            <user-select
              v-model="userProfile"
              :userChipProps="{}"
              :return-object="true"
            >
            </user-select>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          @click="addToGroupDialog = false"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="cctBlue darken-1"
          text
          @click="addToGroup()"
        >
          Hinzufügen
        </v-btn>
      </v-card-actions>
    </v-card>  
  </v-dialog>
</template>

<script lang="ts">
import UserSelect from '@/components/user-select/UserSelect.vue';
import { Group, IUserProfile } from '@/interfaces';
import { dispatchAddUserToGroup, dispatchGetAdminGroups } from '@/store/admin/actions';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { UserSelect }
})
export default class UserGroupAddDialog extends Vue {

  public addToGroupDialog = false;
  public userProfile: IUserProfile | null = null;

  @Prop()
  public group!: Group;


  async addToGroup() {
    if ((this.$refs.groupForm as HTMLFormElement).validate()) {
      await dispatchAddUserToGroup(this.$store, { userId: this.userProfile!.id, groupId: this.group!.id });
      await dispatchGetAdminGroups(this.$store);
      this.addToGroupDialog = false;
    }
  }

}
</script>

<style lang="scss">

</style>