<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        Vorstand
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctOrange" style="color: white" :to="{name: 'board-create'}">
        <v-icon left>
          mdi-school
        </v-icon>
        Neues Vorstandsjahr
      </v-btn>
    </v-toolbar>
    <div class="px-1">
      <v-data-table
        :headers="headers"
        :items="boards || []"
        :loading="boards === null"
        :items-per-page="5"
        class="elevation-1"
      >

        <template v-slot:[`item.descriptor`]="{ item }">
          Vorstandsjahr {{ item.title }}
        </template>

        <!-- Date Last Updated and Last Updated by, not used -->
        <template v-slot:item.date_last_updated="{ item }">
          {{ $common.format(new Date(item.date_last_updated), `dd.MM.yyyy`) }}
        </template>
        <!-- <template v-slot:[`item.custom_last_updated_by`]="{ item }" >
          <user-chip :user="item.last_updated_by" small></user-chip>
        </template>  -->

        <template v-slot:item.start_date="{ item }">
          <div v-if="item.start_date">
            {{ $common.format(new Date(item.start_date), 'dd.MM.yyyy') }}
          </div>
        </template>
        <template v-slot:item.end_date="{ item }">
          <div v-if="item.end_date">
            {{ $common.format(new Date(item.end_date), 'dd.MM.yyyy') }}
          </div>
        </template>

        <template v-slot:[`item.custom_details`]="{ item }">
          <v-btn 
            color="cctGrey"
            outlined
            :to="{ name: 'board-detail', params: { id: item.id } }"
          >
            <v-icon>
              mdi-text
            </v-icon>
          </v-btn>
        </template>
        <!-- necessary? -->
        <template v-slot:[`item.custom_participants`]="{ item }">
          <div v-for="[role, boardUsers] in Object.entries(item.participants)" :key="role">
            <div v-if="role === 'board_member'" class="text-overline">{{$enum('BoardRoleEnum', role)}}</div>
            <div v-if="role === 'board_member'">
              <user-chip
                v-for="boardUser in boardUsers"
                :key="boardUser.participant.id"
                :user="boardUser.participant"
                small
              >
            
              </user-chip>
            </div>
          </div>
        </template>
        <template v-slot:[`item.files`]="{ item }" >
          <FileManager :noManager="true" v-model="item.files" :folder="item.versioned_folder" :labels="fileLabels" :readonly="true">
          </FileManager>

        </template>
      </v-data-table>
  
    </div>
  </div>  
</template>
  
<script lang="ts">
import FileManager from '@/components/file-manager/FileManager.vue';
import UserChip from '@/components/user-chip/UserChip.vue';
import UserListItem from '@/components/user-list-item/UserListItem.vue';
import { FILE_LABELS_TABLE } from '../types'
import {dispatchGetBoards} from '../store/actions';
import { readboards } from '../store/getters';
import { Vue, Component } from 'vue-property-decorator';
  
@Component({
  components: { 
    FileManager,
    UserChip,
    UserListItem,
  },
})

export default class BoardMain extends Vue {
  
  public fileLabels = FILE_LABELS_TABLE;

  get boards() {
    return readboards(this.$store);
  }
    
  mounted(){
    dispatchGetBoards(this.$store);
  }
  
  
  
  headers = [
    {
      text: 'Titel',
      align: 'start',
      value: 'descriptor',
    },
    { 
      text: 'Mitglieder', 
      value: 'custom_participants', 
      sortable: false 
    },
    {
      text: 'Zeitraum von',
      value: 'start_date',
      sortable: true
    },
    {
      text: 'Zeitraum bis',
      value: 'end_date',
      sortable: true
    },
    { 
      text: 'Dateien', 
      value: 'files'
    },
    { 
      text: 'Änderungsdatum', 
      value: 'date_last_updated'
    },
    // { 
    //   text: 'Zuletzt geändert von', 
    //   value: 'custom_last_updated_by'
    // },
    {
      text: 'Details',
      value: 'custom_details',
      sortable: false,
      align: 'center',
    },
  ];
}
</script>
  
<style scoped> 
.trainer-chip {
    margin: 3px; 
  }
#second-table {
    margin-top: 15px;
  }
.grid{
    display: grid;
    grid-template-columns: auto auto;
    justify-items: left;
  }
</style>
  