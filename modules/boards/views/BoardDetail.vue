<template>
  <v-container v-if="board">
    <div>
      <h1 class="text-h2 text--primary mb-3">
        <!-- <v-icon v-if="this.board.approved" color="cctGreen" x-large>mdi-check-decagram</v-icon> -->
        Vorstandsjahr {{ board.title }}
      </h1>
      <div class="d-flex align-center">
        <div>
          <div>
            <div class="text-subtitle 1 mb-4">
              <b>{{ $common.format(new Date(board.start_date), 'dd.MM.yyyy') }}</b>
              <span v-if="board.end_date"> bis <b>{{ $common.format(new Date(board.end_date), 'dd.MM.yyyy') }}</b></span>
            </div>
          </div>
          <div class="text-caption mb-1" v-if="board.author">
            erstellt von <user-chip :user="board.author" small></user-chip>
          </div>
          <div class="text-caption">
            zuletzt bearbeitet
            <span v-if="board.last_updated_by">von <user-chip :user="board.last_updated_by" small></user-chip></span>
            <!-- <span v-if="board.approved_by && board.approved">
              und zuletzt bestätigt durch <user-chip :user="board.approved_by" small></user-chip>
            </span> -->
            <span v-if="board.date_last_updated">
              {{ $common.format(new Date(board.date_last_updated), `'am' dd.MM.yyyy 'um' HH:mm`) }}
            </span>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="cctOrange" outlined :to="{ name: 'board-edit', params: { id: this.board.id } }">
          <v-icon left>
            edit
          </v-icon>
          Vorstand bearbeiten
        </v-btn>
      </div> 

      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Team</h2>
          <p class="text-body-2 text--secondary"></p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
          <v-card outlined>
            <v-list dense>
              <div v-for="([role, boardUsers], index) in Object.entries(board.participants)" :key="role">
                <v-divider v-if="index !== 0" inset></v-divider>
                <v-subheader>{{$enum('BoardRoleEnum', role)}}</v-subheader>
                <user-list-item 
                  v-for="boardUser in boardUsers"
                  :key="boardUser.participant.id"
                  :user="boardUser.participant"
                  dense
                >
                </user-list-item>
              </div>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <!-- add overview of meetings occured between start_date and end_date -->
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Mitgliederversammlungen</h2>
          <p class="text-body-2 text--secondary">
            Mitgliederversammlungen im Zeitraum dieses Vorstandsjahres
          </p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
          <v-card outlined>
            <v-list dense>
              <v-list-item-group> 
                <v-list-item v-for="event in filteredEvents" :key="event.id" :to="'/main/events/'+event.id">
                  <v-list-item-title>{{ event.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ $common.format(new Date(event.date_from), 'dd.MM.yyyy') }}</v-list-item-subtitle>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Dokumente</h2>
          <p class="text-body-2 text--secondary">
            Dokumente zu diesem Vorstandsjahr
          </p>
        </v-col>
        <v-col cols="12" md="8">  
          <file-manager v-model="this.board.files" :folder="this.board.versioned_folder" :labels="fileLabels" :readonly="true">
          </file-manager>
        </v-col>
      </v-row>
    </div>
  </v-container>
  <loading-page v-else></loading-page>
</template>

<script lang="ts">
import { Vue, Component, Watch} from 'vue-property-decorator';
import { dispatchGetUsers } from '@/store/main/actions';
import { readUsers } from '@/store/main/getters';
import FileManager from '@/components/file-manager/FileManager.vue';
import { Route } from 'vue-router';
import UserSelect from '@/components/user-select/UserSelect.vue';
import UserChip from '@/components/user-chip/UserChip.vue';
import UserListItem from '@/components/user-list-item/UserListItem.vue';
import ConsentDialog from '@/components/consent-dialog/ConsentDialog.vue';
import { FILE_LABELS, Board, BoardCreate, BoardCreation,BoardRoleEnum } from '../types';
import { dispatchGetOneBoard,dispatchDeleteBoard,dispatchUpdateBoard,dispatchCreateBoard } from '../store/actions';
import { readoneboard } from '../store/getters';
import { dispatchGetEvents } from '@/store/event/actions';
import { readEvents } from '@/store/event/getters';
import { isAfter, isBefore } from 'date-fns';
import { IEvent } from '@/interfaces';



@Component({
  components: { FileManager, UserSelect, ConsentDialog,UserListItem,UserChip },
})
export default class EditBoard extends Vue {

  public fileLabels = FILE_LABELS;
  public valid = true;
  public tempBoard: Partial<BoardCreation> = {
    participants: {}
  }

  get userProfiles() {
    return readUsers(this.$store);
  }

  get filteredEvents() {
    const allEvents = readEvents(this.$store)('meeting');
    if (!allEvents) {
      return [];
    }
    if(!this.board.end_date) {
      return allEvents.filter(event => {
        return isAfter(new Date(event.date_from), new Date(this.board.start_date)) &&
          event.subtype === 'Mitgliederversammlung';
      });
    }
    return allEvents.filter(event => {
      return isAfter(new Date(event.date_from), new Date(this.board.start_date)) &&
        isBefore(new Date(event.date_to), new Date(this.board.end_date)) &&
        event.subtype === 'Mitgliederversammlung';
    });
  }

  @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params.id !== oldRoute?.params.id) {
      await dispatchGetOneBoard(this.$store, +this.$route.params.id)

    }
  }


  public async mounted() {
    await dispatchGetUsers(this.$store);
    await dispatchGetEvents(this.$store, 'meeting');
    this.valid = false;
  }

  public cancel() {
    this.$router.back();
  }



  public get isLoading() {
    const boardId = +this.$route.params.id
    return boardId && this.board?.id !== boardId;
  }

  get board() {
    return readoneboard(this.$store)(+this.$router.currentRoute.params.id) as Board ;
  }
}
  
</script>

<style lang="sass" scoped>

</style>