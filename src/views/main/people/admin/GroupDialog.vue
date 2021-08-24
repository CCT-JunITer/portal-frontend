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
        Zu Gruppe hinzufügen
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Gruppe hinzufügen</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form lazy-validation ref="groupForm">
            <v-select
              label="Gruppe"
              item-text="name"
              return-object
              v-model="group"
              required
              :rules="[$common.required]"
              :items="groups">
              <template v-slot:item="{ item, on, attrs}">
                <v-list-item v-on="on" v-attrs="attrs" two-line>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.type }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
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
import { Group, IUserProfile } from '@/interfaces';
import { dispatchAddUserToGroup } from '@/store/admin/actions';
import { readGroups } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class GroupDialog extends Vue {

  public addToGroupDialog = false;
  public group: Group | null = null;

  @Prop()
  public userProfile!: IUserProfile;

  get groups() {
    return readGroups(this.$store)
      .filter(group => !this.userProfile?.active_groups.find(g => g.id === group.id))
  }

  async addToGroup() {
    if ((this.$refs.groupForm as HTMLFormElement).validate()) {
      await dispatchAddUserToGroup(this.$store, { userId: this.userProfile!.id, groupId: this.group!.id });
      this.addToGroupDialog = false;
    }
  }

}
</script>

<style lang="scss">

</style>