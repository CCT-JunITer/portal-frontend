<template>
  <v-container>
    <v-form
      v-model="valid"
      ref="form"
      lazy-validation
    >

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Gruppe</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8">
          <v-text-field 
            v-model="name"
            label="Name"
            required
            :rules="[$common.required]"
          ></v-text-field>
          <v-text-field 
            v-model="ldap_group"
            label="LDAP Gruppe"
          ></v-text-field>
          <v-text-field 
            v-model="kas_mailinglist"
            label="KAS Mailverteiler"
          ></v-text-field>
          <v-select 
            v-model="type"
            label="Typ"
            :items="['group', 'ressort', 'position', 'memberstatus', 'status']"
            :rules="[$common.required]"
          ></v-select>
          <v-combobox
            ref="combobox"
            v-model="permissions"
            :search-input.sync="search"
            chips
            clearable
            persistent-hint
            multiple
            label="Berechtigungen"
          >
            <template v-slot:no-data>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ search }}</v-list-item-title>
                  <v-list-item-subtitle>Berechtigung hinzufügen (Beispiel: "portal.*")</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip label dark color="cctGreen" :disabled="false">
                    <v-icon>
                      mdi-keyboard-return
                    </v-icon>
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-menu
                :value="selected"
                bottom
                right
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-chip
                    v-bind="attrs"
                    v-on="on"
                    :input-value="selected"
                    close
                    @click:close="parent.selectItem(item)"
                  >
                    {{ item }}
                  </v-chip>
                </template>
              </v-menu>
          
            </template>
          </v-combobox>
          <icon-list
            v-model="icon"
          ></icon-list>
        </v-col>
      </v-row>
      <v-row v-if="isEdit">
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Benutzer</h4>
          <p class="text-body-2 text--secondary">Benutzer in der Gruppe</p>
        </v-col>
        <v-col cols="12" md="8">
          <v-card-actions>
            <user-group-add-dialog
              :group="group"
            ></user-group-add-dialog>
          </v-card-actions>
          <v-list v-if="users">
            <user-list-item 
              v-for="user in users"
              :user="user"
              :key="user.id"
            >
              <template v-slot:actions>
                <v-btn icon color="red" @click="removeFromGroup(user)">
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
            </user-list-item>
          </v-list>
        </v-col>
      </v-row>
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
        <v-btn @click="$router.back()" raised>Abbrechen</v-btn>
        <v-btn
          @click="submit"
          color="primary"
          raised
          :disabled="!valid"
        >
          Gruppe speichern
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import IconList from '@/components/icon-list/IconList.vue';
import UserListItem from '@/components/user-list-item/UserListItem.vue';
import { GroupCreate, GroupUpdate, IUserProfile } from '@/interfaces';
import { dispatchCreateGroup, dispatchGetAdminGroups, dispatchRemoveUserFromGroup, dispatchUpdateGroup } from '@/store/admin/actions';
import { readAdminOneGroup } from '@/store/admin/getters'
import { Vue, Component, Prop } from 'vue-property-decorator'
import UserGroupAddDialog from './UserGroupAddDialog.vue';

@Component({
  components: { UserListItem, IconList, UserGroupAddDialog }
})
export default class EditGroup extends Vue {

  public valid = false;
  public showValidationError = false;
  public search = '';

  public name = '';
  public ldap_group = '';
  public kas_mailinglist = '';
  public type = '';
  public icon = '';
  public permissions: string[] = [];

  public reset() {
    if (this.group) {
      this.name = this.group.name;
      this.ldap_group = this.group.ldap_group;
      this.kas_mailinglist = this.group.kas_mailinglist;
      this.type = this.group.type;
      this.permissions = this.group.permissions;
      this.icon = this.group.icon;
    }
  }

  public async submit() {
    this.showValidationError = false;
    if ((this.$refs.form as HTMLFormElement).validate()) {
      try {
        const updatedGroup: GroupCreate = {
          name: this.name,
          permissions: this.permissions,
          type: this.type,
          ldap_group: this.ldap_group,
          kas_mailinglist: this.kas_mailinglist,
          icon: this.icon,
        }
        if (this.group?.id) {
          await dispatchUpdateGroup(this.$store, { id: this.group?.id, group: updatedGroup });
        } else {
          await dispatchCreateGroup(this.$store, updatedGroup);
        }
      } catch (error) {
        // Error notification is already shown by apiCallNotify
        console.error('Failed to save group:', error);
      }
    } else {
      this.showValidationError = true;
    }
  }

  async mounted() {
    await dispatchGetAdminGroups(this.$store);
    this.reset();
  }

  public get isEdit() {
    return !!this.group;
  }

  public get users() {
    return this.group?.active_users;
  }

  public get group() {
    return readAdminOneGroup(this.$store)(+this.$route.params.id);
  }

  async removeFromGroup(user: IUserProfile) {
    await dispatchRemoveUserFromGroup(this.$store, { userId: user!.id, groupId: this.group!.id });
  }

}
</script>

<style lang="scss">

</style>