<template>
  <section class="pricing-plan-area gray-bg">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title">
            <h2 class="title">유령 관리</h2>
          </div>
        </div>
      </div>
      <div class="md-layout md-alignment-center-center">
        <!-- <md-button class="md-primary md-raised" @click="getInstagramWork">전체</md-button>
        <md-button class="md-primary md-raised" @click="getInstagramWorkOption('kr')">한국인 실제</md-button>
        <md-button class="md-primary md-raised" @click="getInstagramWorkOption('kg')">한국인 유령</md-button>
        <md-button class="md-primary md-raised" @click="getInstagramWorkOption('fg')">외국인 유령</md-button> -->
        <!-- <md-button class="md-icon-button md-accent md-raised"  @click="showDeleteButton = !showDeleteButton">
          <md-icon>delete</md-icon>
        </md-button> -->
      </div>
      <md-table md-card>
        <md-table-row v-for="(account, index) in ghosts" :key="index" @click="select(account)">
          <md-table-cell>{{account.id}}</md-table-cell>
          <md-table-cell>{{account.username}}</md-table-cell>
          <md-table-cell>{{account.email}}</md-table-cell>
          <md-table-cell>{{account.password}}</md-table-cell>
          <md-table-cell>{{account.active}}</md-table-cell>
          <!-- <md-table-cell>{{account.follow}}</md-table-cell>
          <md-table-cell>{{account.like}}</md-table-cell> -->
          <md-table-cell>{{convertDate(account.regDate)}}</md-table-cell>
        </md-table-row>
      </md-table>
      <!-- <md-card :md-with-hover="true" v-for="(ghost, index) in ghosts" :key="index" style="padding: 20px 10px 20px 10px; margin: 10px;">
        <div class="md-layout md-alignment-center-center">
          <div class="md-layout-item md-size-5 align-center">
            {{ghost.id}}
          </div>
          <div class="md-layout-item md-size-10 align-center">
            {{ghost.email}}
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
      </md-card> -->
      <div class="row justify-content-center w-tmargin-15">
        <input type="number" v-model.number="currentPage" @input="changePage($event.target.value)">
        <input type="number" v-model.number="perPage" @input="changePage($event.target.value)">
      </div>
      <div class="row justify-content-center w-tmargin-15">
        <b-pagination align="center" @change="changePage" :total-rows="ghostCount" v-model="currentPage" :limit="10" :per-page="perPage"></b-pagination>
      </div>
    </div>
    <md-dialog style="min-width: 450px;"
      :md-active.sync="showDetailDialog" v-if="selected">
      <md-dialog-title>유령계정 작업옵션</md-dialog-title>
      <md-dialog-content class="weather-content">
        <div class="md-layout md-alignment-center-center w-profile">
          <div class="md-layout-item md-size-20" style="text-align: center;">
                    <img class="instagram-avatar" :src="selected.img" alt="NoImg">
                  </div>
                  <div class="md-layout-item md-size-80">
                    <div class="w-profile-info w-lmargin-10">
                      {{(selected.biography && selected.biography.length > 100) ? `${selected.biography.slice(0, 90)}...` : selected.biography}}
                    </div>
                  </div>
                </div>
                <md-divider style="margin-bottom: 10px;"/>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    아이디
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.email}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    비밀번호
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.password}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    유저네임
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.username}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    풀네임
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.fullname}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    가입일자
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{new Date(selected.regDate).toLocaleString()}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    가입 IP
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.regIp}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    카피 NO
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.copyNumber}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    카피유저
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.copyUsername}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    팔로우
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.followCount}}
                  </div>
                </div>
                <div class="md-layout md-alignment-center-center" style="margin-bottom: 10px;">
                  <div class="md-layout-item md-size-30 align-center" style="color: #777777;">
                    좋아요
                  </div>
                  <div class="md-layout-item md-size-70 align-center">
                    {{selected.likeCount}}
                  </div>
                </div>
                <md-divider style="margin-bottom: 10px;"/>
                <md-button class="md-raised" @click="open(selected.username)">열기</md-button>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDetailDialog = false">확인</md-button>
      </md-dialog-actions>
    </md-dialog>
  </section>
</template>

<script>
export default {
  mounted() {
    this.getGhostCount();
    this.getGhosts(0, 10);
  },
  data() {
    return {
      ghosts: [],
      selected: null,
      showDetailDialog: false,
      perPage: 10,
      currentPage: 0,
      ghostCount: 0,
    }
  },
  methods: {
    select(item) {
      this.selected = item;
      this.showDetailDialog = true;
    }, 
    changePage(value) {
      console.log(value);
      this.getGhosts(value, this.perPage);
    },
    getGhosts(page, size) {
      this.$http.get(`api/instagram/ghost`, {
        params: {
          page,
          size,
        },
      }).then((response) => {
        if (response.data) {
          this.ghosts = response.data.reverse();
        }
      });
    },
    getGhostCount() {
      this.$http.get('api/instagram/ghost/count').then((response) => {
        if (response.data) {
          this.ghostCount = response.data;
        }
      });
    },
    convertDate(rawDate) {
      const date = new Date(rawDate);
      const dateString = date.toLocaleDateString();
      if (dateString === new Date().toLocaleDateString()) {
        return date.toLocaleTimeString();
      }
      return dateString;
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
.instagram-avatar {
  border-radius: 50%;
}
.w-profile {
  margin: 5px;
  margin-bottom: 20px;
}
.w-lmargin-10 {
  margin-left: 10px;
}
.w-profile-name {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: xx-large;
}
.w-profile-value {
  /* text-align: center; */
  margin: 15px;
}
.weather-content {
  padding-top: 0px;
}
</style>
