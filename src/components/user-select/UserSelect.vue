<template>
  <v-autocomplete
    :items="this.users"
    :item-value="this.returnValue"
    item-text="full_name"
    chips
    cache-items
    deletable-chips
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:selection="{ attrs, on, item, selected, parent }">
      <user-chip
        v-bind="{...attrs, ...$props.userChipProps}"
        v-on="on"
        :input-value="selected"
        :user="item"
        close
        @click:close="parent.multiple ? parent.selectItem(item) : parent.setValue(null)"
      ></user-chip>
    </template>
    <template v-slot:item="data">
      <template>
        <employee-profile-picture
          :employee="data.item"
          component="v-list-item-avatar"
          size="40"
        ></employee-profile-picture>
        <v-list-item-content>
          <v-list-item-title v-text="data.item.full_name || data.item.email"></v-list-item-title>
          <v-list-item-subtitle v-text="data.item.ressort"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { IUserProfile } from '@/interfaces';
import { dispatchGetUsers } from '@/store/main/actions'
import { readUsers } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'
import { VChip } from 'vuetify/lib/components';
import EmployeeProfilePicture from '../employee/EmployeeProfilePicture.vue'
import UserChip from '../user-chip/UserChip.vue';


@Component({
  components: {
    EmployeeProfilePicture,
    UserChip
  }
})
export default class UserSelect extends Vue {

  @Prop({ default: 'id' })
  public returnValue!: string;

  @Prop()
  public userChipProps!: typeof VChip;

  async mounted() {
    await dispatchGetUsers(this.$store);
  }

  get users() {
    return readUsers(this.$store);
  }

}
</script>

<style lang="scss">

</style>