<template>
  <v-list-group 
    dense 
    :color="color"
    :value="true" 
    :prepend-icon="{created: 'mdi-plus', deleted: 'mdi-minus', modified: 'mdi-star'}[fileChange.mode]">
    <template v-slot:activator>
      <v-list-item dense>
        <employee-profile-picture
          :employee="userProfile"
          component="v-list-item-avatar"
          size="24"
        ></employee-profile-picture>
        <v-list-item-icon>
          <v-icon :color="color">{{
          }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ fileChange.mode }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $common.format($common.parseISO(fileChange.date), 'HH:mm dd.MM.yyyy') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-list-item class="FileChange" dense>
      <v-list-item-content>
        <v-list-item-subtitle>
          <file-chip 
            :filename="fileChange.file_id"
            color="cctGreen">
          </file-chip>
          <file-chip 
            v-if="fileChange.old_file_id" 
            :filename="fileChange.old_file_id" 
            color="cctOrange">
          </file-chip>
        </v-list-item-subtitle>
      <!-- <file-chip :filename="fileChange.file_id"></file-chip> -->
      </v-list-item-content>
    </v-list-item>
  </v-list-group>
</template>

<script lang="ts">
import { FileChange } from '@/interfaces';
import { readOneUser } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'
import EmployeeProfilePicture from '../employee/EmployeeProfilePicture.vue';
import FileChip from '../file-chip/FileChip.vue';

@Component({
  components: { FileChip, EmployeeProfilePicture }
})
export default class FileChangeComponent extends Vue {

  @Prop({ required: true })
  public fileChange!: FileChange;

  get color() {
    return { created: 'cctGreen', deleted: 'red', modified: 'purple' }[this.fileChange.mode];
  }

  get userProfile() {
    return readOneUser(this.$store)(this.fileChange.author_id);
  }
}
</script>

<style lang="scss" scoped>

</style>