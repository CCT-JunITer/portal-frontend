<template>
  <v-sheet rounded color="blue-grey lighten-5" class="fill-height">
    <v-container v-if="employees.length">
      <v-row>
        <div class="ma-2 text-h6">{{ this.employees.length }} Mitglieder</div>
      </v-row>
      <v-row>
        <v-col
            v-for="employee in slicedEmployees"
            :key="employee.id"
            cols="12"
            md="3"
            sm="6"
        >
          <employee-card :employee="employee" tile outlined></employee-card>
        </v-col>
      </v-row>
      <v-pagination
          v-model="page"
          class="my-4"
          :length="pages"
          v-if="pages > 0"
      ></v-pagination>
    </v-container>
    <v-container v-else>
      Keine Mitglieder
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Backdrop from '@/components/Backdrop.vue';
import {IUserProfile} from '@/interfaces';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import {readAdminUsers} from '@/store/main/getters';
import {dispatchGetUsers} from '@/store/main/actions';
import {readFilters, readSearchText} from '@/store/dashboard/getters';

@Component({
  components: {EmployeeCard, Backdrop}
})
export default class EmployeesView extends Vue {
  private page = 1;
  private entriesPerPage = 8;

  get pages() {
    return Math.floor(this.employees.length / this.entriesPerPage);
  }

  get slicedEmployees() {
    const pageIndex = this.page - 1;
    return this.employees.slice(pageIndex * this.entriesPerPage, pageIndex * this.entriesPerPage + this.entriesPerPage);
  }

  get searchText() {
    return readSearchText(this.$store);
  }

  get employees(): IUserProfile[] {
    const filters = readFilters(this.$store);
    return readAdminUsers(this.$store)
        .filter(employee => employee.full_name && employee.full_name?.toLowerCase().indexOf(this.searchText?.toLowerCase() || '') !== -1)
        .filter(employee => !filters.length || filters.indexOf(employee.ressort) !== -1);
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
  }
}
</script>
