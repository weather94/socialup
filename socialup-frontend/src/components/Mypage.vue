<template>
  <section class="pricing-plan-area gray-bg">
    <div class="container">
      <div class="row justify-content-center">
          <div class="col-lg-8">
              <div class="section-title"><!-- section title -->
                  <h2 class="title">Mypage</h2>
                  <div class="separator">
                      <span></span>
                      <span></span>
                      <span></span>
                  </div>
              </div><!-- //. section title -->
          </div>
      </div>
      <div class="row" v-if="this.$store.state.member.member">
        <div class="col-lg-4 col-md-6">
          <div class="single-price-plan-01"><!-- single price plan 01 -->
            <div class="price-header">
              <div class="icon">
                <i class="flaticon-rocket-ship"></i>
              </div>
              <h4 class="name">{{this.$store.state.member.member.name}}</h4>
            </div>
            <div class="price-body">
              <ul>
                <li>{{this.$store.state.member.member.email}}</li>
                <li>{{this.$store.state.member.member.name}}</li>
                <li>{{this.$store.state.member.member.contact}}</li>
                <li>{{`포인트 ${this.$store.state.member.member.point}`}}</li>
                <li>{{`등급 ${this.$store.state.member.member.grade}`}}</li>
                <li>{{this.$store.state.member.member.regDate}}</li>
              </ul>
            </div>
          </div>
          <div class="row justify-content-around">
            <a class="btn-boxed blank w-cwhite" href="javascript:void(0)" @click="changePasswordModalShow = true">비밀번호 변경</a>
            <a class="btn-boxed blank w-cwhite" href="javascript:void(0)" @click="couponModalShow = true">쿠폰 등록</a>
          </div>
          <div class="price-footer">

          </div>
        </div>
        <div class="col-lg-8 col-md-6" style="margin-top: 10px;">
          <md-button :class="(selectedMenu === 1) ? 'md-primary md-raised' : 'md-accent md-raised'" @click="selectMenu(1)">사용기간</md-button>
          <md-button :class="(selectedMenu === 2) ? 'md-primary md-raised' : 'md-accent md-raised'" @click="selectMenu(2)">작업내역</md-button>
          <md-button :class="(selectedMenu === 3) ? 'md-primary md-raised' : 'md-accent md-raised'" @click="selectMenu(3)">결제기록</md-button>
          
          <div style="margin-top: 20px;" v-if="selectedMenu === 1">
            <md-card md-with-hover style="color: #5a5a5a; padding: 20px; margin: 10px;" v-for="(period, index) in Object.keys(this.$store.state.member.member.periodProxys)" :key="index">
              <div class="md-layout md-alignment-center-center">
                <div class="md-layout-item md-size-35 md-small-size-100 align-center">
                  <span>{{serviceName[period]}}</span>
                </div>
                <div class="md-layout-item md-size-15 md-small-size-100 align-center">
                  <span>{{`${$store.state.member.member.periodProxys[period].allowCount + 1} 계정`}}</span>
                </div>
                <div class="md-layout-item md-size-50 md-small-size-100 align-center">
                  {{`만료일자 ${new Date($store.state.member.member.periodProxys[period].expired).toLocaleString()}`}}
                </div>
              </div>
            </md-card>
            <md-card md-with-hover style="color: #5a5a5a; padding: 20px; margin: 10px;" v-for="(period, index) in Object.keys(this.$store.state.member.member.periods)" :key="index+100">
              <div class="md-layout md-alignment-center-center">
                <div class="md-layout-item md-size-35 md-small-size-100 align-center">
                  <span>{{serviceName[period]}}</span>
                </div>
                <div class="md-layout-item md-size-15 md-small-size-100 align-center">
                  <span>{{`${$store.state.member.member.periods[period].allowCount + 1} 계정`}}</span>
                </div>
                <div class="md-layout-item md-size-50 md-small-size-100 align-center">
                  {{`만료일자 ${new Date($store.state.member.member.periods[period].expired).toLocaleString()}`}}
                </div>
              </div>
            </md-card>
          </div>
          <div style="margin-top: 20px;" v-if="selectedMenu === 2">
            <md-card md-with-hover style="color: #5a5a5a; padding: 20px; margin: 10px;" v-for="(work, index) in this.$store.state.member.member.instagramWorks" :key="index">
              <div class="md-layout md-alignment-center-center">
                <div class="md-layout-item md-size-20 md-small-size-50 align-center">
                  {{work.url.replace('https://www.instagram.com/p/', '').replace('/', '')}}
                </div>
                <div class="md-layout-item md-size-20 md-small-size-50 align-center">
                  {{serviceName[work.type]}}
                </div>
                <div class="md-layout-item md-size-15 md-small-size-30 align-center">
                  {{`${work.count}/${work.goal} (${Math.round(work.count/work.goal*100)}%)`}}
                </div>
                <div class="md-layout-item md-size-30 md-small-size-70 align-center">
                  {{new Date(work.regDate).toLocaleString()}}
                </div>
                <div class="md-layout-item md-size-15 md-small-size-100 align-center">
                  {{(work.finish) ? new Date(work.finishDate).toLocaleString() : '진행중'}}
                </div>
              </div>
            </md-card>
          </div>
          <div style="margin-top: 20px;" v-if="selectedMenu === 3">
            <md-card md-with-hover style="color: #5a5a5a; padding: 20px; margin: 10px;" v-for="(payment, index) in this.$store.state.member.member.payments" :key="index+200">
              <div class="md-layout" style="align-items: center;">
                <div class="md-layout-item md-size-30 md-small-size-100 align-center">
                  <span>{{serviceName[payment.serviceType]}}</span>
                </div>
                <div class="md-layout-item md-size-15 md-small-size-50 align-center">
                  <span v-if="payment.type === 0">디폴트</span>
                  <span v-if="payment.type === 1">무통장 입금</span>
                  <span v-if="payment.type === 2">스마트 페이</span>
                  <span v-if="payment.type === 3">크몽</span>
                  <span v-if="payment.type === 4">오투잡</span>
                  <span v-if="payment.type === 5">체험판</span>
                  <span v-if="payment.type === 6">관리자</span>
                </div>
                <div class="md-layout-item md-size-10 md-small-size-50 align-center">
                  {{payment.amount}}
                </div>
                <div class="md-layout-item md-size-30 md-small-size-70 align-center">
                  {{new Date(payment.regDate).toLocaleString()}}
                </div>
                <div class="md-layout-item md-size-15 md-small-size-30 align-center">
                  {{(payment.approval) ? '승인완료' : '승인대기'}}
                </div>
              </div>
            </md-card>
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="couponModalShow" centered cancel-title="취소" ok-title="확인" title="쿠폰 등록하기" @ok="getCoupon">
      <b-form-input type="text" class="w-bmargin-15"
                      placeholder="시리얼 번호"
                      v-model="couponSerial"></b-form-input>
      <p>쿠폰을 1회성 상품으로 사용하시면 되돌릴 수 없습니다.<br>그래도 쿠폰을 사용하시겠습니까?</p>
    </b-modal>

    <md-dialog v-if="coupon" :md-active.sync="couponUseModalShow" style="padding: 0 20px 0 20px;"
      :md-close-on-esc="false" :md-click-outside-to-close="false">
      <md-dialog-title>쿠폰</md-dialog-title>
      <md-dialog-content>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-30 md-small-size-100" v-if="coupon.socialType === 'instagram' && (coupon.serviceType === 'manage' || coupon.serviceType === 'instagramProxy')">
            <img v-if="coupon.serviceType === 'manage'" src="src/assets/img/banner/program.jpg" alt="">
            <img v-if="coupon.serviceType === 'instagramProxy'" src="src/assets/img/banner/proxy.jpg" alt="">
          </div>
          <div class="md-layout-item md-size-30 md-small-size-100" v-if="coupon.socialType === 'instagram' && (coupon.serviceType !== 'manage' && coupon.serviceType !== 'instagramProxy')">
            <img src="src/assets/img/banner/up.jpg" alt="">
          </div>
          <div class="md-layout-item md-size-70 md-small-size-100">
            <h5 style="margin-top: 20px;">
              {{`${serviceName[coupon.serviceType]} 쿠폰`}}
            </h5>
            <div style="font-size: 16px; margin-top: 10px;">
              {{`발급일자 : ${new Date(coupon.issueAt).toLocaleDateString()}`}}
            </div>
            <div  style="font-size: 16px; margin-top: 10px;" v-if="coupon.socialType === 'instagram' && (coupon.serviceType === 'manage' || coupon.serviceType === 'instagramProxy')">
              {{`계정 : ${coupon.count + 1}개`}}
            </div>
            <div  style="font-size: 16px; margin-top: 10px;" v-if="coupon.socialType === 'instagram' && (coupon.serviceType === 'manage' || coupon.serviceType === 'instagramProxy')">
              {{`기간 : ${coupon.period}일`}}
            </div>
            <div  style="font-size: 16px; margin-top: 10px;" v-if="coupon.socialType === 'instagram' && (coupon.serviceType !== 'manage' && coupon.serviceType !== 'instagramProxy')">
              {{`수량 : ${coupon.count}개`}}
            </div>
            <div  style="font-size: 16px; margin-top: 10px;" v-if="coupon.socialType === 'instagram' && (coupon.serviceType !== 'manage' && coupon.serviceType !== 'instagramProxy')">
              <md-field>
                <label>작업 할 게시물 주소</label>
                <md-input type="text" v-model="link" placeholder="예시) https://www.instagram.com/p/BvbeuvZlcns/"></md-input>
                <span class="md-helper-text">팔로워를 신청하신 경우에도 자신의 아무 게시물 링크를 입력해주세요.</span>
              </md-field>
            </div>
          </div>
        </div>

        <div v-if="coupon.state === 0" class="align-center" style="font-size: 16px; margin-top: 20px; text-align: center;">
          <span>* 쿠폰은 1회성 상품으로 사용후 되돌릴 수 없습니다. 그래도 쿠폰을 사용하시겠습니까?</span>
        </div>
        <div v-if="coupon.state !== 0" class="align-center" style="margin-top: 10px;">
          <p style="color: red; font-size:30px; font-weight: 600;">이미 사용한 쿠폰입니다.</p>
          <p>사용일자 : {{new Date(coupon.useAt).toLocaleString()}}</p>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent md-raised" @click="couponUseModalShow = false">취소</md-button>
        <md-button v-if="coupon.state === 0" class="md-primary md-raised" @click="useCoupon">사용</md-button>
      </md-dialog-actions>
    </md-dialog>

    <b-modal v-model="changePasswordModalShow" centered cancel-title="취소" ok-title="수정하기" title="비밀번호 변경하기" @ok="changePassword">
      <b-form-input type="password" class="w-bmargin-15"
                      placeholder="기존 비밀번호"
                      v-model="oldPassword"></b-form-input>
      <b-form-input type="password" class="w-bmargin-15"
                      placeholder="새 비밀번호"
                      v-model="newPassword"></b-form-input>
      <b-form-input type="password" class="w-bmargin-15"
                      placeholder="새 비밀번호 확인"
                      v-model="newPasswordCheck"></b-form-input>
    </b-modal>
  </section>
