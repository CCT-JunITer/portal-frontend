<template>
  <v-container>
    <v-form
      v-model="valid"
      ref="form"
      lazy-validation
    >


      <avatar-cropper-dialog
        :input-avatar="inputAvatar"
        :value="inputAvatar"
        @avatar="onAvatarCropped"
        @close="inputAvatar = null"
      >
      </avatar-cropper-dialog>

      <v-alert
        v-if="userProfile && !userProfile.full_name"
        color="cctGreen"
        border="left"
        type="info"
        text
        class="mb-10"
      >
        <b>Herzlich Willkommen</b> im Portal! <br>
        Dein Account wurde soeben in unserem Benutzerverzeichnis angelegt.
        <b>Bitte fülle deine Daten hier aus</b>, bevor du mit dem Entdecken des Portals starten kannst.<br>
      </v-alert>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Avatar</h4>
          <p class="text-body-2 text--secondary">Ändere dein Avatar</p>
        </v-col>

        <v-col cols="12" md="8">
          <employee-profile-picture
            :src="avatar"
            :employee="userProfile"
            size="128"
            class="mr-5 float-left">
          </employee-profile-picture>
          <div class="text-subtitle-2 mb-2">Neues Avatar hochladen</div>
          <upload-button
            outlined
            class="my-1"
            color="primary"
            accept="image/jpeg,image/png"
            @files="onFileChanged">
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
            Diese Informationen sind für das Accountmanagement notwendig
          </p>
        </v-col>

        <v-col cols="12" md="8">  
          <v-text-field
            label="Vor- und Nachname"
            class="input-lg"
            :rules="[$common.required]"
            v-model="fullName"
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
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Profil</h4>
          <p class="text-body-2 text--secondary">Diese Informationen sind in deinem Profil sichtbar</p>
        </v-col>

        <v-col cols="12" md="8">
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
            v-model="phonenumber"
            class="input-lg"
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
            class="input-lg"
            required
            :rules="[$common.required]"
          ></v-text-field>
          <v-select
            label="Universität"
            v-model="university"
            :items="$common.UNIVERSITIES"
            class="input-lg"
            required
            :rules="[$common.required]"
          ></v-select>
          <v-select
            label="Hochschulgrad des Studiums"
            v-model="studylevel"
            :items="$common.STUDYLEVELS"
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
            :rules="[v => !v || $common.isLinkedIn(v) || 'Dies ist keine gültige LinkedIn-URL']"
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

          <v-text-field
            label="Adresse"
            class="input-lg"
            v-model="address"
          >
          </v-text-field>

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

          <v-select
            label="Höchste Projektposition"
            class="input-lg"
            :items="$common.PROJECT_POSITIONS"
            v-model="highestProjectPosition"
          >
          </v-select>

        </v-col>
      </v-row>

      <v-divider class="my-5"></v-divider>

      <v-row>
        <v-col cols="12" md="4" class="px-5">
          <h4 class="text-h4 text--primary mb-3">Gruppen</h4>
          <p class="text-body-2 text--secondary">Gruppenzuweisung</p>
        </v-col>
        <v-col cols="12" md="8">

          <v-row v-for="[type, groups] in Object.entries(sortedGroups)" :key="type">
            <p class="text-overline text--primary px-5">{{ type }}</p>

            <v-col cols="12" v-for="group in groups" :key="group.id">
              <user-group-card :group="group">
                <template v-slot:actions>
                  <v-btn text small color="primary" @click="setPrimaryGroup(group.group)" v-if="!group.is_primary">
                    <v-icon left>mdi-account-check</v-icon>
                    primäre Gruppe für {{ group.group.type }} setzen
                  </v-btn>
                </template>
              </user-group-card>
            </v-col> 
          </v-row>

        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel" raised>Abbrechen</v-btn>
        <v-btn
          @click="submit"
          color="primary"
          raised
          :disabled="!valid"
        >
          Profil speichern
        </v-btn>
      </v-card-actions>

    </v-form>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Group, IUserProfileUpdate, UserGroup } from '@/interfaces';
import { readUserProfile } from '@/store/main/getters';
import { dispatchRouteLoggedIn, dispatchSetPrimaryGroupMe, dispatchUpdateUserProfile, dispatchUploadFile } from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import AvatarCropperDialog from '@/components/AvatarCropperDialog.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import UserGroupCard from '@/components/user-group/UserGroupCard.vue';
import { compareAsc } from 'date-fns';


@Component({
  components: {AvatarCropperDialog, UploadButton, EmployeeProfilePicture,VueTelInputVuetify, DatePickerMenu, UserGroupCard},
})
export default class UserProfileEdit extends Vue {
  public valid = true;
  public avatar: string | Blob | null = '';
  public inputAvatar: Blob | null = null;
  public fullName = '';
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
  public address = '';
  public highestProjectPosition = '';
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

  public created() {
    this.reset();
  }

  get userProfile() {
    return readUserProfile(this.$store);
  }

  public reset() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.fullName = userProfile.full_name;
      this.email = userProfile.email;
      this.birthdate = userProfile.birthdate;
      this.phonenumber = userProfile.phonenumber;
      this.entrydate = userProfile.entrydate;
      this.major = userProfile.major;
      this.university = userProfile.university;
      this.studylevel = userProfile.studylevel;
      this.district = userProfile.district;
      this.linkedin = userProfile.linkedin;
      this.gender = userProfile.gender;
      this.address = userProfile.address;
      this.highestProjectPosition = userProfile.highest_project_position;
      this.matriculationNumber = userProfile.matriculation_number;
      this.iban = userProfile.iban;
      this.bic = userProfile.bic;
      this.bank = userProfile.bank;
    }
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const updatedProfile: IUserProfileUpdate = {
        full_name: this.fullName,
        email: this.email,
        birthdate: this.birthdate,
        phonenumber: this.phonenumber,
        entrydate: this.entrydate,
        major: this.major,
        university: this.university,
        studylevel: this.studylevel,
        district: this.district,
        linkedin: this.linkedin,
        gender: this.gender,
        address: this.address,
        matriculation_number: this.matriculationNumber,
        highest_project_position: this.highestProjectPosition,
        iban: this.iban,
        bic: this.bic,
        bank: this.bank,
      };

      if(this.avatar) {
        const upload = await dispatchUploadFile(this.$store, {
          file: this.avatar,
        });
        updatedProfile.profile_picture = upload?.filename;
      }
      // explicitly set profile_picture to null
      // to remove current avatar
      if (this.avatar === null) {
        updatedProfile.profile_picture = '';
      }
      await dispatchUpdateUserProfile(this.$store, updatedProfile);
      await dispatchRouteLoggedIn(this.$store);
    }
  }

  get sortedGroups(): { [key: string]: UserGroup[] } {
    return this.userProfile?.groups
      .sort((a,b) => compareAsc(new Date(a.date_from), new Date(b.date_from)))
      .reduce((prev, curr) => {
        if(!prev[curr.group.type]){
          prev[curr.group.type] = []
        }
        prev[curr.group.type].push(curr)
        return prev;
      }, {}) as {[key: string]: UserGroup[]}
  }

  async setPrimaryGroup(group: Group) {
    await dispatchSetPrimaryGroupMe(this.$store, group.id);
  }

}


</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>
