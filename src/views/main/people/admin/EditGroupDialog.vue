<template>
  <v-dialog
    v-model="editGroupDialog"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Gruppe bearbeiten</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form lazy-validation ref="groupForm" v-if="userGroup">
            
            <date-picker-menu
              v-model="dateFrom"
              defaultPicker="MONTH"
              :pickerProps="{
                min: '1950-01-01',
              }"
            >
              <template v-slot:activator="{on, attrs}">
                <v-text-field
                  label="Datum von"
                  class="input-lg"
                  required
                  v-bind="attrs"
                  v-on="on"
                  :rules="[...attrs.rules,$common.required]"
                >
                </v-text-field>
              </template>
            </date-picker-menu>
            <date-picker-menu
              v-model="dateTo"
              defaultPicker="MONTH"
              :pickerProps="{
                min: '1950-01-01',
              }"
            >
              <template v-slot:activator="{on, attrs}">
                <v-text-field
                  label="Datum bis"
                  class="input-lg"
                  required
                  v-bind="attrs"
                  v-on="on"
                  :rules="[...attrs.rules]"
                >
                </v-text-field>
              </template>
            </date-picker-menu>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          @click="editGroupDialog = false"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="cctBlue darken-1"
          text
          @click="editGroup()"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>  
  </v-dialog>
</template>

<script lang="ts">
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { IUserProfile, UserGroup } from '@/interfaces';
import { dispatchEditUserGroup } from '@/store/admin/actions';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'


@Component({ 
  components: { DatePickerMenu }
})
export default class EditGroupDialog extends Vue {

  public editGroupDialog = false;
  public dateTo = '';
  public dateFrom = '';

  @Prop()
  public userProfile!: IUserProfile;

  public userGroup: UserGroup | null = null;

  public setEditGroup(userGroup: UserGroup | null) {
    this.userGroup = userGroup;
    if (this.userGroup) {
      this.dateTo = this.userGroup.date_to;
      this.dateFrom = this.userGroup.date_from;
      this.editGroupDialog = true;
    }
  }

  async editGroup() {
    if ((this.$refs.groupForm as HTMLFormElement).validate()) {
      await dispatchEditUserGroup(this.$store, {
        userId: this.userProfile.id,
        userGroupId: this.userGroup!.id, 
        payload: { 
          date_from: this.dateFrom,
          date_to: this.dateTo 
        } 
      })
      this.editGroupDialog = false;
    }
  }

}
</script>

<style lang="scss">

</style>