<template>
  <section class="pricing-plan-area gray-bg">
    <div class="container" :style="{marginTop: '40px'}" v-if="true">
      <div class="row justify-content-center">
          <div class="col-lg-8">
              <div class="section-title"><!-- section title -->
                  <h2 class="title">무통장 입금</h2>
              </div><!-- //. section title -->
          </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-12">
          <div class="single-price-plan-01" :style="{ padding: '30px'}">
            <div class="row justify-content-center">
              <b-form class="col-lg-4 col-md-4">
                <b-form-group id="exampleInputGroup1" label="입금계좌" label-for="exampleInput1">
                  <b-form-input id="exampleInput1" type="text" required value="농협 - 최기상" disabled></b-form-input>
                </b-form-group>
              </b-form>
            </div>
            <div class="row justify-content-center">
              <b-form class="col-lg-4 col-md-4">
                <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
                  <b-form-input id="exampleInput1" type="text" required value="301-0241-0395-11" disabled></b-form-input>
                </b-form-group>
              </b-form>
            </div>
            <div class="row justify-content-center">
              <b-form class="col-lg-4 col-md-4">
                <b-form-group id="exampleInputGroup1" label="결제금액" label-for="exampleInput1">
                  <b-form-input id="exampleInput1" type="text" required :value="payment.amount" disabled></b-form-input>
                </b-form-group>
              </b-form>
            </div>
            <div class="row justify-content-center">
              <b-form class="col-lg-4 col-md-4">
                <b-form-group id="exampleInputGroup1" label="입금자명" label-for="exampleInput1">
                  <b-form-input id="exampleInput1" type="text" required :value="payment.payerName" disabled></b-form-input>
                </b-form-group>
              </b-form>
            </div>
            <div>
              {{new Date().toLocaleString()}}<br>
              <span :style="{color: 'red'}">
                결제신청이 완료되었습니다.<br>
                반드시 입금자명으로 입금해주시기 바랍니다.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showPaymentType: false,
      showBill: false,
      serviceSelected: 'instagram',
      serviceOptions: [
        { text: '인스타그램', value: 'instagram'},
        { text: '페이스북', value: 'facebook', disabled: true },
      ],
      monthSelected: 1,
      monthOptions: [1, 3, 6, 12],
      paymentSelected: 1,
      paymentOptions: [
        { text: '무통장 입금', value: 1 },
        { text: '스마트 페이', value: 2, disabled: true },
      ],
      payerName: '',
      payment: {
        type: null,
        amount: 0,
        serviceType: '',
        period: 0,
        payerName: '',
        date: null,
      },
    };
  },
  computed: {
    price() {
      return this.monthSelected * 19900;
    },
  },
  methods: {
    buy() {
      this.payment.serviceType = this.serviceSelected;
      this.payment.amount = 19900 * this.monthSelected;
      this.payment.period = 30 * this.monthSelected;
      this.showBill = false;
      this.showPaymentType = true;
    },
    pay() {
      this.payment.type = this.paymentSelected;
      this.payment.payerName = this.payerName;
      this.$http.post('/api/payment', this.payment).then((response) => {
        if (response.data) {
          this.payment = response.data;
          this.payerName = '';
          this.showPaymentType = false;
          this.showBill = true;
        } else {
          alert('에러가 발생 하였습니다.');
        }
      })
    },
  }
};
</script>

<style lang="css" scoped>
.price-body ul {
  padding: 0 !important;
}

</style>
