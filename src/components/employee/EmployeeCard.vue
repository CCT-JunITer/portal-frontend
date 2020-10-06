<template>
  <div class="root">
    <v-img
        :src="`https://picsum.photos/500/300?image=${employee.id * 5 + 10}`"
        :lazy-src="`https://picsum.photos/10/6?image=${employee.id * 5 + 10}`"
        aspect-ratio="0.7"
        class="grey lighten-2 image"
    >
      <template v-slot:placeholder>
        <v-row
            class="fill-height ma-0"
            align="center"
            justify="center"
        >
          <v-progress-circular
              indeterminate
              color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {IUserProfile} from '@/interfaces';

@Component
export default class EmployeeCard extends Vue {
  @Prop()
  private employee: IUserProfile | undefined;
}
</script>
