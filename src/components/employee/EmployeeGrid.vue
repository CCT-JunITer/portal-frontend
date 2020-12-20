<template>
  <v-container v-if="$props.employees.length">
    <v-row>
      <v-col
        v-for="employee in slicedEmployees"
        :key="employee.id"
        cols="12"
        md="3"
        sm="6"
        class="d-flex align-center flex-column pa-5"
      >
        <employee-card :employee="employee" outlined rounded elevation="0" class="full-width"></employee-card>
      </v-col>
    </v-row>
    <v-pagination
      v-model="page"
      class="my-4"
      :length="pages"
      v-if="pages > 1"
    ></v-pagination>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Backdrop from '@/components/Backdrop.vue';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';
import { dispatchGetUsers } from '@/store/main/actions';
import { readSearchText } from '@/store/dashboard/getters';

@Component({
  components: { EmployeeCard, Backdrop },
  props: { employees: Array }
})
export default class EmployeesView extends Vue {
  private page = 1;
  private entriesPerPage = 8;

  get pages() {
    return Math.floor(this.$props.employees.length / this.entriesPerPage) + 1;
  }

  get slicedEmployees() {
    const pageIndex = this.page - 1;
    return this.$props.employees.slice(pageIndex * this.entriesPerPage, pageIndex * this.entriesPerPage + this.entriesPerPage);
  }

  get searchText() {
    return readSearchText(this.$store);
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
  }
}
</script>
