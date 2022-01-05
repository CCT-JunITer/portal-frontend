<template>
  <div class="root">
    <v-container>
      <v-card outlined>
        <v-card-title>
          Neue Trainees einladen
        </v-card-title>
        <v-card-text>
          <v-combobox
            ref="combobox"
            v-model="invites"
            :search-input.sync="search"
            chips
            clearable
            hint="Du kannst Namen und Email Adressen aus Excel kopieren!"
            persistent-hint
            multiple
            color="cctGreen"
            outlined
          >
            <template v-slot:label>
              Lade jemanden in das CCT e.V. ein <v-icon small style="vertical-align: middle">
                $cct
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>{{ search }}</v-list-item-title>
                  <v-list-item-subtitle>Format: Name private.email@gmail.com</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip label dark color="cctGreen" :disabled="!getInvites(search).length" @click="addSelected">
                    <v-icon>
                      mdi-keyboard-return
                    </v-icon>
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-menu
                :value="selected"
                bottom
                right
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-chip
                    v-if="item === Object(item)"
                    v-bind="attrs"
                    v-on="on"
                    :input-value="selected"
                  >
                    <span class="pr-2">
                      {{ item.name }}
                    </span>
                    <small>
                      {{ item.email }}
                    </small>
                  </v-chip>
                </template>
                <v-card>
                  <v-list dense dark>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.email }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon @click="parent.selectItem(item)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
          
            </template>
          </v-combobox>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cctBlue" dark @click="sendInvites">
            Einladungen senden
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { UserInvite } from '@/interfaces';
import { dispatchSendInvites } from '@/store/admin/actions';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';


@Component
export default class UserInvitation extends Vue {
  public $refs!: {
    combobox: any;
  }

  public invites: UserInvite[] = [];
  public search = '';

  mounted() {
    this.$refs.combobox.$el.addEventListener('paste', this.onCopy);
  }

  destroy() {
    this.$refs.combobox.$el.removeEventListener('paste', this.onCopy);
  }

  public addSelected() {
    this.$refs.combobox.selectItem(this.search)
    this.search = '';
  }

  public onCopy(e: Event) {
    const event: ClipboardEvent = e as ClipboardEvent; 
    if (event.clipboardData?.getData('text')) {
      event.preventDefault();
      const lines = event.clipboardData?.getData('text');
      const newInvites = this.getInvites(lines);      

      this.invites = [
        ...this.invites,
        ...newInvites,
      ];
    }
  }

  public getInvites(lines: string) {
    const regex = (/^(.+)\s+([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)$/mig)
    let match = regex.exec(lines);
    const newInvites: UserInvite[] = [];

    while (match != null) {
      const [_, name, email] = match;
      newInvites.push({ name: name.trim().replace(/\s+/g, ' '), email: email.trim() });
      match = regex.exec(lines);
    }
    return newInvites;
  }

  @Watch('invites')
  public onInput(newInvites?: UserInvite[], oldSearch?: UserInvite[]) {
    if (newInvites?.length === oldSearch?.length) {
      return;
    }
    if (!newInvites) {
      return;
    }

    this.invites = newInvites.map(newInvite => {
      if (typeof newInvite === 'string') {
        const newInvites = this.getInvites(newInvite);
        if (newInvites.length) {
          return newInvites[0];
        }
        return null;
      }
      return newInvite;
    }).filter(id => id) as UserInvite[]
   
  }


  public async sendInvites() {
    await dispatchSendInvites(this.$store, this.invites);
    await this.$router.push('/main/admin');
  }

}
</script>

<style>

</style>