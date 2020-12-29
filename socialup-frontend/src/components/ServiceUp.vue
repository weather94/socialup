<template>
  <div class="gray-bg">
    <div class="work-details-content-area" style="padding-top: 40px;">
      <div class="container">
        <div style="text-align: center; font-size:30px; line-height: 40px; margin-bottom: 30px;">
          인스타그램 팔로워/좋아요 업 서비스
        </div>
        <div class="md-layout md-gutter">
          <div class="md-layout-item md-size-40 md-small-size-100">
            <div class="work-details-inner-area"><!-- work details inner area -->
              <div class="thumb md-layout md-alignment-center-center">
                <img class="md-layout-item" :src="`../src/assets/img/banner/up.jpg`" alt="work details image">
              </div>
            </div>
          </div>
          <div class="md-layout-item md-size-60 md-small-size-100">
            <div class="work-details-inner-area"><!-- work details inner area -->
              <p style="color: black;">
                ㅁㄴㅇㅁㄴㅇ
              </p>
              <p>기능 - (클릭시 상세설명)</p>
              <div v-for="(desc, index) in description" :key="index" style="margin-top: 10px;">
                <a data-toggle="collapse" :data-target="`#collapse${index}`" aria-expanded="true" :aria-controls="`collapse${index}`" style="cursor: pointer;">
                  <p style="font-weight: bold;">{{`${index+1}. ${desc.title}`}}</p>
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
        <!-- <div class="md-layout" style="margin-top:30px;">
          <md-card class="price md-layout-item md-small-size-100" v-for="(option, index) in buyOption" :key="index" style="margin: 5px;">
            <div class="service-small-card-title ">{{option.title}}</div>
            <div class="price-over" style="text-align: center;">
              <div class="md-layout md-alignment-center-center" style="margin-top: 5px;">
                <span>
                  <md-button class="md-icon-button" @click="(option.count > 1) ? option.count-- : null">
                    <md-icon style="color: #d7d7d7;">keyboard_arrow_left</md-icon>
                  </md-button>
                </span>
                <div style="color: white;">
                  <span style="font-size:20px;">{{option.count*100}}</span>
                  <span style="font-size:12px;">회</span>
                </div>
                <span>
                  <md-button class="md-icon-button" @click="(option.count < option.limit) ? option.count++ : null">
                    <md-icon style="color: #d7d7d7;">keyboard_arrow_right</md-icon>
                  </md-button>
                </span>
              </div>
              <div class="md-layout" style="margin-top:10px;">
                <div class="md-layout-item">
                  <span style="color: white; font-size:30px;">{{addComma(option.price*option.count)}}</span>
                  <span style="color: white;">원</span>
                </div>
              </div>
              <div class="md-layot" style="margin-top:10px;">
                <md-button class="md-raised md-layout-item" style="top: 60%; background-color: #ffbbd6; color: #4a4a4a;">구매하기</md-button>
              </div>
            </div>
            <div class="md-layout md-alignment-center-center" style="padding: 70px 10px 30px 10px; margin:5px;">
              <div class="md-layout-item md-size-40 align-center">
                <span style="font-size: 30px; font-weight: bold;">100</span>회
              </div>
              <div class="md-layout-item md-size-60 align-center">
                <div>
                  <span style="font-size: 20px;  font-weight: bold;">{{addComma(option.price)}}</span>원
                </div>
              </div>
            </div>
          </md-card>
        </div> -->
        <div class="container">
          <div class="row reorder-md">
            <div class="col-lg-4">
              <div class="service-widget-area">
                <div class="widget service-nav">
                  <ul class="service-menu">
                    <li v-for="(service, index) in services" :class="(service.title === selectedService.title) ? 'active' : ''" :key="index">
                      <a href="javascript:void(0)" @click="selectService(service)">{{service.title}}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="service-page-content-inner">
                <h2 class="title">{{selectedService.name}}</h2>
                <p>{{selectedService.descript}}</p>
                <div>
                  <b-form>
                    <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
                      <b-form-input id="exampleInput1" class="mr-sm-4 mb-sm-0" :value="selectedService.title" disabled/>
                    </b-form-group>
                  </b-form>
                  <b-form>
                    <b-form-group id="exampleInputGroup2" label="링크 주소" label-for="linklink"
                        description="- 팔로워를 신청하신 경우에도 자신의 아무 게시물 링크를 입력해주세요.">
                      <b-form-input id="linklink" class="mr-sm-4 mb-sm-0" type="text" v-model="buyData.link" placeholder="예시) https://www.instagram.com/p/BrgmM-iFyOm/"/>
                    </b-form-group>
                  </b-form>
                </div>
                <p>{{`1회당 가격: ${selectedService.price}원 ㅡ 최소 주문수량:  ${selectedService.minLimit}개 ㅡ 최대 주문수량:  ${selectedService.maxLimit}개`}}</p>
                <div>
                  <b-form inline>
                    <b-form-group :description="`- 1회당 가격 ${selectedService.price}원`">
                      <b-input class="mb-4 mr-sm-4 mb-sm-0" placeholder="수량" type="number" v-model="selectedService.count" @change="changeCount" />
                    </b-form-group>
                    <b-form-group description="- 주문 총액">
                      <b-input class="mb-4 mr-sm-4 mb-sm-0" placeholder="" disabled :value="addComma(selectedService.price * this.selectedService.count)" />
                    </b-form-group>
                    <b-form-group id="exampleInputGroup2" description="-">
                      <b-button variant="primary" @click="showDialog = true">구매하기</b-button>
                    </b-form-group>
                  </b-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <md-dialog :md-active.sync="showDialog" style="padding: 0 20px 0 20px;"
      :md-close-on-esc="false" :md-click-outside-to-close="false">
      <md-dialog-title>결제하기</md-dialog-title>
      <md-dialog-content>
        <div class="md-layout md-gutter md-alignment-center-center">
        <div class="md-layout-item md-size-30 md-small-size-100">
          <img :src="'../src/assets/img/banner/up.jpg'" alt="">
        </div>
        <div class="md-layout-item md-size-70 md-small-size-100">
          <div style="font-size:20px; margin: 20px;">인스타그램 팔로우/좋아요 업 서비스</div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item1" style="margin-right:10px;">
                <md-field>
                  <label for="service">기간</label>
                  <md-select v-model="selectedServiceTitle"  name="service" id="service" @md-selected="selectServiceTitle">
                    <md-option v-for="(service, index) in services" :key="index" :value="service.title">{{service.title}}</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="md-layout-item1">
                <md-field>
                  <label>주문수량</label>
                  <md-input v-model="selectedService.count" type="number"></md-input>
                </md-field>
              </div>
            </div>
            <div class="md-layout md-gutter">
              <div class="md-layout-item1" style="width: 100%">
                <md-field>
                  <label>링크</label>
                  <md-input v-model="buyData.link" type="text"></md-input>
                </md-field>
              </div>
            </div>
            <div class="md-layout" style="margin: 20px;">
              <div class="md-layout-item">
                <div style="margin-bottom:15px;">
                  <span>1개당  </span>
                  <span style="font-size: 20px; font-weight: bold;">{{addComma(selectedService.price)}}</span>
                  <span>원 X </span>
                  <span style="font-size: 20px; font-weight: bold;">{{addComma(selectedService.count)}}</span>
                  <span>개</span>
                </div>
                <div>
                  최종결제금액 <span style="font-size: 30px;  font-weight: bold;">{{addComma(selectedService.price*selectedService.count)}}</span>원
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
                    <b-form-input id="exampleInput1" type="text" required :value="addComma(selectedService.price*selectedService.count)" disabled></b-form-input>
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
    <md-snackbar md-position="center" :md-duration="4000" :md-active.sync="showSnackbar">
      <span>{{snackbarMent}}</span>
      <md-button class="md-primary" @click="showSnackbar = false">확인</md-button>
    </md-snackbar>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      showSnackbar: false,
      snackbarMent: '',
      showDialog: false,
      billDialog: false,
      payment: null,
      paymentOptions: [
        { text: '무통장 입금', value: 1 },
        { text: '스마트 페이', value: 2, disabled: true },
      ],
      services: [
        { minLimit: 100, maxLimit: 1000, type: 'korea_real_follower', title: '한국인 실제 팔로워', price: 190, count: null, descript: '단 시간에 한국인 팔로워가 늘어나는 상품입니다. 해당 서비스는 한국인으로 팔로워가 늘어나 매우 자연스럽게 팔로워를 증가시킬 수 있습니다. 단, 비공개 계정의 경우 본 상품을 이용 하실 수 없습니다.',},
        { minLimit: 100, maxLimit: 1000, type: 'korea_ghost_follower', title: '한국인 유령 팔로워', price: 130, count: null, descript: '단 시간에 한국인 좋아요가 늘어나는 상품입니다. 해당 서비스는 한국인으로 좋아요가 늘어나 매우 자연스럽게 좋아요를 증가시킬 수 있습니다. 단, 비공개 계정의 경우 본 상품을 이용 하실 수 없습니다.'},
        { minLimit: 100, maxLimit: 1000, type: 'foreigner_ghost_follower', title: '외국인 유령 팔로워', price: 80, count: null, descript: '단 시간에 외국인 팔로워가 늘어나는 상품입니다. 해당 서비스는 한국인으로 팔로워가 늘어나 매우 자연스럽게 팔로워를 증가시킬 수 있습니다. 단, 비공개 계정의 경우 본 상품을 이용 하실 수 없습니다.',},
        { minLimit: 100, maxLimit: 1000, type: 'korea_real_like', title: '한국인 실제 좋아요', price: 40, count: null, descript: '단 시간에 한국인 좋아요가 늘어나는 상품입니다. 해당 서비스는 한국인으로 좋아요가 늘어나 매우 자연스럽게 좋아요를 증가시킬 수 있습니다. 단, 비공개 계정의 경우 본 상품을 이용 하실 수 없습니다.'},
        { minLimit: 100, maxLimit: 1000, type: 'korea_ghost_like', title: '한국인 유령 좋아요', price: 30, count: null, descript: '단 시간에 한국인 좋아요가 늘어나는 상품입니다. 해당 서비스는 한국인으로 좋아요가 늘어나 매우 자연스럽게 좋아요를 증가시킬 수 있습니다. 단, 비공개 계정의 경우 본 상품을 이용 하실 수 없습니다.'},
        { minLimit: 100, maxLimit: 1000, type: 'foreigner_ghost_like', title: '외국인 유령 좋아요', price: 30, count: null, descript: '단 시간에 한국인 좋아요가 늘어나는 상품입니다. 해당 서비스는 한국인으로 좋아요가 늘어나 매우 자연스럽게 좋아요를 증가시킬 수 있습니다. 단, 비공개 계정의 경우 본 상품을 이용 하실 수 없습니다.'},
      ],
      description: [
        {title: '한국인 팔로워', text: '인스타그램 실사용자들에게 "팔로우/좋아요/댓글" 을 통해 반응을 유도하는 방식으로 계정을 성장시킵니다. 따라서 특정분야에 관심있는 유저들을 자신의 팔로워로 만들 수 있습니다. (예. 패션스타그램, 옷스타그램, #데일리 #데일리패션 을 통해 옷에 관심있어하는 유저들을 타겟팅 할수있습니다.)'},
        {title: '한국인 좋아요', text: '내 팔로워들에게 먼저 좋아요와 댓글을 달아줌으로써 팔로워와의 관계를 진전시켜 나의 고객으로 만들 수 있습니다.'},
        {title: '외국인 팔로워', text: '예약포스팅 및 반복포스팅을 통해 원하는시간에 원하는 간격으로 자신의 컨텐츠를 유저들에게 노출시킬 수 있습니다.'},
        {title: '외국인 좋아요', text: '팔로우 좋아요 댓글 언팔로우 의 활동내역이 실시간으로 나타나며, 팔로우, 팔로잉 변화 그래프를 한눈에 볼수 있어 계정상태를 쉽게 파악할 수 있습니다.'},
        {title: '데일리 좋아요', text: '친구목록 전체를 불러와 맞팔하지않은 유저(언팔), 나를 팔로우한 유저, 맞팔한 유저로 쉽게 분류해서 볼 수 있으며 언팔로우 할 수 있습니다.'},
        {title: '유 령 팔로워', text: '자신의 최신 게시물에서 많이 사용하는 태그 순위를 볼수 있고, 게시글마다 좋아요, 댓글갯수로 참여도를 분석할 수 있습니다.'},
      ],
      selectedDescription: 'detail',
      selectedServiceTitle: '한국인 실제 팔로워',
      selectedService: { minLimit: 100, maxLimit: 1000, title: '한국인 실제 팔로워', price: 190, count: null, descript: '단 시간에 한국인 팔로워가 늘어나는 상품입니다. 해당 서비스는 한국인으로 팔로워가 늘어나 매우 자연스럽게 팔로워를 증가시킬 수 있습니다. 단, 비공개 계정의 경우 본 상품을 이용 하실 수 없습니다.',},
      buyData: {
        period: 0,
        count: 0,
        price: 0,
        link: '',
        paymentSelected: 1,
        payerName: '',
      },
    };
  },
  methods: {
    selectServiceTitle(value) {
      this.selectedService = this.services.filter(item => item.title === value)[0];
    },
    addComma(num) {
      try {
        var regexp = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(regexp, ',');
      } catch(e) {
        return 0;
      }
    },
    selectService(service) {
      this.selectedServiceTitle = service.title;
      this.selectedService = service;
    },
    changeCount() {
      if (this.selectedService.count < this.selectedService.minLimit) {
        this.selectedService.count = this.selectedService.minLimit;
      } else if (this.selectedService.count >= this.selectedService.maxLimit) {
        this.selectedService.count = this.selectedService.maxLimit;
      } else {

      }
    },
    pay() {
      if (!this.buyData.payerName) {
        this.buyData.payerName = this.$store.state.member.member.name;
      }
      if (!this.buyData.link || !this.selectedService.count) {
        this.snackbarMent = '링크와 수량을 제대로입력해주세요.';
        this.showSnackbar = true;
        return;
      }
      const re = /(^https:\/\/www.instagram.com\/p\/.*\/$)/g
      if (!re.exec(this.buyData.link)) {
        alert('인스타그램 게시글 주소를 양식에 맞춰 입력해주세요.\r\n예시) https://www.instagram.com/p/BvbeuvZlcns/');
        return;
      }
      this.$http.post('/api/payment', {
        type: 1,
        amount: this.selectedService.price * this.selectedService.count,
        socialType: 'instagram',
        serviceType: this.selectedService.type,
        link: this.buyData.link,
        count: this.selectedService.count,
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
.service-small-card-title {
  font-size:15px;
  background-color:#ffbbd6;
  color:#4a4a4a;
  width: 100%;
  margin-top: 20px;
  text-align: center;
  position: absolute;
  padding: 5px 0px 5px 0px;
}
</style>
