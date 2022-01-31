import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import '@fontsource/roboto/900.css'; 
import '@fontsource/roboto/500.css'; 
import '@fontsource/roboto/400.css'; 
import '@fontsource/roboto/300.css'; 
import Vuetify from 'vuetify';
import CCTIcon from '@/common/icons/cctIcon.vue';
import de from 'vuetify/lib/locale/de'


Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { de },
    current: 'de'
  },
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
        cctOrange: '#FF6400',
        cctGreen: '#3E8A83',
        cctLightGrey:'#a5a5a5',
        cctGrey:'#646464',
      },
    },
  },
});
