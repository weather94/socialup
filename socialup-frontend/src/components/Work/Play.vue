<template>
  <div class="instgram-log-wrapper">
    <md-empty-state v-if="!periodProxy"
      md-icon="person_add"
      md-label="결제 후 이용하시기 바랍니다."
      md-description="계정이 존재하지 않습니다. 결제 후 이용하시기 바랍니다.">
    </md-empty-state>
    <md-empty-state v-if="periodProxy && periodProxy.instagramProxys.length === 0"
      md-icon="person_add"
      md-label="계정이 존재하지 않습니다."
      md-description="계정이 존재하지 않습니다. 계정을 추가후 이용해주시기 바랍니다.">
      <md-button v-if="periodProxy && periodProxy.allowCount >= 0" class="md-primary md-raised" @click="showLoginDialog = true">계정추가</md-button>
    </md-empty-state>
    <div v-if="periodProxy && periodProxy.instagramProxys.length !== 0" class="container" style="margin-top:30px; margin-bottom: 30px;">
      <div class="md-layout">
        <div class="md-layout-item" v-if="logs">
          <md-subheader class="md-primary">작업 계정</md-subheader>
          <div v-for="(item, index) in periodProxy.instagramProxys" :key="index" @click="goDashboard(item.email)">
            <md-card class="weather-instagram-proxy-item">
          <div class="md-layout md-gutter" >
            <div class="md-layout-item md-size-15 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
              <span class="weather-badge" style="background-color: rgb(200, 158, 196);">
                {{(logs[item.email] && logs[item.email]['accountlog']) ? logs[item.email]['accountlog'].board : '-'}}
                <md-tooltip md-direction="top">게시글</md-tooltip>
              </span>
              <span class="weather-badge" style="background-color: rgb(68, 138, 255);">
                {{(logs[item.email] && logs[item.email]['accountlog']) ? logs[item.email]['accountlog'].follower : '-'}}
                <md-tooltip md-direction="top">팔로워</md-tooltip>
              </span>
              <span class="weather-badge" style="background-color: rgb(238, 119, 133);">
                {{(logs[item.email] && logs[item.email]['accountlog']) ? logs[item.email]['accountlog'].following : '-'}}
                <md-tooltip md-direction="top">팔로잉</md-tooltip>
              </span>
            </div>
            <div class="md-layout-item md-size-15 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
              {{item.email}}
            </div>
            <div class="md-layout-item md-size-10 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
              <div class="align-center">
                <md-icon class="w-follow">person_add</md-icon><br>
                {{`${(logs[item.email] && logs[item.email]['worklog']) ? logs[item.email]['worklog'].follow : 0}/${(item.instagramOption) ? item.instagramOption.followLimitPerDay : 0}`}}
                <md-tooltip md-direction="top">오늘 팔로우 작업횟수</md-tooltip>
              </div>
            </div>
            <div class="md-layout-item md-size-10 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
              <div class="align-center">
                <md-icon class="w-like">favorite</md-icon><br>
                {{`${(logs[item.email] && logs[item.email]['worklog']) ? logs[item.email]['worklog'].likeCount : 0}/${(item.instagramOption) ? item.instagramOption.likeLimitPerDay : 0}`}}
                    <md-tooltip md-direction="top">오늘 좋아요 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-comment">comment</md-icon><br>
                    {{`${(logs[item.email] && logs[item.email]['worklog']) ? logs[item.email]['worklog'].comment : 0}/${(item.instagramOption) ? item.instagramOption.commentLimitPerDay : 0}`}}
                    <md-tooltip md-direction="top">오늘 댓글 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-unfollow">remove_circle_outline</md-icon><br>
                    {{`${(logs[item.email] && logs[item.email]['worklog']) ? logs[item.email]['worklog'].unfollow : 0}/${(item.instagramOption) ? item.instagramOption.followLimitPerDay : 0}`}}
                    <md-tooltip md-direction="top">오늘 언팔로우 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                  <div v-if="!item.instagramOption" style="text-align: center;">
                    <span>미선택</span>
                  </div>
                  <div v-if="item.instagramOption" style="text-align: center;">
                    <span v-if="item.instagramOption.followType === 1">선팔로우</span>
                    <span v-if="item.instagramOption.followType === 2">내 팔로워 관리</span>
                    <span v-if="item.instagramOption.followType === 3">언팔로우</span>
                  </div>
                </div>
                <div class="md-layout-item  md-size-20 md-small-size-100 md-layout md-alignment-center-center w-margin-10" style="text-align: center;">
                  <md-button class="md-icon-button md-raised" v-if="!item.cookie || !item.proxyServer" @click.stop="selectProxy(item)">
                    <md-icon  style="color: black;">perm_data_setting</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised" @click.stop="selectSetting(item)">
                    <md-icon>settings</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised md-primary" @click.stop="startWork(item)" v-if="logs[item.email] && logs[item.email].start === false">
                    <md-icon>play_arrow</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised md-accent" @click.stop="stopWork(item.id)" v-if="logs[item.email] && logs[item.email].start === true">
                    <md-icon>pause</md-icon>
                  </md-button>
                </div>
              </div>
            </md-card>
          </div>
        </div>
      </div>
      <div style="margin-right: 10px; margin-top: 10px; text-align:right;">
        <span><md-button :disabled="true" style="color: black;">{{`추가 가능계정: ${periodProxy.allowCount - periodProxy.instagramProxys.length + 1}개`}}</md-button></span>
        <span><md-button class="md-primary md-raised" @click="showLoginDialog = true">계정 추가하기</md-button></span>
      </div>
    </div>
    <md-dialog
      :md-active.sync="showLoginDialog"
      :md-fullscreen="true"
      :md-click-outside-to-close="false">
      <md-dialog-title style="margin-bottom: 0; text-align: center;"><img src="../../assets/img/instagramLogo.png" width="500"></md-dialog-title>
      <md-dialog-content class="weather-content">
        <div style="color: red; margin-top:20px; margin-bottom:5px;">
          인스타그램 아이디, 비밀번호는 첫 작업시 로그인에 사용되며 기간종료시 자동폐기됩니다.
        </div>
        <div style="color: red; margin-top:20px; margin-bottom:5px;">
          먼저 인스타그램 홈페이지에서 로그인을 해본뒤 정확한 아이디와 비밀번호를 입력해주시기 바랍니다. 잘못 입력하였을 경우 관리자에게 문의하시기 바랍니다. 
        </div>
        <div class="md-layout md-alignment-center-space-around">
          <div class="md-layout-item md-size-45 md-small-size-90">
            <md-field>
              <label>인스타그램 아이디</label>
              <md-input v-model="instagramId" type="text" ></md-input>
              <div class="md-helper-text">인스타그램 아이디를 입력하세요</div>
            </md-field>
          </div>
          <div class="md-layout-item md-size-45 md-small-size-90">
            <md-field>
              <label>인스타그램 비번</label>
              <md-input v-model="instagramPw" type="password" ></md-input>
              <div class="md-helper-text">인스타그램 패스워드를 입력하세요.</div>
            </md-field>
          </div>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent md-raised" @click="showLoginDialog = false">취소</md-button>
        <md-button class="md-primary md-raised" @click="addInstagramProxy">추가</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog v-if="proxy"
      :md-active.sync="proxyPrompt"
      :md-fullscreen="true"
      :md-click-outside-to-close="false">
      <md-dialog-title style="margin-bottom: 0; text-align: center;"><img src="../../assets/img/instagramLogo.png" width="500"></md-dialog-title>
      <md-dialog-content class="weather-content">
        <div style="color: red; margin-top:20px; margin-bottom:5px;">
          인스타그램 아이디, 비밀번호는 첫 작업시 로그인에 사용되며 기간종료시 자동폐기됩니다.
        </div>
        <div style="color: red; margin-top:20px; margin-bottom:5px;">
          먼저 인스타그램 홈페이지에서 로그인을 해본뒤 정확한 아이디와 비밀번호를 입력해주시기 바랍니다.
        </div>
        <div class="md-layout md-alignment-center-space-around">
          <div class="md-layout-item md-size-45 md-small-size-90">
            <md-field>
              <label>인스타그램 아이디</label>
              <md-input v-model="proxy.email" type="text" ></md-input>
              <div class="md-helper-text">인스타그램 아이디를 입력하세요</div>
            </md-field>
          </div>
          <div class="md-layout-item md-size-45 md-small-size-90">
            <md-field>
              <label>인스타그램 비번</label>
              <md-input v-model="proxy.password" type="password" ></md-input>
              <div class="md-helper-text">인스타그램 패스워드를 입력하세요.</div>
            </md-field>
          </div>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent md-raised" @click="proxyPrompt = false">취소</md-button>
        <md-button class="md-primary md-raised" @click="updateInstagramProxyIdPw">수정</md-button>
      </md-dialog-actions>
    </md-dialog>
    <InstagramOptionDialog :show="showSettingDialog" :setting="selectedInstagramOption" @save="saveSetting" @close="showSettingDialog = false"/>
    <md-snackbar md-position="center" :md-duration="5000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarMent}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">닫기</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import { setInterval, clearInterval } from 'timers';
