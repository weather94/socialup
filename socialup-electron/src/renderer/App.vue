<template>
  <div id="app">
    <Login v-if="!this.$store.state.auth.auth"/>
    <Drawer v-if="this.$store.state.auth.auth" :version="version" :lastVersion="lastVersion"/>

    <md-dialog md-fullscreen style="min-width: 400px;"
      :md-click-outside-to-close="false"
      :md-active.sync="showUpdateDialog">
      <md-dialog-title>소셜업 자동 업데이트</md-dialog-title>
      <md-dialog-content class="weather-content">
        <div style="margin-bottom: 10px;">{{(lastData) ? new Date(lastData.date).toLocaleDateString() : ''}}</div>
        <md-progress-bar md-mode="determinate" :md-value="progress.current/progress.total*100" style="height: 20px; margin-top:4px; margin-bottom:20px;"></md-progress-bar>
        <div style="margin-top: 10px;" v-for="(details, index) in updateDetails" :key="index">
          <md-badge class="md-square" :md-content="details.tag" :style="(details.tag === '삭제') ? 'right: unset;  background-color: #a7a7a7;' : (details.tag === '수정') ? 'right: unset; background-color: #448aff;' : 'right: unset;'"/>
          <span class="md-layout-item" style="margin-left: 40px;">{{details.text}}</span>
        </div>
      </md-dialog-content>
    </md-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import Drawer from './components/Drawer';
import Login from './components/Login';
import windowHandler from './assets/js/windowHandler';
import Update from './assets/js/Update';
import CheckInstagramIdPw from './assets/js/CheckInstagramIdPw';

export default {
  name: 'socialup',
  components: {
    Drawer,
    Login,
  },
  data() {
    return {
      showUpdateDialog: false,
      update: true,
      version: '1.4.1',
      lastVersion: null,
      lastData: null,
      updateDetails: [],
      progress: {
        current: 0,
        total: 1,
      },
    };
  },
  async mounted() {
    const result = await CheckInstagramIdPw(this.$store, this.instagramId);
    console.log(result);

    this.$root.$on('updateVersion', () => {
      this.updateVersion();
    });

    setInterval(() => {
      axios.get('http://socialup.kr/api/last-version').then((response) => {
        if (response.data && response.data.version) {
          this.lastData = response.data;
          try {
            this.updateDetails = JSON.parse(response.data.description.replace('<p>', '').replace('</p>', ''));
          } catch (e) {
            this.updateDetails = [];
          }
          this.lastVersion = response.data.version;
        }
      });
    }, 1800 * 1000);
    console.log(this.$store);
    if (this.version !== this.$store.state.flag.version) {
      this.$store.dispatch('setVersion', this.version);
      this.$store.dispatch('clearFriends');
    }

    this.$store.dispatch('finishGetFriends');
    this.$store.dispatch('setPostingProcess', null);
    Object.keys(this.$store.state.process).forEach((id) => {
      this.$store.dispatch('setMultiProcess', {
        id,
        process: false,
      });
    });
    axios.get('http://socialup.kr/api/last-version').then((response) => {
      if (response.data && response.data.version) {
        this.lastData = response.data;
        try {
          this.updateDetails = JSON.parse(response.data.description.replace('<p>', '').replace('</p>', ''));
        } catch (e) {
          this.updateDetails = [];
        }
        this.lastVersion = response.data.version;
        const lastVersionCode = this.lastVersion.split('.');
        const versionCode = this.version.split('.');
        if (lastVersionCode[0] !== versionCode[0] || lastVersionCode[1] !== versionCode[1]) {
          this.updateVersion();
        }
      }
    });
  },
  methods: {
    open(link) {
      windowHandler.openBrowser(link);
    },
    close() {
      windowHandler.closeWindow();
    },
    updateVersion() {
      this.showUpdateDialog = true;
      Update('http://socialup.kr/api/download/1207', this.progress, this.$store);
    },
  },
};
</script>

<style lang="scss">
  @import "~material-design-icons/iconfont/material-icons.css";
  body {
    -ms-overflow-style: none;
    min-height: unset !important;
    &::-webkit-scrollbar {
      width: 8px;
      overflow: auto;
      float: left;
    }
  }
  .weather-box {
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    border-radius: 2px;
    margin: 10px;
  }
  .weather-box-icon {
    text-align: center;
    padding-top: 20px;
  }
  .weather-box-icon md-icon {
    width: 50px !important;
    height: 50px !important;
  }
  .weather-box-header {
    text-align: center;
    padding: 20px;
    font-size: 20px;
    font-weight: 500;
  }
  .weather-box-content {
    text-align: center;
    padding: 15px;
    font-size: 13px;
  }
  .weather-box-content-item {
    padding: 5px;
  }
  .weather-box-footer {
    text-align: center;
  }
  .weather-tpadding-64 {
    padding-top: 64px !important;
  }
  .close-button {
    position: absolute !important;
    font-weight: 900;
    top: 10px;
    right: 10px;
  }
  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .w-follow {
    color: #448aff !important;
  }
  .w-like {
    color: red !important;
  }
  .w-unfollow {
    color: black !important;
  }
  .align-center {
    text-align: center;
  }
  .w-tpadding-15 {
    padding-top: 15px;
  }
  .weather-content {
    padding: 30px;
  }
  .md-chip {
    margin-bottom: 4px;
  }
::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 20px;
}
::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 20px;
}
</style>
