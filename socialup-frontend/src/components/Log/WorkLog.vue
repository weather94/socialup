<template>
  <div class="container" style="margin-top:30px; margin-bottom:30px;">
    <div class="md-layout md-gutter md-alignment-center-right">
      <!-- <div>
        <md-datepicker v-model="startDate" md-immediately >
          <label>시작날짜</label>
        </md-datepicker>
      </div> -->
      <md-button @click="minusDay" class="md-icon-button md-accent md-raised">
        <md-icon>keyboard_arrow_left</md-icon>
      </md-button>
      <div style="margin-left: 20px;">
        <md-datepicker v-model="endDate" md-immediately @md-closed="getWorkLog">
          <label>종료날짜</label>
        </md-datepicker>
      </div>
      <md-button @click="plusDay" class="md-icon-button md-accent md-raised">
        <md-icon>keyboard_arrow_right</md-icon>
      </md-button>
    </div>
    <md-card :md-with-hover="true" v-for="(log, index) in workLogs" :key="index" style="padding: 10px 10px 10px 10px; margin: 10px;">
      <div class="md-layout md-alignment-center-center">
        <div class="md-layout-item md-size-10 align-center">
          {{log.id}}
        </div>
        <div class="md-layout-item md-size-10 align-center">
          {{log.date}}
        </div>
        <div class="md-layout-item md-size-25 align-center">
          {{log.email}}
        </div>
        <div class="md-layout-item md-size-10 align-center">
          <md-icon class="w-follow">person_add</md-icon>
          {{`${log.follow} (${log.followOmit})`}}
        </div>
        <div class="md-layout-item md-size-10 align-center">
          <md-icon class="w-like">favorite</md-icon>
          {{`${log.likeCount} (${log.likeOmit})`}}
        </div>
        <div class="md-layout-item md-size-10 align-center">
          <md-icon class="w-comment">comment</md-icon>
          {{`${log.comment} (${log.commentOmit})`}}
        </div>
        <div class="md-layout-item md-size-10 align-center">
          <md-icon class="w-comment">remove_circle_outline</md-icon>
          {{`${log.unfollow} (${log.unfollowOmit})`}}
        </div>
        <div class="md-layout-item md-size-10 align-center">
          <md-icon style="color: green;">check_circle</md-icon>
          {{log.followback}}
        </div>
      </div>
    </md-card>
  </div>
</template>

<script>
export default {
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
    this.getWorkLog();
  },
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      workLogs: [],
    };
  },
  methods: {
    route(path) {
      this.$router.push(path);
    },
    getWorkLog() {
      this.$http.get('api/instagram/log/work', {
        params: {
          // startDate: this.startDate.toLocaleDateString(),
          date: this.endDate.toLocaleDateString(),
        }
      }).then((response) => {
        if (response.data) {
          this.workLogs = response.data;
        }
      });
    },
    minusDay() {
      this.endDate = new Date(new Date().setDate(this.endDate.getDate() - 1));
      this.getWorkLog();
    },
    plusDay() {
      this.endDate = new Date(new Date().setDate(this.endDate.getDate() + 1));
      this.getWorkLog();
    },
  },
};
</script>

<style lang="css" scoped>
</style>
