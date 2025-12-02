<template>
  <div>
    <v-data-table
      :class="`elevation-2 my-5`"
      :headers="headers" 
      :items="displayItems || []"
      :loading="!displayItems"
      :mobile-breakpoint="0"
      :items-per-page="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [5, 10, 15, -1],
        'items-per-page-text': 'Zeilen pro Seite'
      }"
      @update:items-per-page="saveItemsPerPage"
      sort-by="date_from"
      sort-desc
    >
      <template v-slot:top>
        <slot name="top"></slot>
      </template>
      <template v-slot:item.title="{ item }">
        <v-icon v-if="item.approved" color="cctGreen" small>mdi-check-decagram</v-icon>
        {{ item.title }}
      </template>
      <template v-slot:item.external="{ item }">
        <span v-if="item.external === ''">Keine</span>
        <span v-else>{{item.external}}</span>
      </template>
      
      <template v-slot:item.custom_fields="{ item }">
        <v-chip
          v-for="category in item.categories" 
          :key="category"
          class="ma-1"
          pill
          small
        >
          {{ category }}
        </v-chip>
        <v-chip
          label
          v-for="method in item.methods"
          :key="method"
          class="mx-1"
          pill
          small
        >
          <v-avatar left>
            <v-btn
              icon
              small
              target="_blank"
              :href="`https://wiki.cct-ev.de/index.php/${method}`"
            >
              <v-icon small>mdi-wikipedia</v-icon>
            </v-btn>
          </v-avatar>
          <span class="pr-2">
            {{ method }}
          </span>
        </v-chip>
      </template>
       
      <template v-slot:item.custom_participants="{ item }">
        <div v-for="[role, projectUsers] in Object.entries(item.participants)" :key="role">
          <div class="text-overline">{{$enum('ProjectRoleEnum', role)}}</div>
          <user-chip
            v-for="projectUser in projectUsers"
            :key="projectUser.participant.id"
            :user="projectUser.participant"
            small
          >
          </user-chip>
        </div>
      </template>
      <template v-slot:item.acceptance_date="{ item }">
        {{ item.acceptance_date && $common.formatDateRange(item.acceptance_date, item.project_end_date_actual || item.project_end_date_expected || '') }}
      </template>
      <template v-slot:item.bt_amount_expected="{ item }">
        {{ item.bt_amount_actual ? $common.decimal2Text(item.bt_amount_actual) + ' BT' : $common.decimal2Text(item.bt_amount_expected) + ' BT (soll)'}}
      </template>

      <template v-slot:item.project_end_date_sort="{ item }">
        <span>
          {{ $common.format(item.project_end_date_actual || item.project_end_date_expected || '') }}
        </span>
      </template>

      <template v-slot:item.custom_details="{ item }">
        <v-btn
          color="cctGrey"
          :to="{name: 'project', params: {id: item.id}}"
          dark
        >
          <v-icon>
            mdi-text
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import FileManager from '@/components/file-manager/FileManager.vue';
import UserChip from '@/components/user-chip/UserChip.vue';
import UserListItem from '@/components/user-list-item/UserListItem.vue';
import { readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Project } from '../types';

@Component({
  components: { 
    FileManager,
    UserChip,
    UserListItem,
  }
}) export default class ProjectTable extends Vue {

  public itemsPerPage: number = parseInt(localStorage.getItem('ProjecttablePerPage') || '5');
  
  @Prop()
  public items!: Project[] | null;


  public get displayItems() {
    return this.items?.map(project => {
      return {
        ...project, 
        type: this.$enum('ProjectTypeEnum', project.type),
        project_end_date_sort: project.project_end_date_actual || project.project_end_date_expected || '',
      }
    });
  }

  public saveItemsPerPage(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    localStorage.setItem('ProjecttablePerPage', String(newItemsPerPage));
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  public get headers() {
    return [
      {
        text: 'Projektrahmen',
        value: 'type',
      },
      {
        text: 'Projekttitel',
        value: 'title',
      },
      {
        text: 'Projektart',
        value: 'subtype',
      },
      {
        text: 'Projektunterart & Methoden',
        value: 'custom_fields',
      },
      {
        text: 'Projektteam',
        sortable: false,
        value: 'custom_participants',
      },
      {
        text: 'Projektgröße (BT)',
        value: 'bt_amount_expected',
      },
      {
        text: 'Projektende',
        value: 'project_end_date_sort',
        sortable: true,
        align: 'left',
        sort: (a, b) => {
          if(!a && !b) return 0;
          if(!a) return -1;
          if(!b) return 1;
          return new Date(a).getTime() - new Date(b).getTime();
        }
      },
      {
        text: 'Projektzeitraum',
        sortable: true,
        value: 'acceptance_date',
        align: 'left',
        sort: (a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        }
      },
      {
        text: 'Details',
        value: 'custom_details',
        align: 'center',
        sortable: false,
      
      },
    ].filter(v => v);
  }

}
</script>

<style lang="scss">

</style>