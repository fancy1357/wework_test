import Vue from 'vue';
import App from './App.vue';

import router from './router.js';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios';
// axios.defaults.baseURL = '/api';
axios.defaults.baseURL = 'http://127.0.0.1:5000';
axios.interceptors.request.use(config => {
  console.log(config);
  config.Authorization = window.sessionStorage.getItem('token');
  return config;
});

Vue.prototype.$axios = axios;

import './assets/css/global.css';

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');