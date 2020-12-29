import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import Ghost from '@/components/Ghost';
import ExtractUser from '@/components/ExtractUser';
import ProxyPage from '@/components/ProxyPage';
import WatchPage from '@/components/WatchPage';
import Posting from '@/components/Posting';
import ETC from '@/components/ETC';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/ghost',
      name: 'ghost',
      component: Ghost,
    },
    {
      path: '/extractuser',
      name: 'extractuser',
      component: ExtractUser,
    },
    {
      path: '/proxypage',
      name: 'proxypage',
      component: ProxyPage,
    },
    {
      path: '/watchpage',
      name: 'watchpage',
      component: WatchPage,
    },
    {
      path: '/posting',
      name: 'posting',
      component: Posting,
    },
    {
      path: '/etc',
      name: 'etc',
      component: ETC,
    },
  ],
});
