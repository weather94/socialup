<template>
  <div class="register-wrapper" style="background-image: url('../src/assets/img/background.jpg');">
      <div class="container" style="padding: 30px;">
        <div class="row justify-content-center">
          <h4 class="title">회원가입</h4>
        </div>
        <div class="row justify-content-center">
          <b-form>
            <b-form-group id="exampleInputGroup1" label-for="exampleInput1"
                description="인증메일이 발송 되므로 정확히 입력해주세요." :state="check.email" :invalid-feedback="mention.email">
              <b-form-input id="exampleInput1" v-model="member.email" :state="check.email" @change="checkEmail" type="email" required placeholder="이메일"></b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
              <b-form-input id="exampleInput2" type="password" v-model="member.password" :state="check.pw" @change="checkPassword" required placeholder="비밀번호"> </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup3" label-for="exampleInput3" description="비밀번호는 6글자 이상 입력해주세요." :state="check.pw" :invalid-feedback="mention.pw">
              <b-form-input id="exampleInput3" type="password" v-model="member.password2" :state="check.pw" @change="checkPassword" required placeholder="비밀번호 확인"> </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup4" label-for="exampleInput4">
              <b-form-input id="exampleInput4" v-model="member.name" type="text" required placeholder="이름"> </b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup5" label-for="exampleInput5">
              <b-form-input id="exampleInput5" v-model="member.contact" type="text" required placeholder="연락처"> </b-form-input>
            </b-form-group>
          </b-form>
          <div>
            <b-form-group id="exampleInputGroup6">
              <b-form-checkbox id="checkbox1" v-model="check.checkbox1"><a href="/terms" target="_blank">약관</a>에 동의합니다.</b-form-checkbox>
            </b-form-group>
            <b-form-group id="exampleInputGroup7">
              <b-form-checkbox id="checkbox2" v-model="check.checkbox2"><a href="/terms" target="_blank">개인정보처리 방침</a>에 동의합니다.</b-form-checkbox>
            </b-form-group>
          </div>
          <div>
            <md-button type="button" class="md-primary md-raised" @click="register">회원가입</md-button>
            <md-button type="button" class="md-accent md-raised" @click="router('/mobile')">취소</md-button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      member: {
        email: '',
        password: '',
        password2: '',
        name: '',
        contact: '',
      },
      check: {
        checkbox1: false,
        checkbox2: false,
        email: false,
        pw: false
      },
      mention: {
        pw: '',
        email: ''
      }
    }
  },
  methods: {
    router(route) {
      this.$router.push(route);
    },
    register() {
      if (this.check.email !== true) {
        alert('이메일을 제대로 입력해 주세요.');
      } else if (this.check.pw !== true) {
        alert('비밀번호를 제대로 입력해 주세요.');
      } else if (this.member.name === '') {
        alert('이름을 입력해 주세요.');
      } else if (this.member.contact === '') {
        alert('연락처를 제대로 입력해 주세요.');
      } else if (this.member.contact === '') {
        alert('비밀번호를 제대로 입력해 주세요.');
      } else if (!this.check.checkbox1) {
        alert('약관에 동의해 주세요.');
      } else if (!this.check.checkbox2) {
        alert('개인정보처리방침에 동의해 주세요.');
      } else {
        this.$http.post(`api/member/create`, this.member).then((result) => {
          if (result.data) {
            alert('회원가입에 성공하셨습니다');
            this.$router.push('/mobile');
          } else {
            alert('서버측 에러');
          }
        })
      }
    },
    checkEmail() {
      if (this.member.email.match(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i)) {
        this.$http.post(`api/member/check-email`, {
          email: this.member.email
        }).then((result) => {
          if (result.data) {
            this.check.email = true;
            this.mention.email = '';
          } else {
            this.check.email = false;
            this.mention.email = '이미 가입 된 이메일 입니다.';
          }
        })
      } else {
        this.check.email = false;
        this.mention.email = '제대로된 이메일 형식이 아닙니다.';
      }
    },
    checkPassword() {
      if (this.member.password.length < 6) {
        this.check.pw = false;
        this.mention.pw = '비밀번호가 너무 짧습니다. (6자이상)'
      } else if (this.member.password !== this.member.password2) {
        this.check.pw = false;
        this.mention.pw = '비밀번호가 서로 다릅니다. 제대로 입력해 주세요'
      } else {
        this.check.pw = true;
      }
    }
  }
}
</script>

<style lang="css">
.register-wrapper {
  height: 100%;
  top: 0%;
  width: 100%;
  min-height: 100vh;
}
</style>
