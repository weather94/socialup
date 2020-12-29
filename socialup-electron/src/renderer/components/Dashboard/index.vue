<template>
  <div class="dashboard-wrapper">
    <md-empty-state v-if="!this.$store.state.instagram.username"
      md-icon="repeat"
      md-label="계정 데이터가 없습니다."
      md-description="좌측 '마이페이지' 메뉴를 들어가서 인스타그램 계정 등록을 해주세요.">
      <md-button class="md-primary md-raised" @click="route('/mypage')">등록 하러가기</md-button>
    </md-empty-state>

    <div class="md-layout" v-if="this.$store.state.instagram.username">
      <div class="md-layout-item">
        <div class="md-layout" :style="{marginBottom: '20px'}">
          <div class="md-layout-item">
            <md-card class="md-primary weather-vpadding-10" :style="{backgroundColor: 'rgba(200,158,196, 1)'}" md-with-hover>
              <md-ripple>
                <md-card-header>
                  게시글
                  <div class="md-title">{{this.$store.getters.getTodayBoardCount}}</div>
                </md-card-header>
              </md-ripple>
            </md-card>
          </div>
          <div class="md-layout-item">
            <md-card class="md-primary weather-vpadding-10" :style="{backgroundColor: 'rgba(68,138,255, 1)'}" md-with-hover>
              <md-ripple>
                <md-card-header>
                  팔로워
                  <div class="md-title">{{this.$store.getters.getTodayFollowerCount}}</div>
                </md-card-header>
              </md-ripple>
            </md-card>
          </div>
          <div class="md-layout-item">
            <md-card class="md-primary weather-vpadding-10" :style="{backgroundColor: 'rgba(238,119,133, 1)'}" md-with-hover>
              <md-ripple>
                <md-card-header>
                  팔로잉
                  <div class="md-title">{{this.$store.getters.getTodayFollowingCount}}</div>
                </md-card-header>
              </md-ripple>
            </md-card>
          </div>
        </div>
        <div>
          <line-chart :chart-data="datacollection" :options="chartOptions" />
        </div>
      </div>
      <div class="md-layout-item my-tab md-xsmall-size-100">
        <md-card class="maxHeight500">
          <md-subheader class="md-primary align-center">작업기록</md-subheader>
          <!-- <div style="text-align: center; padding: 5px; color: white; background-color: #448aff;">
            {{$store.state.flag.title}}
          </div> -->
          <md-progress-bar md-mode="determinate" :md-value="amount" style="height: 15px;"></md-progress-bar>
          <md-card-content style="min-height: 400px;">
            <div class="md-layout md-alignment-center-ceneter" :style="{marginBottom: '15px'}">
              <div class="md-layout-item align-center">
                <md-icon class="w-follow">person_add</md-icon>
                <span>{{`${this.$store.getters.getInstagramLogs.follow}/${(selectedSetting) ? selectedSetting.followLimitPerDay : 0}`}}</span>
              </div>
              <div class="md-layout-item align-center">
                <md-icon class="w-like">favorite</md-icon>
                <span>{{`${this.$store.getters.getInstagramLogs.likeCount}/${(selectedSetting) ? selectedSetting.likeLimitPerDay : 0}`}}</span>
              </div>
              <div class="md-layout-item align-center">
                <md-icon class="w-comment">comment</md-icon>
                <span>{{`${this.$store.getters.getInstagramLogs.comment}/${(selectedSetting) ? selectedSetting.commentLimitPerDay : 0}`}}</span>
              </div>
              <div class="md-layout-item align-center">
                <md-icon class="w-unfollow">remove_circle_outline</md-icon>
                <span>{{`${this.$store.getters.getInstagramLogs.unfollow}/${(selectedSetting) ? selectedSetting.followLimitPerDay : 0}`}}</span>
              </div>
            </div>
            <div>
              <div v-for="(log, index) in logs" :key="index" :style="{marginBottom: '10px'}">
                <div v-if="log.type === 20" class="md-layout md-alignment-center-space-around" style="color: crimson;">
                  <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                    <md-icon style="color: crimson;">event_available</md-icon>
                  </div>
                  <div class="md-layout-item md-size-15 md-layout md-alignment-center-center">
                    <span>{{log.time.slice(0, 5)}}</span>
                  </div>
                  <div class="md-layout-item md-size-75  md-layout md-alignment-center-center">
                    {{log.text}}
                  </div>
                </div>
                <div v-else class="md-layout md-alignment-center-space-around">
                  <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                    <md-icon v-if="log.type===1" class="w-follow">person_add</md-icon>
                    <md-icon v-if="log.type===2" class="w-like">favorite</md-icon>
                    <md-icon v-if="log.type===3" class="w-comment">comment</md-icon>
                    <md-icon v-if="log.type===4" class="w-unfollow">remove_circle_outline</md-icon>
                  </div>
                  <div class="md-layout-item md-size-15 md-layout md-alignment-center-center">
                    <span>{{log.time.slice(0, 5)}}</span>
                  </div>
                  <div class="md-layout-item md-size-25  md-layout md-alignment-center-center">
                    {{log.user}}
                  </div>
                  <div class="md-layout-item md-size-25  md-layout md-alignment-center-center">
                    {{log.tag}}
                  </div>
                  <div class="md-layout-item md-size-25  md-layout md-alignment-center-center">
                    {{(log.text.length > 5) ? `${log.text.slice(0, 5)}...` : log.text}}
                  </div>
                </div>
              </div>
            </div>
          </md-card-content>

          <md-card-actions>
            <select v-model="perPage" style="margin-right: 10px;">
              <option>10</option>
              <option>20</option>
              <option>30</option>
            </select>
            <md-button @click="route('/instagramlog')">자세히 보기</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from './LineChart';

