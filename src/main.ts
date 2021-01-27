// Import Component hooks before component definitions
import './component-hooks';
import Vue from 'vue';
import vuetify from './plugins/vuetify';
import './plugins/common-plugin';
import App from './App.vue';
import router from './router';
import store from '@/store';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');
