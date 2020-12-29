<template>
  <div class="">
    <div class="md-layout md-gutter md-alignment-center-left">
      <md-button class="weather-button" @click="showInstaDialog = true">
        <div class="md-layout md-alignment-center-center">
          <md-icon>assignment_turned_in</md-icon>
          <span>&nbsp;인스타 계정설정</span>
        </div>
      </md-button>
      <md-button class="weather-button" @click="open('http://socialup.kr/')">
        <div class="md-layout md-alignment-center-center">
          <md-icon>home</md-icon>
          <span>&nbsp;홈페이지&nbsp;</span>
        </div>
      </md-button>
      <md-button class="weather-button" @click="open('https://pf.kakao.com/_DxhISj')">
        <div class="md-layout md-alignment-center-center">
          <md-icon>question_answer</md-icon>
          <span>&nbsp;1:1문의&nbsp;</span>
        </div>
      </md-button>
      <!-- <md-button class="weather-button" @click="couponSerialPrompt = true">
        <div class="md-layout md-alignment-center-center">
          <md-icon>fiber_pin</md-icon>
          <span>&nbsp;쿠폰등록&nbsp;</span>
        </div>
      </md-button> -->
      <md-button class="weather-button" @click="showDataDialog = true">
        <div class="md-layout md-alignment-center-center">
          <md-icon>data_usage</md-icon>
          <span>&nbsp;인스타기록</span>
        </div>
      </md-button>
      <md-button class="weather-button" @click="$router.push('/log')">
        <div class="md-layout md-alignment-center-center">
          <md-icon>event_note</md-icon>
          <span>&nbsp;작업내역</span>
        </div>
      </md-button>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-large-medium-30 md-small-size-40">
        <div class="weather-box">
          <div class="weather-box-icon">
            <md-icon>account_circle</md-icon>
          </div>
          <div class="weather-box-header">
            {{this.$store.state.member.member.name}}
          </div>
          <md-divider></md-divider>
          <div class="weather-box-content">
            <div class="weather-box-content-item">
              {{this.$store.state.member.member.email}}
            </div>
            <div class="weather-box-content-item">
              {{this.$store.state.member.member.name}}
            </div>
            <div class="weather-box-content-item">
              {{`포인트 ${this.$store.state.member.member.point}`}}
            </div>
            <div class="weather-box-content-item">
              {{`등급 ${this.$store.state.member.member.grade}`}}
            </div>
            <div class="weather-box-content-item">
              {{new Date(this.$store.state.member.member.regDate).toLocaleString()}}
            </div>
          </div>
          <md-divider></md-divider>
        </div>
        <div class="md-layout md-gutter md-alignment-center-center w-margin-10">
          <!-- <div class="md-layout-item">
            <md-field>
              <label>쿠폰번호</label>
              <md-input type="text" v-model="couponSerial" @keyup.enter="useDialog = true"></md-input>
            </md-field>
          </div>
          <md-button class="weather-button md-raised md-primary" @click="useDialog = true">
            <span>등록하기</span>
          </md-button> -->
        </div>
      </div>
      <div class="md-layout-item">
        <div class="weather-box" v-if="Object.keys(this.$store.state.member.member.periods).length > 0">
          <div class="weather-box-header"><!-- section title -->
            사용기간
          </div>
          <md-divider></md-divider>
          <div class="weather-box-content">
            <div class="weather-box-content-item" v-for="(period, index) in Object.keys(this.$store.state.member.member.periods)" :key="index">
              <div class="md-layout">
                <div class="md-layout-item">
                  <span v-if="period === 'manage'">인스타 계정관리</span>
                </div>
                <div class="md-layout-item md-size-10">
                  <span v-if="period === 'manage'">{{`${$store.state.member.member.periods[period].allowCount + 1} 계정`}}</span>
                </div>
                <div class="md-layout-item">
                  {{`만료일자 ${new Date($store.state.member.member.periods[period].expired).toLocaleDateString()}`}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="weather-box" v-if="this.$store.state.member.member.payments.length > 0">
          <div class="weather-box-header"><!-- section title -->
            결제기록
          </div>
          <md-divider></md-divider>
          <div class="weather-box-content">
            <div class="weather-box-content-item" v-for="(payment, index) in this.$store.state.member.member.payments" :key="index">
              <div class="md-layout">
                <div class="md-layout-item">
                  <span v-if="payment.serviceType === 'manage'">계정관리</span>
                  <span v-if="payment.serviceType === 'kfollow'">한국인팔로워</span>
                  <span v-if="payment.serviceType === 'klike'">한국인좋아요</span>
                </div>
                <!-- <div class="md-layout-item">
                  {{payment.payerName}}
                </div> -->
                <div class="md-layout-item">
                  <span v-if="payment.type === 0">디폴트</span>
                  <span v-if="payment.type === 1">무통장 입금</span>
                  <span v-if="payment.type === 2">스마트 페이</span>
                  <span v-if="payment.type === 3">크몽</span>
                  <span v-if="payment.type === 4">오투잡</span>
                  <span v-if="payment.type === 5">체험판</span>
                  <span v-if="payment.type === 6">관리자</span>
                </div>
                <div class="md-layout-item">
                  {{new Date(payment.regDate).toLocaleDateString()}}
                </div>
                <div class="md-layout-item">
                  {{(payment.approval) ? '승인완료' : '승인대기'}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <md-dialog
        :md-active.sync="showDataDialog">
        <div class="weather-content">
          <img src="@/assets/img/instagramLogo.png" alt="" >
          <div class="md-layout md-alignment-center-center">
            <md-button class="md-raised md-primary" @click="showExtractData">인스타기록 추출하기</md-button>
            <md-button class="md-raised md-primary" @click="showLoadData">인스타기록 불러오기</md-button>
            <md-button class="md-raised md-accent" @click="showDataConfirm = true">인스타기록 삭제하기</md-button>
          </div>
          <input id="extract_data" type="file" @change="extractData" webkitdirectory directory hidden/>
          <input id="load_data" type="file" @change="loadData" accept=".txt" hidden/>
          <div class="md-layout md-alignment-center-center">
            <div class="w-tpadding-15 align-center">
              추출되는 데이터는 팔로우 증가내역(그래프) 및 작업내역입니다.<br>
              인스타기록 불러오기를 할 경우 기존의 데이터는 삭제됩니다.<br>
              이기능은 작업 컴퓨터를 옮길 경우에 사용하는 기능입니다.
            </div>
          </div>
        </div>
      </md-dialog>

      <md-dialog
        :md-active.sync="showInstaDialog"
        :md-click-outside-to-close="false">
        <md-dialog-title style="margin-bottom: 0;"><img src="@/assets/img/instagramLogo.png" alt=""></md-dialog-title>
        <md-dialog-content class="weather-content">
          <div class="md-layout md-alignment-center-center">
            <div class="md-layout-item md-size-80">
              <md-field>
                <label>아이디 추가하기</label>
                <md-input v-model="instagramId" type="text" @keyup.enter="checkInstagramIdPw"></md-input>
                <div class="md-helper-text">인스타그램 아이디를 입력후 엔터키를 눌러주세요.</div>
              </md-field>
            </div>
            <md-button  class="md-layout-item md-size-15 md-primary" @click="checkInstagramIdPw">추가하기</md-button>
          </div>
          <div class="md-layout md-alignment-center-center" v-for="(id, index) in Object.keys($store.state.instagram.account)" :key="index">
            <div class="md-layout-item md-size-70">
              <md-radio v-model="selectId" :value="id" @change="changeId">{{id}}</md-radio>
            </div>
            <md-button class="md-layout-item md-size-10 md-accent" @click="removeAccount(id)">삭제</md-button>
          </div>
          <div class="loading-overlay" v-if="loading">
            <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
          </div>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary md-raised" @click="showInstaDialog = false">확인</md-button>
        </md-dialog-actions>
      </md-dialog>

      <md-dialog-prompt
        :md-active.sync="couponSerialPrompt"
        :md-click-outside-to-close="false"
        v-model="couponSerial"
        md-title="쿠폰등록"
        md-input-placeholder="시리얼 번호"
        md-content="보유하고 계신 쿠폰번호를 입력해주세요. <br> 쿠폰은 일회성 상품이므로 <strong>취소하거나 되돌릴 수 없습니다.</strong>"
        @md-confirm="useDialog = true"
        md-confirm-text="등록"
        md-cancel-text="취소" />

      <md-dialog-confirm
        :md-active.sync="useDialog"
        :md-click-outside-to-close="false"
        md-title="쿠폰을 사용하시겠습니까?"
        :md-content="`쿠폰 [${couponSerial}] 를 사용하시겠습니까?`"
        md-confirm-text="사용하기"
        md-cancel-text="취소하기"
        @md-cancel="useDialog = false"
        @md-confirm="useCoupon" />
      
      <md-dialog-confirm
        :md-active.sync="showDataConfirm"
        :md-click-outside-to-close="false"
        md-title="작업기록을 삭제하시겠습니까?"
        md-content="작업기록을 삭제하면 지금까지 작업한 내역들이 전부 사라지며 복구할 수 없습니다. 작업기록이 너무많아 렉이 걸릴경우에 백업하시고 삭제하시기 바랍니다."
        md-confirm-text="삭제"
        md-cancel-text="취소"
        @md-cancel="showDataConfirm = false"
        @md-confirm="deleteData" />

      <md-dialog-alert
        :md-active.sync="resultDialog"
        :md-click-outside-to-close="false"
        :md-title="resultDialogTitle"
        :md-content="resultDialogContent" />
    </div>
  </div>
</template>

<script>
import windowHandler from '@/assets/js/windowHandler';
import CheckInstagramIdPw from '@/assets/js/CheckInstagramIdPw';
import FileStorage from '@/assets/js/FileStorage';

export default {
  mounted() {
    if (!this.$store.state.instagram.username) {
      this.showInstaDialog = true;
    }
  },
  data() {
    return {
      couponSerial: null,
      couponSerialPrompt: false,
      useDialog: false,
      resultDialog: false,
      showDataConfirm: false,
      resultDialogTitle: null,
      resultDialogContent: null,
      showInstaDialog: false,
      showDataDialog: false,
      showDefaultSpamDialog: false,
      instagramId: null,
      loading: false,
      selectId: this.$store.state.instagram.loginId,
    };
  },
  methods: {
    removeAccount(id) {
      this.$store.dispatch('removeAccount', { id });
      this.showInstaDialog = false;
    },
    changeId(id) {
      this.changeLoginId(this.$store.state.instagram.account[id].id);
      this.changeUsername(this.$store.state.instagram.account[id].username);
    },
    showExtractData() {
      document.getElementById('extract_data').click();
    },
    extractData(value) {
      if (value.target.files[0] && value.target.files[0].path) {
        const storage = new FileStorage(value.target.files[0].path, `socialup-${new Date().getTime()}`);
        storage.set('accountlogs', this.$store.state.instagram.accountlogs);
        storage.set('logs', this.$store.state.instagram.logs);
        this.showDataDialog = false;
      }
    },
    showLoadData() {
      document.getElementById('load_data').click();
    },
    loadData(value) {
      if (value.target.files[0] && value.target.files[0].path) {
        const storage = new FileStorage(null, value.target.files[0].path);
        const accountlogs = storage.get('accountlogs');
        const logs = storage.get('logs');
        this.$store.dispatch('setAllLogs', {
          accountlogs,
          logs,
        });
        this.showDataDialog = false;
      }
    },
    async checkInstagramIdPw() {
      if (this.instagramId) {
        this.loading = true;
        const result = await CheckInstagramIdPw(this.$store, this.instagramId);
        if (result) {
          this.changeLoginId(result.instagramId);
          this.changeUsername(result.username);
          this.showInstaDialog = false;
          this.$router.push('/');
        } else {
          this.resultDialogTitle = '인스타그램 로그인';
          this.resultDialogContent = '로그인에 실패 하였습니다.\n인스타그램 홈페이지에 접속하여 직접 로그인이 되는지 확인해주세요.';
          this.resultDialog = true;
        }
        this.loading = false;
      }
    },
    deleteData() {
      this.$store.dispatch('setAllLogs', {
        accountlogs: {},
        logs: {},
      });
    },
    changeLoginId(instagramId) {
      this.$store.dispatch('setLoginId', instagramId);
    },
    changeUsername(username) {
      this.$store.dispatch('setUsername', username);
    },
    open(link) {
      windowHandler.openBrowser(link);
    },
    useCoupon() {
      if (!this.couponSerial) {
        this.resultDialogTitle = '쿠폰등록';
        this.resultDialogContent = '쿠폰번호를 입력해주세요.';
        this.resultDialog = true;
      }
      this.$http.post('api/use/coupon', {
        serial: this.couponSerial,
      }).then((response) => {
        if (response.data) {
          this.resultDialogTitle = '쿠폰등록';
          this.resultDialogContent = '쿠폰 등록이 완료되었습니다.';
          this.resultDialog = true;
          this.whoami();
        } else {
          this.resultDialogContent = '쿠폰번호가 올바르지 않거나 이미 사용한 쿠폰입니다.';
          this.resultDialog = true;
        }
        this.couponSerial = null;
      });
    },
    whoami() {
      this.$http.get('api/member/whoami').then((response) => {
        if (response.data) {
          this.$store.dispatch('setMember', response.data);
        } else {
          this.$store.dispatch('clearAuth');
          this.$store.dispatch('clearMember');
        }
      });
    },
  },
};
</script>

<style lang="css" scoped>
</style>
