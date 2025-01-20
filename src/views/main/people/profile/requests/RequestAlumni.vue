<template>
  <div class="root">
    <v-container v-if="userProfile">
      <v-row>
        <v-col sm="8" cols="12" order="last" order-sm="first">
          <h5 class="text-h6">Alumnisierung</h5>
          <v-form
            v-model="valid"
            ref="form"
            lazy-validation
          >
            
            <v-text-field
              label="Vorname"
              :rules="[$common.required]"
              v-model="firstName"
              required
            ></v-text-field>
            <v-text-field
              label="Nachname"
              :rules="[$common.required]"
              v-model="lastName"
              required
            ></v-text-field>
            <v-text-field
              disabled
              label="E-mail"
              type="email"
              v-model="email"
              :rules="[$common.required, $common.isEmail]"
            ></v-text-field>
            <v-text-field
              label="Private E-mail"
              type="email"
              v-model="privateEmail"
              :rules="[$common.required, $common.isEmail]"
            ></v-text-field>

            <date-picker-menu
              v-model="birthdate"
              defaultPicker="YEAR"
              :pickerProps="{
                min: '1950-01-01',
                max: new Date().toISOString().substr(0, 10),
                'no-title': true
              }"
            >
              <template v-slot:activator="{ on, attrs, }">
                <v-text-field
                  label="Geburtstag"
                  v-bind="attrs"
                  v-on="on"
                  required
                  :rules="[$common.required]"
                ></v-text-field>
              </template>
            </date-picker-menu>

            <vue-tel-input-vuetify
              label="Handynummer"
              v-model="phonenumber"
              mode="international"
              default-country="DE"
              :preferred-countries="['DE', 'AT', 'CH', 'FR']"
              required
              :rules="[
                $common.required,
                v => /^([0-9\(\)\/\+ \-]*)$/.test(v) || 'Dies ist keine gültige Telefonnummer']"
            ></vue-tel-input-vuetify>

            <date-picker-menu
              v-model="entrydate"
              defaultPicker="MONTH"
              :pickerProps="{
                min: '1950-01-01',
                max: new Date().toISOString().substr(0, 10),
              }"
            >
              <template v-slot:activator="{on, attrs}">
                <v-text-field
                  label="Eintrittsdatum"
                  required
                  v-bind="attrs"
                  v-on="on"
                  :rules="[$common.required]"
                  disabled
                >
                  <template v-slot:append="">
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
                      </template>
                      <span>
                        <ul>Das Eintrittsdatum ist der Tag des Onboarding Days. <br>(Bei JunITer der Tag der entgültigen Zusage.)
                        </ul>
                      </span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </template>
            </date-picker-menu>
            
            <v-text-field
              label="Studiengang"
              v-model="major"
              required
              :rules="[$common.required]"
            ></v-text-field>
            <v-select
              label="Universität"
              v-model="university"
              :items="$common.UNIVERSITIES"
              required
              :rules="[$common.required]"
            ></v-select>
            <v-select
              label="Hochschulgrad des Studiums"
              v-model="studylevel"
              :items="$common.STUDYLEVELS"
              required
              :rules="[$common.required]"
            ></v-select>
            <v-select
              label="Bezirk"
              v-model="district"
              :items="$common.BEZIRKE"
              required
              :rules="[$common.required]"
            ></v-select>
            <v-text-field
              label="LinkedIn"
              v-model="linkedin"
              required
              hint="(Format: https://www.linkedin.com/in/name)"
              :rules="[v => !v || $common.isLinkedIn(v) || 'Dies ist keine gültige LinkedIn-URL']"
            ></v-text-field>

            <v-text-field
              label="Adresse"
              type="text"
              v-model="street"
              :rules="[$common.required]"
            >
            </v-text-field>
            <v-text-field
              label="PLZ"
              v-model="postcode"
              required
              :rules="[$common.required, $common.isNumber, v => v.length === 5 || v.length === 4 || 'PLZ ungültig']"
            >
            </v-text-field>
            <v-text-field
              label="Stadt"
              v-model="city"
            >
            </v-text-field>

            <v-select
              label="Kontaktmöglichkeit"
              multiple
              chips
              deletable-chips
              v-model="contact"
              :items="contactOptions"
            >
            </v-select>

            <v-select
              label="Höchste Projektposition"
              :items="$common.PROJECT_POSITIONS"
              v-model="highestProjectPosition"
            >
            </v-select>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="submit">
                Absenden
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-col>

        <v-col sm="4" cols="12" v-if="userProfile.groups">
          <h5 class="text-h6">Aktuell</h5>
          <user-group-card
            class="my-2"
            v-for="group in userProfile.groups"
            outlined
            :key="group.id"
            :group="group"
          ></user-group-card>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import UserGroupCard from '@/components/user-group/UserGroupCard.vue';
