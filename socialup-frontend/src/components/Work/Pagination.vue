<template>
  <div class="weather-pagination md-layout md-alignment-center-center">
    <md-button :disabled="firstButtonDisabled" class="md-icon-button md-raised" @click="firstPage">
      <md-icon>first_page</md-icon>
    </md-button>
    <md-button :disabled="beforeButtonDisabled" class="md-icon-button md-raised" @click="beforePage">
      <md-icon>navigate_before</md-icon>
    </md-button>
    <div v-for="(key, index) in page" :key="index">
      <md-button v-if="currentPage === key" class="md-icon-button md-primary md-raised">
        {{key}}
      </md-button>
      <md-button v-else class="md-icon-button md-raised" @click="changePage(key)">
        {{key}}
      </md-button>
    </div>
    <md-button :disabled="nextButtonDisabled" class="md-icon-button md-raised" @click="nextPage">
      <md-icon>navigate_next</md-icon>
    </md-button>
    <md-button :disabled=" lastButtonDisabled" class="md-icon-button md-raised" @click="lastPage">
      <md-icon>last_page</md-icon>
    </md-button>
  </div>
</template>

<script>
export default {
  props: ['perPage', 'total', 'size'],
  mounted() {
    this.totalPage = Math.ceil(this.total / this.perPage);
    this.limit = Math.floor(this.size / 2);
    this.changePage(1);
  },
  data() {
    return {
      page: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      totalPage: null,
      limit: null,
      startPage: null,
      endPage: null,
      currentPage: 1,
      firstButtonDisabled: false,
      nextButtonDisabled: false,
      beforeButtonDisabled: false,
      lastButtonDisabled: false,
    };
  },
  methods: {
    changePage(number) {
      if (number === 1 && number === this.totalPage) {
        this.firstButtonDisabled = true;
        this.beforeButtonDisabled = true;
        this.nextButtonDisabled = true;
        this.lastButtonDisabled = true;
      } else if (number === 1) {
        this.firstButtonDisabled = true;
        this.beforeButtonDisabled = true;
        this.nextButtonDisabled = false;
        this.lastButtonDisabled = false;
      } else if (number === this.totalPage) {
        this.nextButtonDisabled = true;
        this.lastButtonDisabled = true;
        this.firstButtonDisabled = false;
        this.beforeButtonDisabled = false;
      } else {
        this.firstButtonDisabled = false;
        this.beforeButtonDisabled = false;
        this.nextButtonDisabled = false;
        this.lastButtonDisabled = false;
      }
      if (number - this.limit <= 1) {
        this.startPage = 1;
      } else if (number + this.limit > this.totalPage) {
        this.startPage = this.totalPage - this.size;
      } else {
        this.startPage = number - this.limit;
      }

      if (this.startPage + this.size > this.totalPage) {
        this.endPage = this.totalPage;
      } else {
        this.endPage = this.startPage + this.size;
      }
      this.currentPage = number;
      this.page = this.makeArray(this.startPage, this.endPage);
      this.$emit('change', number);
    },
    firstPage() {
      this.changePage(1);
    },
    beforePage() {
      this.changePage(this.currentPage - 1);
    },
    nextPage() {
      this.changePage(this.currentPage + 1);
    },
    lastPage() {
      this.changePage(this.totalPage);
    },
    makeArray(start, end) {
      const array = [];
      for (let i = start; i <= end; i += 1) {
        array.push(i);
      }
      return array;
    },
  },
};
</script>

<style lang="css" scoped>
.weather-pagination {
  margin-top: 10px;
}
</style>
