import Vue from 'vue'
import 'es6-promise/auto';
import VueRouter from 'vue-router'
import axios from 'axios';
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import makeAxios from './assets/js/weatherAxios'

import App from './App.vue'
import Main from './components/Main'
import Home from './components/Home'
import ReviewList from './components/ReviewList'
import Support from './components/Support'
import Register from './components/Register'
import Login from './components/Login'
import Forget from './components/Forget'
import InstagramProxyManage from './components/InstagramProxyManage'
import InstagramWorkManage from './components/InstagramWorkManage'
import Payment from './components/Payment'
import PaymentManage from './components/PaymentManage'
import AccountManage from './components/AccountManage'
import GhostManage from './components/GhostManage'
import Mypage from './components/Mypage'
import Service from './components/Service'
import ServiceProgram from './components/ServiceProgram'
import ServiceProxy from './components/ServiceProxy'
import ServiceUp from './components/ServiceUp'
import Terms from './components/Terms'
import Notice from './components/Notice'
import Coupon from './components/Coupon'
import Download from './components/Download'

import Dashboard from './components/Work/Dashboard'
import Play from './components/Work/Play'

import WorkLog from './components/Log/WorkLog'
import AccountLog from './components/Log/AccountLog'

import Mobile from './components/Mobile'
import MobileLogin from './components/Mobile/Login'
import MobileRegister from './components/Mobile/Register'
import MobileMypage from './components/Mobile/Mypage'
import MobileSupport from './components/Mobile/Support'
import MobilePlay from './components/Mobile/Play'
import MobileService from './components/Mobile/Service'
import MobileServiceProxy from './components/Mobile/ServiceProxy'

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

let instance = makeAxios();
Vue.http = Vue.prototype.$http = instance;

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

Vue.use(VueMaterial)

const routes = [
  {
    path: '/' ,
    component : Home,
    children: [
      { path: '/', component : Main},
      { path: '/reviews', component : ReviewList},
      { path: '/support', component : Support},
      { path: '/register', component : Register},
      { path: '/login', component : Login},
      { path: '/forget', component : Forget},
      { path: '/instagram-proxy-manage', component : InstagramProxyManage },
      { path: '/instagram-work-manage', component : InstagramWorkManage},
      { path: '/payment', component : Payment},
      { path: '/payment-manage', component : PaymentManage},
      { path: '/account-manage', component : AccountManage},
      { path: '/ghost-manage', component : GhostManage},
      { path: '/mypage', component : Mypage},
      { path: '/service', component : Service},
      { path: '/terms', component : Terms},
      { path: '/notice', component : Notice},
      { path: '/coupon', component : Coupon},
      { path: '/download', component : Download},
      { path: '/dashboard/:id', component : Dashboard, props: true},
      { path: '/play', component : Play},
      { path: '/service/program', component : ServiceProgram },
      { path: '/service/proxy', component : ServiceProxy },
      { path: '/service/up', component : ServiceUp },
      { path: '/worklog', component : WorkLog },
      { path: '/accountlog', component : AccountLog },
    ],
  },
  { 
    path: '/mobile', 
    component : Mobile,
    children: [
      { path: '/mobile', component : MobileLogin},
      { path: '/mobile/register', component : MobileRegister},
      { path: '/mobile/mypage', component : MobileMypage},
      { path: '/mobile/service', component : MobileService},
      { path: '/mobile/service/proxy', component : MobileServiceProxy},
      { path: '/mobile/support', component : MobileSupport},
      { path: '/mobile/play', component : MobilePlay},
      { path: '/mobile/dashboard/:id', component : Dashboard, props: true},
    ],
  },
]

Vue.use(BootstrapVue);
Vue.use(VueRouter);

const router = new VueRouter({
  mode : 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
