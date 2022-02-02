<template>
  <div>
    <v-app-bar dark color="cctBlue" class="flex-grow-0" app>
      <portal-button :to="null"></portal-button>
    </v-app-bar>


    <v-main>
     
      <v-container>
        <v-form v-model="valid" ref="form" lazy-validation>
          <avatar-cropper-dialog
            :input-avatar="inputAvatar"
            :value="inputAvatar"
            @avatar="onAvatarCropped"
            @close="inputAvatar = null"
          >
          </avatar-cropper-dialog>

            
          <v-alert
            color="cctBlue"
            border="left"
            type="info"
            icon="$cct"
            text
            class="mb-10"
          >
            <b>Herzlich Willkommen</b> im Portal <br>
            <b>Bitte fülle deine Daten hier aus</b>, bevor du mit dem Entdecken des Portals starten kannst.<br>
          </v-alert>

          <v-row>
            <v-col cols="12" md="4" class="px-5">
              <h4 class="text-h4 text--primary mb-3">Avatar</h4>
              <p class="text-body-2 text--secondary">Ändere deinen Avatar</p>
            </v-col>

            <v-col cols="12" md="8">
              <employee-profile-picture
                :src="avatar"
                :employee="null"
                size="128"
                class="mr-5 float-left"
              >
              </employee-profile-picture>
              <div class="text-subtitle-2 mb-2">Neues Avatar hochladen</div>
              <upload-button
                outlined
                class="my-1"
                color="primary"
                accept="image/jpeg,image/png"
                @files="onFileChanged"
              >
                <v-icon left>
                  cloud_upload
                </v-icon>
                Avatar setzen
              </upload-button>
              <div class="text-caption">
                Die Datei darf nicht über 2 MB groß sein
              </div>
              <v-btn color="error" outlined icon @click="avatar = null">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider class="my-5"></v-divider>

          <v-row>
            <v-col cols="12" md="4" class="px-5">
              <h4 class="text-h4 text--primary mb-3">Account</h4>
              <p class="text-body-2 text--secondary">
                Diese Informationen sind für die Accounterstellung notwendig
              </p>
            </v-col>

            <v-col cols="12" md="8">  
              <v-text-field
                label="Vorname"
                class="input-lg"
                :rules="[$common.required]"
                v-model="firstName"
                required
              ></v-text-field>
              <v-text-field
                label="Nachname"
                class="input-lg"
                :rules="[$common.required]"
                v-model="lastName"
                required
              ></v-text-field>
              <v-text-field
                disabled
                label="E-mail"
                type="email"
                v-model="email"
                class="input-lg"
                :rules="[$common.required]"
              ></v-text-field>
              <v-text-field
                disabled
                label="Private E-mail"
                type="email"
                v-model="privateEmail"
                class="input-lg"
                :rules="[$common.required]"
              ></v-text-field>
              <v-text-field
                type="password"
                ref="password"
                label="Passwort setzen"
                class="input-lg"
                v-model="password1"
                :rules="[v => v && v.length >= 8 || 'Das Passwort muss mindestens 8 Zeichen lang sein']"
              >
              </v-text-field>
              <v-text-field
                type="password"
                ref="password"
                label="Passwort wiederholen"
                class="input-lg"
                v-model="password2"
                :rules="[v => v == password1 || 'Die Passwörter müssen identisch sein']"
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-divider class="my-5"></v-divider>
          <v-row>
            <v-col cols="12" md="4" class="px-5">
              <h4 class="text-h4 text--primary mb-3">Profil</h4>
              <p class="text-body-2 text--secondary">
                Diese Informationen sind in deinem Profil sichtbar
              </p>
            </v-col>

            <v-col cols="12" md="8">
              <date-picker-menu
                v-model="birthdate"
                defaultPicker="YEAR"
                :pickerProps="{
                  min: '1950-01-01',
                  max: new Date().toISOString().substr(0, 10),
                  'no-title': true,
                }"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Geburtstag"
                    class="input-lg"
                    v-bind="attrs"
                    v-on="on"
                    required
                    :rules="[$common.required]"
                  ></v-text-field>
                </template>
              </date-picker-menu>

              <vue-tel-input-vuetify
                label="Handynummer"
                placeholder="Handynummer"
                class="input-lg"
                v-model="phonenumber"
                mode="international"
                default-country="DE"
                :preferred-countries="['DE', 'AT', 'CH', 'FR']"
                required
                :rules="[
                  $common.required,
                  (v) =>
                    /^([0-9\(\)\/\+ \-]*)$/.test(v) ||
                    'Dies ist keine gültige Telefonnummer',
                ]"
              ></vue-tel-input-vuetify>

              <date-picker-menu
                defaultPicker="MONTH"
                v-model="entrydate"
                :pickerProps="{
                  min: '1950-01-01',
                }"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Eintrittsdatum"
                    class="input-lg"
                      
                    required
                    v-bind="attrs"
                    v-on="on"
                    :rules="[$common.required]"
                  >
                    <template v-slot:append="">
                      <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
                        </template>
                        <span>
                          <ul>
                            Das Eintrittsdatum ist der Tag des Onboarding Days.
                            <br />(Bei JunITer der Tag der entgültigen Zusage.)
                          </ul>
                        </span>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </template>
              </date-picker-menu>

              <v-text-field
                label="Studiengang"
                class="input-lg"
                v-model="major"
                required
                :rules="[$common.required]"
              ></v-text-field>
              <v-select
                label="Universität"
                :items="$common.UNIVERSITIES"
                v-model="university"
                class="input-lg"
                required
                :rules="[$common.required]"
              ></v-select>
              <v-select
                label="Hochschulgrad des Studiums"
                :items="$common.STUDYLEVELS"
                v-model="studylevel"
                class="input-lg"
                required
                :rules="[$common.required]"
              ></v-select>
              <v-select
                label="Bezirk"
                v-model="district"
                class="input-lg"
                :items="$common.BEZIRKE"
                required
                :rules="[$common.required]"
              ></v-select>
              <v-text-field
                label="LinkedIn"
                v-model="linkedin"
                class="input-lg"
                required
                hint="(Format: https://www.linkedin.com/in/name)"
                :rules="[
                  (v) =>
                    !v ||
                    $common.isLinkedIn(v) ||
                    'Dies ist keine gültige LinkedIn-URL',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-divider class="my-5"></v-divider>

          <v-row>
            <v-col cols="12" md="4" class="px-5">
              <h4 class="text-h4 text--primary mb-3">Personales</h4>
              <p class="text-body-2 text--secondary">
                Diese Informationen sind für das Personalmanagement notwendig und können nur von der Ressortleitungsrunde eingesehen werden
              </p>
            </v-col>

            <v-col cols="12" md="8">

              <v-select
                v-model = "gender"
                class="input-lg"
                :items="$common.GENDER"
                label="Gender"
                :rules="[$common.required]"
              ></v-select>

              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="Straße"
                    class="input-lg"
                    v-model="street"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="PLZ"
                    class="input-lg"
                    v-model="postcode"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Stadt"
                    class="input-lg"
                    v-model="city"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                label="Matrikelnummer"
                class="input-lg"
                v-model="matriculationNumber"
              >
              </v-text-field>

              <v-row dense>
                <v-col cols="12">
                  <v-text-field
                    label="Bank"
                    class="input-lg"
                    v-model="bank"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="IBAN"
                    class="input-lg"
                    v-model="iban"
                    :rules="[$common.isIBAN]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="BIC"
                    class="input-lg"
                    v-model="bic"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancel" raised>Abbrechen</v-btn>
            <v-btn @click="submit" color="primary" raised :disabled="!valid">
              Account erstellen
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IUserProfileCreate } from '@/interfaces';
import {
  dispatchCreateUserOpen,
  dispatchUploadFile,
} from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import AvatarCropperDialog from '@/components/AvatarCropperDialog.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import jwt_decode from 'jwt-decode';
import PortalButton from './appbar/components/PortalButton.vue';