import InstagramOptionDialog from '../InstagramOptionDialog';
import * as _ from 'lodash';

export default {
  components: {
    InstagramOptionDialog,
  },
  data() {
    return {
      selectedInstagramOption: null,
      instagramId: '',
      instagramPw: '',
      showSnackbar: false,
      showLoginDialog: false,
      snackbarMent: '',
      showDeleteButton: false,
      showSettingDialog: false,
      proxyPrompt: false,
      periodProxy: null,
      logs: {},
      interval: null,
      proxy: null,
    };
  },
  mounted() {
    this.getMyInstagramPeriodProxy();
    this.getLogs();
    this.interval = setInterval(() => {
      this.getLogs();
    }, 60000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    selectProxy(item) {
      this.proxy = _.cloneDeep(item);
      this.proxyPrompt = true;
    },
    getLogs() {
      this.$http.get('api/instagram/log/work/my-all', {
        params: {
          date: new Date().toLocaleDateString(),
        },
      }).then((response) => {
        if (response.data) {
          this.logs = response.data;
        }
      });
    },
    getMyInstagramPeriodProxy() {
      this.$http.get('api/instagram/my-period-proxy').then((response) => {
        if (response.data) {
          response.data.instagramProxys.sort((a, b) => {
            return a.id - b.id;
          });
          this.periodProxy = response.data;
        }
      });
    },
    saveSetting(setting) {
      this.$http.put(`api/instagram/${setting.id}`, setting).then((response) => {
        if (response.data) {
          const proxy = this.periodProxy.instagramProxys.filter(item => item.instagramOption.id === setting.id)[0];
          if (proxy) {
            proxy.instagramOption = response.data;
          }
        }
      });
      this.showSettingDialog = false;
    },
    selectSetting(item) {
      this.selectedInstagramOption = _.cloneDeep(item.instagramOption);
      this.showSettingDialog = true;
    },
    router(route) {
      this.$router.push(route);
    },
    goDashboard(id) {
      this.$router.push(`/dashboard/${btoa(id)}`)
    },
    addInstagramProxy() {
      if (this.instagramId && this.instagramPw) {
        this.$http.post('api/instagram/proxy', {
          email: this.instagramId,
          password: this.instagramPw,
        }).then((response) => {
          if (response.data) {
            this.$store.dispatch('addInstagramProxy', response.data);
          }
          this.instagramId = '';
          this.instagramPw = '';
          this.showLoginDialog = false;
          this.getLogs();
          this.getMyInstagramPeriodProxy();
        });
      }
    },
    updateInstagramProxyIdPw() {
      if (this.proxy && this.proxy.email && this.proxy.password) {
        this.$http.put(`api/instagram/proxy/${this.proxy.id}/id-pw`, {
          email: this.proxy.email,
          password: this.proxy.password,
        }).then((response) => {
          this.proxyPrompt = false;
          this.getLogs();
          this.getMyInstagramPeriodProxy();
        });
      }
    },
    startWork(item) {
      if (new Date(item.expired) < new Date()) {
        alert('사용 기간이 만료되었습니다.');
        return;
      }

      if (item.instagramOption.activeTimes.length < 1) {
        alert('설정에서 작동시간을 체크해주세요.');
        return;
      }
      
      if (item.instagramOption.followType === 1 && item.instagramOption.targetTags.length < 1) {
        alert('설정에서 타겟태그를 입력해주세요. ( 10개이상 )');
        return;
      }
      
      this.$http.get(`api/instagram/proxy/start/${item.id}`).then((response) => {
        this.getLogs();
      });
    },
    stopWork(id) {
      this.$http.get(`api/instagram/proxy/stop/${id}`).then((response) => {
        this.getLogs();
      });
    },
  },
};
</script>

<style lang="css" scoped>
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
  padding: 5px;
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
