<template>
  <div class="instgram-log-wrapper gray-bg">
    <div class="container" style="padding: 30px 0 30px 0;">
      <div class="md-layout">
        <md-button @click="refreshAll" class="md-primary md-raised">새로고침</md-button>
      </div>
      <div class="md-layout md-gutter md-alignment-center-center">
        <div class="md-layout-item md-size-25 md-small-size-50 md-xsmall-size-100" v-for="(workpool, index) in workpools" :key="index" @click="selectWorkPool(workpool)">
          <md-card md-with-hover :style="(selectedWorkPool === workpool) ? 'background-color: #c7c7c7; padding: 10px;' : 'padding: 10px;'">
            <md-button class="md-icon-button md-raised md-accent" style="position: absolute; right: 5px; top: 10px;" @click.stop="disconnectWorkPool(workpool.name)">
              <md-icon>clear</md-icon>
            </md-button>
            <md-button class="md-icon-button md-raised md-primary" style="position: absolute; left: 10px; top: 10px;" @click.stop="startWorkPool(workpool.name)">
              <md-icon>play_arrow</md-icon>
            </md-button>
            <div class="align-center" style="font-size:20px; margin-top: 5px;">
              {{`워크풀 ${index + 1}`}}
            </div>
            <div class="align-center" style="margin-top: 15px;">
              {{workpool.name}}
            </div>
            <div class="align-center" style="margin-top: 5px;">
              {{workpool.ip}}
            </div>
            <div class="align-center" style="margin-top: 5px; font-size: 20px;">
              {{`${workpool.instagramProxyIds.length} / ${workpool.allowWorkCount}`}}
            </div>
            <div class="md-layout md-alignment-center-center" style="margin-top: 15px;">
              <div v-for="(id, index) in workpool.instagramProxyIds" :key="index" class="md-layout-item align-center" style="margin: 4px;">
                <span class="weather-badge" style="background-color: rgb(79, 179, 81);">
                  {{id}}
                </span>
              </div>
            </div>
          </md-card>
        </div>
      </div>
      <div>
        <div v-for="(period, index) in periodProxys" :key="index">
          <md-subheader>
            {{period.expired}}
          </md-subheader>
          <md-card class="md-layout weather-instagram-proxy-item" v-for="(item, index) in period.instagramProxys" :key="index">
            <div class="md-layout-item md-layout md-gutter" @click="goDashboard(item.email)">
              <div class="md-layout-item md-size-5 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                  {{item.id}}
                </div>
                <div class="md-layout-item md-size-15 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                  <span class="weather-badge" style="background-color: rgb(200, 158, 196);">
                    {{(logs && logs[item.email]['accountlog']) ? logs[item.email]['accountlog'].board : '-'}}
                    <md-tooltip md-direction="top">게시글</md-tooltip>
                  </span>
                  <span class="weather-badge" style="background-color: rgb(68, 138, 255);">
                    {{(logs && logs[item.email]['accountlog']) ? logs[item.email]['accountlog'].follower : '-'}}
                    <md-tooltip md-direction="top">팔로워</md-tooltip>
                  </span>
                  <span class="weather-badge" style="background-color: rgb(238, 119, 133);">
                    {{(logs && logs[item.email]['accountlog']) ? logs[item.email]['accountlog'].following : '-'}}
                    <md-tooltip md-direction="top">팔로잉</md-tooltip>
                  </span>
                </div>
                <div class="md-layout-item md-size-20 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                    {{item.email}}
                </div>
                <div class="md-layout-item md-size-5 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-follow">person_add</md-icon><br>
                    {{(logs && logs[item.email]['worklog']) ? logs[item.email]['worklog'].follow : 0}}
                    <md-tooltip md-direction="top">오늘 팔로우 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-5 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-like">favorite</md-icon><br>
                    {{(logs && logs[item.email]['worklog']) ? logs[item.email]['worklog'].likeCount : 0}}
                    <md-tooltip md-direction="top">오늘 좋아요 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-5 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-comment">comment</md-icon><br>
                    {{(logs && logs[item.email]['worklog']) ? logs[item.email]['worklog'].comment : 0}}
                    <md-tooltip md-direction="top">오늘 댓글 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-5 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-unfollow">remove_circle_outline</md-icon><br>
                    {{(logs && logs[item.email]['worklog']) ? logs[item.email]['worklog'].unfollow : 0}}
                    <md-tooltip md-direction="top">오늘 언팔로우 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-15 md-small-size-100 md-layout md-alignment-center-center w-margin-10" style="cursor: pointer;">
                  <div class="align-center">
                    <md-icon  style="color: black;">verified_user</md-icon><br>
                    {{(item.proxyServer) ? item.proxyServer : '등록안됨'}}
                    <md-tooltip md-direction="top">프록시 서버</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item  md-size-25 md-small-size-100 md-layout md-alignment-center-center w-margin-10" style="text-align: center;">
                  <md-button class="md-icon-button md-raised" @click.stop="selectProxy(item)">
                    <md-icon  style="color: black;">perm_data_setting</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised" @click.stop="selectSetting(item)">
                    <md-icon>settings</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised md-primary" @click.stop="startWork(period.id, item.id)" v-if="logs && logs[item.email].start === false">
                    <md-icon>play_arrow</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised md-accent" @click.stop="stopWork(period.id, item.id)" v-if="logs && logs[item.email].start === true">
                    <md-icon>pause</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised md-primary" :disabled="true" v-if="logs && logs[item.email].serverStart === false">
                    <md-icon>play_arrow</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised md-accent" :disabled="true" v-if="logs && logs[item.email].serverStart === true">
                    <md-icon>pause</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised md-accent" @click.stop="deleteProxy(period.id, item.id)">
                    <md-icon>delete_forever</md-icon>
                  </md-button>
                </div>
            </div>
          </md-card>
        </div>
      </div>
    </div>
    <InstagramOptionDialog :show="showDialog" :setting="selectedInstagramOption" @save="saveSetting" @close="showDialog = false"/>
    <md-dialog v-if="this.proxy"
      :md-active.sync="proxyPrompt"
      :md-fullscreen="true"
      :md-click-outside-to-close="false">
      <md-dialog-title>InstagramProxy SETTING</md-dialog-title>
      <md-dialog-content class="weather-content">
        <div class="md-layout md-gutter md-alignment-center-center">
          <div class="md-layout-item">
            <md-field>
              <label>아이디</label>
              <md-input v-model="proxy.email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>비밀번호</label>
              <md-input v-model="proxy.password" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>유저네임</label>
              <md-input v-model="proxy.username"></md-input>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-center">
          <div class="md-layout-item">
            <md-field>
              <label>appiumPort</label>
              <md-input v-model="proxy.appiumPort"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>deviceName</label>
              <md-input v-model="proxy.deviceName"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>platformVersion</label>
              <md-input v-model="proxy.platformVersion"></md-input>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-center">
          <div class="md-layout-item">
            <md-field>
              <label>프록시 서버</label>
              <md-input v-model="proxy.proxyServer"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>만료 기간</label>
              <md-input v-model="proxy.expired"></md-input>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-center">
          <div class="md-layout-item">
            <md-field>
              <label>프로필</label>
              <md-textarea v-model="proxy.profile"></md-textarea>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-center">
          <div class="md-layout-item">
            <md-field>
              <label>쿠키</label>
              <md-textarea v-model="proxy.cookie"></md-textarea>
            </md-field>
          </div>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent md-raised" @click="proxyPrompt = false">취소</md-button>
        <md-button class="md-primary md-raised" @click="saveProxy">저장</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="deleteConfirm" v-if="this.selectedProxyId">
      <md-dialog-title>인스타그램 프록시를 진짜 삭제하시겠습니까?</md-dialog-title>
      <md-dialog-content>
        <p>절대 되돌릴 수 없습니다. 사용자와 합의이후 진행하시기 바랍니다.</p>
        <md-checkbox v-model="removeLog">작업로그, 계정로그 일괄 삭제</md-checkbox>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="deleteConfirm = false">취소</md-button>
        <md-button class="md-accent" @click="onDeleteProxy">삭제</md-button>
      </md-dialog-actions>
    </md-dialog>
    <!-- <md-snackbar md-position="center" :md-duration="5000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarMent}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">닫기</md-button>
    </md-snackbar> -->
  </div>
