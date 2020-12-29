<template>
  <div class="ghost">
    <div v-if="this.sdk">
      <div class="md-layout md-alignment-center-center">
        <md-button class="md-raised md-primary" @click="showStartDialog = true" v-if="sdk && worker === null">작업 시작</md-button>
        <md-button class="md-raised md-accent" @click="stopWork" v-if="sdk && worker !== null">작업 중지</md-button>
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
      <div class="md-layout md-gutter md-alignment-center-left" style="margin: 20px 0 5px 5px;">
        <div class="md-layout-item">
          <md-button class="md-dense md-raised" @click="createDialog = true">계정 수동추가</md-button>
        </div>
        <div class="md-layout-item">
          <md-field>
            <label>ghostPerPage</label>
            <md-input v-model="ghostPerPage" @keyup.enter="searchGhost"></md-input>
            <span class="md-helper-text">Input GhostPerPage</span>
          </md-field>
        </div>
        <div class="md-layout-item">
          <md-field>
            <label>Category</label>
            <md-input v-model="ghostCategory" @keyup.enter="searchGhost"></md-input>
            <span class="md-helper-text">Input ghostCategory</span>
          </md-field>
        </div>
        <div class="md-layout-item">
          <md-radio v-model="ghostActive" :value="0">ALL</md-radio>
          <md-radio v-model="ghostActive" :value="1">ACTIVE</md-radio>
          <md-radio v-model="ghostActive" :value="2">INACTIVE</md-radio>
        </div>
        <md-button class="md-dense md-raised" @click="searchGhost">검색</md-button>
      </div>
      <div class="md-layout md-gutter md-alignment-center-left">
        <div class="md-layout-item">
          <md-button class="md-dense md-raised" @click="toggleAllModify = !toggleAllModify">일괄수정</md-button>
        </div>
        <div class="md-layout-item">
          <md-checkbox v-model="selectedAllGhost" @change="selectAllGhost">전체체크</md-checkbox>
        </div>
        <div class="md-layout-item">
          <md-field>
            <label>All Category</label>
            <md-input v-model="inputAllCategory"></md-input>
            <span class="md-helper-text">Input All Category</span>
          </md-field>
        </div>
        <div class="md-layout-item">
          <md-button class="md-dense md-raised" :disabled="toggleAllModify" @click="updateGhostsCategory">카테고리 일괄수정</md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-dense md-raised" :disabled="toggleAllModify" @click="updateGhostsActive(true)">일괄 ACTIVE</md-button>
        </div>
        <div class="md-layout-item">
          <md-button class="md-dense md-raised" :disabled="toggleAllModify" @click="updateGhostsActive(false)">일괄 INACTIVE</md-button>
        </div>
      </div>
      <div class="md-layout">
        <div class="md-layout-item md-size-100">
          <md-table md-card @md-selected="onSelectGhost">
            <md-table-row v-for="(account, index) in $store.state.ghost.accounts" :style="(account === selected) ? {backgroundColor: '#c7c7c7'} : null" :key="index">
              <!-- <md-table-cell>{{account.username}}</md-table-cell> -->
              <md-table-cell>
                <md-checkbox v-model="selectedGhost" :value="account.id"></md-checkbox>
              </md-table-cell>
              <md-table-cell>{{convertDate(account.regDate)}}</md-table-cell>
              <md-table-cell>{{account.category}}</md-table-cell>
              <md-table-cell>{{account.email}}</md-table-cell>
              <md-table-cell>{{account.password}}</md-table-cell>
              <md-table-cell>{{`${(account.postCount) ? account.postCount : 0}/${(account.followerCount) ? account.followerCount : 0}/${(account.followingCount) ? account.followingCount : 0}`}}</md-table-cell>
              <md-table-cell>
                <md-button v-if="account.active" class="md-accent md-raised md-icon-button md-dense" @click="ghostUpdateActive(account.id, false)">
                  <md-icon>thumb_down</md-icon>
                </md-button>
                <md-button v-if="!account.active" class="md-primary md-icon-button md-dense md-raised" @click="ghostUpdateActive(account.id, true)">
                  <md-icon>thumb_up</md-icon>
                </md-button>
                <md-button class="md-icon-button md-dense md-raised md-primary" @click="onSelect(account)">
                  <md-icon>settings</md-icon>
                </md-button>
              </md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </div>
      <pagination2
          :perPage="ghostPerPage"
          :total="ghostCount"
          @change="changeGhostPage"></pagination2>
    </div>
    <md-dialog v-if="detailDialog" :md-active.sync="detailDialog">
      <md-dialog-title>유령계정 상세정보</md-dialog-title>
      <md-dialog-content class="weather-content">
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
                    상태
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{`${selected.postCount}/${selected.followerCount}/${selected.followingCount}  (${selected.followCount}/${selected.likeCount})`}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    카테고리
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    <!-- {{selected.category}} -->
                    <input type="text" v-model="input.category">
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    아이디
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    <!-- {{selected.email}} -->
                    <input type="text" v-model="input.email">
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    비밀번호
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    <!-- {{selected.password}} -->
                    <input type="text" v-model="input.password">
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    유저네임
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    <!-- {{selected.username}} -->
                    <input type="text" v-model="input.username">
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    풀네임
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    <!-- {{selected.fullname}} -->
                    <input type="text" v-model="input.fullname">
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
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    핸드폰
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    <input type="text" v-model="input.phone">
                  </div>
                </div>
                <div class="md-layout-item md-size-100 align-center">
                  <md-button  class="md-primary md-raised md-dense" @click="updateGhost">
                    SAVE
                  </md-button>
                  <md-button v-if="!selected.active" class="md-accent md-raised md-dense" @click="ghostUpdateActive(selected.id, true)">
                    INACTIVE
                  </md-button>
                  <md-button v-if="selected.active" class="md-primary md-raised md-dense" @click="ghostUpdateActive(selected.id, false)">
                    ACTIVE
                  </md-button>
                  <md-button v-if="!selected.emailAuth" class="md-accent md-raised md-dense" @click="ghostUpdateEmailAuth(selected.id, true)">
                    E-N-AUTH
                  </md-button>
                  <md-button v-if="selected.emailAuth" class="md-primary md-raised md-dense" @click="ghostUpdateEmailAuth(selected.id, false)">
                    E-AUTH
                  </md-button>
                  <md-button v-if="!selected.phoneAuth" class="md-accent md-raised md-dense" @click="ghostUpdatePhoneAuth(selected.id, true)">
                    P-N-AUTH
                  </md-button>
                  <md-button v-if="selected.phoneAuth" class="md-primary md-raised md-dense" @click="ghostUpdatePhoneAuth(selected.id, false)">
                    P-AUTH
                  </md-button>
                </div>
                <md-divider style="margin-bottom: 10px;"/>
                <!-- <md-button class="md-raised" @click="createGhost">서버저장</md-button> -->
                
                <md-button class="md-raised md-dense" @click="removeGhost(selected.id)">삭제</md-button>
                <md-button class="md-raised md-dense" @click="open(selected.username)">열기</md-button>
                <md-button class="md-raised md-dense" @click="openGhost(selected)">로그인상태 열기</md-button>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="detailDialog = null">취소</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog v-if="createDialog" :md-active.sync="createDialog">
      <md-dialog-title>유령계정 수동추가</md-dialog-title>
      <md-dialog-content class="weather-content">
        이걸만드는게 의미가있을까? 쿠키를 집어넣지 못한다. <br>
        등록시 쿠키를 가져와 넣는다 -> 아이피가 다 같아 문제 <br>
        아디비번만넣고 돌릴떄 쿠키가 없으면 로그인하고 쿠키를 등록한다. 쿠키만들어야댐 <br>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click="createDialog = null">취소</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog style="min-width: 450px;"
      :md-active.sync="showStartDialog">
      <md-dialog-title>유령계정 작업옵션</md-dialog-title>
      <md-dialog-content class="weather-content">
        <div class="md-layout">
          <md-radio class="md-layout-item md-size-45" v-model="ghostOption.workType" value="create">계정 생성\</md-radio>
          <md-radio class="md-layout-item md-size-45" v-model="ghostOption.workType" value="work">INSTAGRAM_WORK 작업시작</md-radio>
          <md-radio class="md-layout-item md-size-45" v-model="ghostOption.workType" value="alive">계정생존 확인</md-radio>
        </div>
        <div v-if="ghostOption.workType === 'create'">
          <md-field>
            <label for="setting">카피계정 검색 해시태그</label>
            <md-input type="text" v-model="ghostOption.copyTag"></md-input>
            <div class="md-helper-text">카피할 계정을 찾기위한 해시태그를 입력해주세요.</div>
          </md-field>
        </div>
        <div v-if="ghostOption.workType === 'alive'">
          <md-field>
            <label for="setting">특정계정 이메일 이후부터 작업</label>
            <md-input type="text" v-model="ghostOption.targetEmail"></md-input>
            <div class="md-helper-text">시작할 계정아이디</div>
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
import OpenGhost from '@/assets/js/OpenGhost';
import windowHandler from '@/assets/js/windowHandler';
import pagination2 from '@/components/pagination2';

