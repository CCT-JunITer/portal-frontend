<template>
  <div>
    <v-toolbar dark>
      <v-toolbar-title>
        Gruppen
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctGreen" to="/main/admin/groups/create">Gruppe hinzufügen</v-btn>
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
      :items="groups" 
      :search="search" 
      multi-sort
      show-expand
      dense
      group-by="type"
      sort-by="id"
    >
      <template v-slot:item.name="{ item }">
        <span>
          <v-icon>
            {{ item.icon }}
          </v-icon>
          {{ item.name }}
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <span>Editieren</span>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" text icon :to="{name: 'main-admin-groups-edit', params: {id: item.id}}">
              <v-icon :to="{name: 'main-admin-groups-edit', params: {id: item.id}}">edit</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { dispatchGetAdminGroups } from '@/store/admin/actions';
import { readAdminGroups } from '@/store/admin/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class AdminGroups extends Vue {

  public search = '';

  public headers = [
    {
      text: '',
      value: 'actions',
      sortable: false,
    },
    {
      text: 'ID',
      value: 'id',
    },
    {
      text: 'Name',
      value: 'name',
    },
    {
      text: 'Typ',
      value: 'type',
    },
    {
      text: 'LDAP Gruppe',
      value: 'ldap_group',
    },
    {
      text: 'KAS Mailverteiler',
      value: 'kas_mailinglist',
    },
  ];

  async mounted() {
    await dispatchGetAdminGroups(this.$store);
  }

  public get groups() {
    return readAdminGroups(this.$store);
  }
}
</script>

<style lang="scss">

</style>