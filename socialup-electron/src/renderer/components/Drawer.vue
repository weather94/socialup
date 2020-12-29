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
        <md-list v-if="this.$store.state.member.member && this.$store.state.member.member.periods && this.$store.state.member.member.periods.manage">
          <md-list-item @click="route('/')" :style="selectedPage === '/' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon class="fa fa-instagram" />
            <md-tooltip md-direction="top">인스타그램</md-tooltip>
            <span class="md-list-item-text">인스타그램</span>
          </md-list-item>
          <md-list-item  @click="route('dashboard')" :style="selectedPage === 'dashboard' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>insert_chart</md-icon>
            <md-tooltip md-direction="top">대시보드</md-tooltip>
            <span class="md-list-item-text">대시보드</span>
          </md-list-item>
          <md-list-item @click="route('follow')" :style="selectedPage === 'follow' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>settings</md-icon>
            <md-tooltip md-direction="top">설정</md-tooltip>
            <span class="md-list-item-text">설정</span>
          </md-list-item>
          <md-list-item v-if="$store.state.member.member.periods.manage.allowCount === 0 && $store.state.instagram.loginId && $store.state.process[$store.state.instagram.loginId].process === true" @click="stopWork($store.state.instagram.loginId)">
            <md-icon>pause</md-icon>
            <span class="md-list-item-text">작업중지</span>
            <md-tooltip md-direction="top">작업중지</md-tooltip>
          </md-list-item>
          <md-list-item v-if="$store.state.member.member.periods.manage.allowCount === 0 && $store.state.instagram.loginId && $store.state.process[$store.state.instagram.loginId].process === false" @click="settingWork($store.state.instagram.loginId)">
            <md-icon>play_arrow</md-icon>
            <span class="md-list-item-text">작업시작</span>
            <md-tooltip md-direction="top">작업시작</md-tooltip>
          </md-list-item>
          <md-list-item v-if="$store.state.member.member.periods.manage.allowCount > 0" @click="route('play')" :style="selectedPage === 'play' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>play_arrow</md-icon>
            <span class="md-list-item-text">작업</span>
            <md-tooltip md-direction="top">작업</md-tooltip>
          </md-list-item>
          <md-list-item @click="route('friend')" :style="selectedPage === 'friend' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>group</md-icon>
            <md-tooltip md-direction="top">친구목록</md-tooltip>
            <span class="md-list-item-text">친구목록</span>
          </md-list-item>
          <md-list-item @click="route('instagramlog')" :style="selectedPage === 'instagramlog' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>event_note</md-icon>
            <md-tooltip md-direction="top">인스타기록</md-tooltip>
            <span class="md-list-item-text">인스타기록</span>
          </md-list-item>
          <md-list-item @click="route('posting')" :style="selectedPage === 'posting' ? {backgroundColor: '#d7d7d7'} : null">
            <md-icon>add_to_photos</md-icon>
            <md-tooltip md-direction="top">포스팅</md-tooltip>
            <span class="md-list-item-text">포스팅</span>
          </md-list-item>
          <md-list-item v-if="$store.state.member.member && $store.state.member.member.grade >= 10" @click="test">
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

    <md-dialog
      :md-active.sync="showStartDialog">
      <md-dialog-title>작업 시작하기</md-dialog-title>
      <div class="weather-content">
        <div class="align-center">
          작업옵션 선택후 시작하기 버튼을 클릭하면 작업이 시작됩니다.
        </div>
        <div>
          <md-field>
            <label for="setting">작업 설정</label>
            <md-select v-model="selectedSetting.settingName" name="setting" id="setting" placeholder="작업 설정" @md-selected="changeSetting">
              <md-option v-for="(setting, index) in $store.state.instagram.settings.filter(item => item.name)" :key="index" :value="setting.name">{{setting.name}}</md-option>
            </md-select>
            <div class="md-helper-text">왼쪽 톱니바퀴 모양 메뉴 '설정'에서 생성할 수 있습니다.</div>
          </md-field>
        </div>
        <div>
          <md-switch v-model="selectedSetting.proxy" @change="changeProxy">프록시 사용하기</md-switch>
        </div>
        <div v-if="selectedSetting.proxy">
          <md-field>
            <label>프록시 서버:포트</label>
            <md-input type="text" v-model="selectedSetting.proxyAddress" @change="changeProxyAddress"></md-input>
            <div class="md-helper-text">프록시 서버 및 포트를 입력해주세요 ex) 127.0.0.1:8080</div>
          </md-field>
        </div>
        <div>
          <md-switch v-model="selectedSetting.viewBrowser" @change="changeViewBrowser">작업시 브라우저 보이기</md-switch>
        </div>
      </div>
      <md-dialog-actions>
        <md-button @click="showStartDialog = false">취소</md-button>
        <md-button class="md-primary" @click="startWork(selectedAccount)">시작하기</md-button>
      </md-dialog-actions>
    </md-dialog>

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
import FollowWorker from '@/assets/js/FollowWorker';
import GetProfileData from '@/assets/js/GetProfileData';
import windowHandler from '@/assets/js/windowHandler';
import PostingWorker from '@/assets/js/PostingWorker';
import PostingRepeatWorker from '@/assets/js/PostingRepeatWorker';
import Test from '@/assets/js/Test';
import * as _ from 'lodash';

