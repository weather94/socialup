<template>
  <div class="friend">
    <md-empty-state v-if="!this.$store.state.instagram.loginId"
      md-icon="repeat"
      md-label="계정 데이터가 없습니다."
      md-description="좌측 '마이페이지' 메뉴를 들어가서 인스타그램 계정 등록을 해주세요.">
      <md-button class="md-primary md-raised" @click="$router.push('/mypage')">등록 하러가기</md-button>
    </md-empty-state>
    <div v-if="$store.state.instagram.loginId">
      <div class="">
        * 친구목록이 많은 경우 친구목록 불러오기가 오래걸립니다. 이럴땐 친구목록 수동추가를 사용해주세요. <a href="#" @click="openUrl('http://socialup.kr/support')">수동추가 방법 알아보기</a>
      </div>
      <!-- <md-button class="md-raised md-accent" v-if="$store.state.instagram.friends && $store.state.instagram.friends[$store.state.instagram.loginId]" :disabled="$store.state.flag.flagGetFriends.loading || this.$store.state.instagram.process !== null" @click="unfollowWithoutMutual">맞팔 제외 언팔하기</md-button>
      <md-button class="md-raised md-accent" v-if="$store.state.instagram.friends && $store.state.instagram.friends[$store.state.instagram.loginId]" :disabled="$store.state.flag.flagGetFriends.loading || this.$store.state.instagram.process !== null" @click="unfollowAll">모두 언팔하기</md-button> -->
      <md-button class="md-raised md-primary" :disabled="$store.state.flag.flagGetFriends.loading" @click="getFriends">친구목록 불러오기</md-button>
      <md-button class="md-raised md-primary" :disabled="$store.state.flag.flagGetFriends.loading" @click="showLoadData">친구목록 수동추가</md-button>
      <input id="load_data" type="file" @change="loadData" accept=".json" hidden/>
      <div class="w-progress-bar" v-if="$store.state.flag.flagGetFriends.loading">
        <md-progress-bar md-mode="determinate" :md-value="progress" style="height: 15px;"></md-progress-bar>
        <div class="md-layout md-alignment-center-right">
          {{`${this.$store.state.flag.flagGetFriends.followersCount + this.$store.state.flag.flagGetFriends.followingCount}/${this.$store.getters.getTodayFollowerCount + this.$store.getters.getTodayFollowingCount}`}}
        </div>
      </div>

      <div v-if="$store.state.instagram.friends && $store.state.instagram.friends[$store.state.instagram.loginId]">
        <div class="md-layout md-alignment-center-left">
          <md-radio v-model="radio" value="all" @change="changeView">
            전체
            <md-tooltip md-direction="top">전체유저</md-tooltip>
          </md-radio>
          <md-radio v-model="radio" value="follower" @change="changeView">팔로워
            <md-tooltip md-direction="top">나를 팔로잉하는 사람</md-tooltip>
          </md-radio>
          <md-radio v-model="radio" value="following" @change="changeView">팔로잉
            <md-tooltip md-direction="top">내가 팔로잉하는 사람</md-tooltip>
          </md-radio>
          <md-radio v-model="radio" value="mutual" @change="changeView">맞팔로우
            <md-tooltip md-direction="top">서로를 팔로잉하는 사람</md-tooltip>
          </md-radio>
          <md-radio v-model="radio" value="onlyfollower" @change="changeView">시크릿팬
            <md-tooltip md-direction="top">상대방만 나를 팔로우하고 있는 유저</md-tooltip>
          </md-radio>
          <md-radio v-model="radio" value="onlyfollowing" @change="changeView">스타
            <md-tooltip md-direction="top">내가 팔로우신청을 했지만 맞팔하지 않은 유저</md-tooltip>
          </md-radio>
          <span v-if="radio === 'all'">총 {{(this.$store.getters.getFriends) ? this.$store.getters.getFriends.length : 0}}명</span>
          <span v-if="radio === 'follower'">총 {{(this.$store.getters.getFollowers) ? this.$store.getters.getFollowers.length : 0}}명</span>
          <span v-if="radio === 'following'">총 {{(this.$store.getters.getFollowings) ? this.$store.getters.getFollowings.length : 0}}명</span>
          <span v-if="radio === 'mutual'">총 {{(this.$store.getters.getMutuals) ? this.$store.getters.getMutuals.length : 0}}명</span>
          <span v-if="radio === 'onlyfollower'">총 {{(this.$store.getters.getOnlyFollowers) ? this.$store.getters.getOnlyFollowers.length : 0}}명</span>
          <span v-if="radio === 'onlyfollowing'">총 {{(this.$store.getters.getOnlyFollowings) ? this.$store.getters.getOnlyFollowings.length : 0}}명</span>
        </div>

        <div class="">
          <md-subheader>{{`마지막 갱신날짜 ${$store.state.instagram.friends[$store.state.instagram.loginId].date}`}}</md-subheader>
          <md-chip md-clickable v-for="(friend, index) in friends" @click="openProfile(friend)" :key="index">{{friend.name}}</md-chip>
        </div>
        <div class="md-layout md-alignment-center-center">
          <md-button class="md-layout-item md-raised md-primary" @click="moreView">더보기</md-button>
        </div>
      </div>
      <div v-else>
        <md-empty-state
          md-icon="repeat"
          md-label="친구목록이 없습니다."
          md-description="친구목록 데이터가 존재하지 않습니다. 친구목록을 먼저 불러와 주세요.">
        </md-empty-state>
      </div>

      <md-dialog-alert
        :md-active.sync="errorDialog"
        md-title="에러발생"
        :md-content="snackbarContent" />

      <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
        <span>{{snackbarContent}}</span>
        <md-button class="md-primary" @click="showSnackbar = false">닫기</md-button>
      </md-snackbar>
    </div>
  </div>
