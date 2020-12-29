<template>
  <div class="">
    <md-empty-state v-if="!this.$store.state.instagram.profile || !this.$store.state.instagram.username"
      md-icon="repeat"
      md-label="계정 데이터가 없습니다."
      md-description="좌측 '마이페이지' 메뉴를 들어가서 인스타그램 계정 등록을 해주세요.">
      <md-button class="md-primary md-raised" @click="route('/mypage')">등록 하러가기</md-button>
    </md-empty-state>

    <div v-if="this.$store.state.instagram.username && this.$store.state.instagram.profile">
      <div class="md-layout md-alignment-center-center w-profile">
        <div class="md-layout-item md-size-20" style="text-align: center;">
          <img class="instagram-avatar" :src="this.$store.state.instagram.profile.profile_pic_url" alt="Cover">
        </div>
        <div class="md-layout-item md-size-30">
          <div class="w-profile-username">
            {{`@${this.$store.state.instagram.profile.username}`}}
          </div>
          <div class="w-profile-name">
            {{this.$store.state.instagram.profile.full_name}}
          </div>
          <div class="w-profile-info">
            {{this.$store.state.instagram.profile.biography}}
          </div>
        </div>
        <div class="md-layout-item md-size-50 md-layout md-alignment-center-right">
          <div class="w-profile-value">
            업로드
            <div class="w-number">
              {{this.$store.state.instagram.profile.edge_owner_to_timeline_media.count}}
            </div>
          </div>
          <div class="w-profile-value">
            팔로우
            <div class="w-number">
              {{this.$store.state.instagram.profile.edge_followed_by.count}}
            </div>
          </div>
          <div class="w-profile-value">
            팔로잉
            <div class="w-number">
              {{this.$store.state.instagram.profile.edge_follow.count}}
            </div>
          </div>
          <div class="w-profile-value">
            참여도
            <div class="w-number">
              {{`${Math.ceil(this.$store.state.instagram.profile.total.comment/this.$store.state.instagram.profile.total.like*100)}%`}}
              <md-tooltip md-direction="top">참여도란 게시글의 댓글/좋아요 비율으로 유저들이 게시물에 얼마나 참여하는지를 나타내는 지표입니다.</md-tooltip>
            </div>
          </div>
        </div>
      </div>
      <div class="w-subtitle">
        최근 업로드 게시물 태그 사용횟수
      </div>
      <div class="">
        <md-chip v-for="(tag, index) in this.$store.state.instagram.profile.tag_rank" :key="index">{{`${tag.tag} ${tag.count}회`}}</md-chip>
      </div>
      <div class="w-subtitle">
        {{`최근 업로드 ( 좋아요 ${this.$store.state.instagram.profile.total.like} 댓글 ${this.$store.state.instagram.profile.total.comment} )`}}
      </div>
      <div class="md-layout md-alignment-center-space-between">
        <md-card v-for="(media, index) in this.$store.state.instagram.profile.edge_owner_to_timeline_media.edges" :key="index">
          <md-card-media-actions>
            <md-card-media>
              <img :src="media.node.thumbnail_src" alt="media">
            </md-card-media>

            <md-card-actions>
              <div class="w-height-40">
                <md-icon class="w-like">favorite</md-icon> {{media.node.edge_liked_by.count}}
              </div>
              <div class="w-height-40">
                <md-icon>comment</md-icon> {{media.node.edge_media_to_comment.count}}
              </div>
              <div class="w-height-40">
                {{`${Math.ceil(media.node.edge_media_to_comment.count/media.node.edge_liked_by.count*100)}%`}}
              </div>
            </md-card-actions>
          </md-card-media-actions>
        </md-card>
      </div>
    </div>
    <div class="loading-overlay" v-if="loading">
      <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
    </div>
  </div>
</template>

<script>
import GetProfileData from '@/assets/js/GetProfileData';
import WorkLog from '@/assets/js/WorkLog';

export default {
  mounted() {
    if (!this.$store.state.instagram.username) {
      this.route('/mypage');
    }
    if (!this.$store.state.instagram.profile || this.$store.state.instagram.profile.username !== this.$store.state.instagram.username) {
      this.getProfileData();
    }
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    route(path) {
      this.$router.push(path);
    },
    async getProfileData() {
      this.$store.dispatch('setTodayKey');
      this.$store.dispatch('setWorkTodayKey');
      if (this.$store.state.instagram.loginId &&
          this.$store.state.instagram.username) {
        this.loading = true;
        const profile = await GetProfileData(this.$store, this.$http, this.$store.state.instagram.username);
        try {
          if (profile) {
            profile.total = profile.edge_owner_to_timeline_media.edges.reduce((acc, cur) => ({
              like: acc.like + cur.node.edge_liked_by.count,
              comment: acc.comment + cur.node.edge_media_to_comment.count,
            }), { like: 0, comment: 0 });

            const tag = profile.edge_owner_to_timeline_media.edges.reduce((acc, cur) => {
              if (cur.node.edge_media_to_caption.edges[0] && cur.node.edge_media_to_caption.edges[0].node.text) {
                const words = cur.node.edge_media_to_caption.edges[0].node.text.split('#');
                words.forEach((item) => {
                  const word = item.split(' ')[0];
                  if (word !== '') {
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
            this.$store.dispatch('setUsername', profile.username);
            this.$store.dispatch('setAccountLogs', {
              id: this.$store.state.instagram.loginId,
              value: {
                board: profile.edge_owner_to_timeline_media.count,
                follower: profile.edge_followed_by.count,
                following: profile.edge_follow.count,
              },
            });
            this.loading = false;
          }
        } catch (e) {
          this.$store.dispatch('addWorkLog', new WorkLog(66, 'error', 'analysis-getProfileData', e));
        }
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.md-card {
    width: 260px;
    margin: 4px !important;
    display: inline-block;
    vertical-align: top;
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
  margin: 20px;
  margin-bottom: 40px;
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
</style>
