<template>
  <div>
    <show-user-dialog
      :value="!!showUsers"
      @input="showUsers = $event"
      :users="showUsers && showUsers.participants"
      :title="`Teilnehmerliste ${showUsers && showUsers.title}`"
      subtitle="Teilnehmer:innen"
    ></show-user-dialog>
    <v-data-table
      :class="`elevation-2 my-5`"
      :headers="headers" 
      :items="items"
    >
      <template v-slot:top>
        <slot name="top"></slot>
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
      <template v-slot:item.custom_title="{ item }">
        <span style="font-weight: 500;">{{ item.title }}</span>
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
        {{ $common.format(new Date(item.date_from), 'dd.MM.yyyy HH:mm') }}
      </template>
      <template v-slot:item.date_to="{ item }">
        {{ $common.format(new Date(item.date_to), 'dd.MM.yyyy HH:mm') }}
      </template>

        
      <template v-slot:item.custom_show_participants="{ item }">
        <v-btn
          color="cctBlue"
          style="color: #fff; margin: 10px;"
          @click="showUsers = item"
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

  @Prop()
  public items!: IEvent[];

  public showUsers: IEvent | null = null;

  public get type() {
    return this.$route.meta?.event_type as IEventType;
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

  public isParticipant(item: IEvent): boolean {
    return item.participants.some(participant => participant.id == this.userProfile?.id);
  }

  public get headers() {
    return [
      {
        text: 'Titel',
        sortable: true,
        value: 'custom_title',
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
        text: 'Datum von',
        sortable: true,
        value: 'date_from',
        align: 'left',
      },
      {
        text: 'Datum bis',
        sortable: true,
        value: 'date_to',
        align: 'left',
      },
      {
        text: 'Agenda',
        value: 'custom_agenda',
        align: 'left',
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
        text: 'Anmelden',
        value: 'custom_register',
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
      {
        text: 'Dateien',
        value: 'custom_files',
      }
    ].filter(v => v);
  }

}
</script>

<style lang="scss">

</style>