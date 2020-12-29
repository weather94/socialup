<template>
  <div>
    <section class="breadcrumb-area breadcrumb-bg">
      <div style="position: absolute; width:100%; height: 100%; text-align: center;">
        <div class="wow fadeInDown" style="color: #d7d7d7; font-size: 3.5rem; font-weight: 500;">
          소셜업 인스타그램 서비스
        </div>
      </div>
    </section>
    <section class="container" style="margin-top: 70px;">
      <div class="md-layout md-gutter md-alignment-center-center">
        <div class="md-layout-item md-size-30 md-small-size-100">
          <md-card class="single-price-plan-01" style="border-radius: 10px;">
            <div class="hovermac" @click="route('/service/program')">
              <div class="hovermac-item md-layout md-alignment-center-center" style="margin-top: 80%;">
                <md-button class="md-layout-item md-raised md-accent">
                  알아보기
                </md-button>
                <md-button class="md-layout-item md-raised md-primary">
                  구매하기
                </md-button>
              </div>
            </div>
            <img src="src/assets/img/banner/program.jpg" alt="" style="border-radius: 10px;">
          </md-card>
        </div>
        <div class="md-layout-item md-size-30 md-small-size-100">
          <md-card class="single-price-plan-01" style="border-radius: 10px;">
            <!-- <div class="hovermac" @click="route('/service/proxy')"> -->
            <div class="hovermac" @click="route('/service/proxy')">
              <div class="hovermac-item md-layout md-alignment-center-center" style="margin-top: 80%;">
                <md-button class="md-layout-item md-raised md-accent">
                  알아보기
                </md-button>
                <md-button class="md-layout-item md-raised md-primary">
                  구매하기
                </md-button>
              </div>
            </div>
            <img src="src/assets/img/banner/proxy.jpg" alt="" style="border-radius: 10px;">
          </md-card>
        </div>
        <div class="md-layout-item md-size-30 md-small-size-100">
          <md-card class="single-price-plan-01" style="border-radius: 10px; background-color: white">
            <!-- <div class="hovermac" @click="route('/service/up')"> -->
            <div class="hovermac" @click="nolaunching">
              <div class="hovermac-item md-layout md-alignment-center-center" style="margin-top: 80%;">
                <md-button class="md-layout-item md-raised md-accent">
                  알아보기
                </md-button>
                <md-button class="md-layout-item md-raised md-primary">
                  구매하기
                </md-button>
              </div>
            </div>
            <img src="src/assets/img/banner/up.jpg" alt="" style="border-radius: 10px;">
          </md-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data: () => ({
    count: null,
    selectedType: 'manage',
    link : null,
    showPaymentType: false,
    showBill: false,
    serviceSelected: 'instagram',
    serviceOptions: [
      { text: '인스타그램', value: 'instagram'},
      { text: '페이스북', value: 'facebook', disabled: true },
    ],
    monthSelected: 1,
    monthOptions: [
      {value: 1, text: '1 개월'},
      {value: 2, text: '2 개월'},
      {value: 3, text: '3 개월'},
    ],
    managePrice: {
      1: 33000,
      2: 55000,
      3: 77000,
    },
    paymentSelected: 1,
    paymentOptions: [
      { text: '무통장 입금', value: 1 },
      { text: '스마트 페이', value: 2, disabled: true },
    ],
    payerName: '',
    payment: {
      type: null,
      amount: 0,
      socialType: '',
      serviceType: '',
      link: '',
      period: 0,
      count: 0,
      payerName: '',
      date: null,
    },
  }),
  methods: {
    route(path) {
      this.$router.push(path);
    },
    nolaunching() {
      alert('런칭 준비중인 기능입니다!');
    },
    selectType(type) {
      this.selectedType = type;
      this.showBill = false;
      this.showPaymentType = false;
    },
    addComma(num) {
      var regexp = /\B(?=(\d{3})+(?!\d))/g;
      return num.toString().replace(regexp, ',');
    },
    buy(serviceType) {
      if (serviceType === 'manage') {
        this.payment = {
          type: null,
          amount: this.managePrice[this.monthSelected],
          socialType: 'instagram',
          serviceType: 'manage',
          link: '',
          period: 30 * this.monthSelected,
          count: 0,
          payerName: '',
          date: null,
        }
      } else {
        if (!this.link || this.count <= 0) {
          alert('링크와 수량을 제대로 입력해주세요.')
          return;
        }
        if(this.selectedService.disabled === true) {
          alert('출시 준비중인 기능입니다.')
          return;
        }
        this.payment = {
          type: null,
          amount: this.selectedService.unitPrice * this.count,
          socialType: 'instagram',
          serviceType: this.selectedService.type,
          link: this.link,
          period: 0,
          count: this.count,
          payerName: '',
          date: null,
        }
      }
      this.showBill = false;
      this.showPaymentType = true;
    },
    pay() {
      this.payment.type = this.paymentSelected;
      if (this.payerName) {
        this.payment.payerName = this.payerName;
      } else {
        this.payment.payerName = this.$store.state.member.member.name;
      }

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
  },
}
</script>

<style lang="css">
.hovermac {
  cursor: pointer;
  position: absolute; 
  width: 100%; 
  height: 100%; 
  background-color: #00000097;
  border-radius: 10px;
  opacity: 0;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.single-price-plan-01 {
  -webkit-transition: all 0.9s ease-in-out;
  -moz-transition: all 0.9s ease-in-out;
  -ms-transition: all 0.9s ease-in-out;
  -o-transition: all 0.9s ease-in-out;
  transition: all 0.9s ease-in-out;
}
/* .single-price-plan-01:hover {
  transform: rotate(360deg);
} */

.single-price-plan-01:hover .hovermac {
  opacity: 1;
}
.w-service-details-content-area {
  padding-top: 60px;
  padding-bottom: 100px;
}
.align-center {
  text-align: center;
}
.hovermac-item {
  margin:20px;
}
</style>
