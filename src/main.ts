// Import Component hooks before component definitions
import './component-hooks';
import Vue from 'vue';
import vuetify from './plugins/vuetify';
import './plugins/common-plugin';
import './plugins/doc-enum-plugin';
import App from './App.vue';
import router from './router';
import store from '@/store';
import wb from './registerServiceWorker';
import LoadingPage from './components/loading-cct/LoadingPage.vue';
Vue.prototype.$workbox = wb;
Vue.config.productionTip = false;

Vue.component('loading-page', LoadingPage);

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app');
