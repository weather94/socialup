import Vue from 'vue';
import Router from 'vue-router';
import Follow from '@/components/Follow';
import Friend from '@/components/Friend';
import Posting from '@/components/Posting';
import Dashboard from '@/components/Dashboard';
import Mypage from '@/components/Mypage';
import Log from '@/components/Log';
import InstagramLog from '@/components/InstagramLog';
import Analysis from '@/components/Analysis';
import Play from '@/components/Play';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'analysis',
      component: Analysis,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: Mypage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/follow',
      name: 'follow',
      component: Follow,
    },
    {
      path: '/friend',
      name: 'friend',
      component: Friend,
    },
    {
      path: '/posting',
      name: 'posting',
      component: Posting,
    },
    {
      path: '/log',
      name: 'log',
      component: Log,
    },
    {
      path: '/instagramlog',
      name: 'instagramlog',
      component: InstagramLog,
    },
    {
      path: '/play',
      name: 'play',
      component: Play,
    },
  ],
});
