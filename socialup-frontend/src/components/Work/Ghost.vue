<template>
  <div class="ghost">
    <div v-if="this.sdk">
      <div class="md-layout md-alignment-center-center">
        <md-button class="md-raised md-primary" @click="showStartDialog = true" v-if="sdk && connectedDevices.length > 0 && worker === null">작업 시작</md-button>
        <md-button class="md-raised md-accent" @click="stopWork" v-if="sdk && connectedDevices.length > 0 && worker !== null">작업 중지</md-button>
        <md-button class="md-raised" @click="changeIp" v-if="sdk && connectedDevices.length > 0">수동 IP변경</md-button>
        <md-button class="md-raised" @click="deviceRefresh" v-if="sdk">디바이스 새로고침</md-button>

        <div class="md-layout-item" v-if="!sdk">
          <span>SDK가 설치되어 있지 않거나 환경변수가 설정되어있지 않습니다.</span>
        </div>
        <div class="md-layout-item" style="text-align: right">
          <span>{{(connectedDevices.length > 0) ? `Device ID: ${connectedDevices[0].udid}` : '디바이스가 연결되지 않았습니다.'}}</span>
        </div>
        <div class="md-layout-item" style="text-align: right">
          <span style="padding-right: 20px;">{{(!process.isChangeIp) ? `IP: ${process.ip}` : 'IP: 변경중...'}}</span>
        </div>
      </div>
      <div class="md-layout" style="margin-top: 20px;">
        <div :class="selected ? 'md-layout-item md-size-50' : 'md-layout-item md-size-100'">
          <md-table md-card>
            <md-table-row v-for="(account, index) in $store.state.ghost.accounts" @click="onSelect(account)" :style="(account === selected) ? {backgroundColor: '#c7c7c7'} : null" :key="index">
              <md-table-cell>{{account.username}}</md-table-cell>
              <md-table-cell>{{account.email}}</md-table-cell>
              <md-table-cell>{{account.password}}</md-table-cell>
              <md-table-cell v-if="!selected">{{`${(account.follow) ? account.follow.length : 0}`}}</md-table-cell>
              <md-table-cell v-if="!selected">{{`${(account.like) ? account.like.length : 0}`}}</md-table-cell>
              <md-table-cell v-if="!selected">{{convertDate(account.regDate)}}</md-table-cell>
            </md-table-row>
          </md-table>
        </div>
        <div class="md-layout-item md-size-50" v-if="selected">
            <md-card>
              <md-card-content>
                <div class="md-layout md-alignment-center-center w-profile">
                  <div class="md-layout-item md-size-20" style="text-align: center;">
                    <img class="instagram-avatar" :src="selected.img" alt="NoImg">
                  </div>
                  <div class="md-layout-item md-size-80">
                    <div class="w-profile-info w-lmargin-10">
                      {{(selected.biography && selected.biography.length > 100) ? `${selected.biography.slice(0, 90)}...` : selected.biography}}
                    </div>
                  </div>
                </div>
                <md-divider style="margin-bottom: 10px;"/>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    아이디
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.email}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    비밀번호
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.password}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    유저네임
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.username}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    풀네임
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.fullname}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    가입일자
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{new Date(selected.regDate).toLocaleString()}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    가입 IP
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.regIp}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    카피 NO
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.copyNumber}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    카피유저
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.copyUsername}}
                  </div>
                </div>
                <md-divider style="margin-bottom: 10px;"/>
                <md-button class="md-raised" @click="createGhost">서버저장</md-button>
                <md-button class="md-raised" @click="removeGhost(selected.id)">삭제</md-button>
                <md-button class="md-raised" @click="open(selected.username)">열기</md-button>
                <div>
                  {{`팔로우 ${(selected.follow) ? selected.follow.length : 0}`}}
                </div>
                <div>
                  {{`좋아요 ${(selected.like) ? selected.like.length : 0}`}}
                </div>
              </md-card-content>
            </md-card>
          </div>
      </div>
    </div>
    <md-dialog style="min-width: 450px;"
      :md-active.sync="showStartDialog">
      <md-dialog-title>유령계정 작업옵션</md-dialog-title>
      <md-dialog-content class="weather-content">
        <div class="md-layout">
          <md-radio class="md-layout-item md-size-45" v-model="ghostOption.workType" value="create">계정 생성 및 작업</md-radio>
          <md-radio class="md-layout-item md-size-45" v-model="ghostOption.workType" value="already">기존 계정으로 작업</md-radio>
        </div>
        <div v-if="ghostOption.workType === 'create'">
          <md-field>
            <label for="setting">카피계정 검색 해시태그</label>
            <md-input type="text" v-model="ghostOption.copyTag"></md-input>
            <div class="md-helper-text">카피할 계정을 찾기위한 해시태그를 입력해주세요.</div>
          </md-field>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="showStartDialog = false">취소</md-button>
        <md-button class="md-primary" @click="startWork">시작하기</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