export default {
  components: {
    LineChart,
  },
  data() {
    return {
      perPage: 10,
      selectedLog: 'follow',
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              // fixedStepSize: 1,
            },
          }],
        },
      },
    };
  },
  computed: {
    logs() {
      const id = this.$store.state.instagram.loginId;
      const key = this.$store.state.instagram.todayKey;
      if (this.$store.state.instagram.logs[id] && this.$store.state.instagram.logs[id][key] && this.$store.state.instagram.logs[id][key].details) {
        return this.$store.state.instagram.logs[id][key].details.slice(-this.perPage).reverse();
      }
      return [];
    },
    selectedSetting() {
      try {
        const setting = this.$store.state.instagram.settings.filter(item => item.name === this.$store.state.process[this.$store.state.instagram.loginId].settingName)[0];
        return setting;
      } catch (e) {
        return null;
      }
    },
    amount() {
      if (this.$store.state.instagram.selectedSetting) {
        const sumTarget = (Number(this.$store.state.instagram.selectedSetting.followLimitPerDay) * 2) + Number(this.$store.state.instagram.selectedSetting.likeLimitPerDay) + Number(this.$store.state.instagram.selectedSetting.commentLimitPerDay);
        const sumCurrent = Number(this.$store.getters.getInstagramLogs.follow) + Number(this.$store.getters.getInstagramLogs.likeCount) + Number(this.$store.getters.getInstagramLogs.comment) + Number(this.$store.getters.getInstagramLogs.unfollow);
        return (sumCurrent / sumTarget) * 100;
      }
      return 0;
    },
    instaPeriod() {
      if (this.$store.state.member.member.periods && this.$store.state.member.member.periods.manage) {
        return new Date(this.$store.state.member.member.periods.manage.expired).toLocaleString();
      }
      return new Date(this.$store.state.member.member.regDate).toLocaleString();
    },
    datacollection() {
      if (this.$store.state.instagram.loginId && this.$store.state.instagram.accountlogs && this.$store.state.instagram.accountlogs[this.$store.state.instagram.loginId]) {
        const datacollection = {};
        const last = new Date();
        last.setDate(last.getDate() - 30);
        let keys = Object.keys(this.$store.state.instagram.accountlogs[this.$store.state.instagram.loginId]).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
        keys = keys.filter(item => new Date(item) >= last);

        datacollection.labels = keys;
        const follower = keys.map(key => this.$store.state.instagram.accountlogs[this.$store.state.instagram.loginId][key].follower);
        const following = keys.map(key => this.$store.state.instagram.accountlogs[this.$store.state.instagram.loginId][key].following);
        const board = keys.map(key => this.$store.state.instagram.accountlogs[this.$store.state.instagram.loginId][key].board);
        datacollection.datasets = [{
          label: '팔로워',
          borderColor: 'rgba(68,138,255, 1)',
          // backgroundColor: 'rgba(68,138,255, 0.5)',
          data: follower,
        }];
        datacollection.datasets = datacollection.datasets.concat([{
          label: '팔로잉',
          borderColor: 'rgba(238,119,133, 1)',
          // backgroundColor: 'rgba(238,119,133, 0.5)',
          data: following,
        }]);
        datacollection.datasets = datacollection.datasets.concat([{
          label: '게시글',
          borderColor: 'rgba(200,158,196, 1)',
          // backgroundColor: 'rgba(200,158,196, 0.5)',
          data: board,
        }]);
        return datacollection;
      }
      return null;
    },
  },
  methods: {
    route(url) {
      this.$router.push(url);
    },
    test() {
      this.$store.dispatch('clearTodayLogs');
    },
    selectLog(value) {
      this.selectedLog = value;
    },
    clearLogs() {
      this.$store.dispatch('clearLogs');
    },
  },
};
</script>

<style lang="css" scoped>
.md-card-header:last-child {
  margin: 0;
}
.weather-elem {
  padding: 5px;
}
.weather-period {
  margin: 16px;
  text-align: right;
}
</style>
