<template>
  <div class="dashboard-wrapper">
    <div v-if="connect">
      <div class="md-layout md-gutter md-alignment-center-center">
        <div class="md-layout-item md-size-25 md-small-size-50">
          <md-field>
            <label>워크풀 이름</label>
            <md-input v-model="workPoolName"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-10 md-small-size-25">
          <md-field>
            <label>현재 작업수</label>
            <md-input :value="Object.keys(worklogs).length" readonly></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-10 md-small-size-25">
          <md-field>
            <label>허용 작업수</label>
            <md-input type="number" v-model="allowWorkCount"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-15 md-small-size-40">
          <md-field>
            <label>내 아이피</label>
            <md-input v-model="ip" readonly></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-15 md-small-size-20">
          <md-checkbox v-model="devOptions.headless">Headless</md-checkbox>
        </div>
        <div class="md-layout-item md-size-25 md-small-size-40">
          <md-button class="md-primary md-raised" @click="updateWorkPool">수정</md-button>
          <md-button class="md-accent md-raised" @click="getCanInstagramProxy">시작</md-button>
        </div>
      </div>
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-20 md-small-size-25">
          <md-field>
            <label>팔로우 누락제한</label>
            <md-input type="number" v-model="devOptions.followOmit"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-20 md-small-size-25">
          <md-field>
            <label>좋아요 누락제한</label>
            <md-input type="number" v-model="devOptions.likeOmit"></md-input>
          </md-field>
        </div>
        <div class="md-layout-item md-size-20 md-small-size-25">
          <md-field>
            <label>댓글 누락제한</label>
            <md-input type="number" v-model="devOptions.commentOmit"></md-input>
          </md-field>
        </div>
      </div>
      
      <md-card class="md-layout-item">
        <md-subheader class="md-primary">작업 계정</md-subheader>
            <div v-for="(item, index) in proxys" :key="index" class="weather-instagram-proxy-item">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-15 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-unfollow">verified_user</md-icon><br>
                    {{(item.proxyServer) ? item.proxyServer : '등록안됨'}}
                    <md-tooltip md-direction="top">프록시 서버</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-20 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                    {{item.email}}
                </div>
                <div class="md-layout-item md-size-10 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-follow">person_add</md-icon><br>
                    {{`${worklogs[item.email].follow}/${(item.instagramOption) ? item.instagramOption.followLimitPerDay : 0}`}}
                    <md-tooltip md-direction="top">오늘 팔로우 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-like">favorite</md-icon><br>
                    {{`${worklogs[item.email].likeCount}/${(item.instagramOption) ? item.instagramOption.likeLimitPerDay : 0}`}}
                    <md-tooltip md-direction="top">오늘 좋아요 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-comment">comment</md-icon><br>
                    {{`${worklogs[item.email].comment}/${(item.instagramOption) ? item.instagramOption.commentLimitPerDay : 0}`}}
                    <md-tooltip md-direction="top">오늘 댓글 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-small-size-25 md-layout md-alignment-center-center w-margin-10">
                  <div class="align-center">
                    <md-icon class="w-unfollow">remove_circle_outline</md-icon><br>
                    {{`${worklogs[item.email].unfollow}/${(item.instagramOption) ? item.instagramOption.followLimitPerDay : 0}`}}
                    <md-tooltip md-direction="top">오늘 언팔로우 작업횟수</md-tooltip>
                  </div>
                </div>
                <div class="md-layout-item md-size-10 md-small-size-100 md-layout md-alignment-center-center w-margin-10">
                  <div v-if="!item.instagramOption" style="text-align: center;">
                    <span>미선택</span>
                  </div>
                  <div v-if="item.instagramOption" style="text-align: center;">
                    <span v-if="item.instagramOption.followType === 1">선팔로우</span>
                    <span v-if="item.instagramOption.followType === 2">내 팔로워 관리</span>
                    <span v-if="item.instagramOption.followType === 3">언팔로우</span>
                  </div>
                  <button @click="startWork(item)">시작</button>
                  <button @click="stopWork(item)">종료</button>
                </div>
                <div class="md-layout-item  md-size-15 md-small-size-100 md-layout md-alignment-center-center w-margin-10" style="text-align: center;">
                  {{new Date(item.expired).toLocaleDateString()}}
                </div>
              </div>
            </div>
       </md-card>
    </div>
    <div v-if="!connect">
      <div class="md-layout md-gutter md-alignment-center-center">
        <div class="md-layout-item md-size-15">
          <md-button class="md-primary md-raised" @click="connectSocket">재연결</md-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import publicIP from 'public-ip';