export default {
  props: ['version', 'lastVersion'],
  data: () => ({
    workers: {},
    postingWorker: null,
    menuVisible: false,
    selectedPage: '/',
    startPosting: false,
    showSnackbar: false,
    snackbarMent: '',
    logoutConfirm: false,
    showStartDialog: false,
    selectedAccount: null,
    selectedSetting: {
      settingName: null,
      proxy: false,
      proxyAddress: null,
      viewBrowser: false,
      process: false,
    },
  }),
  created() {
    this.$root.$on('settingWork', (params) => {
      this.settingWork(params);
    });
    this.$root.$on('stopWork', (params) => {
      this.stopWork(params);
    });
    this.$root.$on('startunfollow', (params) => {
      this.startUnfollow(params);
    });
    this.$root.$on('postingToggle', (param) => {
      if (param === 'reserve') {
        this.postingToggle();
      } else {
        this.postingRepeatToggle();
      }
    });
  },
  mounted() {
    this.$store.dispatch('setTodayKey');
    this.$store.dispatch('setWorkTodayKey');
    this.$http.get('api/member/whoami').then((response) => {
      if (response.data) {
        this.$store.dispatch('setSettings', response.data.instagrams);
        this.$store.dispatch('setMember', response.data);
        this.$store.dispatch('loadAccountLogs', response.data.accountLogs);
        this.$store.dispatch('loadWorkLogs', response.data.workLogs);
      } else {
        this.$store.dispatch('clearAuth');
        this.$store.dispatch('clearMember');
      }
    });
    // setTimeout(async () => {
    //   this.getProfileData();
    // }, 100);
    // setInterval(async () => {
    //   this.getProfileData();
    // }, 300000);
  },
  methods: {
    updateVersion() {
      this.$root.$emit('updateVersion');
    },
    settingWork(item) {
      this.selectedAccount = item;
      this.selectedSetting = (this.$store.state.process[item]) ? _.cloneDeep(this.$store.state.process[item]) : {
        settingName: null,
        proxy: false,
        proxyAddress: null,
        viewBrowser: false,
        process: false,
      };
      this.showStartDialog = true;
    },
    changeSetting() {
      if (!this.$store.state.process[this.selectedAccount] || (this.$store.state.process[this.selectedAccount] && this.$store.state.process[this.selectedAccount].settingName !== this.selectedSetting.settingName)) {
        this.$store.dispatch('setSettingName', {
          id: this.selectedAccount,
          settingName: this.selectedSetting.settingName,
        });
      }
    },
    changeProxy() {
      if (!this.$store.state.process[this.selectedAccount] || (this.$store.state.process[this.selectedAccount] && this.$store.state.process[this.selectedAccount].proxy !== this.selectedSetting.proxy)) {
        this.$store.dispatch('setProxy', {
          id: this.selectedAccount,
          proxy: this.selectedSetting.proxy,
        });
      }
    },
    changeProxyAddress() {
      if (!this.$store.state.process[this.selectedAccount] || (this.$store.state.process[this.selectedAccount] && this.$store.state.process[this.selectedAccount].proxyAddress !== this.selectedSetting.proxyAddress)) {
        this.$store.dispatch('setProxyAddress', {
          id: this.selectedAccount,
          proxyAddress: this.selectedSetting.proxyAddress,
        });
      }
    },
    changeViewBrowser() {
      if (!this.$store.state.process[this.selectedAccount] || (this.$store.state.process[this.selectedAccount] && this.$store.state.process[this.selectedAccount].viewBrowser !== this.selectedSetting.viewBrowser)) {
        this.$store.dispatch('setViewBrowser', {
          id: this.selectedAccount,
          viewBrowser: this.selectedSetting.viewBrowser,
        });
      }
    },
    test() {

      // this.$http.get('api/instagram/token').then((response) => {
      //   if (response.data) {
      //     const id = 'qkrckdtn123@nate.com';
      //     this.$store.dispatch('setMultiToken', {
      //       id,
      //       token: response.data,
      //     });
      //     this.$store.dispatch('setMultiProcess', {
      //       id,
      //       process: true,
      //     });
      //     const process = _.cloneDeep(this.$store.state.process[id]);
      //     const account = _.cloneDeep(this.$store.state.instagram.account[id]);
      //     const setting = this.$store.state.instagram.settings.filter(item => item.name === process.settingName)[0];
      //     FollowWorker(this.$store, this.$http, process, account, setting);
      //   } else {
      //     this.$store.dispatch('setMultiToken', {
      //       id,
      //       token: null,
      //     });
      //     this.snackbarMent = '작업가능 계정을 초과. 기존작업을 중지하고 다시시도해 주세요.   작업을 초과하지않는데 초과했다고 나오는 경우 \'전체작업 초기화\' 버튼을 클릭해 상태를 초기화 해주시기 바랍니다.';
      //     this.showSnackbar = true;
      //   }
      // });
      Test(this.$store, this.$http);
    },
    async getProfileData() {
      this.$store.dispatch('setTodayKey');
      this.$store.dispatch('setWorkTodayKey');
      if (this.$store.state.instagram.loginId &&
          this.$store.state.instagram.username) {
        const profile = await GetProfileData(this.$store, this.$http, this.$store.state.instagram.username);
        profile.total = profile.edge_owner_to_timeline_media.edges.reduce((acc, cur) => ({
          like: acc.like + cur.node.edge_liked_by.count,
          comment: acc.comment + cur.node.edge_media_to_comment.count,
        }), { like: 0, comment: 0 });

        const tag = profile.edge_owner_to_timeline_media.edges.reduce((acc, cur) => {
          if (cur.node.edge_media_to_caption.edges[0] && cur.node.edge_media_to_caption.edges[0].node.text) {
            const words = cur.node.edge_media_to_caption.edges[0].node.text.split('#');
            words.forEach((item, index) => {
              const word = item.split(' ')[0];
              if (word !== '' && index !== 0) {
                if (acc[word]) {
                  acc[word] += 1;
                } else {
                  acc[word] = 1;
                }
              }
            });
          }
          return acc;
        }, {});

        const tags = Object.keys(tag).map(item => ({
          tag: item,
          count: tag[item],
        })).sort((a, b) => b.count - a.count);

        profile.tag_rank = tags;

        this.$store.dispatch('setProfile', profile);
        if (profile) {
          this.$store.dispatch('setAccountLogs', {
            id: this.$store.state.instagram.loginId,
            value: {
              board: profile.edge_owner_to_timeline_media.count,
              follower: profile.edge_followed_by.count,
              following: profile.edge_follow.count,
            },
          });
        }
      }
    },
    close() {
      windowHandler.closeWindow();
    },
    open(url) {
      windowHandler.openBrowser(url);
    },
    logout() {
      localStorage.removeItem('auth');
      this.$store.dispatch('clearAuth');
      this.$store.dispatch('setLoginId', null);
      this.$store.dispatch('setUsername', null);
    },
    async postingToggle() {
      if (this.startPosting) {
        this.startPosting = false;
        if (this.postingWorker !== null) {
          this.postingWorker();
          this.$store.dispatch('setPostingProcess', null);
          this.postingWorker = null;
        }
      } else if (this.$store.state.member.member.periods && this.$store.state.member.member.periods.manage &&
          new Date(this.$store.state.member.member.periods.manage.expired) > new Date()) {
        this.startPosting = true;
        if (this.postingWorker === null) {
          this.$store.dispatch('setPostingProcess', 'reserve');
          this.postingWorker = PostingWorker(this.$store);
        }
      } else {
        this.snackbarMent = '기간이 만료되었습니다. 결제를 해주세요!';
        this.showSnackbar = true;
      }
    },
    async postingRepeatToggle() {
      if (this.startPosting) {
        this.startPosting = false;
        if (this.postingWorker !== null) {
          this.postingWorker();
          this.$store.dispatch('setPostingProcess', null);
          this.postingWorker = null;
        }
      } else if (this.$store.state.member.member.periods && this.$store.state.member.member.periods.manage &&
          new Date(this.$store.state.member.member.periods.manage.expired) > new Date()) {
        this.startPosting = true;
        if (this.postingWorker === null) {
          this.$store.dispatch('setPostingProcess', 'repeat');
          this.postingWorker = PostingRepeatWorker(this.$store);
        }
      } else {
        this.snackbarMent = '기간이 만료되었습니다. 결제를 해주세요!';
        this.showSnackbar = true;
      }
    },
    async startWork(id) {
      const setting = this.$store.state.instagram.settings.filter(item => item.name === this.$store.state.process[id].settingName)[0];
      if (!this.$store.state.process[id].settingName || !setting) {
        this.snackbarMent = '작업 설정을 먼저 선택해 주세요.';
        this.showSnackbar = true;
        return;
      }
      if (!this.$store.state.instagram.account[id]) {
        this.snackbarMent = '계정등록을 먼저해주세요. 왼쪽메뉴 마이페이지 -> 계정등록';
        this.showSnackbar = true;
        return;
      }

      if (this.$store.state.member.member.periods &&
          this.$store.state.member.member.periods.manage &&
          new Date(this.$store.state.member.member.periods.manage.expired) > new Date()) {
        if (this.$store.state.member.member.periods.manage.allowCount === 0) {
          await this.$http.get('api/instagram/token/issue');
        }
        this.$http.get('api/instagram/token').then((response) => {
          if (response.data) {
            this.$store.dispatch('setMultiToken', {
              id,
              token: response.data,
            });
            this.$store.dispatch('setMultiProcess', {
              id,
              process: true,
            });
            const process = _.cloneDeep(this.$store.state.process[id]);
            const account = _.cloneDeep(this.$store.state.instagram.account[id]);
            const setting = this.$store.state.instagram.settings.filter(item => item.name === process.settingName)[0];
            this.workers[id] = FollowWorker(this.$store, this.$http, process, account, setting);
          } else {
            this.$store.dispatch('setMultiToken', {
              id,
              token: null,
            });
            this.snackbarMent = '작업가능 계정을 초과. 기존작업을 중지하고 다시시도해 주세요.   작업을 초과하지않는데 초과했다고 나오는 경우 \'전체작업 초기화\' 버튼을 클릭해 상태를 초기화 해주시기 바랍니다.';
            this.showSnackbar = true;
          }
        });
      } else {
        this.snackbarMent = '기간이 만료되었습니다. 결제를 해주세요!';
        this.showSnackbar = true;
      }
      this.showStartDialog = false;
    },
    stopWork(id) {
      if (!this.workers[id]) {
        this.$store.dispatch('setMultiProcess', {
          id,
          process: false,
        });
      } else if (this.workers[id]()) {
        this.$store.dispatch('setMultiProcess', {
          id,
          process: false,
        });
        this.workers[id] = null;
        this.$store.dispatch('setTitle', '작업을 종료합니다');
        this.$http.get('api/instagram/token/return', { params: { key: this.$store.state.process[id].token } }).then(() => {
          this.$store.dispatch('setMultiToken', {
            id,
            token: null,
          });
        });
      } else {
        this.snackbarMent = '잠시 후 다시 시도해 주세요.';
        this.showSnackbar = true;
      }
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    route(path) {
      this.selectedPage = path;
      this.$router.push(path);
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
