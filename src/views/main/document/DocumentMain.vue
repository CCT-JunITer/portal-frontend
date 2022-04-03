<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>
        {{ this.typeName }} Dokumente
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctOrange" style="color: white" :to="{name: 'document-create'}">
        <v-icon left>
          mdi-school
        </v-icon>
        Neues Dokument
      </v-btn>
    </v-toolbar>
    <v-container class="DocumentMain">
      <v-data-table
        :headers="headers"
        :items="documents"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.date_last_updated="{ item }">
          {{ $common.format(new Date(item.date_last_updated), 'dd.MM.yyyy HH:mm') }}
        </template>
        <template v-slot:item.custom_details="{ item }">
          <v-btn 
            color="cctGrey"
            outlined
            :to="{ name: 'document-edit', params: { id: item.id } }"
          >
            <v-icon>
              mdi-text
            </v-icon>
          </v-btn>
        </template>
      </v-data-table>

    </v-container>
  </div>  
</template>

<script lang="ts">
import { IDocumentType } from '@/interfaces';
import { dispatchGetDocuments } from '@/store/document/actions';
import { readDocuments } from '@/store/document/getters';
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class DocumentMain extends Vue {

  async mounted() {
    await dispatchGetDocuments(this.$store, this.typeName);
  }

  get documents() {
    return readDocuments(this.$store);
  }

  public get type() {
    return this.$route.meta?.document_type as IDocumentType;
  }

  public get typeName() {
    return {
      'member-progression': 'Mitgliedswerdegang',
      'recruiting': 'Recruiting',
      'archive': 'Archiv',
      'public-affairs': 'Öffentlichkeitsarbeit',
      'quality-management': 'Quality Management'
    }[this.type];
  }


  headers = [
    {
      text: 'Titel',
      align: 'start',
      value: 'title',
    },
    { 
      text: 'Beschreibung', 
      value: 'description', 
      sortable: false 
    },
    { 
      text: 'Typ', 
      value: 'type'
    },
    { 
      text: 'Kategorie', 
      value: 'categories' 
    },
    { 
      text: 'Letzte Änderung', 
      value: 'date_last_updated'
    },
    {
      text: 'Details',
      value: 'custom_details',
      sortable: false,
      align: 'center',
    },
  ];
}
</script>

<style scoped>
.v-container {
  background-color: white;
}

.trainer-chip {
  margin: 3px;
}
#second-table {
  margin-top: 15px;
}
.text-blue {
  color: #1E467D;
}
.text-field {
  background-color: #fff !important;
  padding: 15px;
  margin-top: 15px;
  border-radius: 5px;
}
.data-table-header {
  border-top-left-radius: 5px !important;
  border-top-right-radius: 5px !important;
}
</style>