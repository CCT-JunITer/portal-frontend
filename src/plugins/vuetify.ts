import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import '@fontsource/lato/900.css'; 
import '@fontsource/lato/400.css'; 
import '@fontsource/lato/300.css'; 
import Vuetify from 'vuetify';
import CCTIcon from '@/common/icons/cctIcon.vue';
import de from 'vuetify/lib/locale/de'
import DatetimePicker from 'vuetify-datetime-picker'


Vue.use(Vuetify);
Vue.use(DatetimePicker)

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
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        cctBlue: '#1D457C',
        cctPurple: '#762258',
        cctOrange: '#FF6400',
        cctGreen: '#3E8A83',
        cctLightGrey:'#a5a5a5',
        cctGrey:'#646464',
      },
    },
  },
});
