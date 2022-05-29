<template>
  <v-dialog 
    :value="value"
    @input="$emit('input', $event)"
    max-width="450px"
  >
    <v-card>
      <v-card-title class="text-h5">{{ title }}</v-card-title>
      <v-card-text>
        <div>
          <v-list subheader>
            <v-subheader>{{ subtitle }}</v-subheader>

            <v-list-item
              v-for="user in users"
              :key="user.id"
            >
              <employee-profile-picture
                :employee="user"
                component="v-list-item-avatar"
                size="40"
              ></employee-profile-picture>

              <v-list-item-content>
                <v-list-item-title v-text="user.full_name"></v-list-item-title>
                <v-list-item-subtitle v-text="user.ressort"></v-list-item-subtitle>
              </v-list-item-content>

            </v-list-item>
          </v-list>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="cctBlue" text @click="$emit('input', false)">Schließen</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { IUserProfile } from '@/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator'
import EmployeeProfilePicture from '../employee/EmployeeProfilePicture.vue';

@Component({
  components: {
    EmployeeProfilePicture
  }
})
export default class ShowUserDialog extends Vue {
  @Prop({ default: false })
  public value!: boolean;

  @Prop()
  public users!: IUserProfile[];

  @Prop()
  public title!: string;

  @Prop()
  public subtitle!: string;
}
</script>

<style lang="scss">

</style>