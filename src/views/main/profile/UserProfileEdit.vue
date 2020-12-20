<template>
  <v-container>

    <avatar-cropper-dialog
      :input-avatar="inputAvatar"
      :value="inputAvatar"
      @avatar="onAvatarCropped"
      @close="inputAvatar = null"
    >
    </avatar-cropper-dialog>

    <v-alert
      v-if="!userProfile.full_name"
      color="cctGreen"
      border="left"
      type="info"
      text
      class="mb-10"
    >
      <b>Herzlich Willkommen</b> im Personalverwaltungs Tool! <br>
      Dein Account wurde soeben in unserem Benutzerverzeichnis angelegt.
      <b>Bitte fülle deine Daten hier aus</b>, bevor du mit dem Entdecken des PV-Tools starten kannst.<br>
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
        <h4 class="text-h4 text--primary mb-3">Profil</h4>
        <p class="text-body-2 text--secondary">Diese Informationen sind in deinem Profil sichtbar</p>
      </v-col>

      <v-col cols="12" md="8">
        <v-form
          v-model="valid"
          ref="form"
          lazy-validation
        >
          <v-text-field
            label="Full Name"
            v-model="fullName"
            class="input-lg"
            :rules="[v => !!v || 'Bitte gib deinen Namen an']"
            required
          ></v-text-field>
          <v-text-field
            label="E-mail"
            type="email"
            class="input-lg"
            v-model="email"
            disabled
          ></v-text-field>
          <v-text-field
            label="Geburtstag"
            type="date"
            v-model="birthdate"
            class="input-lg"
            required
            :rules="[v => !!v || 'Bitte gib dein Geburtstag an']"
          ></v-text-field>
          <vue-tel-input-vuetify
            label="Handynummer"
            v-model="phonenumber"
            class="input-lg"
            mode="international"
            default-country="DE"
            :preferred-countries="['DE', 'AT', 'CH', 'FR']"
            required
            :rules="[
              v => !!v || 'Bitte gib eine gültige Telefonnummer an',
              v => /^([0-9\(\)\/\+ \-]*)$/.test(v) || 'Bitte gib eine gültige Telefonnummer an']"
          ></vue-tel-input-vuetify>
          <v-select
            label="Mitgliedsstatus"
            v-model = "memberstatus"
            class="input-lg"
            required
            :items="memberstatusSelection"
            :rules="[v => !!v || 'Bitte gib deinen Mitgliedsstatus an']"
          ></v-select>
          <v-text-field
            label="Eingangsdatum"
            type = "date"
            v-model = "entrydate"
            class="input-lg"
            required
            :rules="[v => !!v || 'Bitte gib deinen Eintrittsdatum an']"
          ></v-text-field>
          <v-text-field
            label="Studiengang"
            v-model="major"
            class="input-lg"
            required
            :rules="[v => !!v || 'Bitte gib deinen Studiengang an']"
          ></v-text-field>
          <v-select
            label="Universität"
            v-model="university"
            :items="universitySelection"
            class="input-lg"
            required
            :rules="[v => !!v || 'Bitte gib deine Universität an']"
          ></v-select>
          <v-select
            label="Hochschulgrad des Studiums"
            v-model="studylevel"
            :items="studylevelSelection"
            class="input-lg"
            required
            :rules="[v => !!v || 'Bitte gib deinen Studienabschluss an']"
          ></v-select>
          <v-select
            label="Bezirk"
            v-model="district"
            class="input-lg"
            :items="districtSelection" 
            required
            :rules="[v => !!v || 'Bitte gib dein Bezirk an']"
          ></v-select>
          <v-text-field
            label="LinkedIn"
            v-model="linkedin"
            class="input-lg"
            required
            :rules="[v => !!v || 'Dies ist keine gültige URL']"
          ></v-text-field>
          <v-select
            v-model = "ressort"
            class="input-lg"
            :items="ressortSelection"
            label="Ressort"
            :rules="[v => !!v || 'Bitte gib dein Ressort an']"
          ></v-select>

        </v-form>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IUserProfileUpdate } from '@/interfaces';
import { readUserProfile } from '@/store/main/getters';
import {dispatchUpdateUserProfile, dispatchUploadFile} from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import AvatarCropperDialog from '@/components/AvatarCropperDialog.vue';
import {commitAddNotification} from '@/store/main/mutations';
import { RESSORTS, STUDYLEVELS, MEMBERSTATUS, BEZIRKE, UNIVERSITIES } from '@/common';

@Component({
  components: {AvatarCropperDialog, UploadButton, EmployeeProfilePicture,VueTelInputVuetify},
})
export default class UserProfileEdit extends Vue {
  public valid = true;
  public avatar: string | null = '';
  public inputAvatar = null;
  public fullName = '';
  public email = '';
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
  public ressortSelection = RESSORTS;
  public studylevelSelection = STUDYLEVELS;
  public memberstatusSelection = MEMBERSTATUS;
  public districtSelection = BEZIRKE;
  public universitySelection = UNIVERSITIES;

  public async onFileChanged(files: File[]) {
    const file = files[0];
    if (!file || file.size > 2 * 1024 * 1024) {
      commitAddNotification(this.$store, {content: 'Datei ist ungültig', color: 'red'});
      return;
    }
    const result: any = await new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onloadend = function(e) {
        resolve({
          fileName: file.name,
          result: e.target?.result,
          error: e.target?.error
        });
      };
      reader.readAsDataURL(file);
    });
    this.inputAvatar = result.result;
  }

  public onAvatarCropped(avatar) {
    this.avatar = avatar;
    this.inputAvatar = null;
  }

  public created() {
    const userProfile = readUserProfile(this.$store);
    if (userProfile) {
      this.fullName = userProfile.full_name;
      this.email = userProfile.email;
      this.birthdate = userProfile.birthdate;
      this.phonenumber = userProfile.phonenumber;
      this.memberstatus = userProfile.memberstatus;
      this.entrydate = userProfile.entrydate;
      this.major = userProfile.major;
      this.university = userProfile.university;
      this.studylevel = userProfile.studylevel;
      this.district = userProfile.district;
      this.linkedin = userProfile.linkedin;
      this.ressort = userProfile.ressort;
    }
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
      this.memberstatus = userProfile.memberstatus;
      this.entrydate = userProfile.entrydate;
      this.major = userProfile.major;
      this.university = userProfile.university;
      this.studylevel = userProfile.studylevel;
      this.district = userProfile.district;
      this.linkedin = userProfile.linkedin;
      this.ressort = userProfile.ressort;
    }
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const updatedProfile: IUserProfileUpdate = {};
      if (this.fullName) {
        updatedProfile.full_name = this.fullName;
      }
      if (this.email) {
        updatedProfile.email = this.email;
      }
      if (this.birthdate) {
        updatedProfile.birthdate = this.birthdate;
      }
      if (this.phonenumber) {
        updatedProfile.phonenumber = this.phonenumber;
      }
      if(this.memberstatus) {
        updatedProfile.memberstatus = this.memberstatus;
      }
      if(this.entrydate) {
        updatedProfile.entrydate = this.entrydate;
      }
      if(this.major) {
        updatedProfile.major= this.major;
      }
      if(this.university) {
        updatedProfile.university= this.university;
      }
      if(this.studylevel) {
        updatedProfile.studylevel= this.studylevel;
      }
      if(this.district) {
        updatedProfile.district = this.district;
      }
      if(this.linkedin) {
        updatedProfile.linkedin= this.linkedin;
      }
      if(this.ressort) {
        updatedProfile.ressort= this.ressort;
      }
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
      this.$router.push('/main/profile');
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
