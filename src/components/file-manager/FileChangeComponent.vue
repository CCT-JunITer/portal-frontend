<template>
  <v-list-group 
    dense 
    :color="color"
    :prepend-icon="{created: 'mdi-plus', deleted: 'mdi-minus', modified: 'mdi-star'}[fileChange.mode]">
    <template v-slot:activator>
      <v-list-item dense>
        <v-list-item-content>
          <v-list-item-title>
            <user-chip :user="userProfile" dense>
            </user-chip>
            {{ fileChange.mode }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $common.format(new Date(fileChange.date), 'dd.MM.yyyy HH:mm') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-list-item class="FileChange" dense>
      <v-list-item-content>
        <file-chip 
          :file="fileChange.file"
          color="cctGreen">
        </file-chip>
        <file-chip 
          v-if="fileChange.old_file" 
          :file="fileChange.old_file" 
          color="cctOrange">
        </file-chip>
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
import UserChip from '../user-chip/UserChip.vue';

@Component({
  components: { FileChip, EmployeeProfilePicture, UserChip }
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