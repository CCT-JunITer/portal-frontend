<template>
  <div v-if="users">
    <v-toolbar dark>
      <v-toolbar-title>
        Personaltabelle
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctGreen" to="/main/admin/user-invite">Trainees einladen</v-btn>
      <v-btn color="cctBlue" @click="exportAsCsv" class="ml-1">Exportieren</v-btn>
    </v-toolbar>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Suchen"
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table 
      :headers="headers" 
      :items="users" 
      :search="search"
      :items-per-page="itemsPerPage"
      :footer-props="{
        'items-per-page-options': [5, 10, 15, -1],
        'items-per-page-text': 'Zeilen pro Seite'
      }"
      @update:items-per-page="saveItemsPerPage" 
      multi-sort
      show-expand
      dense
    >
      <template v-slot:item.passive_to="{ value }">
        {{ value ? $common.format(new Date(value), "dd.MM.yyyy") : '' }}
      </template>
      <template v-slot:item.birthdate="{ value }">
        {{ $common.format(new Date(value), "dd.MM.yyyy") }}
      </template>
      <template v-slot:item.entrydate="{ value }">
        {{ $common.format(new Date(value), "dd.MM.yyyy") }}
      </template>
      <template v-slot:item.is_passive="{ value }">
        <v-icon v-if="value">checkmark</v-icon>
      </template>
      <template v-slot:item.direct_debit_mandate="{ value }">
        <v-icon v-if="value">checkmark</v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <span>Editieren</span>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" text icon :to="{name: 'main-admin-users-edit', params: {id: item.id}}">
              <v-icon :to="{name: 'main-admin-users-edit', params: {id: item.id}}">edit</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          {{ item.admin_comment }}
        </td>
      </template>

    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { readAdminUsers } from '@/store/admin/getters';
import { dispatchGetAdminUsers } from '@/store/admin/actions';
import { dispatchSaveAsCsv } from '@/store/main/actions';
import { IUserProfile } from '@/interfaces';

@Component
export default class AdminUsers extends Vue {

  public itemsPerPage: number = parseInt(localStorage.getItem('AdmintablePerPage') || '10');

  public saveItemsPerPage(newItemsPerPage: number) {
    this.itemsPerPage = newItemsPerPage;
    localStorage.setItem('AdmintablePerPage', String(newItemsPerPage));
  }

  public search = '';
  public headers: { text: string; value: keyof IUserProfile | string; sortable?: boolean }[] = [
    {
      text: '',
      value: 'actions',
      sortable: false,
    },
    {
      text: 'Vorname',
      value: 'first_name',
    },
    {
      text: 'Nachname',
      value: 'last_name',
    },
    {
      text: 'Ressort',
      value: 'ressort',
    },
    {
      text: 'Mitgliedsstatus',
      value: 'memberstatus',
    },
    {
      text: 'Ist passiv',
      value: 'is_passive',
    },
    {
      text: 'Höchste Projektposition',
      value: 'highest_project_position',
    },
    {
      text: 'Universität',
      value: 'university',
    },
    {
      text: 'Matrikelnummer',
      value: 'matriculation_number',
    },
    {
      text: 'Geburtstag',
      value: 'birthdate',
    },
    {
      text: 'Geschlecht',
      value: 'gender',
    },
    {
      text: 'Generation',
      value: 'generation',
    },
    {
      text: 'E-Mail',
      value: 'email',
    },
    {
      text: 'Lastschriftmandat',
      value: 'direct_debit_mandate',
    },
    {
      text: 'Studiengang',
      value: 'major',
    },
    {
      text: 'Hochschulgrad des Studiums',
      value: 'studylevel',
    },
    {
      text: 'passiv bis',
      value: 'passive_to',
    },
    {
      text: 'Kommentar',
      value: 'admin_comment',
    },
    {
      text: 'Straße',
      value: 'street',
    },
    {
      text: 'PLZ',
      value: 'postcode',
    },
    {
      text: 'Ort',
      value: 'city',
    },
  ];

  public async exportAsCsv() {
    const headers = this.headers.slice(1);

    await dispatchSaveAsCsv(this.$store, {
      data: this.users,
      fileName: 'Personalbestand',
      headers: headers.map(header => header.text),
      renderRow: (item: IUserProfile) => headers.map(header => item[header.value])
    })
  }

  get users() {
    return readAdminUsers(this.$store);
  }

  public async mounted() {
    await dispatchGetAdminUsers(this.$store);
  }
}
</script>

<style scoped>
/* .v-data-table /deep/ .sticky-header {
  position: sticky;
  top: var(--toolbarHeight);
}

.v-data-table /deep/ .v-data-table__wrapper {
  overflow: unset;
} */
</style>