</template>

<script>
import FileStorage from '@/assets/js/FileStorage';
import GetFollowers from '@/assets/js/GetFollowers';
import GetFollowing from '@/assets/js/GetFollowing';
import windowHandler from '@/assets/js/windowHandler';
// import Test from '@/assets/js/Test';

export default {
  name: 'friend',
  data() {
    return {
      radio: 'all',
      unFollowWorker: null,
      accountId: 0,
      showSnackbar: false,
      snackbarContent: '',
      friendsCount: 300,
      errorDialog: false,
    };
  },
  computed: {
    progress() {
      return ((this.$store.state.flag.flagGetFriends.followersCount + this.$store.state.flag.flagGetFriends.followingCount) / (this.$store.getters.getTodayFollowerCount + this.$store.getters.getTodayFollowingCount)) * 100;
    },
    friends() {
      if (this.friendsCount) {
        if (this.radio === 'all') {
          return this.$store.getters.getFriends.slice(0, this.friendsCount);
        } else if (this.radio === 'follower') {
          return this.$store.getters.getFollowers.slice(0, this.friendsCount);
        } else if (this.radio === 'following') {
          return this.$store.getters.getFollowings.slice(0, this.friendsCount);
        } else if (this.radio === 'mutual') {
          return this.$store.getters.getMutuals.slice(0, this.friendsCount);
        } else if (this.radio === 'onlyfollower') {
          return this.$store.getters.getOnlyFollowers.slice(0, this.friendsCount);
        } else if (this.radio === 'onlyfollowing') {
          return this.$store.getters.getOnlyFollowings.slice(0, this.friendsCount);
        }
      }
      return null;
    },
  },
  methods: {
    openProfile(user) {
      windowHandler.openBrowser(`https://www.instagram.com/${user.name}/`);
    },
    openUrl(url) {
      windowHandler.openBrowser(url);
    },
    showLoadData() {
      document.getElementById('load_data').click();
    },
    loadData(value) {
      if (value.target.files[0] && value.target.files[0].path) {
        const storage = new FileStorage(null, value.target.files[0].path);
        const followers = Object.keys(storage.get('followers'));
        const following = Object.keys(storage.get('following'));
        this.$store.dispatch('setFriends', {
          id: this.$store.state.instagram.loginId,
          followers,
          following,
        });
      }
    },
    setFriends() {
      if (this.$store.state.flag.flagGetFriends.followers.length > 0 && this.$store.state.flag.flagGetFriends.following.length > 0) {
        this.$store.dispatch('setFriends', {
          id: this.$store.state.instagram.loginId,
          followers: this.$store.state.flag.flagGetFriends.followers,
          following: this.$store.state.flag.flagGetFriends.following,
        });
        this.$store.dispatch('finishGetFriends');
      }
    },
    changeView() {
      this.friendsCount = 300;
    },
    moreView() {
      this.friendsCount += 300;
    },
    async getFriends() {
      if (!this.$store.state.flag.flagGetFriends.loading) {
        this.$store.dispatch('startGetFriends');
        GetFollowers(this.$store, this.setFriends);
        GetFollowing(this.$store, this.setFriends);
      }
    },
  },
};
</script>

<style lang="css">
.w-progress-bar {
  margin-top: 10px;
}
.card-in-primary {
  background-color: #448aff !important;
  color: white;
  font-weight: bold;
}
.card-in-accent {
  background-color: #ff5252 !important;
  color: white;
  font-weight: bold;
}
</style>
