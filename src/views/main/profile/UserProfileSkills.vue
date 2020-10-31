<template>
  <div>
    Skills
  </div>
</template>


<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {readAdminOneUser, readUserProfile} from '@/store/main/getters';

@Component({})
export default class UserProfileSkills extends Vue {

  get isMe() {
    const id = this.$route.params.id;
    return id === 'me';
  }

  get userProfile() {
    if (this.isMe) {
      return readUserProfile(this.$store);
    }
    const id = this.$route.params.id;
    return readAdminOneUser(this.$store)(parseInt(id));
  }



}
</script>
