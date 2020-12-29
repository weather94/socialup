<template>
  <div class="test">
    ㄴㅁㅇㄴㅁㅇㅁㄴㅇㅁㄴㅇㅁㄴ
    <div class="md-layout md-alignment-center-space-between">
      <md-card class="md-layout-item md-size-20" v-for="(product, index) in products.slice((currentPage-1)*perPage, currentPage*perPage)" :key="index">
        <div>
          {{product.name}} <br>
        </div>
          <md-card-media-actions>
            <md-card-media>
              <img :src="product.file" alt="media">
            </md-card-media>
          </md-card-media-actions>
          <md-card-actions>
          <md-button v-if="checkExist(product)" class="md-raised md-accent" @click="clickItem(product)">추가</md-button>
        </md-card-actions>
        </md-card>
    </div>
    <pagination2
      :perPage="perPage"
      :total="products.length"
      @change="changePage"></pagination2>
    <div>
      {{`선택된 갯수 : ${selectedWatchCount}`}}
    </div>
    <button @click="saveSelectedWatch">저장</button>
    <!-- <button @click="removeSelectedWatch">삭제</button> -->
  </div>
</template>

<script>
import OpenBrowserProxy from '@/assets/js/OpenBrowserProxy';
import windowHandler from '@/assets/js/windowHandler';
import pagination2 from '@/components/pagination2';
import FileStorage from '@/assets/js/FileStorage';
import fs from 'fs';
// import * as _ from 'lodash';

export default {
  components: { pagination2 },
  data() {
    return {
      proxy: null,
      products: [],
      currentPage: 1,
      perPage: 8,
      selectedWatchCount: 0,
    };
  },
  mounted() {
    this.getSelectedWatchCount();
    for (let i = 0; i < this.$store.state.flag.storage.watchCategory.length; i += 1) {
      console.log(i);
      const cate = this.$store.state.flag.storage.watchCategory[i];
      if (cate.category) {
        for (let i = 0; i < cate.category.length; i += 1) {
          this.products = this.products.concat(cate.category[i].products.map(item => ({
            ...item,
            category: `${cate.name}-${cate.category[i].name}`,
          })));
        }
      } else {
        this.products = this.products.concat(cate.products.map(item => ({
          ...item,
          category: cate.name,
        })));
      }
    }
  },
  computed: {
    selectedWatch() {
      return (this.$store.state.flag.storage.selectedWatch) ? this.$store.state.flag.storage.selectedWatch.length : 0;
    },
  },
  methods: {
    saveSelectedWatch() {
      const storage = new FileStorage(null, 'watch');
      storage.set('watch', this.$store.state.flag.storage.selectedWatch);
    },
    checkExist(product) {
      return (this.$store.state.flag.storage.selectedWatch) ? !this.$store.state.flag.storage.selectedWatch.filter(item => item.file === product.file)[0] : true;
    },
    getSelectedWatchCount() {
      this.selectedWatchCount = (this.$store.state.flag.storage.selectedWatch) ? this.$store.state.flag.storage.selectedWatch.length : 0;
    },
    removeSelectedWatch() {
      this.getSelectedWatchCount();
      this.$store.dispatch('removeData', {
        key: 'selectedWatch',
      });
    },
    clickItem(product) {
      this.getSelectedWatchCount();
      const name = product.name.replace(/[\\/:*?"<>|]/g, '');
      console.log(fs.existsSync(product.category));
      if (!fs.existsSync(product.category)) {
        fs.mkdirSync(product.category);
      }
      if (!fs.existsSync(`${product.category}\\${name}`)) {
        fs.mkdirSync(`${product.category}\\${name}`);
      }
      for (let i = 0; i < product.images.length; i += 1) {
        fs.createReadStream(product.images[i]).pipe(fs.createWriteStream(`${product.category}\\${name}\\${i}.jpg`));
      }
      if (!this.$store.state.flag.storage.selectedWatch) {
        this.$store.dispatch('addData', {
          key: 'selectedWatch',
          value: [],
        });
      }
      this.$store.dispatch('addData', {
        key: 'selectedWatch',
        value: this.$store.state.flag.storage.selectedWatch.concat(product),
      });
    },

    changePage(value) {
      this.getSelectedWatchCount();
      this.currentPage = value;
    },
    open(username) {
      windowHandler.openBrowser(`https://www.instagram.com/${username}/`);
    },
    openBrowserProxy() {
      console.log(1);
      OpenBrowserProxy(this.proxy);
    },
  },
};
</script>

<style lang="css" scoped>
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
