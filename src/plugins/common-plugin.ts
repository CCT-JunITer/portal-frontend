import Vue from 'vue';
import * as common from '@/common';


const ConstantPlugin = {
  install: function (Vue) {
    Vue.prototype.$common = common;
  }
};


Vue.use(ConstantPlugin);


declare module 'vue/types/vue' {
  interface Vue {
    $common: typeof common;
  }
}
