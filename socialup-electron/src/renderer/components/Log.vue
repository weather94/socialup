<template>
  <div class="">
    <div v-if="this.$store.state.log.workLogs[this.$store.state.log.todayKey]">
      <div v-for="(log, index) in this.$store.state.log.workLogs[this.$store.state.log.todayKey].slice((currentPage-1)*perPage, currentPage*perPage)" class="md-layout md-alignment-center-space-around w-padding-10"
        :style="(log.state === 'error') ? { backgroundColor: 'rgba(255, 40, 68, 0.4)' } : null" :key="index">
        <div class="md-layout-item md-size-10 md-layout md-alignment-center-center">
          <span>{{log.time}}</span>
        </div>
        <div class="md-layout-item md-size-20 md-alignment-center-center">
          {{log.id}}
        </div>
        <div class="md-layout-item md-size-20 md-alignment-center-center">
          {{log.tag}}
        </div>
        <div class="md-layout-item md-size-50 md-alignment-center-center">
          {{log.text}}
        </div>
      </div>
    </div>
    <div class="">
      <pagination2
        :perPage="perPage"
        :total="(this.$store.state.log.workLogs[this.$store.state.log.todayKey]) ? this.$store.state.log.workLogs[this.$store.state.log.todayKey].length : 0"
        @change="changePage"></pagination2>
    </div>
    <div class="md-layout md-alignment-center-right">
      <md-button class="weather-button md-primary" v-if="this.$store.state.member.member && this.$store.state.member.member.grade >= 10" @click="showLoadData">
        <span>불러오기</span>
      </md-button>
      <md-button class="weather-button md-primary" @click="showExtractData">
        <span>저장하기</span>
      </md-button>
      <input id="extract_data" type="file" @change="extractData" webkitdirectory directory hidden/>
      <input id="load_data" type="file" @change="loadData" accept=".txt" hidden/>
    </div>
  </div>
</template>

<script>
import pagination2 from '@/components/pagination2';
import FileStorage from '@/assets/js/FileStorage';

export default {
  components: { pagination2 },
  data() {
    return {
      perPage: 11,
      currentPage: 1,
    };
  },
  methods: {
    changePage(number) {
      this.currentPage = number;
    },
    showExtractData() {
      document.getElementById('extract_data').click();
    },
    extractData(value) {
      if (value.target.files[0] && value.target.files[0].path) {
        const storage = new FileStorage(value.target.files[0].path, `socialup-worklog-${new Date().getTime()}`);
        storage.set('workLogs', this.$store.state.log.workLogs);
      }
    },
    showLoadData() {
      document.getElementById('load_data').click();
    },
    loadData(value) {
      if (value.target.files[0] && value.target.files[0].path) {
        const storage = new FileStorage(null, value.target.files[0].path);
        const workLogs = storage.get('workLogs');
        this.$store.dispatch('setWorkLogs', workLogs);
      }
    },
  },
};
</script>

<style lang="css" scoped>
.w-padding-10 {
  padding: 10px;
}
</style>
