<template>
  <v-container v-if="!isLoading">
    <v-form
      v-model="valid"
      ref="form"
    >
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h2 class="text-h4 text--primary mb-3">Allgemeines</h2>
          <p class="text-body-2 text--secondary">
            Informationen zu diesem Vorstandsjahr
          </p>
        </v-col>
        <v-col cols="12" md="8" class="px-5">
          <v-text-field
            label="Titel"
            v-model="board.title"
            class="input-lg"
            prepend-icon="mdi-format-title"
            prefix="Vorstandsjahr "
            required
            :rules="[$common.required]" 
          ></v-text-field>
          <date-picker-menu
            v-model ="board.start_date"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '1993-01-01',
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Vorstandszeit Beginn"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-start"
                :rules="attrs.rules"
              ></v-text-field>
            </template>
          </date-picker-menu>
          <date-picker-menu
            v-model ="board.end_date"
            defaultPicker="MONTH"
            :pickerProps="{
              min: '1993-01-01',
            }"
          >
            <template v-slot:activator="{ on, attrs, }">
              <v-text-field
                label="Vorstandszeit Ende"
                class="input-lg"
                v-bind="attrs"
                v-on="on"
                prepend-icon="mdi-calendar-end"
                :rules="attrs.rules"
              ></v-text-field>
            </template>
          </date-picker-menu>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Team</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">

          <div
            v-for="role in $enums('BoardRoleEnum')"
            :key="role.value"
          >
            <user-select 
              multiple
              class="input-lg"
              prepend-icon="mdi-account-multiple"
              filled
              :label="role.text"
              v-model="board.participants[role.value]">
            </user-select>

          </div>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>
      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Vorstands&shy;dokumente</h4>
          <p class="text-body-2 text--secondary"></p>
        </v-col>

        <v-col cols="12" md="8" class="px-5">
          <file-manager v-model="board.files" :folder="board.versioned_folder" :multiple="true" :labels="fileLabels"></file-manager>
        </v-col>
      </v-row>


      <v-divider class="my-5"></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel" outlined color="cctOrange">Abbrechen</v-btn>

        <consent-dialog @accept="deleteBoard" title="Eintrag löschen" content="Wirklich löschen?" v-if="editBoard">
          <template v-slot:activator="{ attrs, on }">
            <v-btn 
              v-bind="attrs" 
              v-on="on" 
              color="red" 
              dark
            >
              <v-icon left>
                delete
              </v-icon>
              Löschen
            </v-btn>
          </template>
        </consent-dialog>
        <v-btn
          @click="submit"
          color="cctGreen"
          dark
        >
          Vorstandsjahr speichern
        </v-btn>
      </v-card-actions>
    </v-form>
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
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import ConsentDialog from '@/components/consent-dialog/ConsentDialog.vue';
import { FILE_LABELS, Board, BoardCreate, BoardCreation } from '../types';
import { dispatchGetOneBoard,dispatchDeleteBoard,dispatchUpdateBoard,dispatchCreateBoard } from '../store/actions';
import { readoneboard } from '../store/getters';



@Component({
  components: { FileManager, UserSelect, ConsentDialog,DatePickerMenu },
})
export default class EditBoard extends Vue {

  public fileLabels = FILE_LABELS;
  public valid = true;
  public board: Partial<BoardCreation> = {
    participants: {}
  }



  async deleteBoard() {
    if (!this.editBoard) {
      return;
    }
    await dispatchDeleteBoard(this.$store, this.editBoard.id);
    this.$router.push('/main/wms/boards');
  }
  

  get userProfiles() {
    return readUsers(this.$store);
  }

  @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params.id !== oldRoute?.params.id) {
      await dispatchGetOneBoard(this.$store, +this.$route.params.id)
      this.reset();
    }
  }


  public async mounted() {
    await dispatchGetUsers(this.$store);
    this.valid = false;
  }

  public cancel() {
    this.$router.back();
  }

  public get newBoard() {
    const newBoard: BoardCreate = {
      ...this.board as BoardCreation,
      participant_ids: this.board.participants!,
    };
    return newBoard;
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const newBoard = this.newBoard;
      let board: Board | undefined;
      if (this.editBoard?.id) {
        board = await dispatchUpdateBoard(this.$store, {id: this.editBoard.id, board: newBoard});
      } else {
        board = await dispatchCreateBoard(this.$store, newBoard);
      }
      this.$router.push('/main/wms/boards');
      
    }
  }

  public get isLoading() {
    const boardId = +this.$route.params.id
    return boardId && this.editBoard?.id !== boardId;
  }

  get editBoard() {
    return readoneboard(this.$store)(+this.$router.currentRoute.params.id);
  }

  public reset() {
    if (this.editBoard) {
      this.board = {
        ...this.editBoard,
        participants: Object.fromEntries(Object.entries(this.editBoard.participants!).map(([k,v]) => [k, v.map(u => u.participant.id)])),
      };
    }
  }
}
</script>

<style lang="scss" scoped>
.sticky {
  position: sticky;
  top: 64px;
}
</style>