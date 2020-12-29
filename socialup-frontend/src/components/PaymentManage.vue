<template>
  <section class="pricing-plan-area gray-bg">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title"><!-- section title -->
            <h2 class="title">Payment Manage</h2>
            <div class="separator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div><!-- //. section title -->
        </div>
      </div>
      <div class="row" v-for="(payment, index) in payments" :key="index">
          <div class="col-lg-12 col-md-12">
              <div class="single-price-plan-01"><!-- single price plan 01 -->
                  <div class="price-header row align-middle row justify-content-center align-center weather-vpadding-15" style="align-items: center;">
                    <div class="col-lg-1 col-md-2">
                      {{payment.id}}
                    </div>
                    <div class="col-lg-1 col-md-2">
                      <span v-if="payment.type === 0">디폴트</span>
                      <span v-if="payment.type === 1">무통장 입금</span>
                      <span v-if="payment.type === 2">스마트 페이</span>
                      <span v-if="payment.type === 3">크몽</span>
                      <span v-if="payment.type === 4">오투잡</span>
                      <span v-if="payment.type === 5">체험판</span>
                      <span v-if="payment.type === 6">관리자</span>
                    </div>
                    <div class="col-lg-1 col-md-2">
                      {{payment.memberName}}
                    </div>
                    <div class="col-lg-1 col-md-2">
                      {{payment.payerName}}
                    </div>
                    <div class="col-lg-1 col-md-3">
                      {{payment.amount}}
                    </div>
                    <div class="col-lg-1 col-md-2">
                      {{payment.serviceType}}
                    </div>
                    <div class="col-lg-1 col-md-2">
                      {{payment.period}}
                    </div>
                    <div class="col-lg-2 col-md-3">
                      {{new Date(payment.regDate).toLocaleString()}}
                    </div>
                    <div class="col-lg-2 col-md-3">
                      <div v-if="payment.approval">
                        {{new Date(payment.approvalDate).toLocaleString()}}
                      </div>
                      <div v-else>
                        <b-button type="btn md-primary" name="button" @click="approval(payment)">승인</b-button><br>
                      </div>
                    </div>
                  </div>
              </div><!-- //. single price plan one -->
          </div>
      </div>
      <div class="row justify-content-center w-tmargin-15">
        <b-pagination align="center" @change="getPayments" :total-rows="paymentCount" v-model="currentPage" :limit="10" :per-page="perPage"></b-pagination>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    this.getPaymentCount();
    this.getPayments(1);
  },
  data() {
    return {
      currentPage: null,
      perPage: 10,
      paymentCount: 0,
      payments: [],
    }
  },
  methods: {
    approval(payment) {
      this.$http.post(`api/approval/${payment.id}`).then((response) => {
        if (response.data) {
          payment.approval = true;
          payment.approvalDate = new Date().getTime();
        }
      })
    },
    getPaymentCount() {
      this.$http.get('api/count/payment').then((response) => {
        if (response.data) {
          this.paymentCount = response.data;
        }
      });
    },
    getPayments(page) {
      this.$http.get('api/payment', {
        params: {
          page,
          size: this.perPage,
        }
      }).then((response) => {
        if (response.data) {
          this.payments = response.data;
        }
      });
    }
  }
}
</script>

<style lang="css" scoped>
.weather-vpadding-15 {
  padding-top: 15px !important;
  padding-bottom: 15px !important;
}
.weather-margine-15 {
  margin: 15px;
}
</style>
