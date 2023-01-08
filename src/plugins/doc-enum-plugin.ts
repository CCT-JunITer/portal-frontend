import Vue from 'vue';
import { readOneDocEnum } from '@/store/main/getters';

function text(this: Vue, name: string, value?: string) {
  const enums = readOneDocEnum(this.$store)(name)
  return enums.find(e => e.value === value)?.text;
}

function getEnums(this: Vue, name: string) {
  const enums = readOneDocEnum(this.$store)(name)
  return enums;
}

const DocEnumPlugin = {
  install: function (Vue) {
    Vue.prototype.$enum = text;
    Vue.prototype.$enums = getEnums;
  }
};


Vue.use(DocEnumPlugin);


declare module 'vue/types/vue' {
  interface Vue {
    $enum: typeof text;
    $enums: typeof getEnums;
  }
}
