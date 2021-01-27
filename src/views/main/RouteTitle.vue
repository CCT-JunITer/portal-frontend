<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class RouteTitle extends Vue {

  render() {
    this.updateTitle();
    return null;
  }

  updateTitle() {
    let title = '';
    for (const record of [...this.$route.matched].reverse()) {
      if (record.meta.title) {
        const metaTitle = record.meta.title;
        if (typeof metaTitle === 'string') {
          title = metaTitle;
        }
        if (typeof metaTitle === 'function') {
          title = metaTitle(this.$route, this.$store);
        }
        break;
      }
    }
    return document.title = `${title} | CCT e.V. Portal`;
  }

}

</script>

<style>

</style>