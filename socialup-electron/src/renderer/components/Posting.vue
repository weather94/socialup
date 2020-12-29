<template>
  <div class="Firends">
    <md-radio v-model="postView" value="reserve">포스팅 예약하기</md-radio>
    <md-radio v-model="postView" value="repeat">포스팅 도배하기</md-radio>
    <md-radio v-model="postView" value="log">포스팅 기록</md-radio>

    <div class=""  v-if="postView === 'reserve'">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-60">
          <md-list class="md-dense">
            <md-list-item class="md-primary" :style="{backgroundColor: '#ff5252'}">
              <span :style="{color: 'white'}">예약 포스팅</span>
              <md-button class="md-icon-button md-list-action" @click="showReserveDialog = true">
                <md-icon style="color: white;">add</md-icon>
              </md-button>
            </md-list-item>
            <div v-for="(posting, index) in this.$store.state.posting.postings" :key="index">
              <md-list-item class="md-layout"  @click="selectPosting(posting)" :style="(posting === selectedPosting) ? {backgroundColor: '#d7d7d7'} : null">
                <span class="md-layout-item md-size-20">{{(posting.account.length > 10) ? `${posting.account.slice(0, 10)}...` : posting.account}}</span>
                <span class="md-layout-item md-size-40">{{(posting.text.length > 20) ? `${posting.text.slice(0, 20)}...` : posting.text}}</span>
                <span class="md-layout-item md-size-20 align-center">{{(posting.repeat === 'onetime') ? posting.datetime.slice(5).replace('T', ' ') : posting.datetime.split('T')[1]}}</span>
                <span class="md-layout-item md-size-10">
                  <md-badge class="md-square md-primary" v-if="posting.repeat === 'onetime'" md-content="1회" />
                  <md-badge class="md-square md-primary" v-if="posting.repeat === 'daily'" md-content="매일" />
                  <md-badge class="md-square md-primary" v-if="posting.repeat === 'weekly'" :md-content="`${week[new Date(posting.datetime).getDay()]}요일`" />
                  <md-badge class="md-square md-primary" v-if="posting.repeat === 'monthly'" :md-content="`${new Date(posting.datetime).getDate()}일`" />
                </span>
              </md-list-item>
              <md-divider></md-divider>
            </div>
          </md-list>
        </div>
        <div class="md-layout-item">
          <md-card v-if="selectedPosting">
            <md-card-area>
              <md-card-media>
                <img :src="selectedPosting.file" alt="NO IMAGE" width="100">
              </md-card-media>
              <md-card-header>
                <div class="md-title" v-if="selectedPosting.repeat === 'onetime'">
                  {{`${selectedPosting.datetime.replace('T', ' ')} 1회 실행`}}
                </div>
                <div class="md-title" v-if="selectedPosting.repeat === 'daily'">
                  {{`매일 ${selectedPosting.datetime.split('T')[1]} 반복`}}
                </div>
                <div class="md-title" v-if="selectedPosting.repeat === 'weekly'">
                  {{`매주 ${this.week[new Date(selectedPosting.datetime).getDay()]}요일 ${selectedPosting.datetime.split('T')[1]} 반복`}}
                </div>
                <div class="md-title" v-if="selectedPosting.repeat === 'monthly'">
                  {{`매달 ${new Date(selectedPosting.datetime).getDate()}일 ${selectedPosting.datetime.split('T')[1]} 반복`}}
                </div>
                <div class="md-subhead">{{selectedPosting.file}}</div>
              </md-card-header>

              <md-card-content>
                <strong>{{selectedPosting.account}}</strong>
                {{selectedPosting.text}}
              </md-card-content>
            </md-card-area>

            <md-card-actions class="md-layout md-alignment-center-center">
              <md-button class="md-raised"  @click="removePosting">삭제</md-button>
            </md-card-actions>
          </md-card>
        </div>
      </div>
    </div>

    <div class=""  v-if="postView === 'repeat'">
      <div class="w-subtitle">
        태그추가하기 ( 태그는 랜덤하게 15개 태그가 설정됩니다. )
      </div>
      <div class="md-layout">
        <div class="md-layout-item" style="margin-right: 10px;">
          <md-field>
            <label>랜덤 태그 추가</label>
            <md-input v-model="inputHashtag" @keyup.enter="addRepeatHashtag" type="text"></md-input>
            <div class="md-helper-text">입력된 태그중 랜덤으로 15개가 선택되어 업로드됩니다.</div>
          </md-field>
        </div>
        <div class="md-layout-item">
          <md-field>
            <label>반복 간격 (초단위)</label>
            <md-input v-model="inputRepeatInterval" @change="setRepeatInterval" type="number"></md-input>
            <div class="md-helper-text">반복 간격 (초단위 입력)</div>
          </md-field>
        </div>
      </div>
      <div style="padding-top: 10px;">
        <md-chip class="md-primary" md-deletable v-for="(tag, index) in $store.state.posting.repeat.hashtags" :key="index" @md-delete="removeRepeatHashtag(tag)" style="marginBottom: 4px;">{{tag}}</md-chip>
      </div>
      <div>
        <md-field>
          <label>내용</label>
          <md-textarea v-model="inputRepeatText" @change="setRepeatText"></md-textarea>
          <div class="md-helper-text">이모티콘 입력은 지원하지 않습니다. 태그가 삽입될 위치에 [TAG] 를 입력하시면 위에서 설정한 태그가 삽입됩니다.</div>
        </md-field>
      </div>
      <input id="load_repeat_image" type="file" multiple @change="addRepeatImage" accept="image/*" hidden/>
      <div class="w-subtitle">
        업로드 이미지 (첫번째 이미지부터 순차적으로 업로드됩니다.) <a href="javascript:void(0)" @click="showRepeatImage">이미지 추가하기</a>
      </div>
      <div class="md-layout md-alignment-center-space-between">
        <md-card v-for="(image, index) in $store.state.posting.repeat.images" :key="index">
          <md-card-media-actions>
            <md-card-media>
              <img :src="image" alt="media" width="">
            </md-card-media>
            <md-button class="md-icon-button md-raised md-accent" style="position: absolute; margin-top: 5px;" @click="removeRepeatImage(image)">
              <md-icon style="color: black;">delete</md-icon>
            </md-button>
          </md-card-media-actions>
        </md-card>
      </div>
    </div>

    <div class=""  v-if="postView === 'log'">
      <div class="md-layout md-gutter">
        <div class="md-layout-item md-size-60">
          <md-list class="md-dense">
            <md-list-item class="md-primary" :style="{backgroundColor: '#ff5252'}">
              <span :style="{color: 'white'}">포스팅 내역</span>
            </md-list-item>
            <div v-for="(log, index) in sliceLogs" :key="index">
              <md-list-item class="md-layout" @click="selectLog(log)" :style="(log === selectedLog) ? { backgroundColor: '#d7d7d7' } : null">
                <span class="md-layout-item md-size-10">{{log.username}}</span>
                <span class="md-layout-item md-size-50">{{log.caption.slice(0, 25)}}</span>
                <span class="md-layout-item md-size-20 align-center">
                  {{
                    (new Date(log.date).toLocaleDateString() === new Date().toLocaleDateString()) ? new Date(log.date).toLocaleTimeString() : new Date(log.date).toLocaleDateString()
                  }}
                </span>
                <md-badge class="md-square md-primary" v-if="log.type === 'reserve'" md-content="예약" />
                <md-badge class="md-square md-primary" v-if="log.type === 'repeat'" md-content="도배" />
              </md-list-item>
              <md-divider></md-divider>
            </div>
            <div>
              <pagination2
                :perPage="9"
                :total="this.$store.state.posting.logs.length"
                @change="changePage"></pagination2>
            </div>
          </md-list>
          <md-button class="md-accent md-raised" @click="deletePostingLog">기록 전체삭제</md-button>
        </div>
        <div class="md-layout-item">
          <md-card v-if="selectedLog">
            <md-card-area>
              <md-card-media>
                <md-button class="md-icon-button md-raised" style="position: absolute; margin-top: 5px;" @click="openLink(selectedLog.shortcode)">
                  <md-icon style="color: black;">link</md-icon>
                </md-button>
                <img :src="selectedLog.thumbnail" alt="NO IMAGE" width="100">
              </md-card-media>
              <md-card-content>
                <strong>{{selectedLog.username}}</strong> {{new Date(selectedLog.date).toLocaleString()}}
                <div>{{selectedLog.caption}}</div>
              </md-card-content>
            </md-card-area>
          </md-card>
        </div>
      </div>
    </div>

    <md-button class="md-fab md-accent w-fab" v-if="postView === 'reserve'" @click="postingToggle">
      <md-icon>{{($store.state.posting.process === null) ? 'play_arrow' : 'pause'}}</md-icon>
    </md-button>
    <md-button class="md-fab md-primary w-fab" v-if="postView === 'repeat'" @click="postingRepeatToggle">
      <md-icon>{{($store.state.posting.process === null) ? 'play_arrow' : 'pause'}}</md-icon>
    </md-button>

    <md-dialog :md-active.sync="showReserveDialog">
      <md-dialog-title>포스팅 예약하기</md-dialog-title>
      <md-dialog-content class="weather-content">
        <div class="md-layout md-gutter md-alignment-center-left">
          <div class="md-layout-item">
            <md-field>
              <label for="account">계정</label>
              <md-select v-model="selectedAccount" name="account" id="account">
                <md-option v-for="(account, index) in Object.keys($store.state.instagram.account)" :key="index" :value="account">{{account}}</md-option>
              </md-select>
            </md-field>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-left">
          <div class="md-layout-item">
            <md-field>
              <label for="repeat">반복날짜</label>
              <md-select v-model="repeat" name="repeat" id="repeat">
                <md-option value="onetime">1회</md-option>
                <md-option value="daily">매일</md-option>
                <md-option value="weekly">매주</md-option>
                <md-option value="monthly">매달</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="md-layout-item">
            <input type="datetime-local" name="" v-model="datetime" style="width:100%; padding: 5px; margin-bottom: 20px;">
          </div>
        </div>
        <div>
          <md-field>
            <label>포스팅 내용</label>
            <md-textarea v-model="text"></md-textarea>
            <div class="md-helper-text">이모티콘 입력은 지원하지 않습니다.</div>
          </md-field>
        </div>
        <div class="">
          <md-field>
            <label>Only images</label>
            <md-file accept="image/*" @change="changeFile"/>
          </md-field>
        </div>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showReserveDialog = false">닫기</md-button>
        <md-button class="md-primary" @click="addPosting">예약하기</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import PostingWorker from '@/assets/js/PostingWorker';
