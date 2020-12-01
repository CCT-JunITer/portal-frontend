<template>
  <v-container fluid>
    <employee-grid :employees="employees"></employee-grid>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IUserProfile } from '@/interfaces';
import { readAdminUsers } from '@/store/main/getters';
import { dispatchGetUsers } from '@/store/main/actions';
import EmployeeGrid from '@/components/employee/EmployeeGrid.vue';

@Component({
  components: { EmployeeGrid }
})
export default class EmployeesView extends Vue {

  get employees(): IUserProfile[] {
    return readAdminUsers(this.$store);
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
  }
}
</script>