</template>

<script>
import InstagramOptionDialog from './InstagramOptionDialog';
import * as _ from 'lodash';

export default {
  components: {
    InstagramOptionDialog,
  },
  data() {
    return {
      periodProxys: [],
      logs: null,
      proxyPrompt: false,
      showDialog: false,
      deleteConfirm: false,
      selectedInstagramOption: null,
      selectedProxyId: 0,
      proxy: null,
      interval: null,
      selectedWorkPool: null,
      removeLog: false,
      workpools: [],
    };
  },
  mounted() {
    this.getPeriodProxys();
    this.getAllLogsInProxy();
    this.getWorkPools();
    this.interval = setInterval(() => {
      this.getAllLogsInProxy();
    }, 60000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    startWorkPool(name) {
      if (!name) {
        name = "";
      }
      this.$http.get(`api/admin2/workpool/start`, {
        params: {
          name,
        },
      }).then((response) => {
        this.getWorkPools();
        this.getAllLogsInProxy();
      });
    },
    disconnectWorkPool(name) {
      if (!name) {
        name = "";
      }
      this.$http.get(`api/admin2/workpool/disconnect`, {
        params: {
          name,
        },
      }).then((response) => {
        this.getWorkPools();
        this.getAllLogsInProxy();
      });
    },
    selectWorkPool(workpool) {
      if (this.selectedWorkPool === workpool) {
        this.selectedWorkPool = null
      } else {
        this.selectedWorkPool = workpool;
      }
    },
    refreshAll() {
      this.getPeriodProxys();
      this.getAllLogsInProxy();
      this.getWorkPools();
    },
    refresh() {
      this.getAllLogsInProxy();
      this.getWorkPools();
    },
    saveProxy() {
      this.$http.put(`api/admin2/instagram/proxy/${this.proxy.id}`, this.proxy).then((response) => {
        if (response.data) {
          this.periodProxys.forEach((period) => {
            const proxy = period.instagramProxys.filter(item => item.id === this.proxy.id)[0];
            if (proxy) {
              proxy.email = response.data.email;
              proxy.password = response.data.password;
              proxy.username = response.data.username;
              proxy.proxyServer = response.data.proxyServer;
              proxy.expired = response.data.expired;
              proxy.cookie = response.data.cookie;
              proxy.profile = response.data.profile;
              proxy.appiumPort = response.data.appiumPort;
              proxy.deviceName = response.data.deviceName;
              proxy.platformVersion = response.data.platformVersion;
            }
          });
        }
        this.proxyPrompt = false;
      });
    },
    goDashboard(id) {
      this.$router.push(`/dashboard/${btoa(id)}`)
    },
    saveSetting(item) {
      this.$http.put(`api/admin2/instagram/proxy/${this.selectedProxyId}/option`, item).then((response) => {
        if (response.data) {
          this.periodProxys.forEach((period) => {
            const proxy = period.instagramProxys.filter(item => item.id === this.selectedProxyId)[0];
            if (proxy) {
              proxy.instagramOption = response.data;
            }
          });
        }
      });
      this.showDialog = false;
    },
    selectSetting(item) {
      this.showDialog = true;
      this.selectedProxyId = item.id;
      this.selectedInstagramOption = _.cloneDeep(item.instagramOption);
    },
    deleteProxy(periodId, proxyId) {
      this.deleteConfirm = true;
      this.selectedPeriodId = periodId;
      this.selectedProxyId = proxyId;
    },
    onDeleteProxy() {
      this.$http.delete(`api/admin2/period/${this.selectedPeriodId}/proxy/${this.selectedProxyId}`, {
        params: {
          removeLog: this.removeLog,
        },
      }).then((response) => {
        this.refreshAll();
      });
      this.deleteConfirm = false;
    },
    selectProxy(item) {
      this.proxy = _.cloneDeep(item);
      this.proxyPrompt = true;
    },
    updateProxyIp() {
      this.$http.put(`api/instagram/proxy/${this.proxy.id}/proxy-server`, this.proxy).then((response) => {
        if (response.data) {
          this.periodProxys.forEach((item) => {
            const proxy = item.instagramProxys.filter(item => item.id === this.proxy.id)[0];
            proxy.proxyServer = this.proxy.proxyServer;
          });
        }
      });
    },
    getWorkPools() {
      this.$http.get(`api/admin2/workpool`).then((response) => {
        if (response.data) {
          this.workpools = response.data;
        }
      });
    },
    getPeriodProxys() {
      this.$http.get('api/admin2/instagram/period-proxy').then((response) => {
        if (response.data) {
          this.periodProxys = response.data;
        }
      });
    },
    getAllLogsInProxy() {
      this.$http.get('api/instagram/log/work-account/proxy-all', {
        params: {
          date: new Date().toLocaleDateString(),
        }
      }).then((response) => {
        if (response.data) {
          this.logs = response.data;
          // response.data.forEach((item) => {
          //   this.logs = item;
          // })
        }
      });
    },
    router(route) {
      this.$router.push(route);
    },
    startWork(periodId, id) {
      this.$http.get(`api/admin2/instagram/proxy/start/${id}`, {
          params: {
            name: (this.selectedWorkPool) ? this.selectedWorkPool.name : null,
          },
        }).then((response) => {
          this.refresh();
        });
    },
    stopWork(periodId, id) {
      this.$http.get(`api/admin2/instagram/proxy/stop/${id}`).then((response) => {
        this.refresh();
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
