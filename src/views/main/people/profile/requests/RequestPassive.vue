<template>
  <div class="root">
    <v-container v-if="userProfile">

      <h5 class="text-h6">Antrag auf Passivisierung</h5>
      <v-form
        v-model="valid"
        ref="form"
        lazy-validation
      >
        <date-picker-menu
          v-model="desiredDateTo"
          defaultPicker="MONTH"
          :pickerProps="{
            min: new Date().toISOString().substr(0, 10),
            'no-title': true
          }"
        >
          <template v-slot:activator="{ on, attrs, }">
            <v-text-field
              label="Passiv bis"
              v-bind="attrs"
              v-on="on"
              class="input-lg"
              required
              :rules="[$common.required]"
            ></v-text-field>
          </template>
        </date-picker-menu>

        <v-select
          v-model="cause"
          :items="$common.PASSIVE_CAUSES"
          label="Grund"
          class="input-lg"

        >
        </v-select>

        <v-textarea
          label="Beschreibung"
          rows="4"
          v-model="description"
        >
        </v-textarea>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submit">
            Absenden
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-container>
  </div>
</template>

<script lang="ts">
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import UserGroupCard from '@/components/user-group/UserGroupCard.vue';
import { Group, RequestCreate } from '@/interfaces';
import { dispatchAddRequestMe, dispatchGetGroups } from '@/store/main/actions';
import { readGroups, readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { UserGroupCard, DatePickerMenu }
})
export default class UserProfileRessortChange extends Vue {

  public valid = false;
  public desiredDateTo: Date | null = null;
  public description = '';
  public cause = '';


  public async submit() {

    if ((this.$refs.form as HTMLFormElement).validate()) {
      //
      const requestCreate: RequestCreate = {
        description: `${this.description}\nGrund: ${this.cause}\nBis: ${this.desiredDateTo}`,
        groups: [
          {
            mode: 'add',
            group_id: this.passiveGroup!.id,
            is_primary: true,
          }
        ]
      };

      await dispatchAddRequestMe(this.$store, requestCreate);
      this.$router.push('/main/people/profile/requests');
    }
  }

  get passiveGroup() {
    return readGroups(this.$store).find((group) => group.name === 'passiv')
  }


  get userProfile() {
    return readUserProfile(this.$store);
  }

  async mounted() {
    await dispatchGetGroups(this.$store);
  }

  get groups() {
    return readGroups(this.$store);
  }

}
</script>

<style lang="scss" scoped>

</style>