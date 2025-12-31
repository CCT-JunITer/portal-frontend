<template>
  <div>
    <show-user-dialog
      :value="!!displayUsersFor"
      @input="displayUsersFor = $event"
      :users="displayUsersFor && displayUsersFor.participants"
      :title="`Teilnehmerliste ${displayUsersFor && displayUsersFor.title}`"
      :subtitle="`${userCount} Teilnehmer:innen`"
    ></show-user-dialog>
    <v-data-table
      :class="`elevation-2 my-5`"
      :headers="headers" 
      :items="items || []"
      :loading="!items"
      :mobile-breakpoint="0"
      :items-per-page="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [5, 10, 15, -1],
        'items-per-page-text': 'Zeilen pro Seite'
      }"
      @update:items-per-page="saveItemsPerPage"
      fixed-header
      sort-by="date_from"
      sort-desc
      multi-sort
    >
      <template v-slot:top>
        <slot name="top"></slot>
      </template>
      <template v-slot:item.title="{ item }">
        <v-icon v-if="item.approved" color="cctGreen" small>mdi-check-decagram</v-icon>
        {{ item.title }}
      </template>
      <template v-slot:item.custom_agenda="{ item }">
        <ul>
          <li 
            v-for="(text, index) in item.agenda"
            :key="index"
            v-text="text"
          >
          </li>
        </ul>
      </template>
      <template v-slot:item.subtype="{ item }">
        <v-icon v-if="item.approved && item.type==='meeting'" color="cctGreen" small>mdi-check-decagram</v-icon>
        <span v-if="item.subtype.toLowerCase() ==='ressortsitzung'">{{ item.topic }}</span>
        <span v-else>{{ item.subtype }}</span>
      </template>
      <template v-slot:item.external="{ item }">
        <span v-if="item.external === ''">Keine</span>
        <span v-else>{{item.external}}</span>
      </template>
      <template v-slot:item.custom_files="{ item }">
        <file-manager :value="item.files" :folder="item.versioned_folder" :readonly="true" :noManager="true"></file-manager>
      </template>
       
      <template v-slot:item.custom_leaders="{ item }">
        <user-chip :user="leader" v-for="leader in item.leaders" :key="leader.id" class="ma-1">
        </user-chip>
      </template>
      <template v-slot:item.wms_link="{ item }">
        <a :href="item.wms_link"> {{ item.wms_link }}</a>
      </template>
      <template v-slot:item.date_from="{ item }">
        {{ item.timed ? $common.formatRange(item.date_from, item.date_to) : $common.format(new Date(item.date_from), 'dd.MM.yyyy')}}
      </template>
        
      <template v-slot:item.custom_show_participants="{ item }">
        <v-btn
          color="cctBlue"
          style="color: #fff; margin: 10px;"
          @click="showUsers(item)"
        >
          <v-icon>
            mdi-account-supervisor
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:item.custom_register="{ item }">
        <v-btn
          v-if="isParticipant(item)"
          disabled
          style="margin: 10px;"
        >
          <v-icon>
            mdi-account-check
          </v-icon>
        </v-btn>
        <v-btn
          v-else
          color="cctGreen"
          style="color: #fff; margin: 10px;"
          @click="openRegisterEvent(item)"
        >
          <v-icon>
            mdi-account-plus
          </v-icon>
        </v-btn>
      </template>

      <template v-slot:item.custom_details="{ item }">
        <v-btn
          color="cctGrey"
          :to="{name: 'events-details', params: {id: item.id}}"
          style="color:#fff;"
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
import ShowUserDialog from '@/components/show-user-dialog/ShowUserDialog.vue';
import UserChip from '@/components/user-chip/UserChip.vue';
import { IEvent, IEventType } from '@/interfaces';
import { dispatchGetOneEvent } from '@/store/event/actions';
import { readOneEvent } from '@/store/event/getters';
import { readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({ 
  components: {
    ShowUserDialog,
    FileManager,
    UserChip
  }
})
export default class EventTable extends Vue {

  public itemsPerPage: number = parseInt(localStorage.getItem('EventtablePerPage') || '5');
  
  @Prop()
  public items!: IEvent[] | null;

  @Prop()
  public type!: IEventType;

  public displayUsersFor: IEvent | null = null;

  public saveItemsPerPage(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    localStorage.setItem('EventtablePerPage', String(newItemsPerPage));
  }

  public async showUsers(event: IEvent) {
    await dispatchGetOneEvent(this.$store, event.id);
    this.displayUsersFor = readOneEvent(this.$store)(event.id) || null;        
  }

  public get typeName() {
    return {
      'training': 'Training',
      'meeting': 'Meeting'
    }[this.type];
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get userCount() {
    if (!this.displayUsersFor) {
      return 0;
    }
    return this.displayUsersFor.participants.length;
  }

  public get headers() {
    return [
      this.type === 'training' && {
        text: 'Titel',
        sortable: true,
        value: 'title',
        align: 'left',
      },
      this.type === 'meeting' && {
        text: 'Meetingtyp',
        sortable: true,
        value: 'subtype',
        align: 'left',
      },
      this.type === 'training' && {
        text: 'Schulungstyp',
        sortable: true,
        value: 'subtype',
        align: 'left',
      },
      this.type === 'training' && {
        text: 'Thema',
        sortable: true,
        value: 'topic',
        align: 'left',
      },
      this.type === 'training' && {
        text: 'Beschreibung',
        sortable: false,
        value: 'description',
        align: 'left',
      },
      {
        text: 'Datum',
        sortable: true,
        value: 'date_from',
        align: 'left',
        sort: (a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        }
      },
      this.type === 'meeting' && {
        text: 'Agenda',
        value: 'custom_agenda',
        align: 'left',
        sortable: false,
      },
      this.type === 'training' && {
        text: 'Ext. Trainer:innen',
        value: 'external',
        sortable: false,
      },
      {
        text: 'Sitzungsleiter:innen',
        value: 'custom_leaders',
        align: 'center',
        sortable: false,
      },
      {
        text: 'Teilnehmer:innen',
        value: 'custom_show_participants',
        align: 'center',
        sortable: false,
      
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