<template>
  <div class="md-layout md-alignment-center-space-between weather-item2">
    <div>
      <md-button :disabled="firstButtonDisabled" class="md-icon-button" @click="firstPage">
        <md-icon>first_page</md-icon>
      </md-button>
      <md-button :disabled="beforeButtonDisabled" class="md-icon-button" @click="beforePage">
        <md-icon>navigate_before</md-icon>
      </md-button>
    </div>
    <span class="md-layout-item" style="text-align: center;">
      <input class="w-small-input" type="number" name="" v-model="currentPage" @input="reloadPage">&nbsp;/&nbsp;{{totalPage}}</span>
    <div>
      <md-button :disabled="nextButtonDisabled" class="md-icon-button" @click="nextPage">
        <md-icon>navigate_next</md-icon>
      </md-button>
      <md-button :disabled="lastButtonDisabled" class="md-icon-button" @click="lastPage">
        <md-icon>last_page</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['perPage', 'total'],
  mounted() {
    this.changePage(1);
  },
  data() {
    return {
      currentPage: 1,
      firstButtonDisabled: false,
      nextButtonDisabled: false,
      beforeButtonDisabled: false,
      lastButtonDisabled: false,
    };
  },
  watch: {
    total() {
      this.changePage(this.currentPage);
    },
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.perPage);
    },
  },
  methods: {
    reloadPage() {
      this.changePage(this.currentPage);
    },
    changePage(number) {
      if (!number || number === 1) {
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
      if (number > this.totalPage) {
        this.currentPage = this.totalPage;
        this.$emit('change', this.totalPage);
      } else if (number > 0) {
        this.currentPage = number;
        this.$emit('change', number);
      } else if (number < 0) {
        this.currentPage = 1;
        this.$emit('change', 1);
      } else {
        this.$emit('change', 1);
      }
    },
    firstPage() {
      this.changePage(1);
    },
    beforePage() {
      this.changePage(this.currentPage - 1);
    },
    nextPage() {
      this.changePage(Number(this.currentPage) + 1);
    },
    lastPage() {
      this.changePage(this.totalPage);
    },
  },
};
</script>

<style lang="css" scoped>
.md-button {
  margin: 0px !important;
}
.md-icon-button {
  width: 30px !important;
  height: 30px !important;
}
.w-small-input {
  text-align: right;
  width: 50px;
}
.weather-item2 {
  min-height: 40px;
  font-size: 13px;
  padding: 4px 16px;
}
</style>
