<template>
  <section class="w-service-details-content-area gray-bg">
    <div class="container">
      <div class="row w-tmargin-50">
        <div class="col-lg-12 col-md-12">
          <div class="single-price-plan-01"><!-- single price plan 01 -->
            <div class="price-header row align-middle">
            <div class="col-lg-4 col-md-4">
              <div class="icon">
                <i class="flaticon-rocket-ship"></i>
              </div>
              <h4 class="name">
                <div class="row justify-content-center">
                  <b-form-select v-model="socialType" :options="socialTypeOption" class="mb-1 col-6" />
                </div>
              </h4>
            </div>
            <div class="col-lg-4 col-md-4">
              <div class="price-body">
              <ul>
                <li>
                  <div class="justify-content-center">
                    <b-form-select v-model="issueType" :options="issueTypeOption"/>
                  </div>
                </li>
                <li>
                  <div class="justify-content-center">
                    <b-form-select v-model="serviceType" :options="serviceTypeOption"/>
                  </div>
                </li>
                <li v-if="serviceType === 'manage' || serviceType === 'instagramProxy'">
                  <b-form-input v-model="period" type="number" placeholder="기간"></b-form-input>
                </li>
                <li v-if="serviceType === 'manage' || serviceType === 'instagramProxy'">
                  <b-form-input v-model="count" type="number" placeholder="추가 계정수"></b-form-input>
                </li>
                <li v-if="serviceType && serviceType !== 'manage' && serviceType !== 'instagramProxy'">
                  <b-form-input v-model="count" type="number" placeholder="수량"></b-form-input>
                </li>
                <li>
                  <b-form-input v-model="amount" type="number" placeholder="결제 금액"></b-form-input>
                </li>
              </ul>
              </div>
            </div>
            <div class="col-lg-4 col-md-4">
              <div class="row justify-content-center">
              </div>
              <div class="price-footer">
                <a href="javascript:void(0)" class="btn-boxed blank"  @click="issueCoupon">쿠폰발급</a>
              </div>
            </div>
            </div>
          </div><!-- //. single price plan one -->
        </div>
      </div>
    </div>
    <div class="container w-tmargin-15">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title"><!-- section title -->
            <h2 class="title">쿠폰 내역</h2>
          </div><!-- //. section title -->
        </div>
      </div>
      <div class="row" v-for="(coupon, index) in coupons" :key="index">
          <div class="col-lg-12 col-md-12">
              <div class="single-price-plan-01 w-click-box2" :style="(coupon.id === issueCouponId) ? { backgroundColor: 'khaki' } : null"><!-- single price plan 01 -->
                  <div class="row justify-content-center align-center w-padding-10">
                    <div class="col-lg-1 col-md-1">
                      {{coupon.id}}
                    </div>
                    <div class="col-lg-3 col-md-3">
                      <div>
                        {{coupon.issuerName}}
                      </div>
                      <div>
                        {{new Date(coupon.issueAt).toLocaleString()}}
                      </div>
                    </div>
                    <div class="col-lg-1 col-md-1">
                      <div>
                        {{coupon.socialType}}
                      </div>
                      <div>
                        {{coupon.serviceType}}
                      </div>
                      <div v-if="coupon.serviceType === 'manage' || coupon.serviceType === 'instagramProxy'">
                        {{`${coupon.period} / ${coupon.count + 1}`}}
                      </div>
                      <div v-if="coupon.serviceType !== 'manage' && coupon.serviceType !== 'instagramProxy'">
                        {{`${coupon.count}`}}
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4">
                      {{coupon.serial}}
                    </div>
                    <div class="col-lg-3 col-md-3">
                      <div v-if="coupon.state === 0">
                        미사용
                      </div>
                      <div v-if="coupon.state === 1">
                        <div>
                          {{coupon.userName}}
                        </div>
                        <div>
                          {{new Date(coupon.useAt).toLocaleString()}}
                        </div>
                      </div>
                    </div>
                  </div>
              </div><!-- //. single price plan one -->
          </div>
      </div>
      <div class="row justify-content-center w-tmargin-15">
        <b-pagination align="center" @change="getCounpons" :total-rows="couponCount" v-model="currentPage" :limit="10" :per-page="perPage"></b-pagination>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      socialTypeOption: [
        { value: null, text: '소셜 타입', disabled: true },
        { value: 'instagram', text: '인스타그램' },
        { value: 'facebook', text: '페이스북', disabled: true },
        { value: 'naver', text: '네이버', disabled: true },
      ],
      issueTypeOption: [
        { value: null, text: '쿠폰발급 타입', disabled: true },
        { value: 'KMONG', text: '크몽' },
        { value: 'OTWOJOB', text: '오투잡' },
        { value: 'TRIAL', text: '체험판' },
        { value: 'ADMIN', text: '관리자' },
      ],
      serviceTypeOption: [
        { value: null, text: '서비스 타입', disabled: true },
        { value: 'manage', text: '인스타 계정관리 프로그램' },
        { value: 'instagramProxy', text: '인스타 계정관리 대행서비스' },
        { value: 'korea_real_follower', text: '한국인 실제 팔로워',},
        { value: 'korea_real_like', text: '한국인 실제 좋아요',},
        { value: 'korea_ghost_follower', text: '한국인 유령 팔로워',},
        { value: 'korea_ghost_like', text: '한국인 유령 좋아요',},
        { value: 'foreigner_ghost_follower', text: '외국인 유령 팔로워',},
        { value: 'foreigner_ghost_like', text: '외국인 유령 좋아요',},
      ],
      coupons: [],
      couponCount: 0,
      perPage: 10,
      issueCouponId: null,
      currentPage: null,
      socialType: null,
      issueType: null,
      serviceType: null,
      period: null,
      count: null,
      amount: null,
    };
  },
  mounted() {
    this.getCounponCount();
    this.getCounpons(1);
  },
  methods: {
    issueCoupon() {
      if (this.socialType === null || this.issueType === null || this.serviceType === null) {
        alert('옵션을 전부 선택해 주세요.')
        return;
      }
      if (this.serviceType === 'manage' && !this.period) {
        alert('기간을 입력해주세요.');
        return;
      }
      this.$http.post('api/coupon', {
        socialType: this.socialType,
        issueType: this.issueType,
        serviceType: this.serviceType,
        period: this.period,
        amount: this.amount,
        count: this.count,
      }).then((response) => {
        if (response.data) {
          this.issueCouponId = response.data.id;
          this.getCounponCount();
          this.currentPage = 1;
          this.getCounpons(1);
          this.socialType = null;
          this.issueType = null;
          this.serviceType = null;
          this.period = null;
          this.amount = null;
          this.count = null;
        }
      });
    },
    getCounponCount() {
      this.$http.get('api/count/coupon').then((response) => {
        if (response.data) {
          this.couponCount = response.data;
        }
      })
    },
    getCounpons(page) {
      this.$http.get('api/coupon', {
        params: {
          page,
          size: this.perPage,
        }
      }).then((response) => {
        if (response.data) {
          this.coupons = response.data;
        }
      })
    },
  }
}
</script>

<style lang="css">

</style>
