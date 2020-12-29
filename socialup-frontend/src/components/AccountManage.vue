<template>
  <section class="w-service-details-content-area gray-bg">
    <div class="container w-tmargin-15">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title"><!-- section title -->
            <h2 class="title">유저 목록</h2>
          </div><!-- //. section title -->
        </div>
      </div>
      <div class="row" v-for="(member, index) in members" :key="index">
          <div class="col-lg-12 col-md-12" @click="selectMember(member)">
              <div class="single-price-plan-01 w-click-box">
                  <div class="row justify-content-center align-center w-padding-10">
                    <div class="col-lg-1 col-md-1">
                      {{member.id}}
                    </div>
                    <div class="col-lg-1 col-md-1">
                      {{member.name}}
                    </div>
                    <div class="col-lg-3 col-md-3">
                      {{member.email}}
                    </div>
                    <div class="col-lg-2 col-md-2">
                      {{member.contact}}
                    </div>
                    <div class="col-lg-2 col-md-2">
                      <div v-if="member.grade >= 10">
                        {{`운영자(${member.grade})`}}
                      </div>
                      <div v-else>
                        {{`유저(${member.grade})`}}
                      </div>
                    </div>
                    <div class="col-lg-1 col-md-1">
                      {{member.point}}
                    </div>
                    <div class="col-lg-2 col-md-2">
                      {{new Date(member.regDate).toLocaleString()}}
                    </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="row justify-content-center w-tmargin-15">
        <input type="text" v-model="keyword" class="w-input" disabled>
        <button type="button" name="button" class="btn" disabled>검색</button>
      </div>
      <div class="row justify-content-center w-tmargin-15">
        <b-pagination align="center" @change="getMembers" :total-rows="memberCount" v-model="currentPage" :limit="10" :per-page="perPage"></b-pagination>
      </div>
    </div>
    <b-modal hide-footer size="lg" title="회원정보" v-model="modalShow" v-if="member">
      <div class="row justify-content-center align-center w-padding-10">
        <div class="col-lg-2 col-md-2">
          {{member.name}}
        </div>
        <div class="col-lg-3 col-md-3">
          {{member.email}}
        </div>
        <div class="col-lg-2 col-md-2">
          {{member.contact}}
        </div>
        <div class="col-lg-2 col-md-2">
          <div v-if="member.grade >= 10">
            {{`운영자(${member.grade})`}}
          </div>
          <div v-else>
            {{`유저(${member.grade})`}}
          </div>
        </div>
        <div class="col-lg-1 col-md-1">
          {{member.point}}
        </div>
        <div class="col-lg-2 col-md-2">
          {{new Date(member.regDate).toLocaleString()}}
        </div>
      </div>
      <div v-if="Object.keys(member.periods).length > 0">
        <div class="section-title"><!-- section title -->
          <h5>사용기간</h5>
        </div>
        <div class="single-price-plan-01 w-bmargin-15" v-for="(period, index) in Object.keys(member.periods)" :key="index">
          <div class="price-body w-vpadding-15 row justify-content-center">
            <div class="col-3">
              <span v-if="period === 'manage'">인스타 계정관리</span>
              <span v-else>{{period}}</span>
            </div>
            <div class="">
              <span>{{`${member.periods[period].allowCount + 1} 계정`}}</span>
            </div>
            <div class="col-6">
              {{`만료일자 ${new Date(member.periods[period].expired).toLocaleString()}`}}
            </div>
            <div class="1">
              <b-button @click="deletePeriod(member.id, period)">삭제하기</b-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="member.payments.length > 0">
        <div class="section-title"><!-- section title -->
          <h5>결제기록</h5>
        </div>
        <div class="single-price-plan-01 w-bmargin-15" v-for="(payment, index) in member.payments" :key="index">
          <div class="price-body w-vpadding-15 row justify-content-center" style="align-items: center;">
            <div class="col-2">
              <span v-if="payment.serviceType === 'manage'">계정관리</span>
              <span v-if="payment.serviceType === 'kfollow'">한국인팔로워</span>
              <span v-if="payment.serviceType === 'klike'">한국인좋아요</span>
            </div>
            <div class="col-2">
              <span v-if="payment.type === 0">디폴트</span>
              <span v-if="payment.type === 1">무통장 입금</span>
              <span v-if="payment.type === 2">스마트 페이</span>
              <span v-if="payment.type === 3">크몽</span>
              <span v-if="payment.type === 4">오투잡</span>
              <span v-if="payment.type === 5">체험판</span>
              <span v-if="payment.type === 6">관리자</span>
            </div>
            <div class="col-1">
              {{payment.amount}}
            </div>
            <div class="col-3">
              {{new Date(payment.regDate).toLocaleString()}}
            </div>
            <div class="col-2">
              {{(payment.approval) ? '승인완료' : '승인대기'}}
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center align-center">
        <b-button class="w-rmargin-15" @click="initPassword">비밀번호 초기화</b-button>
        <span v-if="newPassword" style="color: red;">{{`초기화된 비밀번호는 ${newPassword} 입니다.`}}</span>
      </div>
    </b-modal>
  </section>
</template>

<script>
export default {
  data() {
    return {
      members: [],
      member: null,
      memberCount: 0,
      perPage: 10,
      currentPage: null,
      keyword: '',
      modalShow: false,
      newPassword: null,
    };
  },
  mounted() {
    this.getMemberCount();
    this.getMembers(1);
  },
  methods: {
    initPassword() {
      let result = confirm('비밀번호를 정말 초기화하시겠습니까?\n기존 비밀번호로 복구할수도 알아낼수도 없습니다.\n유저가 비밀번호를 분실하였을 경우에만 초기화 하십시오.');
      if (result) {
        this.$http.put(`api/member/${this.member.id}/password`).then((response) => {
          this.newPassword = response.data;
        })
      }
    },
    selectMember(member) {
      this.member = member;
      this.newPassword = null;
      this.modalShow = true;
    },
    deletePeriod(memberId, period) {
      this.$http.delete(`api/instagram/period/${memberId}`, {
        params: {
          name: period,
        },
      }).then((response) => {
        if (!response.data) {
          alert('삭제할 수 없습니다.');
        }
      });
    },
    getMemberCount() {
      this.$http.get('api/count/member').then((response) => {
        if (response.data) {
          this.memberCount = response.data;
        }
      })
    },
    getMembers(page) {
      this.$http.get('api/member', {
        params: {
          page,
          size: this.perPage,
        }
      }).then((response) => {
        if (response.data) {
          this.members = response.data;
        }
      })
    },
  }
}
</script>

<style lang="css">

</style>
