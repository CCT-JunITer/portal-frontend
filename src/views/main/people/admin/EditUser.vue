<template>
  <v-container>

    <avatar-cropper-dialog
      :input-avatar="inputAvatar"
      :value="inputAvatar"
      @avatar="onAvatarCropped"
      @close="inputAvatar = null"
    >
    </avatar-cropper-dialog>

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
            :rules="[$common.required]"
            required
          ></v-text-field>
          <v-text-field
            label="E-mail"
            type="email"
            class="input-lg"
            v-model="email"
            disabled
            :rules="[$common.required]"
          ></v-text-field>
          <v-text-field
            label="Geburtstag"
            type="date"
            v-model="birthdate"
            class="input-lg"
            required
            :rules="[$common.required]"
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
              $common.required,
              v => /^([0-9\(\)\/\+ \-]*)$/.test(v) || 'Dies ist keine gültige Telefonnummer']"
          ></vue-tel-input-vuetify>
          <v-select
            label="Mitgliedsstatus"
            v-model = "memberstatus"
            class="input-lg"
            required
            :items="$common.MEMBERSTATUS"
            :rules="[$common.required]"
          ></v-select>
          <v-text-field
            label="Eingangsdatum"
            type = "date"
            v-model = "entrydate"
            class="input-lg"
            required
            :rules="[$common.required]"
          ></v-text-field>
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
          <v-select
            v-model = "ressort"
            class="input-lg"
            :items="$common.RESSORTS"
            label="Ressort"
            :rules="[$common.required]"
          ></v-select>
          <div class="subheading secondary--text text--lighten-2">User is superuser <span v-if="isSuperuser">(currently is a superuser)</span><span v-else>(currently is not a superuser)</span></div>
          <v-checkbox
            label="Is Superuser"
            v-model="isSuperuser"
          ></v-checkbox>
          <div class="subheading secondary--text text--lighten-2">User is active <span v-if="isActive">(currently active)</span><span v-else>(currently not active)</span></div>
          <v-checkbox
            label="Is Active"
            v-model="isActive"
          ></v-checkbox>
          <v-layout align-center>
            <v-flex shrink v-if="isEdit()">
              <v-checkbox
                v-model="setPassword"
                class="mr-2"
              ></v-checkbox>
            </v-flex>
            <v-flex>
              <v-text-field
                :disabled="!setPassword"
                type="password"
                ref="password"
                label="Set Password"
                class="input-lg"
                v-model="password1"
                :rules="[v => v && v.length > 8 || 'Das Passwort muss mindestens 8 Zeichen lang sein']"
              >
              </v-text-field>
              <v-text-field
                v-show="setPassword"
                type="password"
                label="Confirm Password"
                class="input-lg"
                v-model="password2"
                :rules="[v => v === password1 || 'Die Passwörter stimmen nicht überein']"
              >
              </v-text-field>
            </v-flex>
          </v-layout>

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
import { IUserProfileCreate } from '@/interfaces';
import { readAdminOneUser } from '@/store/main/getters';
import { dispatchGetUsers, dispatchUploadFile } from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import AvatarCropperDialog from '@/components/AvatarCropperDialog.vue';
import { dispatchCreateUser, dispatchUpdateUser } from '@/store/admin/actions';

@Component({
  components: {AvatarCropperDialog, UploadButton, EmployeeProfilePicture,VueTelInputVuetify},
})
export default class EditUser extends Vue {
  public valid = true;

  // profile fields
  public avatar: string | Blob | null = '';
  public inputAvatar: Blob | null = null;
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
  public isActive = true;
  public isSuperuser = false;
  public password1 = '';
  public password2 = '';

  private password = false;

  public set setPassword(value) {
    this.password = value;
  }

  public get setPassword() {
    return this.password || !this.isEdit();
  }


  public async onFileChanged(files: File[]) {
    this.inputAvatar = files[0];
  }

  public onAvatarCropped(avatar: Blob | null) {
    this.avatar = avatar;
    this.inputAvatar = null;
  }

  public isEdit() {
    return !!this.userProfile?.id;
  }

  public created() {
    this.reset();
  }

  public async mounted() {
    await dispatchGetUsers(this.$store);
    this.reset();
  }

  public reset() {
    this.setPassword = false;
    this.password1 = '';
    this.password2 = '';
    if (this.userProfile) {
      this.fullName = this.userProfile.full_name;
      this.email = this.userProfile.email;
      this.birthdate = this.userProfile.birthdate;
      this.phonenumber = this.userProfile.phonenumber;
      this.memberstatus = this.userProfile.memberstatus;
      this.entrydate = this.userProfile.entrydate;
      this.major = this.userProfile.major;
      this.university = this.userProfile.university;
      this.studylevel = this.userProfile.studylevel;
      this.district = this.userProfile.district;
      this.linkedin = this.userProfile.linkedin;
      this.ressort = this.userProfile.ressort;
    }
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const updatedProfile: IUserProfileCreate = {
        email: this.email,
      };
      if (this.fullName) {
        updatedProfile.full_name = this.fullName;
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
        const uploadObject = await dispatchUploadFile(this.$store, {
          file: this.avatar,
        })
        updatedProfile.profile_picture = uploadObject?.filename;
      }
      updatedProfile.is_active = this.isActive;
      updatedProfile.is_superuser = this.isSuperuser;
      updatedProfile.ressort = this.ressort;
      if (this.setPassword) {
        updatedProfile.password = this.password1;
      }
      if (this.userProfile?.id) {
        await dispatchUpdateUser(this.$store, { id: this.userProfile?.id, user: updatedProfile });
      } else {
        await dispatchCreateUser(this.$store, updatedProfile);
      }
      this.$router.push('/main/people/admin/users');
    }
  }

  get userProfile() {
    return readAdminOneUser(this.$store)(+this.$router.currentRoute.params.id);
  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>
