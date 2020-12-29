<template>
  <div class="test">
    <div class="md-layout md-alignment-center-left">
      <div class="md-layout-item1">
        <md-field>
          <label>프록시서버</label>
          <md-input v-model="proxy"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item1">
        <md-checkbox v-model="mobile">모바일</md-checkbox>
      </div>
      <div class="md-layout-item1">
        <md-button class="md-raised md-primary" @click="openBrowserProxy(proxy, null, mobile)">브라우저 열기</md-button>
      </div>
    </div>
      <div v-for="(period, index) in periodProxys" :key="index">
          <md-subheader>
            {{period.expired}}
          </md-subheader>
          <md-card class="md-layout weather-instagram-proxy-item" v-for="(item, index) in period.instagramProxys" :key="index">
            <div class="md-layout-item md-layout md-gutter">
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
                  <md-button class="md-raised" @click.stop="openBrowserProxy(null, item.cookie)">
                    NO_PROXY
                  </md-button>
                  <md-button class="md-icon-button md-raised" @click.stop="openBrowserProxy(item.proxyServer, item.cookie)">
                    <md-icon  style="color: black;">link</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised" @click.stop="openBrowserProxy(item.proxyServer, item.cookie, true)">
                    <md-icon  style="color: black;">perm_device_information</md-icon>
                  </md-button>
                  <!-- <md-button class="md-icon-button md-raised" @click.stop="selectSetting(item)">
                    <md-icon>settings</md-icon>
                  </md-button> -->
                  <!-- <md-button class="md-icon-button md-raised md-primary" @click.stop="startWork(period.id, item.id)" v-if="logs && logs[item.email].start === false">
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
                  </md-button> -->
                  <!-- <md-button class="md-icon-button md-raised md-accent">
                    <md-icon>delete_forever</md-icon>
                  </md-button> -->
                </div>
            </div>
          </md-card>
        </div>
  </div>
</template>

<script>
import OpenBrowserProxy from '@/assets/js/OpenBrowserProxy';
import windowHandler from '@/assets/js/windowHandler';

export default {
  data() {
    return {
      periodProxys: [],
      logs: null,
      proxy: null,
      mobile: false,
    };
  },
  mounted() {
    this.getAllLogsInProxy();
    this.getPeriodProxys();
  },
  methods: {
    open(username) {
      windowHandler.openBrowser(`https://www.instagram.com/${username}/`);
    },
    openBrowserProxy(proxy, cookie, mobile) {
      OpenBrowserProxy(proxy, cookie, mobile);
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
        },
      }).then((response) => {
        if (response.data) {
          this.logs = response.data;
          // response.data.forEach((item) => {
          //   this.logs = item;
          // })
        }
      });
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
