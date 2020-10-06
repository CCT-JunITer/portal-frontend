<template>
  <backdrop>
    <v-container style="z-index: 1;" fluid class="pa-10">
      <v-sheet rounded>
        <v-container v-if="employees.length">
          <v-row>
            <v-col
                v-for="employee in employees"
                :key="employee.id"
                cols="6"
                sm="3"
            >
              <employee-card :employee="employee"></employee-card>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else>
          Keine Mitglieder
        </v-container>
      </v-sheet>
    </v-container>
  </backdrop>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Backdrop from '@/components/Backdrop.vue';
import {IUserProfile} from '@/interfaces';
import EmployeeCard from '@/components/employee/EmployeeCard.vue';

@Component({
  components: {EmployeeCard, Backdrop}
})
export default class Dashboard extends Vue {

  private employees: Array<IUserProfile> = [];

}
</script>
