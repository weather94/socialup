<template>
  <div class="test">
      <div>
          <md-subheader>
            이메일 관리
          </md-subheader>
          <md-card class="md-layout weather-instagram-proxy-item" v-for="(email, index) in $store.state.email.accounts" :key="index">
            <div class="md-layout-item md-layout md-gutter">
              <div class="md-layout-item md-size-5 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                {{email.id}}
              </div>
              <div class="md-layout-item md-size-10 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                {{email.site}}
              </div>
              <div class="md-layout-item md-size-20 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                {{email.loginId}}
              </div>
              <div class="md-layout-item md-size-20 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                {{email.loginPw}}
              </div>
              <div class="md-layout-item md-size-20 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                {{email.text}}
              </div>
              <div class="md-layout-item md-size-10 md-small-size-100 md-layout md-alignment-center-center w-margin-10" style="cursor: pointer;">
                <div class="align-center">
                  <md-icon  style="color: black;" v-if="email.cookie">vpn_key</md-icon><br v-if="email.cookie">
                  {{(email.cookie) ? '쿠키' : '쿠키없음'}}
                  <md-tooltip md-direction="top">쿠키여부</md-tooltip>
                </div>
              </div>
              <div class="md-layout-item  md-size-15 md-small-size-100 md-layout md-alignment-center-center w-margin-10" style="text-align: center;">
                <md-button class="md-icon-button md-raised" v-if="!browsers[email.id]" @click.stop="openEmailBrowser(email)">
                  <md-icon  style="color: black;">link</md-icon>
                </md-button>
                <md-button class="md-icon-button md-raised" v-if="browsers[email.id]" @click.stop="browsers[email.id]()">
                  <md-icon  style="color: black;">save</md-icon>
                </md-button>
                <md-button class="md-icon-button md-raised" @click.stop="removeEmail(email.id)">
                  <md-icon  style="color: black;">delete</md-icon>
                </md-button>
              </div>
            </div>
          </md-card>
      </div>
      <div>
        <md-button class="md-primary md-raised md-dense" @click="createDialog = true">
          이메일 수동추가
        </md-button>
        <md-button class="md-primary md-raised md-dense" @click="startEmailAutoCreate">
          자동가입
        </md-button>
        <!-- <md-button class="md-primary md-raised md-dense" @click="setEmailId">
          테스트 번호설정
        </md-button> -->
      </div>
      <md-dialog v-if="createDialog" :md-active.sync="createDialog" style="width: 400px;">
        <md-dialog-title>이메일 수동추가</md-dialog-title>
        <md-dialog-content class="weather-content">
          <div>
            <md-field>
              <label for="setting">사이트 이름</label>
              <md-input type="text" v-model="inputEmail.site"></md-input>
              <div class="md-helper-text">네이버 다음 네이트 구글 야후 얀덱스 투타노타 등등</div>
            </md-field>
          </div>
          <div>
            <md-field>
              <label for="setting">로그인 아이디</label>
              <md-input type="text" v-model="inputEmail.loginId"></md-input>
              <div class="md-helper-text">ex) jungminsu1987</div>
            </md-field>
          </div>
          <div>
            <md-field>
              <label for="setting">로그인 비밀번호</label>
              <md-input type="text" v-model="inputEmail.loginPw"></md-input>
              <div class="md-helper-text">ex) 1234456789123</div>
            </md-field>
          </div>
          <div>
            <md-field>
              <label for="setting">계정이름</label>
              <md-input type="text" v-model="inputEmail.name"></md-input>
              <div class="md-helper-text">ex) 정민수</div>
            </md-field>
          </div>
          <div>
            <md-field>
              <label for="setting">계정생일</label>
              <md-input type="text" v-model="inputEmail.birth"></md-input>
              <div class="md-helper-text">ex) 890321</div>
            </md-field>
          </div>
          <div>
            <md-field>
              <label for="setting">폰번호</label>
              <md-input type="text" v-model="inputEmail.phone"></md-input>
              <div class="md-helper-text">ex) 01012341234</div>
            </md-field>
          </div>
          <div>
            <md-field>
              <label for="setting">메모</label>
              <md-input type="text" v-model="inputEmail.text"></md-input>
            </md-field>
          </div>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button @click="addEmail">추가</md-button>
          <md-button @click="createDialog = false">취소</md-button>
        </md-dialog-actions>
      </md-dialog>
  </div>
</template>

<script>
import OpenEmailBrowser from '@/assets/js/OpenEmailBrowser';
import EmailAutoCreate from '@/assets/js/EmailAutoCreate';
import windowHandler from '@/assets/js/windowHandler';
import * as _ from 'lodash';

export default {
  data() {
    return {
      periodProxys: [],
      logs: null,
      proxy: null,
      mobile: false,
      createDialog: false,
      browsers: {},
      inputEmail: {
        site: '',
        loginId: '',
        loginPw: '',
        name: '',
        birth: '',
        phone: '',
        text: '',
      },
    };
  },
  mounted() {
  },
  methods: {
    startEmailAutoCreate() {
      EmailAutoCreate();
    },
    open(username) {
      windowHandler.openBrowser(`https://www.instagram.com/${username}/`);
    },
    openEmailBrowser(email) {
      this.browsers[email.id] = OpenEmailBrowser(email, this.$store, this.closeEmailBrowser);
      this.browsers = _.cloneDeep(this.browsers);
    },
    closeEmailBrowser(email) {
      delete this.browsers[email.id];
      this.browsers = _.cloneDeep(this.browsers);
    },
    addEmail() {
      if (this.inputEmail.site && this.inputEmail.loginId && this.inputEmail.loginPw) {
        this.$store.dispatch('addEmail', this.inputEmail);
        this.createDialog = false;
        // this.inputEmail = {
        //   site: '',
        //   loginId: '',
        //   loginPw: '',
        //   name: '',
        //   birth: '',
        //   phone: '',
        //   text: '',
        // };
      }
    },
    removeEmail(id) {
      this.$store.dispatch('removeEmail', { id });
    },
    setEmailId() {
      this.$store.dispatch('setEmailId', 0);
    },
  },
};
</script>

<style lang="css" scoped>
.instagram-avatar {
  border-radius: 50%;
}
.w-profile {
  margin: 5px;
  margin-bottom: 20px;
}
.w-lmargin-10 {
  margin-left: 10px;
}
.w-profile-name {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: xx-large;
}
.w-profile-value {
  /* text-align: center; */
  margin: 15px;
}
.weather-content {
  padding-top: 0px;
}
.md-radio {
  margin: 8px 8px 8px 0;
}
.weather-badge {
  background-color: #448aff; 
  color: white; 
  padding: 2px 5px 2px 5px;
  border-radius: 3px;
  margin-right: 5px;
}
.weather-log-type-selector {
  margin-left: 20px;
}
.weather-lpadding-20 {
  padding-left: 20px;
}
.md-card {
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.weather-item {
  min-height: 40px;
  font-size: 13px;
  padding: 4px 16px;
}
.weather-item:hover {
  background-color: #e7e7e7;
  cursor: pointer;
}
.md-table-row {
  cursor: pointer;
}
.unfollow-item {
  background-color: rgba(255, 40, 68, 0.4);
}
.followback-item {
  background-color: rgba(38, 138, 255, 0.4);
}
.weather-instagram-proxy-item {
  margin: 5px;
  cursor:pointer;
}
.weather-instagram-proxy-item:hover {
  background-color: #e7e7e7;
}
.w-margin-10 {
  margin-top: 10px;
  margin-bottom: 10px;
}
.weather-input {
  padding: 5px;
  width: 100%;
}
</style>
