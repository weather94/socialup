<template>
  <nav class="navbar navbar-area navbar-expand-lg ">
    <div class="container">
      <router-link class="navbar-brand logo" :to="{ path: '/', params: {} }">
        <img src="http://socialup.kr/src/assets/img/logopink.png" class="black" alt="logo" style="height:50px;">
      </router-link>
      <div class="collapse navbar-collapse" id="apptidy">
        <ul class="navbar-nav" id="primary-menu">
          <li class="nav-item" v-if="authAndMobile">
            <router-link class="nav-link" :to="{ path: '/mobile', params: {} }">모바일 관리 페이지</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/', params: {} }">메인</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/service', params: {} }">서비스</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/reviews', params: {} }">리뷰</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ path: '/support', params: {} }">고객센터</router-link>
          </li>
          <li class="nav-item" v-if="!this.$store.state.member.member">
            <router-link class="nav-link" :to="{ path: '/register', params: {} }">회원가입</router-link>
          </li>
          <li class="nav-item" v-if="!this.$store.state.member.member">
            <router-link class="nav-link" :to="{ path: '/login', params: {} }">로그인</router-link>
          </li>
          <li class="nav-item dropdown" v-if="this.$store.state.member.member">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">마이페이지</a>
            <div class="dropdown-menu" >
              <router-link class="dropdown-item" :to="{ path: '/mypage', params: {} }">내 정보</router-link>
              <router-link class="dropdown-item" v-if="this.$store.state.member.member && this.$store.state.member.member.periods.manage"
                :to="{ path: '/download', params: {} }">프로그램 다운로드</router-link>
              <router-link class="dropdown-item" :to="{ path: '/play', params: {} }">내 계정 관리</router-link>
            </div>
          </li>
          <li class="nav-item dropdown" v-if="this.$store.state.member.member && this.$store.state.member.member.grade >= 10">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">관리자페이지</a>
            <div class="dropdown-menu" >
              <router-link class="dropdown-item" :to="{ path: '/payment-manage', params: {} }">결제관리</router-link>
              <router-link class="dropdown-item" :to="{ path: '/account-manage', params: {} }">유저관리</router-link>
              <router-link class="dropdown-item" :to="{ path: '/instagram-work-manage', params: {} }">INSTAGRAM_WORK</router-link>
              <router-link class="dropdown-item" :to="{ path: '/instagram-proxy-manage', params: {} }">INSTAGRAM_PROXY</router-link>
              <router-link class="dropdown-item" :to="{ path: '/ghost-manage', params: {} }">유령관리</router-link>
              <router-link class="dropdown-item" :to="{ path: '/coupon', params: {} }">쿠폰관리</router-link>
              <router-link class="dropdown-item" :to="{ path: '/worklog', params: {} }">WORK_LOG</router-link>
              <router-link class="dropdown-item" :to="{ path: '/accountlog', params: {} }">ACCOUNT_LOG</router-link>
              <router-link class="dropdown-item" :to="{ path: '/mobile', params: {} }">모바일 페이지</router-link>
            </div>
          </li>
          <li class="nav-item" v-if="this.$store.state.member.member">
            <a class="nav-link" href="javascript:void(0)" @click="logout">로그아웃</a>
          </li>
        </ul>
      </div>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#apptidy" aria-controls="apptidy" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>
  </nav>
</template>

<script>
import Vue from 'vue';
import makeAxios from '../assets/js/weatherAxios';

export default {
  computed: {
    authAndMobile() {
      if (this.$store.state.member.member && navigator.userAgent.includes('Mobile')) {
        return true;
      }
      return false;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('clearMember');
      this.$store.dispatch('clearAuth');
      localStorage.removeItem('auth');
      this.$router.push('/');
      Vue.http = Vue.prototype.$http = makeAxios();
    },
  },
}
</script>

<style lang="css">
.navbar{
  box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
}
</style>
