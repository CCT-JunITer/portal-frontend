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
            :disabled="isEdit()"
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
          <v-dialog
            v-model="addToGroupDialog"
            persistent
            max-width="600px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="cctGreen" outlined v-on="on" v-attrs="attrs">
                <v-icon left>
                  mdi-plus
                </v-icon>
                Zu Gruppe hinzufügen
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Gruppe hinzufügen</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form lazy-validation ref="groupForm">
                    <v-alert outlined border="left" type="warning">
                      Vorhandene Gruppen des selben Typs werden gelöscht
                    </v-alert>
                    <v-select
                      label="Gruppe"
                      item-text="name"
                      return-object
                      v-model="group"
                      required
                      :rules="[$common.required]"
                      :items="groups">
                      <template v-slot:item="{ item, on, attrs}">
                        <v-list-item v-on="on" v-attrs="attrs" two-line>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ item.type }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-select>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red darken-1"
                  text
                  @click="addToGroupDialog = false"
                >
                  Abbrechen
                </v-btn>
                <v-btn
                  color="cctBlue darken-1"
                  text
                  @click="addToGroup()"
                >
                  Hinzufügen
                </v-btn>
              </v-card-actions>
            </v-card>  
          </v-dialog>
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
import { readAdminOneUser, readGroups } from '@/store/main/getters';
import { dispatchGetGroups, dispatchGetUsers, dispatchUploadFile } from '@/store/main/actions';
import EmployeeProfilePicture from '@/components/employee/EmployeeProfilePicture.vue';
import UploadButton from '@/components/UploadButton.vue';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue';
import AvatarCropperDialog from '@/components/AvatarCropperDialog.vue';
import { dispatchAddUserToGroup, dispatchCreateUser, dispatchRemoveUserFromGroup, dispatchUpdateUser } from '@/store/admin/actions';
import UserGroupCard from '@/components/user-group/UserGroupCard.vue';

@Component({
  components: {AvatarCropperDialog, UploadButton, EmployeeProfilePicture,VueTelInputVuetify, UserGroupCard},
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
      this.ressort = this.userProfile.ressort;
      this.isSuperuser = this.userProfile.is_superuser;
      this.isActive = this.userProfile.is_active;

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

  get groups() {
    return readGroups(this.$store)
      .filter(group => !this.userProfile?.active_groups.find(g => g.id === group.id))
  }

  async addToGroup() {
    if ((this.$refs.groupForm as HTMLFormElement).validate()) {
      await dispatchAddUserToGroup(this.$store, { userId: this.userProfile!.id, groupId: this.group!.id });
      this.addToGroupDialog = false;
    }
  }
  async removeFromGroup(group: Group) {
    await dispatchRemoveUserFromGroup(this.$store, { userId: this.userProfile!.id, groupId: group.id });
  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

@media #{map-get($display-breakpoints, 'md-and-up')}
  .input-lg
    max-width: 340px!important


</style>
