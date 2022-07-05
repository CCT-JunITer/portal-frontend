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
    <div class="px-1">
      <v-data-table
        :headers="headers"
        :items="documents"
        :loading="documents === null"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.title="{ item }">
          <v-icon v-if="item.approved" color="cctGreen" small>mdi-check-decagram</v-icon>
          {{ item.title }}
        </template>
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
        <template v-slot:item.custom_last_updated_by="{ item }">
          <v-chip
            class="trainer-chip"
            color="lightgrey"
          >
            <v-avatar left>
              <employee-profile-picture
                :employee="item.last_updated_by"
              ></employee-profile-picture>
            </v-avatar>
            {{ item.last_updated_by.full_name }}
          </v-chip>
        </template>
        <template v-slot:item.custom_files="{ item }">
          <file-manager 
            :value="item.files"
            :folder="item.versioned_folder" 
            :readonly="true" 
            :noManager="true">
          </file-manager>
        </template>
      </v-data-table>

    </div>
  </div>  
</template>

<script lang="ts">
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import FileManager from '@/components/file-manager/FileManager.vue';
import { IDocumentType } from '@/interfaces';
import { dispatchGetDocuments } from '@/store/document/actions';
import { readDocuments } from '@/store/document/getters';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component({ components: { FileManager, EmployeeProfilePicture }})
export default class DocumentMain extends Vue {

  @Watch('$route', {immediate: true})
  public async onRouteChange(newRoute?: Route, oldRoute?: Route) {
    if (newRoute?.params?.type !== oldRoute?.params?.type) {
      await dispatchGetDocuments(this.$store, this.type);
    }
  }

  get documents() {
    return readDocuments(this.$store)(this.type);
  }

  public get type() {
    return this.$route.params.type as IDocumentType;
  }

  public get typeName() {
    return this.$common.DOCUMENT_TYPES.find(dt => dt.value === this.type)?.name;
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
      text: 'Dateien', 
      value: 'custom_files'
    },
    { 
      text: 'letztes Änderungsdatum', 
      value: 'date_last_updated'
    },
    { 
      text: 'Autor:in letzte Änderung', 
      value: 'custom_last_updated_by'
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