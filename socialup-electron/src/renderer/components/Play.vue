<template>
  <div class="instgram-log-wrapper">
    <md-empty-state v-if="Object.keys($store.state.instagram.account).length <= 0"
      md-icon="repeat"
      md-label="계정 데이터가 없습니다."
      md-description="좌측 '마이페이지' 메뉴를 들어가서 인스타그램 계정 등록을 해주세요.">
      <md-button class="md-primary md-raised" @click="$router.push('/mypage')">등록 하러가기</md-button>
    </md-empty-state>
    <div v-if="Object.keys($store.state.instagram.account).length > 0">
      <div class="md-layout">
      <md-card class="md-layout-item">
        <md-subheader class="md-primary">작업 계정</md-subheader>
            <div v-for="(item, index) in Object.keys($store.state.instagram.account)" :key="index">
              <div class="md-layout md-gutter" style="padding: 10px;">
                <div class="md-layout-item md-size-20 md-layout md-alignment-center-center">
                  <span class="weather-badge" style="background-color: rgb(200, 158, 196);">
                    {{
                      ($store.state.instagram.accountlogs[item] && $store.state.instagram.accountlogs[item][$store.state.instagram.todayKey]) ? $store.state.instagram.accountlogs[item][$store.state.instagram.todayKey].board : 0
                    }}
                  </span>
                  <span class="weather-badge" style="background-color: rgb(68, 138, 255);">
                    {{
                      ($store.state.instagram.accountlogs[item] && $store.state.instagram.accountlogs[item][$store.state.instagram.todayKey]) ? $store.state.instagram.accountlogs[item][$store.state.instagram.todayKey].follower : 0
                    }}
                  </span>
                    <span class="weather-badge" style="background-color: rgb(238, 119, 133);">
                    {{
                      ($store.state.instagram.accountlogs[item] && $store.state.instagram.accountlogs[item][$store.state.instagram.todayKey]) ? $store.state.instagram.accountlogs[item][$store.state.instagram.todayKey].following : 0
                    }}
                  </span>
                </div>
                <div class="md-layout-item md-size-20 md-layout md-alignment-center-center">
                    {{item}}
                </div>
                <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                  <div>
                    <md-icon class="w-follow">person_add</md-icon>
                    {{($store.state.instagram.logs[item] && $store.state.instagram.logs[item][$store.state.instagram.todayKey]) ? $store.state.instagram.logs[item][$store.state.instagram.todayKey].follow : 0}}
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                  <div>
                    <md-icon class="w-like">favorite</md-icon>
                    {{($store.state.instagram.logs[item] && $store.state.instagram.logs[item][$store.state.instagram.todayKey]) ? $store.state.instagram.logs[item][$store.state.instagram.todayKey].likeCount : 0}}
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                  <div>
                    <md-icon class="w-comment">comment</md-icon>
                    {{($store.state.instagram.logs[item] && $store.state.instagram.logs[item][$store.state.instagram.todayKey]) ? $store.state.instagram.logs[item][$store.state.instagram.todayKey].comment : 0}}
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                  <div>
                    <md-icon class="w-unfollow">remove_circle_outline</md-icon>
                    {{($store.state.instagram.logs[item] && $store.state.instagram.logs[item][$store.state.instagram.todayKey]) ? $store.state.instagram.logs[item][$store.state.instagram.todayKey].unfollow : 0}}
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                  <div style="text-align: center;">
                    {{$store.state.process[item] ? $store.state.process[item].settingName : ''}}
                  </div>
                </div>
                <div class="md-layout-item  md-size-5" style="text-align: right;">
                  <md-button class="md-icon-button md-raised md-primary" @click="settingWork(item)" v-if="!$store.state.process[item] || !$store.state.process[item].process">
                    <md-icon>play_arrow</md-icon>
                  </md-button>
                  <md-button class="md-icon-button md-raised md-accent" @click="stopWork(item)" v-if="$store.state.process[item] && $store.state.process[item].process">
                    <md-icon>pause</md-icon>
                  </md-button>
                </div>
              </div>
            </div>
       </md-card>
      </div>
      <div style="margin-right: 10px; margin-top: 10px; text-align:right;">
        <span><a href="javascript:void(0)" @click="allWorkerInit">전체작업 초기화</a></span>&nbsp;&nbsp;
        <span>{{`동시작업 가능계정: ${$store.state.member.member.periods.manage.allowCount + 1}개`}}</span>
      </div>
    </div>
    <md-snackbar md-position="center" :md-duration="5000" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarMent}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">닫기</md-button>
    </md-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSnackbar: false,
      snackbarMent: '',
    };
  },
  computed: {
    detailTotal() {
      return this.$store.state.instagram.logs[this.$store.state.instagram.loginId][this.selected].details.length;
    },
  },
  methods: {
    allWorkerInit() {
      Object.keys(this.$store.state.process).forEach((id) => {
        if (this.$store.state.process[id].process === true) {
          this.stopWork(id);
        }
      });
      this.$http.get('api/instagram/token/issue');
    },
    settingWork(id) {
      this.$root.$emit('settingWork', id);
    },
    stopWork(id) {
      this.$root.$emit('stopWork', id);
    },
  },
};
</script>

<style lang="css" scoped>
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
</style>