</template>

<script>
export default {
  data() {
    return {
      serviceName: {
        manage: '인스타 계정관리 프로그램',
        instagramProxy: '인스타 계정관리 대행',
        korea_real_follower: '한국인 실제 팔로워',
        korea_ghost_follower: '한국인 유령 팔로워',
        foreigner_ghost_follower: '외국인 유령 팔로워',
        korea_real_like: '한국인 실제 좋아요',
        korea_ghost_like: '한국인 유령 좋아요',
        foreigner_ghost_like: '외국인 유령 좋아요',
      },
      couponModalShow: false,
      couponUseModalShow: false,
      changePasswordModalShow: false,
      oldPassword: null,
      newPassword: null,
      newPasswordCheck: null,
      couponSerial: null,
      coupon: null,
      link: null,
      selectedMenu: 1,
    };
  },
  methods: {
    selectMenu(value) {
      this.selectedMenu = value;
    },
    whoami() {
      this.$http.get('api/member/whoami').then((result) => {
        if (result.data) {
          this.$store.dispatch('setMember', result.data);
        }
      })
    },
    getCoupon(evt) {
      evt.preventDefault();
      if (!this.couponSerial) {
        return;
      }
      this.$http.get(`api/coupon/${this.couponSerial}`).then((response) => {
        if (response.data) {
          this.coupon = response.data;
          this.couponModalShow = false;
          this.couponUseModalShow = true;
        } else {
          alert('쿠폰번호가 올바르지 않습니다.');
        }
      });
    },
    useCoupon(evt) {
      evt.preventDefault();
      if (this.coupon.socialType === 'instagram' && (this.coupon.serviceType !== 'manage' && this.coupon.serviceType !== 'instagramProxy')) {
        if(!this.link) {
          alert('작업 할 게시물 주소를 입력해주세요.');
          return;          
        } else {
          const re = /(^https:\/\/www.instagram.com\/p\/.*\/$)/g
          if (!re.exec(this.link)) {
            alert('인스타그램 게시글 주소를 양식에 맞춰 입력해주세요.\r\n예시) https://www.instagram.com/p/BvbeuvZlcns/');
            return;
          }
        }
      }
      this.$http.post('api/use/coupon', {
        serial: this.coupon.serial,
        link: this.link,
      }).then((response) => {
        if (response.data) {
          alert('쿠폰 등록이 완료되었습니다.');
          this.couponModalShow = false;
          this.couponUseModalShow = false;
          this.whoami();
        } else {
          alert('쿠폰번호가 올바르지 않거나 이미 사용한 쿠폰입니다.');
        }
      });
    },
    changePassword(evt) {
      evt.preventDefault();
      if (!this.oldPassword || !this.newPassword || !this.newPasswordCheck) {
        alert('비밀번호를 입력해 주세요.');
        return;
      }
      if (this.newPassword.length < 6) {
        alert('새 비밀번호를 너무 짧습니다.');
        return;
      }
      if (this.newPassword !== this.newPasswordCheck) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      this.$http.put('api/member/password', {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      }).then((response) => {
        if (response.data) {
          alert('비밀번호가 변경되었습니다.');
          this.changePasswordModalShow = false;
        } else {
          alert('기존 비밀번호가 올바르지 않습니다.');
        }
        this.oldPassword = null;
        this.newPassword = null;
        this.newPasswordCheck = null;
      });
    }
  }
}
</script>

<style lang="css">
</style>
