<template>
  <div>
    <v-toolbar flat elevation="2" color="cctPurple darken-1" dark>
      <v-toolbar-title>
        Projekte
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="cctGreen" style="color: white" :to="{name: 'project-create'}">
        <v-icon left>
          mdi-account-tie
        </v-icon>
        Neues Projekt
      </v-btn>
    </v-toolbar>

    <div class="pa-5">
      <v-card-actions>
        <v-btn
          @click="filtersOpen = !filtersOpen"
          text
          outlined>
          <v-icon left>
            mdi-filter-variant
          </v-icon>
          Filter
          <v-icon right>
            {{ filtersOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </v-btn>
        <v-fade-transition>
          <v-btn
            @click="filters = {}"
            v-show="hasFilters()"
            text
            small>
            <v-icon left>
              mdi-delete
            </v-icon>
            Filter löschen
          </v-btn>
        </v-fade-transition>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="filtersOpen">
          <v-row>
            <v-col
              v-for="filter in filterOptions"
              :key="filter.value"
              cols="12"
              md="6"
              lg="4"
            >
              <h6 class="text-h6">
                {{ filter.text }}
              </h6>
              <v-select
                v-model="filters[filter.value]"
                :multiple="filter.multiple"
                :items="filter.values"
                deletable-chips
                clearable
                dense
                small-chips
                chips
              >
              </v-select>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
    </div>

    <v-divider class="ma-2"></v-divider>

    <div class="px-1">
      <project-table :items="runningProjects">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              Laufende Projekte
            </v-toolbar-title>
          </v-toolbar>
        </template>
      </project-table>
      <project-table :items="pastProjects">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>
              Vergangene Projekte
            </v-toolbar-title>
          </v-toolbar>
        </template>
      </project-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { readUserProfile, readUsers } from '@/store/main/getters';
import FileManager from '@/components/file-manager/FileManager.vue';
import { readAutocompleteValues, readProjects } from '../store/getters';
import { dispatchGetAutocompleteValues, dispatchGetProjects } from '../store/actions';
import ProjectTable from './ProjectTable.vue';
import { Route } from 'vue-router';
import { Project, ProjectTypeEnum } from '../types';

@Component({
  components: {EmployeeProfilePicture, FileManager, ProjectTable },
})
export default class ProjectMain extends Vue {
  public filtersOpen = false;

  public filters: { [key: string]: string | string[] } = {}

  @Watch('$route', { immediate: true })
  public onRouteChange(newRoute?: Route) {
    if (newRoute?.query.filters == JSON.stringify(this.filters)){
      return;
    }
    try {
      this.filters = JSON.parse((this.$route.query.filters as string));
      this.filtersOpen = true;
    } catch(e) {
      this.filters = {};
    }
  }

  @Watch('filters', { deep: true })
  setFilters(value: { [key in string]?: string }) {
    const newString = JSON.stringify(value);
    if (newString === this.$route.query.filters as string) {
      return;
    }
    this.$router.replace({ query: { ...this.$route.query, filters: JSON.stringify(value) } });
  }
  
  get filterOptions(): {
    value: string;
    text: string;
    values: {text: string; value: string}[];
    multiple?: boolean;
  }[] {
    return [
      {
        value: 'type',
        text: 'Projektrahmen',
        values: this.$enums('ProjectTypeEnum'),
      },
      {
        value: 'subtype',
        text: 'Projektart',
        values: readAutocompleteValues(this.$store)('subtype')?.map(type => ({ text: type, value: type })),
        multiple: true,
      },
      {
        value: 'categories',
        text: 'Projektunterart',
        values: readAutocompleteValues(this.$store)('categories')?.map(category => ({ text: category, value: category })),
        multiple: true,
      },
      {
        value: 'methods',
        text: 'Methoden',
        values: readAutocompleteValues(this.$store)('methods')?.map(method => ({ text: method, value: method })),
        multiple: true,
      },
      {
        value: 'tags',
        text: 'Tags',
        values: readAutocompleteValues(this.$store)('tags')?.map(method => ({ text: method, value: method })),
        multiple: true,
      },
      {
        value: 'reference_status',
        text: 'Status der Referenzfreigabe',
        values: this.$enums('ProjectReferenceStatusEnum'),
      },
      {
        value: 'customer_name',
        text: 'Kunde',
        values: readAutocompleteValues(this.$store)('customer_name')?.map(method => ({ text: method, value: method })),
        multiple: true,
      },
    ];
  }

  
  public hasFilters() {
    return !!Object.values(this.filters).filter(c => c).length;
  }



  get runningProjects() {
    if(!this.projects) {
      return null;
    }
    return this.projects.filter(project => project.status === 'running')
  }

  get pastProjects() {
    if(!this.projects) {
      return null;
    }
    return this.projects.filter(project => project.status !== 'running')
  }
  
  get userProfile() {
    return readUserProfile(this.$store);
  }

  get users() {
    return readUsers(this.$store);
  }
  async mounted() {
    await dispatchGetAutocompleteValues(this.$store);
  }

  get projects() {
    const filterBy = (filters: string[], key: keyof Project) => (project: Project) => !filters?.length || filters.some(f => (project[key] as string[] || []).indexOf(f) !== -1)
    const filter = (key: keyof Project) => filterBy(this.filters[key] as string[], key);

    return readProjects(this.$store)(this.filters.type as ProjectTypeEnum || 'all')
      ?.filter(filter('subtype'))
      ?.filter(filter('categories'))
      ?.filter(filter('methods'))
      ?.filter(filter('tags'))
      ?.filter(filter('customer_name'))
      
  }


  @Watch('filters.type', { immediate:true })
  public async onFilterTypeChange(newType: string) {
    await dispatchGetProjects(this.$store, newType || 'all');
  }

}
</script>

<style scoped>

</style>