import { Group, RequestCreate } from '@/interfaces';
import { dispatchAddRequestMe } from '@/store/main/actions';
import { readGroups, readUserProfile } from '@/store/main/getters';
import { Vue, Component, Prop } from 'vue-property-decorator'

import { IUserProfileUpdate, UserGroup } from '@/interfaces';
import { dispatchUpdateUserProfile } from '@/store/main/actions';
// import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { compareAsc } from 'date-fns';

@Component({
  components: { UserGroupCard, DatePickerMenu}
})
export default class UserProfileRessortChange extends Vue {

  public firstName = '';
  public lastName = '';
  public email = '';
  public birthdate = '';
  public phonenumber = '';
  public entrydate = '';
  public major = '';
  public university = '';
  public studylevel = '';
  public district = '';
  public linkedin = '';
  public gender = '';
  public privateEmail = '';
  public highestProjectPosition = '';
  public valid = false;
  public street = '';
  public postcode = '';
  public city = '';
  public contact: string[] = [];

  public contactOptions = [
    'Alumni Newsletter / Hinweise zu CCT Events',
    'Einladungen zu Events',
    'Get Togethers',
    'Persönliche Kontaktaufnahme',
    'Alumni Networking 4.0 Gruppe LinkedIn',
    'Facebook Gruppe'
  ]


  public async submit() {

    if ((this.$refs.form as HTMLFormElement).validate()) {
      //
      const requestCreate: RequestCreate = {
        description: 'Alumnisierung',
        groups: [],
      };
      const updatedProfile: IUserProfileUpdate = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        birthdate: this.birthdate,
        phonenumber: this.phonenumber,
        entrydate: this.entrydate,
        major: this.major,
        university: this.university,
        studylevel: this.studylevel,
        district: this.district,
        linkedin: this.linkedin,
        street: this.street,
        city: this.city,
        postcode: this.postcode,
        highest_project_position: this.highestProjectPosition,
        private_email: this.privateEmail,
        contact: this.contact,
      };

      
      await dispatchAddRequestMe(this.$store, requestCreate);
      await dispatchUpdateUserProfile(this.$store, updatedProfile);
      this.$router.push('/main/people/profile/requests');
    }
  }

  get activeGroup() {
    return readGroups(this.$store).find((group) => group.name === 'aktiv')
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  get groups() {
    return readGroups(this.$store);
  }

  public created() {
    this.reset();
  }

  public reset() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.firstName = userProfile.first_name;
      this.lastName = userProfile.last_name;
      this.privateEmail = userProfile.private_email;
      this.email = userProfile.email;
      this.birthdate = userProfile.birthdate;
      this.phonenumber = userProfile.phonenumber;
      this.entrydate = userProfile.entrydate;
      this.major = userProfile.major;
      this.university = userProfile.university;
      this.studylevel = userProfile.studylevel;
      this.district = userProfile.district;
      this.linkedin = userProfile.linkedin;
      this.street = userProfile.street;
      this.city = userProfile.city;
      this.postcode = userProfile.postcode;
      this.highestProjectPosition = userProfile.highest_project_position;
      this.contact = userProfile.contact;
    }
  }

}
</script>

<style lang="scss" scoped>

</style>