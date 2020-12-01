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
            required
            class="input-lg"
          ></v-text-field>
          <v-text-field
            label="E-mail"
            type="email"
            class="input-lg"
            v-model="email"
            v-validate="'required|email'"
            data-vv-name="email"
            :error-messages="errors.collect('email')"
            required
          ></v-text-field>
          <v-text-field
            label="Geburtstag"
            type = "date"
            v-model = "birthdate"
            class="input-lg"
            required
          ></v-text-field>
          <vue-tel-input-vuetify
            label="Handynummer"
            type = "number"
            v-model = "phonenumber"
            class="input-lg"
            mode="international"
            data-vv-name="mobile"
            required
            default-country="de"
            :state="errors[0] ? false : (valid ? true : null)"
          ></vue-tel-input-vuetify>
          <v-combobox
            label="Memberstatus"
            v-model = "memberstatus"
            class="input-lg"
            required
            :items="memberstatusSelection"
          ></v-combobox>
          <v-text-field
            label="Eingangsdatum"
            type = "date"
            v-model = "entrydate"
            class="input-lg"
            required
          ></v-text-field>
          <v-text-field
            label="Studiengang"
            v-model="major"
            class="input-lg"
            required
          ></v-text-field>
          <v-text-field
            label="Universität"
            v-model="university"
            class="input-lg"
            required
          ></v-text-field>
          <v-combobox
            label="Studienabschluss"
            v-model="studylevel"
            :items="studylevelSelection"
            class="input-lg"
            required
          ></v-combobox>
          <v-combobox
            label="Bezirk"
            v-model="district"
            class="input-lg"
            :items="districtSelection" 
            required
          ></v-combobox>
          <v-text-field
            label="LinkedIn"
            v-model="linkedin"
            class="input-lg"
            required
          ></v-text-field>
          <v-combobox
            v-model = "ressort"
            class="input-lg"
            :items="ressortSelection"
            label="Ressort"
          ></v-combobox>
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
                data-vv-name="password"
                class="input-lg"
                data-vv-delay="100"
                v-validate="{required: setPassword}"
                v-model="password1"
                :error-messages="errors.first('password')"
              >
              </v-text-field>
              <v-text-field
                v-show="setPassword"
                type="password"
                label="Confirm Password"
                data-vv-name="password_confirmation"
                class="input-lg"
                data-vv-delay="100"
                data-vv-as="password"
                v-validate="{required: setPassword, confirmed: 'password'}"
                v-model="password2"
                :error-messages="errors.first('password_confirmation')"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IUserProfileCreate, IUserProfileUpdate } from '@/interfaces';
import { readUserProfile } from '@/store/main/getters';
import {dispatchUpdateUserProfile, dispatchUploadFile} from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import AvatarCropperDialog from '@/components/AvatarCropperDialog.vue';
import {commitAddNotification} from '@/store/main/mutations';
import { dispatchCreateUser, dispatchUpdateUser } from '@/store/admin/actions';
import {readAdminOneUser} from '@/store/main/getters';
import {dispatchGetUsers} from '@/store/main/actions';
import { RESSORTS } from '@/common';
import {STUDYLEVELS} from '@/common';
import { MEMBERSTATUS } from '@/common';
import { BEZIRKE } from '@/common';

@Component({
  components: {AvatarCropperDialog, UploadButton, EmployeeProfilePicture,VueTelInputVuetify},
})
export default class EditUser extends Vue {
  public valid = true;

  // profile fields
  public avatar: string | null = null;
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


  public ressortSelection = RESSORTS;
  public studylevelSelection = STUDYLEVELS;
  public memberstatusSelection = MEMBERSTATUS;
  public districtSelection = BEZIRKE; 

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
    this.$validator.reset();
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
    if (await this.$validator.validateAll()) {
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
        updatedProfile.profile_picture = await dispatchUploadFile(this.$store, {
          file: this.avatar,
          email: updatedProfile.email || this.userProfile!.email,
        })
      }
      updatedProfile.is_active = this.isActive;
      updatedProfile.is_superuser = this.isSuperuser;
      updatedProfile.ressort = this.ressort;
      if (this.setPassword) {
        updatedProfile.password = this.password1;
      }
      if(this.userProfile?.id){
        await dispatchUpdateUser(this.$store, { id: this.userProfile!.id, user: updatedProfile });
      } else {
        await dispatchCreateUser(this.$store, updatedProfile);
      }
      this.$router.push('/main/admin/users');
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
