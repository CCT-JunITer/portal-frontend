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
      fixed-header
      sort-by="date_from"
      sort-desc
      multi-sort
    >
      <template v-slot:top>
        <slot name="top"></slot>
      </template>
      <template v-slot:item.title="{ item }">
        <v-icon v-if="item.approved || isAutoApproved(item)" color="cctGreen" small>mdi-check-decagram</v-icon>
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
        <v-icon v-if="item.type==='meeting' && (item.approved || isAutoApproved(item))" color="cctGreen" small>mdi-check-decagram</v-icon>
        {{ item.subtype }}
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

  @Prop()
  public items!: IEvent[] | null;

  @Prop()
  public type!: IEventType;

  public displayUsersFor: IEvent | null = null;


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

  /**
   * Automatischer QM-Haken für Donnerstagssitzung.
   * Bedingungen:
   *  - Typ: meeting
   *  - Subtype: Donnerstagssitzung
   *  - Agenda hat mindestens einen Eintrag
   *  - Datei mit Label "Protokoll" vorhanden
   *  - Datei mit Label "Präsentation" oder "Folien" vorhanden
   */
  public isAutoApproved(event: IEvent & { versioned_folder?: { effective_files?: { label?: string | null }[] } }) {
    if (!event || event.type !== 'meeting' || event.subtype !== 'Donnerstagssitzung') {
      return false;
    }
    const hasAgenda = Array.isArray(event.agenda) && event.agenda.length > 0;
    const labels = (event.versioned_folder?.effective_files || [])
      .map(f => f.label)
      .filter((l): l is string => typeof l === 'string' && l.length > 0);
    const hasProtocol = labels.includes('Protokoll');
    const hasSlides = labels.includes('Präsentation') || labels.includes('Folien');
    return hasAgenda && hasProtocol && hasSlides;
  }

  // Prüft, ob aktueller User bereits Teilnehmer:in ist
  public isParticipant(event: IEvent) {
    const user = this.userProfile;
    if (!user) return false;
    return !!event.participants.find(p => p.id === user.id);
  }

  // Öffnet Anmeldedialog / Seite (Platzhalter – konkrete Implementierung abhängig vom restlichen Code)
  public openRegisterEvent(event: IEvent) {
    // Falls es eine Route für Event-Anmeldung gibt, dort hin navigieren
    this.$emit('register-event', event);
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