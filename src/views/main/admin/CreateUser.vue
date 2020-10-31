<template>
  <v-container fluid>
    <v-card class="ma-3 pa-3">
      <v-card-title primary-title>
        <div class="headline primary--text">Create User</div>
      </v-card-title>
      <v-card-text>
        <template>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field label="Full Name" v-model="fullName" required></v-text-field>
            <v-text-field label="E-mail" type="email" v-model="email" v-validate="'required|email'" data-vv-name="email" :error-messages="errors.collect('email')" required></v-text-field>
            <v-text-field label="Geburtstag" type = "date" v-model = "birthdate" required ></v-text-field>
            <v-text-field label="Handynummer" type = "number" v-model = "phonenumber" data-vv-name="mobile" required default-country-code="national_number" state="errors[0] ? false : (valid ? true : null)"   ></v-text-field>
            <v-text-field label="Memberstatus" type = "string" v-model = "memberstatus" required ></v-text-field>
            <v-text-field label="Eingangsdatum" type = "date" v-model = "entrydate" required ></v-text-field>
            <v-text-field label="Studiengang" v-model="major" required ></v-text-field>
            <v-text-field label="Universität" v-model="university"  required ></v-text-field>
            <v-text-field label="Studienabschluss" v-model="studylevel" required ></v-text-field>
            <v-text-field label="Bezirk" v-model="district" required  ></v-text-field>
            <v-text-field label="LinkedIn" v-model="linkedin" required  ></v-text-field>
            <v-combobox
                v-model = "ressort"
                :items="ressortSelection"
                :search-input.sync="search"
                hide-selected
                label="Ressort"
              ></v-combobox>
            <div class="subheading secondary--text text--lighten-2">User is superuser <span v-if="isSuperuser">(currently is a superuser)</span><span v-else>(currently is not a superuser)</span></div>
            <v-checkbox label="Is Superuser" v-model="isSuperuser"></v-checkbox>
            <div class="subheading secondary--text text--lighten-2">User is active <span v-if="isActive">(currently active)</span><span v-else>(currently not active)</span></div>
            <v-checkbox label="Is Active" v-model="isActive"></v-checkbox>
            <v-layout align-center>
              <v-flex>
                <v-text-field type="password" ref="password" label="Set Password" data-vv-name="password" data-vv-delay="100" v-validate="{required: true}" v-model="password1" :error-messages="errors.first('password')">
                </v-text-field>
                <v-text-field type="password" label="Confirm Password" data-vv-name="password_confirmation" data-vv-delay="100" data-vv-as="password" v-validate="{required: true, confirmed: 'password'}" v-model="password2" :error-messages="errors.first('password_confirmation')">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn @click="reset">Reset</v-btn>
        <v-btn @click="submit" :disabled="!valid">
              Save
            </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  IUserProfile,
  IUserProfileUpdate,
  IUserProfileCreate,
} from '@/interfaces';
import { dispatchCreateUser } from '@/store/admin/actions';
import {dispatchGetUsers} from '@/store/main/actions';

@Component
export default class CreateUser extends Vue {
  public valid = false;
  public fullName = '';
  public email = '';
  public isActive = true;
  public isSuperuser = false;
  public setPassword = false;
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
    public ressortSelection = ['Juniter','Public Affairs','Human Resources', 'Quality Management', 'International Networks'];


  public async mounted() {
    await dispatchGetUsers(this.$store);
    this.reset();
  }

  public reset() {
    this.password1 = '';
    this.password2 = '';
    this.fullName = '';
    this.email = '';
    this.birthdate = '';
    this.phonenumber = '';
    this.memberstatus = '';
    this.entrydate = '';
    this.major = '';
    this.university = '';
    this.studylevel = '';
    this.district = '';
    this.linkedin = '';
    this.ressort = '';
    this.isActive = true;
    this.isSuperuser = false;
    this.$validator.reset();

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
      if(this.linkedin) {
        updatedProfile.linkedin= this.linkedin;
      }
      if(this.ressort) {
        updatedProfile.ressort= this.ressort;
      }
      updatedProfile.is_active = this.isActive;
      updatedProfile.is_superuser = this.isSuperuser;
      updatedProfile.password = this.password1;
      await dispatchCreateUser(this.$store, updatedProfile);
      this.$router.push('/main/admin/users');
    }
  }
}
</script>
