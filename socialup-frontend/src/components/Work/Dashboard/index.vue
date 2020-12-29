<template>
  <div class="dashboard gray-bg">
    <div class="container" style="padding:30px 0 30px 0;">
      <div v-if="dashboard">
        <div class="md-layout md-alignment-center-center w-profile" v-if="profile">
          <div class="md-layout-item md-size-20 md-small-size-50" style="text-align: center;">
            <img class="instagram-avatar" :src="profile.profile_pic_url" alt="Cover">
          </div>
          <div class="md-layout-item md-size-30 md-small-size-50">
            <div class="w-profile-username">
              {{`@${profile.username}`}}
            </div>
            <div class="w-profile-name">
              {{profile.full_name}}
            </div>
            <div class="w-profile-info">
              {{(profile.biography.length > 15) ? `${profile.biography.slice(0, 15)}...` : profile.biography}}
            </div>
          </div>
          <div class="md-layout-item md-size-50 md-small-size-100 md-layout md-alignment-center-right">
            <div class="w-profile-value">
              업로드
              <div class="w-number">
                {{(accountlogs[0]) ? accountlogs.slice(-1)[0].board : 0}}
              </div>
            </div>
            <div class="w-profile-value">
              팔로워
              <div class="w-number">
                {{(accountlogs[0]) ? accountlogs.slice(-1)[0].follower : 0}}
              </div>
            </div>
            <div class="w-profile-value">
              팔로잉
              <div class="w-number">
                {{(accountlogs[0]) ? accountlogs.slice(-1)[0].following : 0}}
              </div>
            </div>
            <div class="w-profile-value">
              참여도
              <div class="w-number">
                {{`${(profile.sum.like !== 0) ? Math.ceil(profile.sum.comment/profile.sum.like*100) : 0}%`}}
              </div>
              <md-tooltip md-direction="top">참여도란 게시글의 댓글/좋아요 비율으로 유저들이 게시물에 얼마나 참여하는지를 나타내는 지표입니다.</md-tooltip>
            </div>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-right">
          <div>
            <md-datepicker v-model="startDate" md-immediately >
              <label>시작날짜</label>
            </md-datepicker>
          </div>
          <div style="margin-left: 20px;">
            <md-datepicker v-model="endDate" md-immediately >
              <label>종료날짜</label>
            </md-datepicker>
          </div>
        </div>
        <div style="margin-bottom: 20px;">
          <line-chart :chart-data="datacollection" :options="chartOptions" :height="400" />
        </div>
        <div class="md-layout md-gutter" style="margin-bottom: 20px;">
          <div class="md-layout-item md-size-50 md-small-size-100">
            <md-table md-card style="min-height: 450px;">
              <md-table-row>
                <md-table-head class="align-center">
                  <md-icon>date_range</md-icon>
                  <md-tooltip md-direction="top">날짜</md-tooltip>
                </md-table-head>
                <md-table-head class="align-center">
                  <md-icon class="w-follow">person_add</md-icon>
                  <md-tooltip md-direction="top">팔로우</md-tooltip>
                </md-table-head>
                <md-table-head class="align-center">
                  <md-icon class="w-like">favorite</md-icon>
                  <md-tooltip md-direction="top">좋아요</md-tooltip>
                </md-table-head>
                <md-table-head class="align-center">
                  <md-icon class="w-comment">comment</md-icon>
                  <md-tooltip md-direction="top">댓글</md-tooltip>
                </md-table-head>
                <md-table-head class="align-center">
                  <md-icon class="w-unfollow">remove_circle_outline</md-icon>
                  <md-tooltip md-direction="top">언팔로우</md-tooltip>
                </md-table-head>
                <md-table-head class="align-center">
                  <md-icon class="w-unfollow">people</md-icon>
                  <md-tooltip md-direction="top">맞팔로우</md-tooltip>
                </md-table-head>
              </md-table-row>

              <md-table-row v-for="(item, index) in worklogs.slice((currentPage - 1)*perPage, currentPage*perPage)" :key="index">
                <md-table-cell class="align-center">
                  <span style="white-space:nowrap;">
                    {{`${item.date}\r\n`}}
                  </span>
                </md-table-cell>
                <md-table-cell class="w-follow align-center">
                  {{item.follow}}
                </md-table-cell>
                <md-table-cell class="w-like align-center">
                  {{item.likeCount}}
                </md-table-cell>
                <md-table-cell class="align-center">
                  {{item.comment}}
                </md-table-cell>
                <md-table-cell class="align-center">
                  {{item.unfollow}}
                </md-table-cell>
                <md-table-cell class="align-center">
                  {{item.followback}}
                </md-table-cell>
              </md-table-row>
            </md-table>
            <div>
                <pagination2
                  :perPage="perPage"
                  :total="(worklogs) ? worklogs.length : 0"
                  @change="changePage"></pagination2>
              </div>
          </div>
          <div class="md-layout-item my-tab md-xsmall-size-100">
            <md-card class="">
              <md-subheader class="md-primary align-center">최근 활동로그</md-subheader>
              <md-progress-bar md-mode="determinate" :md-value="30" style="height: 20px;"></md-progress-bar>
              <md-card-content style="min-height: 380px;">
                <div class="md-layout md-alignment-center-ceneter" :style="{marginBottom: '15px'}">
                  <div class="md-layout-item align-center">
                    <md-icon class="w-follow">person_add</md-icon>
                    <span>{{`${(worklogs[0]) ? worklogs[0].follow : 0}/${dashboard.setting.followLimitPerDay}`}}</span>
                  </div>
                  <div class="md-layout-item align-center">
                    <md-icon class="w-like">favorite</md-icon>
                    <span>{{`${(worklogs[0]) ? worklogs[0].likeCount : 0}/${dashboard.setting.likeLimitPerDay}`}}</span>
                  </div>
                  <div class="md-layout-item align-center">
                    <md-icon class="w-comment">comment</md-icon>
                    <span>{{`${(worklogs[0]) ? worklogs[0].comment : 0}/${dashboard.setting.commentLimitPerDay}`}}</span>
                  </div>
                  <div class="md-layout-item align-center">
                    <md-icon class="w-unfollow">remove_circle_outline</md-icon>
                    <span>{{`${(worklogs[0]) ? worklogs[0].unfollow : 0}/${dashboard.setting.followLimitPerDay}`}}</span>
                  </div>
                </div>
                <div v-if="workLogDetails">
                  <div v-for="(log, index) in workLogDetails" :key="index" :style="(log.omit) ? { backgroundColor: 'rgba(255, 40, 68, 0.4)', padding: '5px 0 5px 0' } : { padding: '5px 0 5px 0' }">
                    <div v-if="log.type===20" class="md-layout md-alignment-center-space-around" style="color: crimson;">
                      <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                        <md-icon style="color: crimson;">event_available</md-icon>
                      </div>
                      <div class="md-layout-item md-size-15 md-layout md-alignment-center-center">
                        <span>{{log.time}}</span>
                      </div>
                      <div class="md-layout-item md-size-50  md-layout md-alignment-center-center">
                        {{log.text}}
                      </div>
                    </div>
                    <div v-else class="md-layout md-alignment-center-space-around">
                      <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                        <md-icon v-if="log.type===1" class="w-follow">person_add</md-icon>
                        <md-icon v-if="log.type===2" class="w-like">favorite</md-icon>
                        <md-icon v-if="log.type===3" class="w-comment">comment</md-icon>
                        <md-icon v-if="log.type===4" class="w-unfollow">remove_circle_outline</md-icon>
                        <md-icon v-if="log.type===5" style="color: green;">check_circle</md-icon>
                        <md-icon v-if="log.type===10" class="w-follow">cloud_download</md-icon>
                      </div>
                      <div class="md-layout-item md-size-15 md-layout md-alignment-center-center">
                        <span>{{log.time}}</span>
                      </div>
                      <div class="md-layout-item md-size-25  md-layout md-alignment-center-center">
                        {{log.value}}
                      </div>
                      <div class="md-layout-item md-size-25  md-layout md-alignment-center-center">
                        {{log.text}}
                      </div>
                    </div>
                  </div>
                </div>
              </md-card-content>
            </md-card>
          </div>
        </div>
        <div v-if="profile && profile.tag_rank && profile.tag_rank.length > 0">
          <div class="w-subtitle">
            최근 업로드 게시물 태그 사용횟수
          </div>
          <div>
            <md-chip v-for="(tag, index) in profile.tag_rank" :key="index">{{`${tag.tag} ${tag.count}회`}}</md-chip>
          </div>
        </div>
        <div v-if="profile && profile.timeline.edges && profile.timeline.edges.length > 0">
          <div class="w-subtitle">
            {{`최근 업로드 ( 좋아요 ${profile.sum.like} 댓글 ${profile.sum.comment} )`}}
          </div>
          <div class="md-layout md-alignment-center-space-between">
            <md-card class="my-card" v-for="(media, index) in profile.timeline.edges" :key="index">
              <md-card-media-actions>
                <md-card-media>
                  <img :src="media.thumbnail" alt="media">
                </md-card-media>

                <md-card-actions>
                  <div class="w-height-40">
                    <md-icon class="w-like">favorite</md-icon> {{media.like}}
                  </div>
                  <div class="w-height-40">
                    <md-icon>comment</md-icon> {{media.comment}}
                  </div>
                  <div class="w-height-40">
                    {{`${(media.like !== 0) ? Math.ceil(media.comment/media.like*100) : 0}%`}}
                  </div>
                </md-card-actions>
              </md-card-media-actions>
            </md-card>
          </div>

        </div>
      </div>
      <div class="loading-overlay" v-if="loading">
        <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from './LineChart';
