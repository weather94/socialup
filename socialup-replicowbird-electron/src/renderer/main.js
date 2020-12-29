/* eslint-disable */
import Vue from 'vue';
import { remote } from 'electron'

import App from './App';
import router from './router';
import store from './store';
import makeAxios from '@/assets/js/weatherAxios'

import electron from 'electron';

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Date.prototype.toLocaleDateString = function() {
  const month = this.getMonth() + 1;
  const day = this.getDate(); 
  return `${this.getYear() + 1900}-${(month < 10) ? '0' + month : month}-${(day < 10) ? '0' + day : day}`;
}

Date.prototype.toLocaleTimeString = function() {
  const hour = this.getHours();
  const minute = this.getMinutes();
  const second = this.getSeconds(); 
  return `${(hour < 10) ? '0' + hour : hour}:${(minute < 10) ? '0' + minute : minute}:${(second < 10) ? '0' + second : second}`;
}

// const id = electron.remote.powerSaveBlocker.start('prevent-display-sleep')
const id = electron.remote.powerSaveBlocker.start('prevent-app-suspension');

Vue.use(VueMaterial)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;
Vue.http = Vue.prototype.$http = makeAxios();

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
})

window.addEventListener('beforeunload', () => {
  remote.globalShortcut.unregisterAll()
})
