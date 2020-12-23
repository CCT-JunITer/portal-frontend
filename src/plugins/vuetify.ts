import Vue from 'vue';
import Vuetify from 'vuetify';
import { colors } from 'vuetify/lib';
import CCTIcon from '@/common/icons/cctIcon.vue';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: {
      cct: {
        component: CCTIcon
      }
    }
  },
  theme:{
    themes: {
      light: {
        cctBlue: '#1e467d',
        cctOrange: 'FF6400',
        cctGreen: '#3E8A83',
        cctLightGrey:'a5a5a5',
        cctGrey:'646464',
      },
    },
  },
});
