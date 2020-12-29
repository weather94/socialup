<template>
  <div class="page-container">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <md-app class="weather-tmargin-64">
      <md-app-toolbar class="weather-pink navbar md-layout" md-elevation="0">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <img src="@/assets/img/logogray.png" alt="" style="height: 45px; margin-left: 15px;">
        <div class="md-layout-item" style="text-align: right;">
          <a href="javascript:void(0);" v-if="$props.version !== $props.lastVersion" @click="updateVersion" style="color: black;">
            <span style="font-weight: 400; font-size:13px;">최신버전 업데이트</span><span style="font-weight: 400;">{{` v${$props.lastVersion}`}}</span><br>
          </a>
          <span style="font-weight: 400; font-size:13px;">현재버전</span><span style="font-weight: 400;">{{` v${$props.version}`}}</span><br>
        </div>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible" md-permanent="clipped" md-persistent="mini">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>SOCIAL UP</span>
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>
        <md-list>
          <md-list-item @click="route('/dashboard')" :style="selectedPage === '/dashboard' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>insert_chart</md-icon>
            <md-tooltip md-direction="top">대시보드</md-tooltip>
            <span class="md-list-item-text">대시보드</span>
          </md-list-item>
          <md-list-item @click="route('ghost')" :style="selectedPage === 'ghost' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>face</md-icon>
            <md-tooltip md-direction="top">고스트</md-tooltip>
            <span class="md-list-item-text">고스트</span>
          </md-list-item>
          <md-list-item @click="route('extractuser')" :style="selectedPage === 'extractuser' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>move_to_inbox</md-icon>
            <md-tooltip md-direction="top">유저추출</md-tooltip>
            <span class="md-list-item-text">유저추출</span>
          </md-list-item>
          <md-list-item @click="route('proxypage')" :style="selectedPage === '/proxypage' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>polymer</md-icon>
            <md-tooltip md-direction="top">프록시페이지</md-tooltip>
            <span class="md-list-item-text">프록시페이지</span>
          </md-list-item>
          <md-list-item @click="route('posting')" :style="selectedPage === '/posting' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>add_to_photos</md-icon>
            <md-tooltip md-direction="top">포스팅</md-tooltip>
            <span class="md-list-item-text">포스팅</span>
          </md-list-item>
          <md-list-item @click="route('etc')" :style="selectedPage === '/etc' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>stars</md-icon>
            <md-tooltip md-direction="top">잡기술</md-tooltip>
            <span class="md-list-item-text">잡기술</span>
          </md-list-item>
          <md-list-item @click="route('watchpage')" :style="selectedPage === '/watchpage' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>move_to_inbox</md-icon>
            <md-tooltip md-direction="top">시계페이지</md-tooltip>
            <span class="md-list-item-text">시계페이진</span>
          </md-list-item>
          
          <md-list-item @click="test">
            <md-icon>move_to_inbox</md-icon>
            <md-tooltip md-direction="top">테스트</md-tooltip>
            <span class="md-list-item-text">테스트</span>
          </md-list-item>
          <md-divider></md-divider>
        </md-list>

        <md-list>
          <md-list-item @click="route('mypage')" :style="selectedPage === 'mypage' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>account_circle</md-icon>
            <md-tooltip md-direction="top">마이페이지</md-tooltip>
            <span class="md-list-item-text">마이페이지</span>
          </md-list-item>
          <md-list-item @click="logoutConfirm = true">
            <md-icon>cancel</md-icon>
            <md-tooltip md-direction="top">로그아웃</md-tooltip>
            <span class="md-list-item-text">로그아웃</span>
          </md-list-item>
          
          <md-divider></md-divider>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>

    <md-dialog-confirm
      :md-active.sync="logoutConfirm"
      md-title="소셜업"
      :md-click-outside-to-close="true"
      md-content="로그아웃 하시겠습니까?"
      md-confirm-text="로그아웃"
      md-cancel-text="취소"
      @md-cancel="logoutConfirm = false"
      @md-confirm="logout" />

    <md-snackbar md-position="center" :md-duration="5000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarMent}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">닫기</md-button>
    </md-snackbar>
  </div>
</template>

<script>
/* eslint-disable */
import windowHandler from '@/assets/js/windowHandler';
import * as _ from 'lodash';
import Test from '@/assets/js/Test2';
// import fs from 'fs';
// import cp from 'child_process';

export default {
  props: ['version', 'lastVersion'],
  data: () => ({
    menuVisible: false,
    selectedPage: '/',
    showSnackbar: false,
    snackbarMent: '',
    logoutConfirm: false,
  }),
  mounted() {
    this.$http.get('api/member/whoami').then((response) => {
      if (response.data) {
        this.$store.dispatch('setMember', response.data);
      } else {
        this.$store.dispatch('clearAuth');
        this.$store.dispatch('clearMember');
      }
    });
  },
  methods: {
    updateVersion() {
      this.$root.$emit('updateVersion');
    },
    open(url) {
      windowHandler.openBrowser(url);
    },
    logout() {
      localStorage.removeItem('auth');
      this.$store.dispatch('clearAuth');
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    route(path) {
      this.selectedPage = path;
      this.$router.push(path);
    },
    test() {
      Test(this.$store, this.$http);
    },
  },
};
</script>

<style lang="scss" scoped>
  @media (max-width: 960px) {
    .md-toolbar, .md-toolbar-row {
      min-height: 64px !important;
    }
  }
  .weather-tmargin-64 {
    margin-top: 64px;
  }
  .navbar {
    position: fixed;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
  }
  .close-button {
    position: absolute;
    font-weight: 900;
    top: 10px;
    right: 10px;
  }
  .fa {
    text-align: center;
  }
  .weather-pink {
    background-color: #fab1ce !important;
  }
  .md-app {
    min-height: 550px;
    border: 1px solid rgba(#000, .12);
  }

   // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    border: unset !important;
  }
</style>