import appiumADB from 'appium-adb';
import publicIP from 'public-ip';
import CreateAccount from '@/assets/js/CreateAccount';
import windowHandler from '@/assets/js/windowHandler';

export default {
  data() {
    return {
      adb: null,
      connectedDevices: [],
      sdk: false,
      selected: null,
      worker: null,
      showStartDialog: false,
      process: {
        isChangeIp: false,
        ip: null,
      },
      ghostOption: {
        workType: 'create',
        copyTag: null,
      },
    };
  },
  async mounted() {
    try {
      this.getGhost(0, 30);
      this.adb = await appiumADB.createADB();
      this.connectedDevices = await this.adb.getConnectedDevices();
      this.sdk = true;
    } catch (e) {
      console.log(e);
      this.sdk = false;
    }
    this.process.ip = await publicIP.v4();
  },
  methods: {
    open(username) {
      windowHandler.openBrowser(`https://www.instagram.com/${username}/`);
    },
    onSelect(item) {
      if (this.selected === item) {
        this.selected = null;
      } else {
        this.selected = item;
      }
    },
    async deviceRefresh() {
      this.connectedDevices = await this.adb.getConnectedDevices();
    },
    async changeIp() {
      // console.log(await this.adb.getConnectedDevices());
      if (!this.process.isChangeIp) {
        this.process.isChangeIp = true;
        await this.adb.broadcastAirplaneMode();
        await this.adb.setAirplaneMode(false);
        await this.adb.broadcastAirplaneMode();
        await this.adb.setAirplaneMode(true);
        this.process.ip = await publicIP.v4();
        this.process.isChangeIp = false;
      }
    },
    getGhost(page, size) {
      this.$http.get('api/instagram/ghost', {
        params: {
          page,
          size,
        },
      }).then((response) => {
        if (response.data) {
          this.$store.dispatch('setAccount', response.data);
        }
      });
    },
    createGhost() {
      this.$http.post('api/instagram/ghost', {
        email: this.selected.id,
        password: this.selected.password,
        username: this.selected.username,
        fullname: this.selected.fullname,
        img: this.selected.img,
        biography: this.selected.biography,
        regDate: this.selected.date,
        regIp: this.selected.ip,
        cookie: JSON.stringify(this.selected.cookie),
        copyNumber: this.selected.copyNo,
        copyUsername: this.selected.copyUser,
        followCount: 0,
        likeCount: 0,
      }).then((response) => {
        if (response.data) {
          console.log(response.data);
        }
      });
    },
    removeGhost(id) {
      this.$http.delete(`api/instagram/ghost/${id}`).then((response) => {
        if (response.data) {
          this.getGhost(0, 30);
        }
      });
    },
    startWork() {
      if (this.ghostOption.workType === 'create' && !this.ghostOption.copyTag) {
        return;
      }
      this.worker = CreateAccount(this.$store, this.$http, this.adb, this.process, this.ghostOption);
      this.showStartDialog = false;
    },
    stopWork() {
      if (this.worker !== null && this.worker() === true) {
        this.worker = null;
      }
    },
    convertDate(rawDate) {
      const date = new Date(rawDate);
      const dateString = date.toLocaleDateString();
      if (dateString === this.$store.state.instagram.todayKey) {
        return date.toLocaleTimeString();
      }
      return dateString;
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
</style>
