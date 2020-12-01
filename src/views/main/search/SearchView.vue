<template>
  <backdrop :height="this.$vuetify.breakpoint.mdAndUp ? '100px' : '50px'" color="grey lighten-4">
    <v-container fluid>
      <div class="d-flex align-center justify-center flex-column mb-5">
        <v-toolbar
          class="mt-md-15 mx-5"
          rounded
          elevation="3"
          width="500"
        >
          <v-text-field
            v-model="searchText"
            class="search-bar"
            clearable
            label="Mitglieder suchen"
            hide-details
            color="cctGreen"
            full-width
            dense
            solo
            flat
            single-line
            prepend-icon="mdi-magnify"
          >
          </v-text-field>
          <v-divider vertical inset></v-divider>
          <div class="select-wrapper px-2">
            <v-select
              v-model="category"
              @change="onCategoryChange"
              :menu-props="{ offsetY: true, bottom: true }"
              solo
              flat
              dense
              hide-details
              :items="categories"
              :value="category"
            >
            </v-select>
          </div>
        </v-toolbar>
      </div>

      <v-container>
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
              >
                <h2 class="title mb-2">
                  {{ filter.text }}
                </h2>
                <v-chip-group
                  v-model="filters[filter.value]"
                  column
                  active-class="cctOrange--text"
                >
                  <v-chip
                    outlined
                    v-for="value in filter.values"
                    :key="value"
                    :value="value"
                  >
                    {{ value }}
                  </v-chip>
                </v-chip-group>
              </v-col>

            </v-row>
          </div>
        </v-expand-transition>
      </v-container>
      <v-divider class="ma-3"></v-divider>
      <employee-grid :employees="employees"></employee-grid>
      <v-container v-if="!employees.length">
        Keine Mitglieder gefunden
      </v-container>
    </v-container>
  </backdrop>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Backdrop from '@/components/Backdrop.vue';
import { IUserProfile } from '@/interfaces';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import { readAdminUsers } from '@/store/main/getters';
import { dispatchGetUsers } from '@/store/main/actions';
import EmployeeGrid from '@/components/employee/EmployeeGrid.vue';
import { MEMBERSTATUS, RESSORTS, STUDYLEVELS } from '@/common';
import { UserType } from '@/interfaces';

@Component({
  components: { EmployeeGrid, EmployeeCard, Backdrop }
})
export default class EmployeesView extends Vue {
  private filtersOpen = false;

  private filters = {};

  private filterOptions = [
    {
      value: 'ressort',
      text: 'Ressort',
      values: RESSORTS,
    },
    {
      value: 'memberstatus',
      text: 'Member status',
      values: MEMBERSTATUS,
    }
  ];

  public hasFilters() {
    return !!Object.values(this.filters).filter(c => c).length;
  }


  private categories = [{
    value: 'all',
    text: 'Alle'
  }, {
    value: 'members',
    text: 'Mitglieder'
  },
  {
    value: 'alumni',
    text: 'Alumni'
  }];
  
  public get category() {
    const cat = (this.$route.query.category as string);
    if(!this.categories.find(category => category.value === cat)){
      return 'members';
    }
    return cat as UserType;
  }

  public set category(category) {
    this.$router.replace({ query: { ...this.$route.query, category: category }});
  }

  get searchText() {
    return (this.$route.query.value as string) || '';
  }

  set searchText(value) {
    this.$router.replace({ query: { ...this.$route.query, value: value } });
  }

  get employees(): IUserProfile[] {
    return readAdminUsers(this.$store)
      .filter(employee => this.category === 'all' || (this.category === 'alumni' ? employee.is_alumni : !employee.is_alumni))
      .filter(employee => employee.full_name && employee.full_name?.toLowerCase().indexOf(this.searchText?.toLowerCase() || '') !== -1)
      .filter(employee => !this.filters.ressort || this.filters.ressort == employee.ressort)
      .filter(employee => !this.filters.memberstatus || this.filters.memberstatus == employee.memberstatus)
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
  }

  public async onCategoryChange(e) {
    await dispatchGetUsers(this.$store);
  }
}
</script>

<style>
.expand-filters {
  overflow: hidden;
  height: 100%;
}

.search-bar {
  align-self: center;
}

.select-wrapper {
  max-width: 160px;
}

</style>
