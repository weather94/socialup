<template>
  <div class="centered-container">
    <!-- <md-button class="md-icon-button close-button" @click="close">
      <md-icon>close</md-icon>
    </md-button> -->
    <md-content class="md-elevation-3">
      <img src="@/assets/img/logopink.png">
      <div class="title">
        <div class="md-title">이제 내가 마케터다.</div>
        <div class="md-body-1">직접하는 소셜마케팅 소셜업에 오신걸 환영합니다!</div>
      </div>

      <div class="form">
        <md-field>
          <label>이메일</label>
          <md-input v-model="login.email" autofocus @keyup.enter="auth"></md-input>
        </md-field>

        <md-field md-has-password>
          <label>비밀번호</label>
          <md-input v-model="login.password" type="password" @keyup.enter="auth"></md-input>
        </md-field>
      </div>

      <div class="actions md-layout md-alignment-center-space-between">
        <div>
          <a href="javascript:void(0)" @click="open('http://socialup.kr/')">회원가입</a>
          &nbsp;&nbsp;&nbsp;
          <a href="javascript:void(0)" @click="open('http://socialup.kr/')">비밀번호 찾기</a>
        </div>
        <md-button class="md-raised weather-pink" @click="auth"><span class="weather-pink">로그인</span></md-button>
      </div>

      <div class="loading-overlay" v-if="loading">
        <md-progress-spinner md-mode="indeterminate" :md-stroke="2"></md-progress-spinner>
      </div>

      <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="errorShow" md-persistent>
        <span>{{ment}}</span>
        <md-button class="md-primary" @click="errorShow = false">닫기</md-button>
      </md-snackbar>

    </md-content>
    <img class="background" src="@/assets/img/background.jpg"/>
  </div>
</template>

<script>
// import axios from 'axios';
import Vue from 'vue';
import makeAxios from '@/assets/js/weatherAxios';
import windowHandler from '@/assets/js/windowHandler';

export default {
  name: 'App',
  data() {
    return {
      loading: false,
      errorShow: false,
      ment: '',
      login: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    open(link) {
      windowHandler.openBrowser(link);
    },
    close() {
      windowHandler.closeWindow();
    },
    auth() {
      // if (this.login.email.length < 1 || this.login.password.length < 1) {
      //   this.ment = '아이디 비밀번호를 입력해주세요';
      //   this.errorShow = true;
      //   return;
      // }
      // this.loading = true;

      const data = {
        name: 'test',
      };

      this.$store.dispatch('setAuth', data);
      localStorage.setItem('auth', JSON.stringify(data));
      Vue.http = Vue.prototype.$http = makeAxios();

      // axios.post('http://localhost:8080/api/auth', this.login).then((result) => {
      // axios.post('http://socialup.kr/api/auth', this.login).then((result) => {
      //   if (result.data) {
      //     this.$store.dispatch('setAuth', result.data);
      //     localStorage.setItem('auth', JSON.stringify(result.data));
      //     Vue.http = Vue.prototype.$http = makeAxios();
      //   } else {
      //     this.ment = '아이디 비밀번호가 일치하지 않습니다.';
      //     this.errorShow = true;
      //   }
      //   this.loading = false;
      // });
    },
  },
};
</script>

<style lang="scss">
.close-button {
  position: absolute !important;
  font-weight: 900;
  top: 10px;
  right: 10px;
}
.weather-pink {
  background-color: #fab1ce !important;
  font-weight: 700;
  color: white;
}
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  .title {
    text-align: center;
    margin-bottom: 30px;
    img {
      margin-bottom: 16px;
      max-width: 80px;
    }
  }
  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }
  .background {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: -10;
  }
  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
}
</style>
