<template>
  <div class="ghost">
    <div class="md-layout md-gutter md-alignment-center-center">
      <div class="md-layout-item">
        <md-field>
          <label>계정 아이디</label>
          <md-input v-model="loginId"></md-input>
          <div class="md-helper-text">계정 아이디를 입력해주세요.</div>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label>계정 비밀번호</label>
          <md-input v-model="loginPw" type="password"></md-input>
          <div class="md-helper-text">계정 비밀번호를 입력해주세요.</div>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-field>
          <label>계정 유저네임</label>
          <md-input v-model="loginUsername"></md-input>
          <div class="md-helper-text">계정 유저네임를 입력해주세요.</div>
        </md-field>
      </div>
      <div>
        <md-button class="md-raised md-primary" @click="saveAccount">저장</md-button> 
      </div>
    </div>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item">
        <md-field>
          <label>분석할 유저</label>
          <md-input v-model="targetUsername" @keyup.enter="analysisUser"></md-input>
          <div class="md-helper-text">분석할 유저의 주소를 입력해주세요.</div>
        </md-field>
      </div>
      <div>
        <md-button class="md-raised md-primary" @click="analysisUser">전체 추출하기</md-button> 
      </div>
      <div>
        <md-button class="md-raised md-accent" @click="showExtractData">저장하기</md-button> 
      </div>
      <div>
        <md-button class="md-raised md-accent" @click="showLoadData">불러오기</md-button> 
      </div>
      <input id="extract_data" type="file" @change="extractData" webkitdirectory directory hidden/>
      <input id="load_data" type="file" @change="loadData" accept=".txt" hidden/>
    </div>
    <div class="md-layout md-alignment-center-left">
      <div>
        <md-button class="md-raised md-primary" @click="extractUserProfile">계정 기본데이터 추출</md-button> 
      </div>
      <div>
        <md-button class="md-raised md-primary" @click="extractUserMedia">게시글 추출</md-button> 
      </div>
      <div>
        <md-button class="md-raised md-primary" @click="extractFollower">팔로워 추출</md-button> 
      </div>
      <div>
        <md-button class="md-raised md-primary" @click="extractFollowing">팔로잉 추출</md-button> 
      </div>
      <div>
        <md-button class="md-raised md-primary" @click="extractMediaDetailFirst">게시글 댓+좋 유저 추출 (처음부터)</md-button> 
      </div>
      <div>
        <md-button class="md-raised md-primary" @click="extractMediaDetailUnchecked">게시글 댓+좋 유저 추출 (추출안된부분부터)</md-button> 
      </div>
      <div>
        <md-button class="md-raised md-primary" @click="analysisFan">팬(유저) 분석</md-button> 
      </div>
      <input id="extract_data" type="file" @change="extractData" webkitdirectory directory hidden/>
      <input id="load_data" type="file" @change="loadData" accept=".txt" hidden/>
    </div>
    <md-subheader>분석된 유저</md-subheader>
    <div v-if="extract.user" style="margin-top: 20px;">
      <div class="md-layout md-alignment-center-center w-profile">
        <div class="md-layout-item md-size-30" style="text-align: center;">
          <img class="instagram-avatar" :src="extract.user.profilePicUrl" alt="Cover">
        </div>
        <div class="md-layout-item md-size-70">
          <div class="md-layout">
            <md-chip>{{extract.user.id}}</md-chip>
            <md-chip>{{(extract.user.isBusiness) ? '비즈니스 계정' : '개인 계정'}}</md-chip>
            <md-chip v-if="extract.user.isPrivate">비공개</md-chip>
            <md-chip v-if="extract.user.isVerified">인증계정</md-chip>
          </div>
          <div class="w-profile-username">
            {{`@${extract.user.username}`}}
          </div>
          <div class="w-profile-name">
            {{extract.user.fullName}}
          </div>
          <div class="w-profile-info">
            {{extract.user.biography}}
          </div>
        </div>
      </div>
      <div class="md-layout md-alignment-center-center">
        <div class="w-profile-value" style="cursor: pointer;" @click="showFollowerDialog = true">
          팔로워
          <div class="w-number">
            {{extract.user.followerCount}}
          </div>
        </div>
        <div class="w-profile-value" style="cursor: pointer;" @click="showFollowingDialog = true">
          팔로잉
          <div class="w-number">
            {{extract.user.followingCount}}
          </div>
        </div>
        <div class="w-profile-value">
          게시물 갯수
          <div class="w-number">
            {{extract.user.mediaCount}}
          </div>
        </div>
        <div class="w-profile-value" v-if="extract.user.allCommentCount">
          총 댓글 갯수
          <div class="w-number">
            {{extract.user.allCommentCount}}
          </div>
        </div>
        <div class="w-profile-value" v-if="extract.user.allCommentCount">
          평균 댓글 갯수
          <div class="w-number">
            {{Math.round(extract.user.allCommentCount/extract.user.mediaCount)}}
          </div>
        </div>
        <div class="w-profile-value" v-if="extract.user.allLikeCount">
          총 좋아요 갯수
          <div class="w-number">
            {{extract.user.allLikeCount}}
          </div>
        </div>  
        <div class="w-profile-value" v-if="extract.user.allLikeCount">
          평균 좋아요 갯수
          <div class="w-number">
            {{Math.round(extract.user.allLikeCount/extract.user.mediaCount)}}
          </div>
        </div>
        <div class="w-profile-value" v-if="extract.user.allLikeCount && extract.user.allCommentCount">
          참여도
          <div class="w-number">
            {{`${Math.ceil(extract.user.allCommentCount / extract.user.allLikeCount*100)}%`}}
            <md-tooltip md-direction="top">참여도란 게시글의 댓글/좋아요 비율으로 유저들이 게시물에 얼마나 참여하는지를 나타내는 지표입니다.</md-tooltip>
          </div>
        </div>
        <div class="w-profile-value" v-if="extract.user.fans">
          분석된 유저
          <div class="w-number">
            {{extract.user.fans.length}}
          </div>
        </div>
      </div>

      <div v-if="extract.user.media && extract.user.media.length > 0">
        <div class="md-layout md-alignment-center-space-between">
          <md-card v-for="(media, index) in extract.user.media.slice((currentMediaPage-1)*9, currentMediaPage*9)" :key="index">
            <md-card-media-actions>
              <md-card-media>
                <img :src="media.image" alt="media">
              </md-card-media>
              <md-card-actions>
                <div class="w-height-40">
                  <md-icon class="w-like">favorite</md-icon> {{media.likeCount}}
                </div>
                <div class="w-height-40">
                  <md-icon>comment</md-icon> {{media.commentCount}}
                </div>
                <div class="w-height-40">
                  {{`${Math.ceil(media.commentCount/media.likeCount*100)}%`}}
                </div>
                <div class="w-height-40" v-if="!media.likers">
                  미추출
                  <!-- <md-button class="md-primary md-raised md-layout-item" @click="showFanDialog = true">추출</md-button> -->
                </div>
              </md-card-actions>
            </md-card-media-actions>
          </md-card>
        </div>
        <pagination2
          :perPage="9"
          :total="extract.user.media.length"
          @change="changeMediaPage"></pagination2>
      </div>
    </div>

    <div v-if="extract.user && extract.user.fans && extract.user.fans.length > 0">
      <md-subheader>추출된 팬</md-subheader>
      <div class="md-layout md-alignment-center-left">
          <md-field>
            <label>추출 아이디 갯수</label>
            <md-input v-model="extractOption.count"></md-input>
            <span class="md-helper-text">ex) 0입력시 모두 추출</span>
          </md-field>
        </div>
        <div class="md-layout md-gutter md-alignment-center-left">
          <div class="md-layout-item">
            <md-switch v-model="extractOption.islcfilter" value="1">좋아요+댓글 필터</md-switch>
          </div>
          <div class="md-layout-item" v-if="extractOption.islcfilter">
            <md-field>
              <label>최소값</label>
              <md-input v-model="extractOption.lcmin" type="number"></md-input>
              <span class="md-helper-text">ex) 최소값 0입력시 한계없음</span>
            </md-field>
          </div>
          <div class="md-layout-item" v-if="extractOption.islcfilter">
            <md-field>
              <label>최대값</label>
              <md-input v-model="extractOption.lcmax" type="number"></md-input>
              <span class="md-helper-text">ex) 최대값 0입력시 한계없음</span>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-left">
          <div class="md-layout-item">
            <md-switch v-model="extractOption.islfilter" value="1">좋아요 필터</md-switch>
          </div>
          <div class="md-layout-item" v-if="extractOption.islfilter">
            <md-field>
              <label>최소값</label>
              <md-input v-model="extractOption.lmin" type="number"></md-input>
              <span class="md-helper-text">ex) 최소값 0입력시 한계없음</span>
            </md-field>
          </div>
          <div class="md-layout-item" v-if="extractOption.islfilter">
            <md-field>
              <label>최대값</label>
              <md-input v-model="extractOption.lmax" type="number"></md-input>
              <span class="md-helper-text">ex) 최대값 0입력시 한계없음</span>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-left">
          <div class="md-layout-item">
            <md-switch v-model="extractOption.iscfilter" value="1">댓글 필터</md-switch>
          </div>
          <div class="md-layout-item" v-if="extractOption.iscfilter">
            <md-field>
              <label>최소값</label>
              <md-input v-model="extractOption.cmin" type="number"></md-input>
              <span class="md-helper-text">ex) 최소값 0입력시 한계없음</span>
            </md-field>
          </div>
          <div class="md-layout-item" v-if="extractOption.iscfilter">
            <md-field>
              <label>최대값</label>
              <md-input v-model="extractOption.cmax" type="number"></md-input>
              <span class="md-helper-text">ex) 최대값 0입력시 한계없음</span>
            </md-field>
          </div>
        </div>
      
      <md-table>
        <md-table-row>
          <!-- <md-table-head md-numeric>id</md-table-head> -->
          <md-table-head>username</md-table-head>
          <md-table-head>relationship</md-table-head>
          <md-table-head>like</md-table-head>
          <md-table-head>comment</md-table-head>
          <md-table-head>like + comment</md-table-head>
        </md-table-row>

        <md-table-row v-for="(fan, index) in filteredFans.slice((currentFanPage-1)*10, currentFanPage*10)" :key="index">
          <!-- <md-table-cell md-numeric>{{index + 1}}</md-table-cell> -->
          <md-table-cell>{{fan.username}}</md-table-cell>
          <md-table-cell>{{(fan.follower && fan.following) ? '맞팔로우' : (fan.follower) ? '팔로워' : (fan.following) ? '팔로잉' : ''}}</md-table-cell>
          <md-table-cell>{{fan.like}}</md-table-cell>
          <md-table-cell>{{fan.comment}}</md-table-cell>
          <md-table-cell>{{fan.like + fan.comment}}</md-table-cell>
        </md-table-row>
      </md-table>
      <pagination2
        :perPage="10"
        :total="filteredFans.length"
        @change="changeFanPage"></pagination2>
      <div class="md-layout md-aligment-right-center">
        <md-button class="md-primary md-raised md-layout-item" @click="showFanDialog = true">아이디 추출하기</md-button>
      </div>
    </div>


    <md-dialog :md-active.sync="showFollowerDialog" v-if="extract.user && extract.user.followers">
      <md-dialog-title>{{`팔로워 (${extract.user.followers.length})`}}</md-dialog-title>
      <md-dialog-content>
        <md-chip v-for="(follower, index) in extract.user.followers.slice((currentFollowPage-1)*50, currentFollowPage*50)" :key="index+10000">{{follower.username}}</md-chip>
        <pagination2
          :perPage="50"
          :total="extract.user.followers.length"
          @change="changeFollowPage"></pagination2>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showFollowerDialog = false">종료</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showFollowingDialog" v-if="extract.user && extract.user.following">
      <md-dialog-title>{{`팔로잉 (${extract.user.following.length})`}}</md-dialog-title>
      <md-dialog-content>
        <md-chip v-for="(following, index) in extract.user.following.slice((currentFollowPage-1)*50, currentFollowPage*50)" :key="index+10000">{{following.username}}</md-chip>
        <pagination2
          :perPage="50"
          :total="extract.user.following.length"
          @change="changeFollowPage"></pagination2>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showFollowingDialog = false">종료</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="showFanDialog" v-if="extract.user && extract.user.fans">
      <md-dialog-title>추출유저</md-dialog-title>
      <md-dialog-content>
        <div>
          {{`${filteredFans.length}개의 `}}추출된 유저목록입니다. 복사해서 다른곳에 입력하시기 바랍니다.
        </div>
        <md-field v-if="showFanDialog">
          <label>추출유저</label>
          <md-textarea :value="filteredFans.map(item => item.username).join(',')" md-autogrow></md-textarea>
          <span class="md-helper-text">추출데이터</span>
          <span class="md-error">There is an error</span>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showFanDialog = false">종료</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash';