import FollowWorker from '@/assets/js/FollowWorker.js';

export default {
  data() {
    return {
      connect: false,
      sockjs: null,
      workCount: 0,
      allowWorkCount: 30,
      workPoolName: null,
      ip: null,
      proxys: [],
      worklogs: {},
      workers: {},
      devOptions: {
        headless: true,
        followOmit: 10,
        likeOmit: 3,
        commentOmit: 10,
      },
    };
  },
  async mounted() {
    this.workCount = 0;
    if (!this.workPoolName) {
      this.workPoolName = `workpool-${btoa(Math.floor(Math.random() * 1000000))}`;
    }
    this.ip = await publicIP.v4();
    this.connectSocket();
  },
  destroyed() {
    if (this.sockjs) {
      this.closeSocket();
    }
  },
  methods: {
    startWork(item) {
      this.workers[item.email] = FollowWorker(this.$store, this.$http, item, this.worklogs[item.email], this.devOptions, this.workCount);
    },
    stopWork(item) {
      this.workers[item.email]();
    },
    async closeSocket() {
      console.log(this.sockjs);
      await this.sockjs.close();
      this.sockjs = null;
    },
    connectSocket() {
      this.sockjs = new SockJS('http://socialup.kr/ws/workpool');
      // this.sockjs = new SockJS('http://localhost:8080/ws/workpool');
      this.sockjs.onopen = () => {
        this.connect = true;
        this.updateWorkPool();
      };
      this.sockjs.onclose = () => {
        console.log('close');
        this.connect = false;
        this.proxys = [];
        this.worklogs = {};
        Object.keys(this.workers).forEach((item) => {
          this.workers[item]();
        });
        setTimeout(() => {
          if (this.sockjs) {
            this.connectSocket();
          }
        }, 1000);
      };
      this.sockjs.onmessage = (response) => {
        this.processSocketResponse(JSON.parse(response.data));
      };
    },
    updateWorkPool() {
      console.log('updateWorkPool');
      const data = {
        type: 'updateWorkPool',
        workPoolName: this.workPoolName,
        allowWorkCount: this.allowWorkCount,
      };
      this.sockjs.send(JSON.stringify(data));
    },
    getCanInstagramProxy() {
      this.$http.get('api/admin2/workpool/canInstagramProxy', {
        params: {
          name: this.workPoolName,
        },
      }).then((response) => {
        if (response.data) {
          response.data.forEach((item) => {
            this.startProxy(item);
          });
        }
      });
      // console.log('getCanInstagramProxy');
      // const data = {
      //   type: 'getCanInstagramProxy',
      // };
      // this.sockjs.send(JSON.stringify(data));
    },
    async getProxy(id) {
      const response = await this.$http.get(`api/admin2/instagram/proxy/data/${id}`);
      this.startProxy(response.data);
    },
    startProxy(item) {
      this.proxys.push(item.instagramProxy);
      this.worklogs[item.instagramProxy.email] = item.worklog;
      this.startWork(item.instagramProxy);
    },
    stopProxy(id) {
      const proxy = this.proxys.filter(item => item.id === id)[0];
      if (proxy) {
        try {
          delete this.worklogs[proxy.email];
          this.workers[proxy.email]();
        } catch (e) {
          console.log('err-213');
          console.log(e);
        }
      }
      this.proxys = this.proxys.filter(item => item.id !== id);
    },
    processSocketResponse(data) {
      console.log(data);
      if (data.type === 'startInstagramProxy') {
        this.getProxy(data.id);
        // this.worklogs = {
        //   ...this.worklogs,
        //   ...data.worklogs,
        // };
        // data.instagramProxys.forEach((item) => {
        //   this.proxys.push(item);
        //   this.startWork(item);
        // });
      } else if (data.type === 'stopInstagramProxy') {
        this.stopProxy(data.id);
      } else if (data.type === 'startWorkPool') {
        this.getCanInstagramProxy();
      }
    },
  },
};
</script>

<style lang="css" scoped>
.w-margin-10 {
  margin: 10px;
}
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
.weather-instagram-proxy-item {
  padding: 10px; 
  cursor:pointer;
}
.weather-instagram-proxy-item:hover {
  background-color: #e7e7e7;
}
</style>
