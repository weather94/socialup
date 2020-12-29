<template>
  <section class="pricing-plan-area gray-bg">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title">
            <h2 class="title">인스타그램 작업</h2>
            <div class="separator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="md-layout md-alignment-center-center">
        <md-button class="md-primary md-raised" @click="createWorkDialog = true">ADD WORK</md-button>
        <md-button class="md-primary md-raised" @click="getInstagramWork">전체</md-button>
        <md-button class="md-primary md-raised" @click="getInstagramWorkOption('target')">타겟</md-button>
        <md-button class="md-primary md-raised" @click="getInstagramWorkOption('kr')">한국인 실제</md-button>
        <md-button class="md-primary md-raised" @click="getInstagramWorkOption('kg')">한국인 유령</md-button>
        <md-button class="md-primary md-raised" @click="getInstagramWorkOption('fg')">외국인 유령</md-button>
        <md-button class="md-icon-button md-accent md-raised"  @click="showDeleteButton = !showDeleteButton">
          <md-icon>delete</md-icon>
        </md-button>
      </div>
      <md-card :md-with-hover="true" v-for="(work, index) in works" :key="index" style="padding: 20px 10px 20px 10px; margin: 10px;">
        <div class="md-layout md-alignment-center-center">
          <div class="md-layout-item md-size-5 align-center">
            {{work.id}}
          </div>
          <div class="md-layout-item md-size-10 align-center">
            {{work.memberName}}
          </div>
          <div class="md-layout-item md-size-30 align-center">
            {{work.url}}
          </div>
          <div class="md-layout-item md-size-15 align-center">
            {{serviceName[work.type]}}
          </div>
          <div class="md-layout-item md-size-10 align-center">
            {{`${work.count}/${work.goal} (${Math.round(work.count/work.goal*100)}%)`}}
          </div>
          <div class="md-layout-item md-size-15 align-center">
            {{new Date(work.regDate).toLocaleString().replace('오', '\n오')}}
          </div>
          <div class="md-layout-item md-size-15 align-center">
            {{(work.finish) ? new Date(work.finishDate).toLocaleString() : '진행중'}}
          </div>
          <md-button v-if="showDeleteButton" @click="deleteInstagramWork(work.id)" style="position: absolute; right: 10px;" class="md-icon-button md-accent md-raised">
            <md-icon>delete</md-icon>
          </md-button>
        </div>
      </md-card>
      <!-- <div class="row justify-content-center w-tmargin-15">
        <b-pagination align="center" @change="getPayments" :total-rows="paymentCount" v-model="currentPage" :limit="10" :per-page="perPage"></b-pagination>
      </div> -->
    </div>
    <md-dialog :md-active.sync="createWorkDialog">
      <md-dialog-title>ADD WORK</md-dialog-title>

      <md-dialog-content>
        <div class="md-layout md-gutter md-alignment-center-center">
          <div class="md-layout-item">
            <md-field>
              <label>타겟 URL을 입력해주세요.</label>
              <md-input v-model="inputWork.url"></md-input>
              <span class="md-helper-text">ex) https://www.instagram.com/p/BywyUzmnAju/</span>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-center">
          <div class="md-layout-item">
            <md-field>
              <label for="movie">WorkType</label>
              <md-select v-model="inputWork.type" name="movie" id="movie">
                <md-option v-for="(work, index) of Object.keys(workName)" :key="index" :value="work">{{workName[work]}}</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="md-layout-item" v-if="inputWork.type === 'target_kgl'">
            <md-field>
              <label>기간</label>
              <md-input v-model="inputWork.count" type="number"></md-input>
              <span class="md-helper-text">기간을 입력해주세요.</span>
            </md-field>
          </div>
          <div class="md-layout-item">
            <md-field>
              <label>도달 목표값</label>
              <md-input v-model="inputWork.goal" type="number"></md-input>
              <span class="md-helper-text">도달 목표값을 입력해주세요.</span>
            </md-field>
          </div>
        </div>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="createWork">추가</md-button>
        <md-button class="md-primary" @click="createWorkDialog = false">취소</md-button>
      </md-dialog-actions>
    </md-dialog>
  </section>
</template>

<script>
export default {
  mounted() {
    this.getInstagramWork();
  },
  data() {
    return {
      serviceName: {
        manage: '인스타 계정관리 프로그램',
        instagramProxy: '인스타 계정관리 대행',
        target_kgl: '계정타겟 한국인 유령 좋아요',
        korea_real_follower: '한국인 실제 팔로워',
        korea_ghost_follower: '한국인 유령 팔로워',
        foreigner_ghost_follower: '외국인 유령 팔로워',
        korea_real_like: '한국인 실제 좋아요',
        korea_ghost_like: '한국인 유령 좋아요',
        foreigner_ghost_like: '외국인 유령 좋아요',
      },
      workName: {
        korea_real_follower: '한국인 실제 팔로워',
        korea_ghost_follower: '한국인 유령 팔로워',
        target_kgl: '계정타겟 한국인 유령 좋아요',
        foreigner_ghost_follower: '외국인 유령 팔로워',
        korea_real_like: '한국인 실제 좋아요',
        korea_ghost_like: '한국인 유령 좋아요',
        foreigner_ghost_like: '외국인 유령 좋아요',
      },
      inputWork: {
        url: null,
        type: null,
        goal: null,
        count: null,
      },
      showDeleteButton: false,
      createWorkDialog: false,
      currentPage: null,
      perPage: 10,
      paymentCount: 0,
      works: [],
    }
  },
  methods: {
    createWork() {
      this.$http.post(`api/instagram/work`, this.inputWork).then((response) => {
        if (response.data) {
          this.works = this.works.concat(response.data);
          this.inputWork = {
            url: null,
            type: null,
            goal: null,
          };
          this.createWorkDialog = false;
        }
      });
    },
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
    deleteInstagramWork(id) {
      this.$http.delete(`api/instagram/work/${id}`).then((response) => {
        if (response.data) {
          this.getInstagramWork();
        }
      });
    },
    getInstagramWork() {
      this.$http.get('api/instagram/work').then((response) => {
        if (response.data) {
          this.works = response.data;
        }
      });
    },
    getInstagramWorkOption(option) {
      this.$http.get(`api/instagram/work/${option}`).then((response) => {
        if (response.data) {
          this.works = response.data;
        }
      });
    },
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
