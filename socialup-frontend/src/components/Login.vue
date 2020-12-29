<template>
  <div class="contact-page-conent-aera" style="background-image: url('src/assets/img/background.jpg');">
      <div class="container login-box">
        <div class="row justify-content-center">
          <h2 class="weather-title"><img src="src/assets/img/logopink.png" class="black" alt="logo" style="height:70px;"></h2>
        </div>
        <div class="row justify-content-center">
          <div class="weather-descript">직접하는 마케팅 소셜업에 오신걸 환영합니다</div>
        </div>
        <div class="row md-layout">
          <b-form class="md-layout-item">
            <!-- <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
              <b-form-input id="exampleInput1" type="email" v-model="member.email" required placeholder="이메일"></b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
              <b-form-input id="exampleInput2" type="password" v-model="member.password" required placeholder="비밀번호" @keyup.enter="login"> </b-form-input>
            </b-form-group> -->
            <md-field>
              <label>아이디</label>
              <md-input v-model="member.email" type="email" @keyup.enter="login"></md-input>
              <span class="md-helper-text">이메일 형식을 입력해주세요.</span>
            </md-field>
            <md-field>
              <label>패스워드</label>
              <md-input v-model="member.password" type="password" @keyup.enter="login"></md-input>
              <span class="md-helper-text">6글자 이상 입력해주세요.</span>
            </md-field>
            <b-form-group>
              <div class="btn-wrapper">
                  <a href="javascript:void(0);" class="btn-boxed" @click="login" style="width: 100%;">로그인</a>
              </div>
            </b-form-group>
            <router-link :to="{ path: '/register', params: {} }" style="font-size:14px;">회원가입</router-link>
            <router-link :to="{ path: '/forget', params: {} }" style="font-size:14px; float:right;">비밀번호 찾기</router-link>
          </b-form>
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue'
import makeAxios from '../assets/js/weatherAxios'

export default {
  data() {
    return {
      member: {
        email: null,
        password: null
      }
    }
  },
  methods: {
    login() {
      // axios.post(`http://localhost:8080/api/auth`, this.member).then(result => {
      axios.post(`http://socialup.kr/api/auth`, this.member).then(result => {
        if (result.data) {
          this.$store.dispatch(`setAuth`, result.data);
          localStorage.setItem('auth', JSON.stringify(result.data));
          Vue.http = Vue.prototype.$http = makeAxios();
          this.$router.push('/');
          this.$http.get('api/member/whoami').then((result) => {
            if (result.data) {
              this.$store.dispatch('setMember', result.data);
            }
          });
        } else {
          alert('아이디 비밀번호가 일치하지 않습니다.');
        }
      }).catch((error) => {
        alert(error);
      })
    }
  }

}
</script>

<style lang="css" scoped="">
.weather-title {
  font-size: 24px;
  font-weight: 600;
  color: #f861a6;
}
.contact-page-conent-aera {
  min-height: 80vh;
}
.login-box {
  /* background-image: url('src/assets/img/marketing2.jpg'); */
  background-color: white;
  /* box-shadow: 1px 1px 1px 1px; */
  padding: 40px;
  max-width: 400px;
  box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
}
</style>
