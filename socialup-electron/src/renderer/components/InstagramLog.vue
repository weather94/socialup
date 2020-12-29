<template>
  <div class="instgram-log-wrapper">
    <md-empty-state v-if="!this.$store.state.instagram.username"
      md-icon="repeat"
      md-label="계정 데이터가 없습니다."
      md-description="좌측 '마이페이지' 메뉴를 들어가서 인스타그램 계정 등록을 해주세요.">
      <md-button class="md-primary md-raised" @click="$router.push('/mypage')">등록 하러가기</md-button>
    </md-empty-state>
    <md-empty-state v-if="this.$store.state.instagram.username && (!this.$store.state.instagram.logs || !this.$store.state.instagram.logs[this.$store.state.instagram.loginId])"
      md-icon="repeat"
      md-label="작업기록이 없습니다."
      md-description="작업을 진행하면 작업기록이 생성됩니다.">
    </md-empty-state>
    <div class="" v-if="this.$store.state.instagram.username && this.$store.state.instagram.logs && this.$store.state.instagram.logs[this.$store.state.instagram.loginId]">
      <div class="md-layout md-gutter">
        <div :class="(selected) ? 'md-layout-item md-size-50' : 'md-layout-item md-size-100'">
          <md-table md-card>
            <md-table-row style="text-align: center;">
              <md-table-head>
                <md-icon>date_range</md-icon>
                <md-tooltip md-direction="top">날짜</md-tooltip>
              </md-table-head>
              <md-table-head>
                <md-icon class="w-follow">person_add</md-icon>
                <md-tooltip md-direction="top">팔로우</md-tooltip>
              </md-table-head>
              <md-table-head>
                <md-icon class="w-like">favorite</md-icon>
                <md-tooltip md-direction="top">좋아요</md-tooltip>
              </md-table-head>
              <md-table-head>
                <md-icon class="w-comment">comment</md-icon>
                <md-tooltip md-direction="top">댓글</md-tooltip>
              </md-table-head>
              <md-table-head>
                <md-icon class="w-unfollow">remove_circle_outline</md-icon>
                <md-tooltip md-direction="top">언팔로우</md-tooltip>
              </md-table-head>
              <md-table-head v-if="!selected">
                <md-icon class="w-unfollow">people</md-icon>
                <md-tooltip md-direction="top">맞팔 / 맞팔체크 (비율)<br></md-tooltip>
              </md-table-head>
            </md-table-row>

            <md-table-row v-for="(item, index) in page"
              @click="onSelect($store.state.instagram.logs[$store.state.instagram.loginId][item])" :style="(item === selected) ? {backgroundColor: '#c7c7c7'} : null" :key="index">
              <md-table-cell>{{item}}</md-table-cell>
              <md-table-cell>
                <span class="w-follow">
                  {{$store.state.instagram.logs[$store.state.instagram.loginId][item].follow}}
                </span>
              </md-table-cell>
              <md-table-cell class="w-like">
                {{$store.state.instagram.logs[$store.state.instagram.loginId][item].likeCount}}
              </md-table-cell>
              <md-table-cell>
                {{$store.state.instagram.logs[$store.state.instagram.loginId][item].comment}}
              </md-table-cell>
              <md-table-cell>
                {{$store.state.instagram.logs[$store.state.instagram.loginId][item].unfollow}}
              </md-table-cell>
              <md-table-cell v-if="!selected">
                {{
                  ($store.state.instagram.logs[$store.state.instagram.loginId][item].unfollowProcess) ? ($store.state.instagram.logs[$store.state.instagram.loginId][item].follow > $store.state.instagram.logs[$store.state.instagram.loginId][item].unfollowProcess) ? `${$store.state.instagram.logs[$store.state.instagram.loginId][item].followback}/${$store.state.instagram.logs[$store.state.instagram.loginId][item].unfollowProcess} (${Math.ceil($store.state.instagram.logs[$store.state.instagram.loginId][item].followback/$store.state.instagram.logs[$store.state.instagram.loginId][item].unfollowProcess*100)}%)` : `${$store.state.instagram.logs[$store.state.instagram.loginId][item].followback} (${Math.ceil($store.state.instagram.logs[$store.state.instagram.loginId][item].followback/$store.state.instagram.logs[$store.state.instagram.loginId][item].unfollowProcess*100)}%)` : 'X'
                }}
              </md-table-cell>
            </md-table-row>
          </md-table>
        </div>
        <div class="md-layout-item md-size-50" v-if="selected">
          <md-card>
            <md-subheader class="md-primary">Details</md-subheader>
            <div v-for="(log, index) in selected.details.slice((currentDetailPage-1)*9, currentDetailPage*9)" :key="index"
              @click="openUrl(log)" :style="(log.omit) ? { backgroundColor: 'rgba(255, 40, 68, 0.4)' } : null">
              <div v-if="log.type === 20" class="md-layout md-alignment-center-space-around weather-item" style="color: crimson;">
                <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                  <md-icon style="color: crimson;">event_available</md-icon>
                </div>
                <div class="md-layout-item md-size-15 md-layout md-alignment-center-center">
                  <span>{{log.time.slice(0, 8)}}</span>
                </div>
                <div class="md-layout-item md-size-75  md-layout md-alignment-center-center">
                  {{log.text}}
                </div>
              </div>
              <div v-else class="md-layout md-alignment-center-space-around weather-item">
                <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
                  <md-icon v-if="log.type===1" class="w-follow">person_add</md-icon>
                  <md-icon v-if="log.type===2" class="w-like">favorite</md-icon>
                  <md-icon v-if="log.type===3" class="w-comment">comment</md-icon>
                  <md-icon v-if="log.type===4" class="w-unfollow">remove_circle_outline</md-icon>
                  <md-icon v-if="log.type===5" style="color: green;">check_circle</md-icon>
                  <md-icon v-if="log.type===10" class="w-follow">cloud_download</md-icon>
                </div>
                <div class="md-layout-item md-size-15 md-layout md-alignment-center-center">
                  <span>{{log.time.slice(0, 8)}}</span>
                </div>
                <div class="md-layout-item md-size-25  md-layout md-alignment-center-center">
                  {{log.user}}
                </div>
                <div class="md-layout-item md-size-25  md-layout md-alignment-center-center">
                  {{log.postUrl}}
                </div>
                <div class="md-layout-item md-size-25  md-layout md-alignment-center-center">
                  {{(log.text.length > 6) ? `${log.text.slice(0, 6)}...` : log.text}}
                  <md-tooltip md-direction="top">{{log.text}}</md-tooltip>
                </div>
              </div>
            </div>
            <div>
              <pagination2
                :perPage="9"
                :total="this.detailTotal"
                @change="changeDetailPage"></pagination2>
            </div>
          </md-card>
        </div>
      </div>
      <div class="md-layout" v-if="this.$store.state.instagram.logs && this.$store.state.instagram.logs[this.$store.state.instagram.loginId]">
        <pagination
          :perPage="8"
          :total="Object.keys(this.$store.state.instagram.logs[this.$store.state.instagram.loginId]).length"
          :size="6"
          @change="changePage"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/pagination';
import pagination2 from '@/components/pagination2';
import windowHandler from '@/assets/js/windowHandler';

export default {
  components: { pagination, pagination2 },
  data() {
    return {
      currentPage: 1,
      currentDetailPage: 1,
      selected: null,
    };
  },
  computed: {
    detailTotal() {
      return this.selected.details.length;
    },
    page() {
      return Object.keys(this.$store.state.instagram.logs[this.$store.state.instagram.loginId]).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).slice((this.currentPage - 1) * 8, this.currentPage * 8);
    },
  },
  methods: {
    openUrl(log) {
      if (log.type === 2 || log.type === 3) {
        this.open(`https://www.instagram.com/p/${log.postUrl}/`);
      } else if (log.type === 1 || log.type === 4) {
        this.open(`https://www.instagram.com/${log.user}/`);
      }
    },
    open(link) {
      windowHandler.openBrowser(link);
    },
    onSelect(item) {
      if (item.details) {
        if (this.selected === item) {
          this.selected = null;
        } else {
          this.selected = item;
        }
      } else {
        this.selected = null;
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    changeDetailPage(page) {
      this.currentDetailPage = page;
    },
  },
};
</script>

<style lang="css" scoped>
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