import windowHandler from '@/assets/js/windowHandler';
import InstaAPI from '@/assets/js/InstaAPI';
import pagination2 from '@/components/pagination2';
import FileStorage from '@/assets/js/FileStorage';
// import GetMediaLikerComment from '@/assets/js/GetMediaLikerComment';

export default {
  components: { pagination2 },
  mounted() {
    this.loginId = this.$store.state.account.loginId;
    this.loginPw = this.$store.state.account.loginPw;
    this.loginUsername = this.$store.state.account.username;
  },
  computed: {
    filteredFans() {
      if (this.extract && this.extract.user && this.extract.user.fans && this.extract.user.fans.length > 0) {
        let filteredFans = this.extract.user.fans;
        if (this.extractOption.islcfilter) {
          if (this.extractOption.lcmin > 0) {
            filteredFans = filteredFans.filter(item => item.like + item.comment >= this.extractOption.lcmin);
          }
          if (this.extractOption.lcmax > 0) {
            filteredFans = filteredFans.filter(item => item.like + item.comment <= this.extractOption.lcmax);
          }
        }

        if (this.extract && this.extract.user && this.extract.user.fans && this.extract.user.fans.length > 0) {
          if (this.extractOption.lmin > 0) {
            filteredFans = filteredFans.filter(item => item.like + item.comment >= this.extractOption.lmin);
          }
          if (this.extractOption.lmax > 0) {
            filteredFans = filteredFans.filter(item => item.like + item.comment <= this.extractOption.lmax);
          }
        }

        if (this.extract && this.extract.user && this.extract.user.fans && this.extract.user.fans.length > 0) {
          if (this.extractOption.cmin > 0) {
            filteredFans = filteredFans.filter(item => item.like + item.comment >= this.extractOption.cmin);
          }
          if (this.extractOption.cmax > 0) {
            filteredFans = filteredFans.filter(item => item.like + item.comment <= this.extractOption.cmax);
          }
        }
        return filteredFans;
      }
      return [];
    },
  },
  data() {
    return {
      loginId: null,
      loginPw: null,
      loginUsername: null,
      targetUsername: '',
      currentMediaPage: 1,
      currentFollowPage: 1,
      currentFanPage: 1,
      showFollowerDialog: false,
      showFollowingDialog: false,
      showFanDialog: false,
      extractOption: {
        islcfilter: false,
        islfilter: false,
        iscfilter: false,
        count: 0,
        lcmin: 0,
        lcmax: 0,
        lmin: 0,
        lmax: 0,
        cmin: 0,
        cmax: 0,
      },
      extract: {
        user: null,
      },
    };
  },
  methods: {
    changeFanPage(number) {
      this.currentFanPage = number;
    },
    saveAccount() {
      this.$store.dispatch('setAccount', {
        loginId: this.loginId,
        loginPw: this.loginPw,
        username: this.loginUsername,
      });
    },
    showExtractData() {
      document.getElementById('extract_data').click();
    },
    extractData(value) {
      if (this.extract.user) {
        if (value.target.files[0] && value.target.files[0].path) {
          const storage = new FileStorage(value.target.files[0].path, `${this.extract.user.username}-${new Date().getTime()}`);
          storage.set('user', this.extract.user);
          document.getElementById('extract_data').value = '';
        }
      } else {
        alert('추출할 정보가 없습니다', 'socialup');
      }
    },
    showLoadData() {
      document.getElementById('load_data').click();
    },
    loadData(value) {
      if (value.target.files[0] && value.target.files[0].path) {
        const storage = new FileStorage(null, value.target.files[0].path);
        const user = storage.get('user');
        this.extract.user = user;
        console.log(user);
        document.getElementById('load_data').value = '';
      }
    },
    changeFollowPage(number) {
      this.currentFollowPage = number;
    },
    changeMediaPage(number) {
      this.currentMediaPage = number;
    },
    open(username) {
      windowHandler.openBrowser(`https://www.instagram.com/${username}/`);
    },
    async extractUserProfile() {
      if (!this.targetUsername) {
        return;
      }
      if (!InstaAPI.isLogin) {
        await InstaAPI.login(this.$store.state.account.loginId, this.$store.state.account.loginPw, this.$store.state.account.username);
      }
      let user = await InstaAPI.getAccountById((await InstaAPI.getAccountByUsername(this.targetUsername)).params.id);
      user = {
        id: user.params.id,
        profilePicUrl: user.params.profilePicUrl,
        isBusiness: user.params.isBusiness,
        isPrivate: user.params.isPrivate,
        isVerified: user.params.isVerified,
        username: user.params.username,
        fullName: user.params.fullName,
        biography: user.params.biography,
        followerCount: user.params.followerCount,
        followingCount: user.params.followingCount,
        mediaCount: user.params.mediaCount,
        fans: [],
      };
      this.extract.user = user;
    },
    async extractUserMedia() {
      if (!InstaAPI.isLogin) {
        await InstaAPI.login(this.$store.state.account.loginId, this.$store.state.account.loginPw, this.$store.state.account.username);
      }

      const media = this.extract.user.media = (await InstaAPI.getUserMedia(this.extract.user.id, this.extract.user.mediaCount)).map(item => ({
        commentCount: item.params.commentCount,
        likeCount: item.params.likeCount,
        caption: item.params.caption,
        image: (item.params.images.slice(-1)[0] instanceof Array) ? item.params.images[0].slice(-1)[0].url : item.params.images.slice(-1)[0].url,
        webLink: item.params.webLink,
        id: item.params.id,
      }));

      const sumData = this.extract.user.media.reduce((acc, cur) => ({
        likeCount: acc.likeCount + cur.likeCount,
        commentCount: acc.commentCount + cur.commentCount,
      }), { commentCount: 0, likeCount: 0 });
      this.extract.user.allCommentCount = sumData.commentCount;
      this.extract.user.allLikeCount = sumData.likeCount;
      this.extract.user.media = media;
      this.extract.user = _.cloneDeep(this.extract.user);
    },
    async extractFollower() {
      if (!InstaAPI.isLogin) {
        await InstaAPI.login(this.$store.state.account.loginId, this.$store.state.account.loginPw, this.$store.state.account.username);
      }

      const followers = (await InstaAPI.getAccountFollowers(this.extract.user.id, 99999)).map(item => ({
        fullName: item.params.fullName,
        username: item.params.username,
        id: item.params.id,
      }));
      this.extract.user.followers = followers;
      this.extract.user = _.cloneDeep(this.extract.user);
    },
    async extractFollowing() {
      if (!InstaAPI.isLogin) {
        await InstaAPI.login(this.$store.state.account.loginId, this.$store.state.account.loginPw, this.$store.state.account.username);
      }

      const following = (await InstaAPI.getAccountFollowing(this.extract.user.id, 99999)).map(item => ({
        fullName: item.params.fullName,
        username: item.params.username,
        id: item.params.id,
      }));
      this.extract.user.following = following;
      this.extract.user = _.cloneDeep(this.extract.user);
    },
    async extractMediaDetailFirst() {
      if (!InstaAPI.isLogin) {
        await InstaAPI.login(this.$store.state.account.loginId, this.$store.state.account.loginPw, this.$store.state.account.username);
      }

      for (let i = 0; i < this.extract.user.media.length; i += 1) {
        // eslint-disable-next-line
        let comments = (await InstaAPI.getMediaComments(this.extract.user.media[i].id, this.extract.user.media[i].commentCount)).map(item => ({
          id: item.params.account.id,
          fullName: item.params.account.fullName,
          username: item.params.account.username,
        }));
        comments = [...new Set(comments)];
        // eslint-disable-next-line
        const likers = (await InstaAPI.getLikers(this.extract.user.media[i].id)).map(item => ({
          id: item.params.id,
          fullName: item.params.fullName,
          username: item.params.username,
        }));
        this.extract.user.media[i].comments = comments;
        this.extract.user.media[i].likers = likers;
        this.extract.user = _.cloneDeep(this.extract.user);
      }
    },
    async extractMediaDetailUnchecked() {
      if (!InstaAPI.isLogin) {
        await InstaAPI.login(this.$store.state.account.loginId, this.$store.state.account.loginPw, this.$store.state.account.username);
      }

      for (let i = 0; i < this.extract.user.media.length; i += 1) {
        console.log('-');
        if (!this.extract.user.media[i].likers) {
          // eslint-disable-next-line
          let comments = (await InstaAPI.getMediaComments(this.extract.user.media[i].id, this.extract.user.media[i].commentCount)).map(item => ({
            id: item.params.account.id,
            fullName: item.params.account.fullName,
            username: item.params.account.username,
          }));
          comments = [...new Set(comments)];
          // eslint-disable-next-line
          const likers = (await InstaAPI.getLikers(this.extract.user.media[i].id)).map(item => ({
            id: item.params.id,
            fullName: item.params.fullName,
            username: item.params.username,
          }));
          this.extract.user.media[i].comments = comments;
          this.extract.user.media[i].likers = likers;
        }
      }
    },
    async analysisFan() {
      this.extract.user.fans = [];
      console.log('analysis1');
      for (let i = 0; i < this.extract.user.media.length; i += 1) {
        console.log(`${i} 번째 게시글`);
        this.extract.user.media[i].likers.forEach((item) => {
          const result = this.extract.user.fans.filter(fan => item.id === fan.id)[0];
          if (result) {
            result.like += 1;
          } else {
            this.extract.user.fans.push({
              id: item.id,
              username: item.username,
              like: 1,
              comment: 0,
            });
          }
        });

        this.extract.user.media[i].comments.forEach((item) => {
          const result = this.extract.user.fans.filter(fan => item.id === fan.id)[0];
          if (result) {
            result.comment += 1;
          } else {
            this.extract.user.fans.push({
              id: item.id,
              username: item.username,
              like: 0,
              comment: 1,
            });
          }
        });
      }

      console.log('analysis2');
      this.extract.user.followers.forEach((item) => {
        const result = this.extract.user.fans.filter(fan => fan.id === item.id)[0];
        if (result) {
          result.follower = true;
        } else {
          this.extract.user.fans.push({
            id: item.id,
            username: item.username,
            follower: true,
            like: 0,
            comment: 0,
          });
        }
      });

      console.log('analysis3');
      this.extract.user.following.forEach((item) => {
        const result = this.extract.user.fans.filter(fan => fan.id === item.id)[0];
        if (result) {
          result.following = true;
        } else {
          this.extract.user.fans.push({
            id: item.id,
            username: item.username,
            following: true,
            like: 0,
            comment: 0,
          });
        }
      });
      this.extract.user.fans.sort((a, b) => (b.comment + b.like) - (a.comment + a.like));
    },
    async analysisUser() {
      if (!this.targetUsername) {
        return;
      }
      if (!InstaAPI.isLogin) {
        // const account = (await this.getGhost(100, 1))[0];
        await InstaAPI.login(this.$store.state.account.loginId, this.$store.state.account.loginPw, this.$store.state.account.username);
      }
      let user = await InstaAPI.getAccountById((await InstaAPI.getAccountByUsername(this.targetUsername)).params.id);
      user = {
        id: user.params.id,
        profilePicUrl: user.params.profilePicUrl,
        isBusiness: user.params.isBusiness,
        isPrivate: user.params.isPrivate,
        isVerified: user.params.isVerified,
        username: user.params.username,
        fullName: user.params.fullName,
        biography: user.params.biography,
        followerCount: user.params.followerCount,
        followingCount: user.params.followingCount,
        mediaCount: user.params.mediaCount,
        fans: [],
      };

      user.media = (await InstaAPI.getUserMedia(user.id, user.mediaCount)).map(item => ({
        commentCount: item.params.commentCount,
        likeCount: item.params.likeCount,
        caption: item.params.caption,
        image: (item.params.images.slice(-1)[0] instanceof Array) ? item.params.images[0].slice(-1)[0].url : item.params.images.slice(-1)[0].url,
        webLink: item.params.webLink,
        id: item.params.id,
      }));

      const sumData = user.media.reduce((acc, cur) => ({
        likeCount: acc.likeCount + cur.likeCount,
        commentCount: acc.commentCount + cur.commentCount,
      }), { commentCount: 0, likeCount: 0 });
      user.allCommentCount = sumData.commentCount;
      user.allLikeCount = sumData.likeCount;
      this.extract.user = user;

      const followers = (await InstaAPI.getAccountFollowers(user.id, 99999)).map(item => ({
        fullName: item.params.fullName,
        username: item.params.username,
        id: item.params.id,
      }));
      const following = (await InstaAPI.getAccountFollowing(user.id, 99999)).map(item => ({
        fullName: item.params.fullName,
        username: item.params.username,
        id: item.params.id,
      }));
      this.extract.user.followers = followers;
      this.extract.user.following = following;

      // GetMediaLikerComment(this.$store, user.media.map(item => item.webLink));
      for (let i = 0; i < user.media.length; i += 1) {
        // eslint-disable-next-line
        let comments = (await InstaAPI.getMediaComments(user.media[i].id, user.media[i].commentCount)).map(item => ({
          id: item.params.account.id,
          fullName: item.params.account.fullName,
          username: item.params.account.username,
        }));
        comments = [...new Set(comments)];
        // eslint-disable-next-line
        const likers = (await InstaAPI.getLikers(user.media[i].id)).map(item => ({
          id: item.params.id,
          fullName: item.params.fullName,
          username: item.params.username,
        }));
        user.media[i].comments = comments;
        user.media[i].likers = likers;
        console.log(`${comments.length} - ${likers.length}`);

        likers.forEach((item) => {
          const result = user.fans.filter(fan => item.id === fan.id)[0];
          if (result) {
            result.like += 1;
          } else {
            user.fans.push({
              id: item.id,
              username: item.username,
              like: 1,
              comment: 0,
            });
          }
        });

        comments.forEach((item) => {
          const result = user.fans.filter(fan => item.id === fan.id)[0];
          if (result) {
            result.comment += 1;
          } else {
            user.fans.push({
              id: item.id,
              username: item.username,
              like: 0,
              comment: 1,
            });
          }
        });
      }

      console.log('followers.forEach');
      followers.forEach((item) => {
        const result = user.fans.filter(fan => fan.id === item.id)[0];
        if (result) {
          result.follower = true;
        } else {
          user.fans.push({
            id: item.id,
            username: item.username,
            like: 0,
            comment: 0,
          });
        }
      });

      console.log('following.forEach');
      following.forEach((item) => {
        const result = user.fans.filter(fan => fan.id === item.id)[0];
        if (result) {
          result.following = true;
        } else {
          user.fans.push({
            id: item.id,
            username: item.username,
            like: 0,
            comment: 0,
          });
        }
      });
      user.fans.sort((a, b) => (b.comment + b.like) - (a.comment + a.like));
      console.log(this.extract.user);
    },
    async getGhost(page, size) {
      const response = await this.$http.get('api/instagram/ghost', {
        params: {
          page,
          size,
        },
      });
      return response.data;
    },
  },
};
</script>

<style lang="css" scoped>
.ghost {
  overflow: hidden;
}
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
  text-align: center;
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
