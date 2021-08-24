<template>

  <v-autocomplete
    v-if="!this.$route.meta.disableSearchBar"
    class="mx-4"
    v-model="model"
    ref="autocomplete"
    :items="employees"
    @change="goToProfile"
    @keydown.enter="goToSearch"
    :search-input.sync="searchText"
    return-object
    clearable
    hide-details
    item-text="full_name"
    item-value="id"
    label="Suche"
    solo-inverted
    flat
    dense
    dark
    prepend-inner-icon="mdi-magnify"
  >
    <template v-slot:no-data>
      <v-list-item
        @click="goToSearch"
        color="primary"
        ripple>
        <v-list-item-title>
          Weitere Benutzer finden
        </v-list-item-title>
      </v-list-item>
    </template>

    <template v-slot:item="{ item }">

      <employee-profile-picture :employee="item" component="v-list-item-avatar" small></employee-profile-picture>
      <v-list-item-content>
        <v-list-item-title v-text="item.full_name"></v-list-item-title>
        <v-list-item-subtitle v-text="item.ressort"></v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { IUserProfile } from '@/interfaces';
import { readUsers } from '@/store/main/getters';
import { Vue, Component } from 'vue-property-decorator'
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import { dispatchGetUsers } from '@/store/main/actions';

@Component({
  components: { EmployeeProfilePicture }
})
export default class SearchBar extends Vue {

  public model = {};
  public searchText = '';

  public async created() {
    await dispatchGetUsers(this.$store);
  }

  get employees(): IUserProfile[] {
    return readUsers(this.$store)
      .filter(user => user.full_name);
  }

  public clearInput() {
    this.model = {};
    (this.$refs.autocomplete as HTMLElement).blur();
  }

  public goToProfile(e) {
    this.clearInput();
    if (e?.id) {
      this.$router.push({ path: '/main/people/profile/view/' + e.id })
    }
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