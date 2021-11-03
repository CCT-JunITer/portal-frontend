<template>
  <div v-if="users">
    <v-toolbar dark>
      <v-toolbar-title>
        Personaltabelle
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctGreen" to="/main/admin/user-invite">Trainees einladen</v-btn>
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
      multi-sort
      show-expand
      dense
    >
      <template v-slot:item.birthdate="{ value }">
        {{ $common.format(new Date(value), "dd.MM.yyyy") }}
      </template>
      <template v-slot:item.entrydate="{ value }">
        {{ $common.format(new Date(value), "dd.MM.yyyy") }}
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

@Component
export default class AdminUsers extends Vue {
  public search = '';

  public headers = [
    {
      text: '',
      value: 'actions',
      sortable: false,
    },
    {
      text: 'Name',
      sortable: true,
      value: 'full_name',
    },
    {
      text: 'Ressort',
      sortable: true,
      value: 'ressort',
    },
    {
      text: 'Mitgliedsstatus',
      sortable: true,
      value: 'memberstatus',
    },
    {
      text: 'Universität',
      sortable: true,
      value: 'university',
    },
    {
      text: 'Studiengang',
      sortable: true,
      value: 'major',
    },
    {
      text: 'Studiengang',
      sortable: true,
      value: 'studylevel',
    },
    {
      text: 'Matrikelnummer',
      sortable: true,
      value: 'matriculation_number',
    },
    {
      text: 'IBAN',
      sortable: true,
      value: 'iban',
    },
    {
      text: 'Geburtsdatum',
      sortable: true,
      value: 'birthdate',
    },
    {
      text: 'Geschlecht',
      sortable: true,
      value: 'gender',
    },
    {
      text: 'Eintrittsdatum',
      sortable: true,
      value: 'entrydate',
    },
    {
      text: 'Generation',
      sortable: true,
      value: 'generation',
    },
    {
      text: 'E-Mail',
      sortable: true,
      value: 'email',
    },
    {
      text: 'Lastschriftmandat',
      sortable: true,
      value: 'direct_debit_mandate',
    },
    {
      text: 'Adresse',
      sortable: true,
      value: 'address',
    },
    {
      text: 'Kommentar',
      sortable: true,
      value: 'admin_comment',
    },
    {
      text: 'Höchste Projektposition',
      sortable: true,
      value: 'highest_project_position',
    },

  ];
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