import pagination2 from '../pagination2';
import { setInterval, clearInterval } from 'timers';

export default {
  props: ['id'],
  components: {
    LineChart,
    pagination2,
  },
  mounted() {
    this.$material.locale = {
    startYear: 1900,
      endYear: 2099,
      dateFormat: 'YYYY-MM-DD',
      days: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      shortDays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      shorterDays: ['일', '월', '화', '수', '목', '금', '토'],
      months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      shortMonths: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      shorterMonths: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      firstDayOfAWeek: 0
    };
    this.getDashboardData();
    this.getWorkLogDetails();
    this.getWorkAndAccountLog();
    this.interval = setInterval(() => {
      this.getWorkLogDetails();
      this.getWorkAndAccountLog();
    }, 30000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  computed: {
    currentEmail() {
      return atob(this.$props.id);
    },
    worklogs() {
      if (this.dashboard && this.dashboard.worklog) {
        return this.dashboard.worklog.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      } else {
        return [];
      }
    },
    accountlogs() {
      if (this.dashboard && this.dashboard.accountlog) {
        return this.dashboard.accountlog.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
      } else {
        return [];
      }
    },
    datacollection() {
      if (this.dashboard && this.dashboard.accountlog) {
        const datacollection = {};
        const accountLogs = this.accountlogs.filter(item => new Date(item.date).toLocaleDateString() >= this.startDate.toLocaleDateString() && new Date(item.date).toLocaleDateString() <= this.endDate.toLocaleDateString());
        let keys = accountLogs.map(item => item.date);
        datacollection.labels = keys;

        const follower = accountLogs.map(item => item.follower);
        const following = accountLogs.map(item => item.following);
        const board = accountLogs.map(item => item.board);
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
  data() {
    return {
      perPage: 8,
      currentPage: 1,
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
      loading: false,
      workLogDetails: [],
      todayWorkLog: {},
      dashboard: null,
      interval: null,
      profile: null,
      chartOptions: {
        maintainAspectRatio: false,
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
  methods: {
    getDashboardData() {
      this.$http.get('api/instagram/dashboard', {
        params: {
          email: this.currentEmail,
        },
      }).then((response) => {
        if (response.data) {
          this.dashboard = response.data;
          if (response.data.profile) {
            this.profile = JSON.parse(response.data.profile);
          }
        }
      });
    },
    getWorkLogDetails() {
      this.$http.get('api/instagram/proxy/log-detail', {
        params: {
          email: this.currentEmail,
        }
      }).then((response) => {
        if (response.data) {
          this.workLogDetails = response.data.reverse(); 
        }
      })
    },
    getWorkAndAccountLog() {
      const currentDate = new Date();
      this.$http.get('api/instagram/log/work-account', {
        params: {
          email: this.currentEmail,
          date: currentDate.toLocaleDateString(),
        }
      }).then((response) => {
        if (response.data) {
          if (response.data.accountlog && this.dashboard && this.dashboard.accountlog) {
            const result = this.dashboard.accountlog.filter(item => item.id === response.data.accountlog.id)[0];
            if (result) {
              result.board = response.data.accountlog.board;
              result.follower = response.data.accountlog.follower;
              result.following = response.data.accountlog.following;
            } else {
              this.dashboard.accountlog.push(response.data.accountlog);
            }
          }
          if (response.data.worklog && this.dashboard && this.dashboard.worklog) {
            const result = this.dashboard.worklog.filter(item => item.id === response.data.worklog.id)[0];
            if (result) {
              result.follow = response.data.worklog.follow;
              result.likeCount = response.data.worklog.likeCount;
              result.comment = response.data.worklog.comment;
              result.unfollow = response.data.worklog.unfollow;
            } else {
              this.dashboard.worklog.push(response.data.worklog);
            }
          }
        }
      });
    },
    route(path) {
      this.$router.push(path);
    },
    changePage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style lang="css" scoped>
.my-card {
    width: 260px;
    margin: 4px !important;
    display: inline-block;
    vertical-align: top;
  }
.md-card {
  overflow-x: auto !important;
}
.md-card-actions {
  padding: 0px !important;
}
.w-height-40 {
  height: 40px;
}
.instagram-avatar {
  height: 110px;
  width: 110px;
  border-radius: 50%;
}
.w-profile {
  padding-top: 20px;
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
  margin: 14px;
}
.w-number {
  /* text-align: center; */
  margin-top: 10px;
  font-size: 20px;
}
.md-chip {
  margin: 2px;
}
.w-subtitle {
  margin: 10px;
}
.md-datepicker-dialog { 
  height : 286px; 
} 
.md-datepicker-body-content { 
  height : 232px! important; 
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
.md-table-cell-container {
    padding: 6px 10px 6px 10px;
}
.md-table-head-label {
  padding-right: 24px;
}
</style>
