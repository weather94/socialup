<template>
  <div class="gray-bg">
    <div class="work-details-content-area" style="padding-top: 40px;">
      <div class="container">
        <div style="text-align: center; font-size:30px; line-height: 40px; margin-bottom: 30px;">
          인스타그램 계정 관리대행 서비스
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-40 md-small-size-100">
            <div class="work-details-inner-area"><!-- work details inner area -->
              <div class="thumb md-layout md-alignment-center-center">
                <img class="md-layout-item" :src="`../src/assets/img/banner/proxy.jpg`" alt="work details image">
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-60 md-small-size-100">
            <div class="work-details-inner-area"><!-- work details inner area -->
              <p style="color: black;">
                고객님이 선팔로우, 내 팔로워관리, 언팔로우 할 기능을 설정하고 타겟대상, 작업옵션, 응답댓글 등을 설정하시면 소셜업에서 그에 맞게 계정을 관리합니다.<br>
              </p>
              <p>기능 - (클릭시 상세설명)</p>
              <div v-for="(desc, index) in description" :key="index" style="margin-top: 10px;">
                <a data-toggle="collapse" :data-target="`#collapse${index}`" aria-expanded="true" :aria-controls="`collapse${index}`" style="cursor: pointer;">
                  <p style="font-weight: bold;">{{`${index + 1}. ${desc.title}`}}</p>
                </a>
                <div :id="`collapse${index}`" class="collapse" :aria-labelledby="`heading${index}`">
                  <p>
                    {{desc.text}}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="md-layout md-alignment-center-center" style="margin-top:30px;">
          <md-card class="price md-layout-item md-size-20 md-small-size-100" v-for="(option, index) in buyOption" :key="index" style="margin: 5px;">
            <div class="sale">{{`${Math.round((1-option.salePrice/option.price)*100)}% 할인`}}</div>
            <div class="price-over" style="text-align: center;">
              <div class="md-layout md-alignment-center-center" style="margin-top: 5px;">
                <span class="md-layou">
                  <md-button class="md-icon-button" @click="(option.count > 1) ? option.count-- : null">
                    <md-icon style="color: #d7d7d7;">keyboard_arrow_left</md-icon>
                  </md-button>
                </span>
                <div class="md-layou-item" style="color: white;">
                  <span style="font-size:20px;">{{option.count}}</span>
                  <span style="font-size:12px;">계정</span>
                </div>
                <span class="md-layou">
                  <md-button class="md-icon-button" @click="option.count++">
                    <md-icon style="color: #d7d7d7;">keyboard_arrow_right</md-icon>
                  </md-button>
                </span>
              </div>
              <div class="md-layout" style="margin-top:10px;">
                <div class="md-layout-item">
                  <span style="color: white; font-size:30px;">{{addComma(option.salePrice*option.count)}}</span>
                  <span style="color: white;">원</span>
                </div>
              </div>
              <div class="md-layot" style="margin-top:10px;">
                <md-button class="md-raised md-layout-item" style="top: 60%; background-color: #ffbbd6; color: #4a4a4a;" @click="setBuyData(option)">구매하기</md-button>
              </div>
            </div>
            <div class="md-layout md-alignment-center-center" style="padding: 50px 10px 30px 10px; margin:5px;">
              <div class="md-layout-item md-size-40 align-center">
                <span style="font-size: 30px; font-weight: bold;">{{option.period}}</span>개월
              </div>
              <div class="md-layout-item md-size-60 align-center">
                <div style="text-decoration: line-through; margin-bottom:10px;">
                  <span style="font-size: 20px; font-weight: bold;">{{addComma(option.price)}}</span>원
                </div>
                <div>
                  <span style="font-size: 20px;  font-weight: bold;">{{addComma(option.salePrice)}}</span>원
                </div>
              </div>
            </div>
          </md-card>
        </div>
        <div class="md-layout md-alignment-center-center" style="margin: 10px 0 10px 0; ">
          <md-button class="md-raised" @click="selectedDescription = 'detail'" :style="(selectedDescription === 'detail') ? 'background-color: #d7d7d7;' : ''">상세설명</md-button>
          <md-button class="md-raised" @click="selectedDescription = 'notice'" :style="(selectedDescription === 'notice') ? 'background-color: #d7d7d7;' : ''">주의사항</md-button>
        </div>
        <div v-if="selectedDescription === 'detail'" class="align-center">
          <img src="http://socialup.kr/src/assets/img/manage.jpg" width="800">
        </div>
        <div v-if="selectedDescription === 'notice'" class="align-center">
          <img src="http://socialup.kr/src/assets/img/notice.png" width="800">
        </div>
      </div>
    </div>
    <md-dialog :md-active.sync="showDialog" style="padding: 0 20px 0 20px;"
      :md-close-on-esc="false" :md-click-outside-to-close="false">
      <md-dialog-title>결제하기</md-dialog-title>
      <md-dialog-content>
        <div class="md-layout md-gutter md-alignment-center-center">
        <div class="md-layout-item md-size-30 md-small-size-100">
          <img :src="'../src/assets/img/banner/program.jpg'" alt="">
        </div>
        <div class="md-layout-item md-size-70 md-small-size-100">
          <div style="font-size:20px; margin: 20px;">인스타그램 계정관리 프로그램</div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item1" style="margin-right:10px;">
                <md-field>
                  <label for="period">기간</label>
                  <md-select v-model="buyData.period" name="period" id="period" @md-selected="changePeriod">
                    <md-option :value="1">1개월</md-option>
                    <md-option :value="3">3개월</md-option>
                    <md-option :value="6">6개월</md-option>
                    <md-option :value="12">12개월</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item1">
                <md-field>
                  <label>계정수</label>
                  <md-input v-model="buyData.count" @input="changeCount" type="number"></md-input>
                </md-field>
              </div>
            </div>
            <div class="md-layout" style="margin: 20px;">
              <div class="md-layout-item">
                  <div style="margin-bottom:15px;">
                    <span>총금액 </span>
                    <span style="font-size: 20px; font-weight: bold;">{{addComma(buyData.price*buyData.count)}}</span>
                    <span>원 - 이벤트 {{addComma(buyData.price*buyData.count - buyData.salePrice*buyData.count)}}원 할인!</span>
                  </div>
                  <div>
                    최종결제금액 <span style="font-size: 30px;  font-weight: bold;">{{addComma(buyData.salePrice*buyData.count)}}</span>원
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div class="md-layout md-alignment-center-center" style="margin-top: 20px;">
          <md-radio v-model="buyData.paymentSelected" v-for="(option, index) in paymentOptions" :key="index" :value="option.value" :disabled="option.disabled">{{option.text}}</md-radio>
        </div>
        <div class="md-layout md-alignment-center-center">
          <div class="md-layout-item1">
            <b-form-input type="text" v-model="buyData.payerName" placeholder="입금자 명"></b-form-input>
          </div>
          <div class="md-layout-item1">
            <md-button class="md-accent md-raised" @click="pay">결제하기</md-button>
          </div>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-accent" @click="showDialog = false">취소</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-dialog :md-active.sync="billDialog" style="padding: 0 20px 0 20px;"
      :md-close-on-esc="false" :md-click-outside-to-close="false">
      <md-dialog-title>무통장 입금</md-dialog-title>
      <md-dialog-content>
        <div class="md-layout">
          <div class="md-layout-item">
            <div class="single-price-plan-01" :style="{ padding: '30px'}">
              <div class="md-layout md-alignment-center-center">
                <b-form class="md-layout-item">
                  <b-form-group id="exampleInputGroup1" label="입금계좌" label-for="exampleInput1">
                    <b-form-input id="exampleInput1" type="text" required value="농협 - 최기상" disabled></b-form-input>
                  </b-form-group>
                </b-form>
              </div>
              <div class="md-layout md-alignment-center-center">
                <b-form class="md-layout-item">
                  <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
                    <b-form-input id="exampleInput1" type="text" required value="301-0241-0395-11" disabled></b-form-input>
                  </b-form-group>
                </b-form>
              </div>
              <div class="md-layout md-alignment-center-center">
                <b-form class="md-layout-item">
                  <b-form-group id="exampleInputGroup1" label="결제금액" label-for="exampleInput1">
                    <b-form-input id="exampleInput1" type="text" required :value="addComma(buyData.salePrice*buyData.count)" disabled></b-form-input>
                  </b-form-group>
                </b-form>
              </div>
              <div class="md-layout md-alignment-center-center">
                <b-form class="md-layout-item">
                  <b-form-group id="exampleInputGroup1" label="입금자명" label-for="exampleInput1">
                    <b-form-input id="exampleInput1" type="text" required :value="buyData.payerName" disabled></b-form-input>
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
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="billDialog = false">확인</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      showDialog: false,
      billDialog: false,
      paymentOptions: [
        { text: '무통장 입금', value: 1 },
        { text: '스마트 페이', value: 2, disabled: true },
      ],
      buyOption: [
        { period: 1, price: 33000, salePrice: 33000, count: 1},
        { period: 3, price: 99000, salePrice: 89100, count: 1},
        { period: 6, price: 198000, salePrice: 168300, count: 1},
        { period: 12, price: 396000, salePrice: 316800, count: 1},
      ],
      description: [
        {title: '소통서비스', text: '인스타그램 실사용자들에게 "팔로우/좋아요/댓글" 을 통해 반응을 유도하는 방식으로 계정을 성장시킵니다. 따라서 특정분야에 관심있는 유저들을 자신의 팔로워로 만들 수 있습니다. (예. 패션스타그램, 옷스타그램, #데일리 #데일리패션 을 통해 옷에 관심있어하는 유저들을 타겟팅 할수있습니다.)'},
        {title: '내팔로워 관리', text: '내 팔로워들에게 먼저 좋아요와 댓글을 달아줌으로써 팔로워와의 관계를 진전시켜 나의 고객으로 만들 수 있습니다.'},
        // {title: '예약포스팅 / 반복포스팅', text: '예약포스팅 및 반복포스팅을 통해 원하는시간에 원하는 간격으로 자신의 컨텐츠를 유저들에게 노출시킬 수 있습니다.'},
        {title: '실시간 대시보드', text: '팔로우 좋아요 댓글 언팔로우 의 활동내역이 실시간으로 나타나며, 팔로우, 팔로잉 변화 그래프를 한눈에 볼수 있어 계정상태를 쉽게 파악할 수 있습니다.'},
        {title: '언팔로우', text: '맞팔하지 않은 유저를 언팔로우 하거나 전체유저를 언팔로우 할 수 있습니다.'},
        {title: '내 계정분석', text: '자신의 최신 게시물에서 많이 사용하는 태그 순위를 볼수 있고, 게시글마다 좋아요, 댓글갯수로 참여도를 분석할 수 있습니다.'},
      ],
      selectedDescription: 'detail',
      buyData: {
        period: 0,
        count: 0,
        price: 0,
        salePrice: 0,
        paymentSelected: 1,
        payerName: '',
      },
    };
  },
  methods: {
    addComma(num) {
        var regexp = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(regexp, ',');
    },
    setBuyData(item) {
      this.buyData.period = item.period;
      this.buyData.price = item.price;
      this.buyData.salePrice = item.salePrice;
      this.buyData.count = item.count;
      this.showDialog = true;
    },
    changePeriod(value) {
      const item = this.buyOption.filter(item => item.period === value)[0];
      console.log(item);
      this.buyData.period = item.period;
      this.buyData.price = item.price;
      this.buyData.salePrice = item.salePrice;
    },
    changeCount() {
      if (this.buyData.count < 1) {
        this.buyData.count = 1;
      }
    },
    pay() {
      if (!this.buyData.payerName) {
        this.buyData.payerName = this.$store.state.member.member.name;
      }
      this.$http.post('/api/payment', {
        type: 1,
        amount: this.buyData.salePrice * this.buyData.count,
        socialType: 'instagram',
        serviceType: 'instagramProxy',
        period: this.buyData.period * 30,
        count: this.buyData.count - 1,
        payerName: this.buyData.payerName,
        date: null,
      }).then((response) => {
        if (response.data) {
          this.payment = response.data;
          this.showDialog = false;
          this.billDialog = true;
        } else {
          alert('에러가 발생 하였습니다.');
        }
      })
    },
  }
};
</script>

<style lang="css">
.price:hover .price-over {
  opacity: 1;
}
.price-over {
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background-color: #000000b0;
  cursor: pointer;
}
.sale {
  font-size:15px;
  left: -10px;
  top: -2px;
  transform:rotate(-20deg);
  -ms-transform:rotate(-20deg);
  -webkit-transform:rotate(-20deg); 
  -webkit-clip-path: polygon(8% 0%, 67% 0%, 100% 100%, 0% 100%);
  clip-path: polygon(7% 0%, 47% 0%, 100% 100%, 0% 100%);
  background-color:#ffbbd6;
  color:#4a4a4a;
  position:absolute; 
  padding: 5px 80px 5px 15px;
}
</style>
