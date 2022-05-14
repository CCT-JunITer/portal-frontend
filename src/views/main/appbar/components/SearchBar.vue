<template>

  <v-autocomplete
    class="mx-4"
    v-model="model"
    ref="autocomplete"
    :items="items"
    @change="goToProfile"
    @click="fetchResults"
    :no-filter="true"
    :loading="isLoading"
    :search-input.sync="searchText"
    return-object
    clearable
    hide-details
    item-text="searchType"
    item-value="searchId"
    label="Suche"
    solo-inverted
    flat
    dense
    dark
    prepend-inner-icon="mdi-magnify"
    :menu-props="{
      closeOnClick: false,
      closeOnContentClick: false,
      disableKeys: true,
      openOnClick: false,
      offsetY: true,
      offsetOverflow: true,
      transition: 'slide-y-transition',
      maxHeight: '500px'
    }"
  >

    <template v-slot:prepend-item>
      <v-list-item dense>
        <v-btn-toggle v-model="filter" dense color="deep-purple accent-3">
          <v-btn value="user">
            <v-icon left>people</v-icon>
            Mitglieder
          </v-btn>
          <v-btn value="training">
            <v-icon left>mdi-school</v-icon>
            Training
          </v-btn>
          <v-btn value="meeting">
            <v-icon left>mdi-human-male-board</v-icon>
            Meeting
          </v-btn>
          <v-btn value="document">
            <v-icon left>mdi-folder</v-icon>
            Dokumente
          </v-btn>
        </v-btn-toggle>
      </v-list-item>
    </template>
    
    <template v-slot:item="{ item }">
      <template v-if="item.searchType === 'user'">
        <employee-profile-picture :employee="item.target" component="v-list-item-avatar" small></employee-profile-picture>
        <v-list-item-content>
          <v-list-item-title v-text="item.target.full_name"></v-list-item-title>
          <v-list-item-subtitle v-text="item.target.ressort"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
      <template v-if="item.searchType === 'training' || item.searchType === 'meeting'">
        <v-list-item-content>
          <v-list-item-title v-text="item.target.title"></v-list-item-title>
          <v-list-item-subtitle v-text="item.target.description"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
      <template v-if="item.searchType === 'document'">
        <v-list-item-content>
          <v-list-item-title v-text="item.target.title"></v-list-item-title>
          <v-list-item-subtitle v-text="item.target.description"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { api } from '@/api';
@Component({
  components: { EmployeeProfilePicture }
})
export default class SearchBar extends Vue {

  public results: any[] | null = null;
  public model = {};
  public searchText = '';
  public filter = '';
  public isLoading = false;

  public sections = [
    {
      type: 'user',
      name: 'Mitglieder',
    },
    {
      type: 'meeting',
      name: 'Meetings',
    }, 
    {
      type: 'training',
      name: 'Schulungen',
    },
    {
      type: 'document',
      name: 'Dokumente',
    }
  ]
  
  @Watch('searchText')
  public async search(newVal?: string, oldVal?: string) {
    if (newVal === oldVal) {
      return;
    } 
    this.isLoading = true;
    this.fetch();
  }

  public fetch = this.$common.debounce(this.fetchResults, 200);

  public async fetchResults() {
    this.isLoading = true;
    const searchText = this.searchText || '';
    const response = await api.getSearchResults(this.$store.state.main.token, searchText)
    this.results = response.data.results;
    this.isLoading = false;
  }

  public get items() {
    if (!this.results) {
      return [];
    }
    const arr: any[] = [];
    const sections = this.sections.filter(section => !this.filter || section.type === this.filter)
    for (let i = 0 ; i < sections.length; i++) {
      const section = sections[i];
      const items = this.results[section.type].map((obj) => ({
        target: obj,
        searchType: section.type,
        searchId: `${section.type}-${obj.id}`,
        id: obj.id
      }));
      if (items.length) {
        arr.push({ section, items});
      }
    }
    const array: any[] = [];
    for (let i = 0 ; i < arr.length ; i++) {
      const { section, items } = arr[i];
      array.push({ header: section.name });
      array.push(...items);
      if (i + 1 !== arr.length) {
        array.push({ divider: true });
      }
    }
    return array;
  }
  
  public clearInput() {
    this.model = {};
    (this.$refs.autocomplete as HTMLElement).blur();
  }

  public goToProfile(e) {
    this.clearInput();
    if (e?.searchType === 'user') {
      return this.$router.push({ path: '/main/people/profile/view/' + e.id })
    }
    if (e?.searchType === 'training' || e?.searchType === 'meeting') {
      return this.$router.push({ path: '/main/events/' + e.id })
    }
    if (e?.searchType === 'document') {
      return this.$router.push({ path: '/main/wms/documents/edit/' + e.id })
    }
    console.error(`unhandled searchtype '${e.searchType}'`);
  }

  public goToSearch() {
    if (this.searchText) {
      this.$router.push({ path: '/main/people/search', query: { value: this.searchText } })
    }
    this.clearInput();
  }

}
</script>

<style lang="scss">

</style>