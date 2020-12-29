<template>
  <div class="etc">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header>
            <div class="md-title">이미지 다운로드</div>
          </md-card-header>

          <md-card-content>
            <md-field>
              <label>태그</label>
              <md-input v-model="imageDownload.tags"></md-input>
              <span class="md-helper-text">이미지를 다운로드할 태그를 , 로 구분해서 입력해주세요.</span>
            </md-field>
            <input type="file" @change="changePath" webkitdirectory directory>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-raised md-primary" @click="startDownloadImage">시작</md-button>
            <md-button class="md-raised md-primary" @click="stopDownloadImage">종료</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
    <br>
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header>
            <div class="md-title">JPG 이미지 좌우반전</div>
          </md-card-header>

          <md-card-content>
            <input type="file" @change="changeImageMirrorPath" webkitdirectory directory>
          </md-card-content>

          <md-card-actions>
            <md-button class="md-raised md-primary" @click="startImageMirror">시작</md-button>
          </md-card-actions>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import PostingWorker from '@/assets/js/PostingWorker';
import PostingRepeatWorker from '@/assets/js/PostingRepeatWorker';
import pagination2 from '@/components/pagination2';
import windowHandler from '@/assets/js/windowHandler';
import DownloadImage from '@/assets/js/DownloadImage';
import * as _ from 'lodash';
import jimp from 'jimp';
import fs from 'fs';

export default {
  name: 'posting',
  components: { pagination2 },
  data() {
    return {
      downloadWorker: null,
      imageDownload: {
        tags: '',
        path: '',
      },
      imageMirrorPath: '',
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
    async startImageMirror() {
      const images = await fs.readdirSync(this.imageMirrorPath);
      for (let i = 0; i < images.length; i++) {
        console.log(`${images[i]}`);
        if (images[i].slice(-3) === 'jpg') {
          try {
            const path = `${this.imageMirrorPath}\\${images[i]}`;
            const image = await jimp.read(path);
            image.flip(true, false);
            await image.write(path);
          } catch(e) { }
        }
        console.log(`${Math.floor((i + 1)/images.length*100)}% ${i + 1}/${images.length}`);
      }
    },
    startDownloadImage() {
      if (!this.imageDownload.tags) {
        alert('태그가 없습니다');
        return;
      }
      this.downloadWorker = DownloadImage(this.imageDownload.tags, this.imageDownload.path);
    },
    stopDownloadImage() {
      if (this.downloadWorker) {
        this.downloadWorker();
      }
    },
    changePath(event) {
      this.imageDownload.path = event.target.files[0].path;
    },
    changeImageMirrorPath(event) {
      this.imageMirrorPath = event.target.files[0].path;
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
