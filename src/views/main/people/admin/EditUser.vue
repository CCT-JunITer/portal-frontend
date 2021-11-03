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

        <v-textarea
          label="Kommentar"
          class="input-lg"
          v-model="adminComment"
        >
        </v-textarea>

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
            :disabled="isEdit()"
            :rules="[$common.required]"
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
                        <li>SS16 - 25.05.2016</li>
                        <li>WS16/17 - 22.11.2016</li>
                        <li>SS17 - 10.05.2017</li>
                        <li>WS17/18 - 15.11.2017</li>
                        <li>SS18 - 08.05.2018</li>
                        <li>WS18/19 - 18.11.2018</li>
                        <li>SS19 - 18.05.2019</li>
                        <li>WS19/20 - 23.11.2019</li>
                        <li>SS20 - 6.6.2020</li>
                        <li>S20/21 - 28.11.2020</li>
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
                :rules="[v => !setPassword || v && v.length > 8 || 'Das Passwort muss mindestens 8 Zeichen lang sein']"
              >
              </v-text-field>
              <v-text-field
                v-show="setPassword"
                type="password"
                label="Confirm Password"
                class="input-lg"
                v-model="password2"
                :rules="[v => !setPassword || v === password1 || 'Die Passwörter stimmen nicht überein']"
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
    <v-divider class="my-5"></v-divider>
    <v-row>
      <v-col cols="12" md="4" class="px-5">
        <h4 class="text-h4 text--primary mb-3">Gruppen</h4>
        <p class="text-body-2 text--secondary">Gruppenzuweisung</p>
      </v-col>
      <v-col cols="12" md="8">

        <v-card-actions>
          <group-dialog :userProfile="userProfile"></group-dialog> 
          <delete-dialog :userProfile="userProfile" v-if="userProfile && !userProfile.is_alumni"></delete-dialog>
        </v-card-actions>
        <v-row v-if="userProfile">
          <v-col cols="12" v-for="group in userProfile.groups" :key="group.id">
            <user-group-card :group="group">
              <template v-slot:actions>
                <v-btn text small color="cctGreen" disabled>
                  <v-icon left>edit</v-icon>
                  Editieren
                </v-btn>
                <v-btn text small color="red" @click="removeFromGroup(group.group)">
                  <v-icon left>delete</v-icon>
                  Löschen
                </v-btn>
                <v-btn depressed small color="primary" @click="setPrimaryGroup(group.group)" v-if="!group.is_primary">
                  <v-icon left>mdi-account-check</v-icon>
                  primäre Gruppe für {{ group.group.type }} setzen
                </v-btn>
              </template>
            </user-group-card>
          </v-col> 
        </v-row>

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Group, IUserProfileCreate } from '@/interfaces';
import { dispatchGetGroups, dispatchUploadFile } from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import AvatarCropperDialog from '@/components/AvatarCropperDialog.vue';
import { dispatchCreateUser, dispatchGetAdminUsers, dispatchRemoveUserFromGroup, dispatchSetPrimaryGroup, dispatchUpdateUser } from '@/store/admin/actions';
import UserGroupCard from '@/components/user-group/UserGroupCard.vue';
import GroupDialog from './GroupDialog.vue';
import DeleteDialog from './DeleteDialog.vue';
import { readAdminOneUser } from '@/store/admin/getters';
import DatePickerMenu from '@/components/DatePickerMenu.vue';

@Component({
  components: {AvatarCropperDialog, UploadButton, EmployeeProfilePicture,VueTelInputVuetify, UserGroupCard, GroupDialog, DatePickerMenu, DeleteDialog},
})
export default class EditUser extends Vue {
  public valid = true;

  public addToGroupDialog = false;
  public group: Group | null = null;

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
  public gender = '';
  public adminComment? = '';
  public address = '';
  public highestProjectPosition = '';
  public matriculationNumber = '';
  public iban = '';
  public bic = '';
  public bank = '';


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
    await dispatchGetAdminUsers(this.$store);
    await dispatchGetGroups(this.$store);
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
      this.gender = this.userProfile.gender;
      this.adminComment = this.userProfile.admin_comment;
      this.address = this.userProfile.address;
      this.highestProjectPosition = this.userProfile.highest_project_position;
      this.matriculationNumber = this.userProfile.matriculation_number;
      this.iban = this.userProfile.iban;
      this.bic = this.userProfile.bic;
      this.bank = this.userProfile.bank;

    }
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const updatedProfile: IUserProfileCreate = {
        email: this.email,
        full_name: this.fullName,
        birthdate: this.birthdate,
        phonenumber: this.phonenumber,
        entrydate: this.entrydate,
        major: this.major,
        university: this.university,
        studylevel: this.studylevel,
        district: this.district,
        linkedin: this.linkedin,
        gender: this.gender,
        admin_comment: this.adminComment,
        address: this.address,
        matriculation_number: this.matriculationNumber,
        highest_project_position: this.highestProjectPosition,
        iban: this.iban,
        bic: this.bic,
        bank: this.bank,
      };

      if(this.avatar) {
        const uploadObject = await dispatchUploadFile(this.$store, {
          file: this.avatar,
        })
        updatedProfile.profile_picture = uploadObject?.filename;
      }
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

  async removeFromGroup(group: Group) {
    await dispatchRemoveUserFromGroup(this.$store, { userId: this.userProfile!.id, groupId: group.id });
  }

  async setPrimaryGroup(group: Group) {
    await dispatchSetPrimaryGroup(this.$store, { userId: this.userProfile!.id, groupId: group.id });
  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>
