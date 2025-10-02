<template>
  <backdrop :height="this.$vuetify.breakpoint.mdAndUp ? '100px' : '50px'" color="grey lighten-4">
    <v-container>
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
          <v-divider vertical inset class="mx-0"></v-divider>
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
          <v-spacer></v-spacer>
          <v-btn
            to="/main/people/streaks"
            color="cctOrange"
            outlined
            class="mr-2">
            <v-icon left>
              mdi-fire
            </v-icon>
            Streak Leaderboard
          </v-btn>
          <v-select
            v-model="sortBy"
            :items="sortBys"
            filled
            color="cctGreen"
            class="sort-by"
            menu-props="auto"
            dense
            label="Select"
            hide-details
            single-line
          >
            <template v-slot:prepend>
              <v-btn icon small @click="ascending = !ascending">
                <v-icon>{{ ascending ? 'mdi-sort-ascending' : 'mdi-sort-descending' }}</v-icon>
              </v-btn>
            </template>
          </v-select>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="filtersOpen">
            <v-row>
              <v-col
                v-for="filter in filterOptions"
                :key="filter.value"
                cols="12"
                md="6"
              >
                <h2 class="title-h6 mb-2">
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
      <v-container v-if="users.length">
        <v-row>
          <v-col
            v-for="(employee, i) in employees"
            :key="employee.id"
            cols="12"
            md="3"
            sm="6"
            class="pa-5"
          >
            <v-lazy :value="i < 4">
              <employee-card :employee="employee" outlined rounded elevation="0" class="full-width"></employee-card>
            </v-lazy>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <v-row>
          <v-col
            v-for="employee in [1,2,3,4]"
            :key="employee"
            cols="12"
            md="3"
            sm="6"
            class="pa-5"
          >
            <v-skeleton-loader
              type="card"
              width="100%"
            ></v-skeleton-loader>
          </v-col>
        </v-row>

      </v-container>
    </v-container>
  </backdrop>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Backdrop from '@/components/Backdrop.vue';
import { IUserProfile, UserType } from '@/interfaces';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import { readGroups, readUsers } from '@/store/main/getters';
import { dispatchGetUsers } from '@/store/main/actions';
import { MEMBERSTATUS, UNIVERSITIES } from '@/common';

@Component({
  components: { EmployeeCard, Backdrop }
})
export default class EmployeesView extends Vue {
  private filtersOpen = false;

  private filters: { [key in keyof IUserProfile]?: string } = {};


  get filterOptions(): {
    value: keyof IUserProfile;
    text: string;
    values: string[];
  }[] { 
    return [
      {
        value: 'ressort',
        text: 'Ressort',
        values: readGroups(this.$store).filter(v => v.type == 'ressort').map(v => v.name),
      },
      {
        value: 'university',
        text: 'Universität',
        values: UNIVERSITIES,
      },
      {
        value: 'memberstatus',
        text: 'Mitgliedsstatus',
        values: MEMBERSTATUS,
      },
    ];}

  readonly sortBys: {
    value: keyof IUserProfile;
    text: string;
  }[] = [
    {
      value: 'full_name',
      text: 'Name',
    },
    {
      value: 'ressort',
      text: 'Ressort',
    },
    {
      value: 'memberstatus',
      text: 'Mitgliedsstatus',
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

  public get ascending() {
    const ascending = (this.$route.query.ascending as string);
    return ascending !== 'false';
  }

  public set ascending(ascending) {
    this.$router.replace({ query: { ...this.$route.query, ascending: `${ascending}` }});
  }


  public get sortBy() {
    const sortBy = (this.$route.query.sortBy as string);
    if(!this.sortBys.find(category => category.value === sortBy)){
      return 'memberstatus' as keyof IUserProfile;
    }
    return sortBy as keyof IUserProfile;
  }

  public set sortBy(sortBy) {
    this.$router.replace({ query: { ...this.$route.query, sortBy }});
  }

  @Watch('$route', { immediate: true })
  public onRouteChange() {
    try {
      this.filters = JSON.parse((this.$route.query.filters as string));
    } catch(e) {
      this.filters = {};
    }
  }

  @Watch('filters', { deep: true })
  setFilters(value: { [key in keyof IUserProfile]?: string }) {
    const newString = JSON.stringify(value);
    if (newString === this.$route.query.filters as string) {
      return;
    }
    this.$router.replace({ query: { ...this.$route.query, filters: JSON.stringify(value) } });
  }

  get searchText() {
    return (this.$route.query.value as string) || '';
  }

  set searchText(value) {
    this.$router.replace({ query: { ...this.$route.query, value: value } });
  }

  get users() {
    return readUsers(this.$store);
  }

  get employees(): IUserProfile[] {
    return readUsers(this.$store)
      .filter(employee => this.category === 'all' || (this.category === 'alumni' ? employee.is_alumni : !employee.is_alumni))
      .filter(employee => employee.full_name && employee.full_name?.toLowerCase().indexOf(this.searchText?.toLowerCase() || '') !== -1)
      .filter(employee => !this.filters.ressort || this.filters.ressort == employee.ressort)
      .filter(employee => !this.filters.memberstatus || this.filters.memberstatus == employee.memberstatus)
      .filter(employee => !this.filters.university || this.filters.university == employee.university)
      .sort((o1, o2) => (o1[this.sortBy]! < o2[this.sortBy]! ? -1 : 1) * (this.ascending ? 1 : -1))
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
  }

  public async onCategoryChange() {
    await dispatchGetUsers(this.$store);
  }
}
</script>

<style lang="scss">
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

.sort-by {
  flex-grow: 0;
  width: 250px;
}

</style>