import PostingRepeatWorker from '@/assets/js/PostingRepeatWorker';
import pagination2 from '@/components/pagination2';
import windowHandler from '@/assets/js/windowHandler';
import * as _ from 'lodash';

export default {
  name: 'posting',
  components: { pagination2 },
  data() {
    return {
      currentPage: 1,
      showReserveDialog: false,
      postView: 'reserve',
      datetime: new Date().toJSON().slice(0, 16),
      repeat: 'daily',
      text: '',
      file: '',
      week: ['일', '월', '화', '수', '목', '금', '토'],
      selectedPosting: null,
      inputHashtag: null,
      inputRepeatText: null,
      inputRepeatInterval: 0,
      selectedLog: null,
      selectedAccount: null,
    };
  },
  computed: {
    sliceLogs() {
      if (this.currentPage === 1) {
         return this.$store.state.posting.logs.slice(-9).reverse();
      } else {
        return this.$store.state.posting.logs.slice(this.currentPage*-9, (this.currentPage-1)*-9).reverse();
      }
    },
  },
  mounted() {
    this.inputRepeatText = this.$store.state.posting.repeat.text;
    this.inputRepeatInterval = this.$store.state.posting.repeat.interval;
    this.selectedAccount = this.$store.state.instagram.loginId;
  },
  methods: {
    deletePostingLog() {
      const result = confirm('삭제하시면 되돌릴 수 없습니다. 진짜 삭제 하시겠습니까?', '소셜업');
      if (result === true) {
        this.$store.dispatch('setPostingLog', []);
      }
    },
    openLink(shortcode) {
      windowHandler.openBrowser(`https://www.instagram.com/p/${shortcode}/`);
    },
    selectLog(log) {
      this.selectedLog = log;
    },
    changePage(page) {
      this.currentPage = page;
    },
    showRepeatImage() {
      document.getElementById('load_repeat_image').click();
    },
    async postingToggle() {
      this.$root.$emit('postingToggle', 'reserve');
    },
    async postingRepeatToggle() {
      this.$root.$emit('postingToggle', 'repeat');
    },
    removePosting() {
      this.$store.dispatch('removePosting', this.selectedPosting);
      this.selectedPosting = null;
    },
    selectPosting(posting) {
      this.selectedPosting = posting;
    },
    addPosting() {
      if (this.datetime && this.repeat === 'onetime' && new Date() > new Date(this.datetime)) {
        alert('이미 지난 날짜입니다.', '소셜업');
        return;
      }
      if (this.text && this.file && this.repeat && this.selectedAccount) {
        this.$store.dispatch('addPosting', {
          account: this.selectedAccount,
          datetime: this.datetime,
          repeat: this.repeat,
          text: this.text,
          file: this.file,
        });
        this.text = null;
        this.file = null; 
        this.showReserveDialog = false;
      }
    },
    clearPosting() {
      this.$store.dispatch('clearPosting');
    },
    changeFile(event) {
      this.file = event.target.files[0].path;
    },
    addRepeatImage(event) {
      for (const file of event.target.files) {
        if (file.type === 'image/jpeg') {
          const path = file.path;
          if (!this.$store.state.posting.repeat.images.filter(item => item === path)[0]) {
            this.$store.dispatch('addRepeatImage', path);
          }
        } else {
          alert('이미지는 jpg 파일만 허용됩니다.');
        }
      }
      // if (event.target.files[0].type === 'image/jpeg') {
      //   const path = event.target.files[0].path;
      //   if (!this.$store.state.posting.repeat.images.filter(item => item === path)[0]) {
      //     this.$store.dispatch('addRepeatImage', path);
      //   }
      // } else {
      //   alert('이미지는 jpg 파일만 허용됩니다.');
      //   console.log(event.target.files);
      //   event.target.files = {};
      // }
    },
    removeRepeatImage(image) {
      this.$store.dispatch('removeRepeatImage', image);
    },
    addRepeatHashtag() {
      const tags = this.inputHashtag.split(',');
      this.inputHashtag = null;
      tags.forEach((item) => {
        const tag = item.trim();
        if (tag && !this.$store.state.posting.repeat.hashtags.filter(item => item === tag)[0]) {
          this.$store.dispatch('addRepeatHashtag', tag);
        }
      });
    },
    removeRepeatHashtag(tag) {
      this.$store.dispatch('removeRepeatHashtag', tag);
    },
    setRepeatText() {
      this.$store.dispatch('setRepeatText', this.inputRepeatText);
    },
    setRepeatInterval() {
      this.$store.dispatch('setRepeatInterval', this.inputRepeatInterval);
    },
  },
};
</script>

<style lang="css" scoped>
  .md-card {
    margin-right: 2px !important;
    margin-left: 2px !important;
  }
  .w-fab {
    position: absolute;
    right: 10px;
    top: 10px;
  }
</style>