export default {
  components: { pagination2 },
  data() {
    return {
      adb: null,
      connectedDevices: [],
      sdk: false,
      selected: null,
      worker: null,
      showStartDialog: false,
      createDialog: false,
      ghostCount: 0,
      ghostPerPage: 10,
      ghostCategory: '',
      ghostActive: 0,
      currentGhostPage: 1,
      detailDialog: false,
      toggleAllModify: true,
      selectedGhost: [],
      selectedAllGhost: false,
      inputAllCategory: '',
      input: {
        phone: '',
        email: '',
        password: '',
        username: '',
        fullname: '',
        category: '',
      },
      process: {
        isChangeIp: false,
        ip: null,
      },
      ghostOption: {
        workType: 'create',
        copyTag: null,
        targetEmail: null,
      },
      accounts: [],
    };
  },
  async mounted() {
    try {
      this.getGhostCount();
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
    selectAllGhost(value) {
      console.log(value);
      if (value === true) {
        console.log(this.accounts.map(item => item.id));
        this.selectedGhost = this.$store.state.ghost.accounts.map(item => item.id);
      } else {
        this.selectedGhost = [];
      }
    },
    searchGhost() {
      this.getGhost();
    },
    onSelectGhost(items) {
      this.selectedGhost = items;
    },
    updateGhost() {
      this.$http.put(`api/instagram/ghost/${this.selected.id}`, this.input).then((response) => {
        if (response.data) {
          this.getGhost();
        }
      });
    },
    updateGhostsCategory() {
      this.$http.put('api/instagram/ghosts', {
        ids: this.selectedGhost,
        ghost: {
          category: this.inputAllCategory,
        },
      }).then((response) => {
        if (response.data) {
          this.getGhost();
        }
      });
    },
    updateGhostsActive(value) {
      this.$http.put('api/instagram/ghosts/active', {
        ids: this.selectedGhost,
        ghost: {
          active: value,
        },
      }).then((response) => {
        if (response.data) {
          this.getGhost();
        }
      });
    },
    changeGhostPage(num) {
      this.currentGhostPage = num;
      this.getGhost();
    },
    ghostUpdateActive(id, active) {
      this.$http.get(`api/instagram/ghost/${id}/active`, {
        params: {
          active,
        },
      }).then((response) => {
        if (response.data) {
          this.getGhost();
        }
      });
    },
    ghostUpdateEmailAuth(id, emailAuth) {
      this.$http.get(`api/instagram/ghost/${id}/email-auth`, {
        params: {
          emailAuth,
        },
      }).then((response) => {
        if (response.data) {
          this.getGhost();
        }
      });
    },
    ghostUpdatePhoneAuth(id, phoneAuth) {
      this.$http.get(`api/instagram/ghost/${id}/phone-auth`, {
        params: {
          phoneAuth,
        },
      }).then((response) => {
        if (response.data) {
          this.getGhost();
        }
      });
    },
    open(username) {
      windowHandler.openBrowser(`https://www.instagram.com/${username}/`);
    },
    onSelect(item) {
      this.detailDialog = true;
      this.selected = item;
      this.input.phone = this.selected.phone;
      this.input.email = this.selected.email;
      this.input.category = this.selected.category;
      this.input.password = this.selected.password;
      this.input.username = this.selected.username;
      this.input.fullname = this.selected.fullname;
    },
    async deviceRefresh() {
      this.connectedDevices = await this.adb.getConnectedDevices();
    },
    async changeIp() {
      console.log(await this.adb.getConnectedDevices());
      if (true) {
        this.process.isChangeIp = true;
        try {
          console.log(1);
          await this.adb.shell(' su -c "settings put global airplane_mode_on 1"');
          console.log(2);
          await this.adb.shell(' su -c "am broadcast -a android.intent.action.AIRPLANE_MODE"');
          console.log(3);
          await this.adb.shell(' su -c "settings put global airplane_mode_on 0"');
          console.log(4);
          await this.adb.shell(' su -c "am broadcast -a android.intent.action.AIRPLANE_MODE"');
          console.log(5);
        } catch (e) {
          console.log(e);
        }

        try {
          console.log(6);
          await this.adb.broadcastAirplaneMode();
          console.log(7);
          await this.adb.setAirplaneMode(false);
          console.log(8);
          await this.adb.broadcastAirplaneMode();
          console.log(9);
          await this.adb.setAirplaneMode(true);
          console.log(10);
        } catch (e) {
          console.log(e);
        }
        this.process.ip = await publicIP.v4();
        this.process.isChangeIp = false;
      }
    },
    getGhostCount() {
      this.$http.get('api/instagram/ghost/count', {
        params: {
          category: this.ghostCategory,
          active: this.ghostActive,
        },
      }).then((response) => {
        if (response.data) {
          this.ghostCount = response.data;
        }
      });
    },
    getGhost() {
      if (this.currentGhostPage < 1) {
        return;
      }
      this.getGhostCount();
      this.$http.get('api/instagram/ghost', {
        params: {
          page: this.currentGhostPage - 1,
          size: this.ghostPerPage,
          category: this.ghostCategory,
          active: this.ghostActive,
        },
      }).then((response) => {
        if (response.data) {
          if (this.selected) {
            const ghost = response.data.filter(item => item.id === this.selected.id)[0];
            if (ghost) {
              this.selected = ghost;
            }
          }
          this.$store.dispatch('setGhostAccounts', response.data);
        }
      });
    },
    openGhost(item) {
      OpenGhost(item);
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
          this.getGhost();
        }
      });
    },
    startWork() {
      if (this.ghostOption.workType === 'create' && !this.ghostOption.copyTag) {
        return;
      }
      // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ CREATE _ACCOUNT 내부수정 다해야됨 state 걷어내기!
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
      if (dateString === new Date().toLocaleDateString()) {
        return date.toLocaleTimeString();
      }
      return dateString;
    },
  },
};
</script>

<style lang="css" scoped>
input {
  text-align: center;
}
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
