<template>
  <v-card v-bind="$attrs" v-on="$listeners">
    <v-card-subtitle class="py-0">
      <div class="text-overline purple--text" v-text="application.status">
      </div>
    </v-card-subtitle>
    <v-card-text class="py-0">
      <div v-text="application.description" class="pre-formatted"></div>
    </v-card-text>
    <v-list-item>
      <employee-profile-picture :employee="application.applicant" component="v-list-item-avatar" small></employee-profile-picture>

      <v-list-item-content>
        <v-list-item-title v-text="application.applicant.full_name"></v-list-item-title>
        <v-list-item-subtitle v-text="application.applicant.ressort"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <div class="py-3">
      <slot name="actions"></slot>
    </div>
  </v-card> 
</template>

<script lang="ts">
import { IEventApplication } from '@/interfaces';
import { Vue, Component, Prop } from 'vue-property-decorator'
import EmployeeProfilePicture from '../employee/EmployeeProfilePicture.vue'

@Component({ 
  components: { EmployeeProfilePicture }
})
export default class EventApplicationCard extends Vue {

  @Prop()
  public application!: IEventApplication;
}
</script>

<style lang="scss">
.pre-formatted {
  white-space: pre;
}
</style>