@Component({
  components: {
    AvatarCropperDialog,
    UploadButton,
    EmployeeProfilePicture,
    VueTelInputVuetify,
    DatePickerMenu,
    PortalButton,
  },
})
export default class AccountCreate extends Vue {
  public valid = true;
  public avatar: string | Blob | null = '';
  public inputAvatar: Blob | null = null;
  public firstName = '';
  public lastName = '';
  public password1 = '';
  public password2 = '';
  public birthdate = '';
  public phonenumber = '';
  public memberstatus = '';
  public entrydate = '';
  public major = '';
  public university = '';
  public studylevel = '';
  public district = '';
  public linkedin = '';
  public ressort = '';
  public gender = '';
  public street = '';
  public postcode = '';
  public city = '';
  public matriculationNumber = '';
  public iban = '';
  public bic = '';
  public bank = '';


  public async onFileChanged(files: File[]) {
    this.inputAvatar = files[0];
  }

  public onAvatarCropped(avatar) {
    this.avatar = avatar;
    this.inputAvatar = null;
  }

  public cancel() {
    this.$router.back();
  }

  public getToken() {
    const token = this.$route.query.token as string;
    if (!token) {
      return null;
    }
    return jwt_decode(token) as { sub: string; invite: { name: string; email: string } };
  }

  created() {
    const token = this.getToken();
    const names = (token?.invite.name || '').split(' ');
    this.lastName = names[names.length - 1];
    names.splice(names.length - 1, 1);
    this.firstName = names.join(' ');
  }

  public get email() {
    const token = this.getToken();
    const names = (token?.invite.name || '').split(' ');

    return token?.sub || '';
  }

  public get privateEmail() {
    const token = this.getToken();

    return token?.invite.email || '';
  }

  public async submit() {
    const token = this.$route.query.token as string;
    if (!token) {
      return null;
    }
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const createProfile: IUserProfileCreate = {
        email: this.email,
        private_email: this.privateEmail,
        first_name: this.firstName,
        last_name: this.lastName,
        password: this.password1,
        birthdate: this.birthdate,
        phonenumber: this.phonenumber,
        memberstatus: this.memberstatus,
        entrydate: this.entrydate,
        major: this.major,
        university: this.university,
        studylevel: this.studylevel,
        district: this.district,
        linkedin: this.linkedin,
        ressort: this.ressort,
        gender: this.gender,      
        street: this.street,
        city: this.city,
        postcode: this.postcode,
        matriculation_number: this.matriculationNumber,
        iban: this.iban,
        bic: this.bic,
        bank: this.bank,
      };
      if (this.avatar) {
        const upload = await dispatchUploadFile(this.$store, {
          file: this.avatar,
        });
        createProfile.profile_picture = upload?.filename;
      }
      // explicitly set profile_picture to null
      // to remove current avatar
      if (this.avatar === null) {
        createProfile.profile_picture = '';
      }

      
      await dispatchCreateUserOpen(this.$store, {user: createProfile, token: token});
    }
  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>
