<template>
  <div class="mobile-login login-background" style="background-image: url('../src/assets/img/background.jpg');">
    <div class="mobile-login-elem">
      <div class="md-layout md-alignment-center-center" style="padding-top: 50px;">
        <h2 class="weather-title"><img src="../../assets/img/logogray.png" class="black" alt="logo" style="height:70px;"></h2>
      </div>
      <div class="md-layout md-alignment-center-center">
        <div class="weather-descript">직접하는 마케팅 소셜업에 오신걸 환영합니다</div>
      </div>
      <div class="md-layout md-alignment-center-center">
        <b-form>
          <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
            <b-form-input id="exampleInput1" type="email" v-model="member.email" required placeholder="이메일"></b-form-input>
          </b-form-group>
          <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
            <b-form-input id="exampleInput2" type="password" v-model="member.password" required placeholder="비밀번호" @keyup.enter="login"> </b-form-input>
          </b-form-group>
          <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
            <div class="btn-wrapper">
                <a href="javascript:void(0);" class="btn-boxed" @click="login" style="width: 100%;">로그인</a>
            </div>
          </b-form-group>
          <router-link :to="{ path: '/mobile/register', params: {} }" style="font-size:14px;">회원가입</router-link>
          <a href="javascript:alert('관리자에게 문의해주세요.');" style="font-size:14px; float:right;">비밀번호 찾기</a>
        </b-form>
      </div>
    </div>
    <!-- <div class="login-background" style="background-image: url('../src/assets/img/background.jpg');"></div> -->
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue'
import makeAxios from '../../assets/js/weatherAxios'

export default {
  data() {
    return {
      member: {
        email: null,
        password: null
      }
    }
  },
  mounted() {
    if (this.$store.state.member.member) {
      this.$router.push('/mobile/play');
    }
    this.$store.watch((state) => {
      return state.member.member;
    }, () => {
      if (this.$store.state.member.member) {
        this.$router.push('/mobile/play');
      }
    });
  },
  methods: {
    login() {
      // axios.post(`http://localhost:8080/api/auth`, this.member).then(result => {
      axios.post(`http://socialup.kr/api/auth`, this.member).then(result => {
        if (result.data) {
          this.$store.dispatch(`setAuth`, result.data);
          localStorage.setItem('auth', JSON.stringify(result.data));
          Vue.http = Vue.prototype.$http = makeAxios();
          this.$router.push('/mobile/play');
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
.weather-descript{
  margin-bottom: 40px;
}
.weather-title {
  font-size: 24px;
  font-weight: 600;
  color: #f861a6;
}
.login-background {
  /* position: fixed; */
  z-index: 0;
  height: 100%;
  top: 0%;
  width: 100%;
  min-height: 100vh;
}
.login-box {
  /* background-image: url('src/assets/img/marketing2.jpg'); */
  background-color: white;
  /* box-shadow: 1px 1px 1px 1px; */
  padding: 40px;
  width: 400px;
  box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
}
</style>
