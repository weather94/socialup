<template>
  <section class="pricing-plan-area gray-bg">
    <div class="container" v-if="true">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title"><!-- section title -->
            <h2 class="title">다운로드</h2>
            <div class="separator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div><!-- //. section title -->
        </div>
      </div>
      <md-card style="margin: 20px; padding: 10px;">
        <div class="md-layout md-gutter md-alignment-center-center">
          <div class="md-layout-item md-size-25 md-small-size-100 align-center">
            <img src="src/assets/img/banner/program.jpg" alt="">
          </div>
          <div class="md-layout-item">
            <div style="margin-bottom: 20px;">
              {{`최신버전(${last.version}) ㅡ ${new Date(last.date).toLocaleString()}`}}
            </div>
            <div style="margin-bottom: 20px;">
              {{`${last.title}`}}
            </div>
            <div class="md-layout" style="margin-top: 10px;" v-for="(details, index) in last.details" :key="index">
              <md-badge class="md-layout-item md-square" :md-content="details.tag" :style="(details.tag === '삭제') ? 'right: unset;  background-color: #a7a7a7;' : (details.tag === '수정') ? 'right: unset; background-color: #448aff;' : 'right: unset;'"/>
              <span class="md-layout-item" style="margin-left: 40px;">{{details.text}}</span>
            </div>
          </div>
          <div style="position: absolute; bottom: 10px; right: 10px;">
            <md-button class="md-primary md-raised" @click="download">다운로드</md-button>
          </div>
        </div>
      </md-card>
      <div style="margin: 50px 10px 10px 10px; padding: 10px;">
        <h3>패치내역</h3>
      </div>
      <md-card v-for="(ver, index) in versions" :key="index" style="margin: 20px; padding: 10px;">
        <div class="md-layout md-alignment-center-center">
          <div class="md-layout-item md-size-10 align-center">
            {{ver.id}}
          </div>
          <div class="md-layout-item md-size-20 align-center">
            {{`ver ${ver.version}`}}
          </div>
          <div class="md-layout-item md-size-10 align-center">
            {{ver.title}}
          </div>
          <div class="md-layout-item md-size-40 align-center">
            {{`패치일자: ${new Date(ver.date).toLocaleString()}`}}
          </div>
          <div class="md-layout-item md-size-20 align-center">
            <md-button class="md-primary md-raised" disabled>다운로드</md-button>
            <!-- <md-button class="md-accent md-raised" v-if="$store.state.member.member && $store.state.member.member.grade >= 10" @click="deleteVersion(version)">삭제</md-button> -->
          </div>
        </div>
      </md-card>
      <div class="row" v-if="true" style="margin-top: 100px;">
        <div class="col-lg-12">
          <b-form>
            <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
              <b-form-input id="exampleInput1" type="text" v-model="version.version" required placeholder="버전"></b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
              <b-form-input id="exampleInput2" type="text" v-model="version.link" required placeholder="링크"></b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup4" label-for="exampleInput4">
              <b-form-input id="exampleInput4" type="text" v-model="version.title" required placeholder="타이틀"></b-form-input>
            </b-form-group>
            <b-form-group id="exampleInputGroup3" label-for="exampleInput3">
              <b-form-textarea
                id="textarea"
                v-model="version.description"
                :placeholder="placeholder"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
              <!-- <vue-editor v-model="version.description"></vue-editor> -->
            </b-form-group>
            <b-form-group>
              <b-button class="float-right" type="button" @click="addVersion">등록하기</b-button>
            </b-form-group>
            {{`[{"tag": "추가", "text": "알고리즘 변경"}]`}}
          </b-form>
        </div>
      </div>
    </div>
    <div v-if="!this.$store.state.member.member" style="margin-top: 50px;">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title"><!-- section title -->
            <h2 class="title">로그인 후 이용해주시기 바랍니다.</h2>
            <p>다운로드 권한이 없습니다.</p>
          </div><!-- //. section title -->
        </div>
      </div>
    </div>
    <div v-if="this.$store.state.member.member && !canDownload" style="margin-top: 50px;">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title"><!-- section title -->
            <h2 class="title">다운로드 기간이 만료 되었습니다.</h2>
            <p>결제 후 이용해 주시기 바랍니다.</p>
          </div><!-- //. section title -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor,
  },
  mounted() {
    this.getLastVersion();
    this.getVersions(1);
  },
  data() {
    return {
      lastVersion: null,
      versions: [],
      version: {
        version: null,
        link: null,
        title: null,
        description: null,
      },
      last: {
        
      },
      placeholder: '업데이트 내역 JSON 형식 ex) [ { tag: \'추가\', text: \'알고리즘 변경\' } ]',
    }
  },
  computed: {
    canDownload() {
      const currentDate = new Date();
      for (const key of Object.keys(this.$store.state.member.member.periods)) {
        if (currentDate < new Date(this.$store.state.member.member.periods[key].expired)) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    download() {
      window.open('api/download/1207');
    },
    setLast(version) {
      this.last = {
        ...version,
      };
      this.last.details = JSON.parse(version.description.replace('<p>', '').replace('</p>', ''));
    },
    getLastVersion() {
      this.$http.get('api/last-version').then((response) => {
        if (response.data) {
          this.lastVersion = response.data;
        }
      });
    },
    getVersions() {
      this.$http.get('api/version').then((response) => {
        if (response.data) {
          this.versions = response.data;
          this.setLast(response.data[0]);
        }
      });
    },
    addVersion() {
      this.$http.post('api/version', this.version).then((response) => {
        if (response.data) {
          this.versions = [response.data].concat(this.versions);
          this.getLastVersion();
        }
      });
    },
    deleteVersion(version) {
      this.$http.delete(`api/version/${version.id}`).then((response) => {
        if (response.data) {
          this.versions = this.versions.filter(item => item.id !== version.id);
        }
      });
    },
  }
}
</script>

<style lang="css" scoped>
.w-cwhite {
  color: white !important;
}
.weather-vpadding-15 {
  padding-top: 15px !important;
  padding-bottom: 15px !important;
}
.weather-margine-15 {
  margin: 15px;
}
section{
  padding-top: 30px !important;
}
.pricing-plan-area {
}
</style>
