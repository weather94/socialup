<template>
  <div class="test">
    ㄴㅁㅇㄴㅁㅇㅁㄴㅇㅁㄴㅇㅁㄴ
    <div class="md-layout md-alignment-center-space-between">
      <!-- <md-card class="md-layout-item md-size-20" v-for="(product, index) in products.slice((currentPage-1)*perPage, currentPage*perPage)" :key="index">
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
        </md-card> -->
        <md-card class="md-layout-item md-size-20" v-for="(product, index) in this.products.slice((currentPage-1)*perPage, currentPage*perPage)" :key="index">
        <div>
          {{product.name}} <br>
        </div>
          <md-card-media-actions>
            <md-card-media>
              <img :src="`C:\\workspace\\project\\socialup\\socialup-admin-electron\\watch\\${product.img}`" alt="media">
            </md-card-media>
          </md-card-media-actions>
          <div class="md-layout md-alignment-center-center">
            <div class="md-layout-item">
              <md-button class="md-icon-button md-raised md-primary" @click="product.price1 = 289000">
                28
              </md-button>
            </div>
            <div class="md-layout-item">
              <md-button class="md-icon-button md-raised md-primary" @click="product.price1 = 299000">
                29
              </md-button>
            </div>
            <div class="md-layout-item">
              <md-button class="md-icon-button md-raised md-primary" @click="product.price1 = 319000">
                31
              </md-button>
            </div>
            <div class="md-layout-item">
              <md-button class="md-icon-button md-raised md-primary" @click="product.price1 = 339000">
                33
              </md-button>
            </div>
            <div class="md-layout-item">
              <md-button class="md-icon-button md-raised md-primary" @click="product.price1 = 369000">
                36
              </md-button>
            </div>
            <div class="md-layout-item">
              <md-button class="md-icon-button md-raised md-primary" @click="product.price1 = 389000">
                38
              </md-button>
            </div>
            <!-- <div class="md-layout-item">
              <md-button v-if="!product.best" class="md-button md-raised md-primary" @click="product.best = true">
                BEST
              </md-button>
              <md-button v-if="product.best" class="md-button md-raised md-accent" @click="product.best = false">
                NOT BEST
              </md-button>
            </div>
            <div class="md-layout-item">
              <md-button v-if="!product.watermark" class="md-raised md-primary" @click="product.watermark = true">
                watermark
              </md-button>
              <md-button v-if="product.watermark" class="md-raised md-accent" @click="product.watermark = false">
                no watermark
              </md-button>
            </div> -->
          </div>
          <div class="md-layout">
            <input class="md-layout-item md-size-50" type="text" v-model="product.price1">
            <input class="md-layout-item md-size-50" type="text" v-model="product.price2">
          </div>
          <!-- <md-card-actions>
            <md-button v-if="checkExist(product)" class="md-raised md-accent" @click="clickItem(product)">추가</md-button>
          </md-card-actions> -->
        </md-card>
    </div>
    <pagination2
      :perPage="perPage"
      :total="this.$store.state.flag.storage.products.length"
      @change="changePage"></pagination2>
    <div>
      {{`선택된 갯수 : ${selectedWatchCount}`}}
    </div>
    <button @click="saveSwatch">저장</button>
    <!-- <button @click="copySelectedWatch">복사</button> -->
    <!-- <button @click="saveSelectedWatch">저장</button> -->
    <!-- <button @click="removeSelectedWatch">삭제</button> -->
    <div class="md-layout">
      <div class="md-layout-item">
        <md-button class="md-raised" @click="test">테스트</md-button>
        <md-button class="md-raised" @click="makeCSV">makeCSV</md-button>
        <md-button class="md-raised" @click="copyImageToNewImage">copyImageToNewImage</md-button>
        <md-button class="md-raised" @click="loadData">LOAD</md-button>
        <md-button class="md-raised" @click="saveRemoveProductData">저장하기</md-button>
        <md-button class="md-raised" @click="copy222">COPY</md-button>
        <md-button class="md-raised" @click="test2">test11111test</md-button>
        <md-button class="md-raised" @click="test3">getThumbnail</md-button>
        <md-button class="md-raised" @click="loadCSV">LOAD_CSV</md-button>
        <md-button class="md-raised" @click="productsSaveCSV">Products_SAVE_CSV</md-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import OpenBrowserProxy from '@/assets/js/OpenBrowserProxy';
import windowHandler from '@/assets/js/windowHandler';
import pagination2 from '@/components/pagination2';
import FileStorage from '@/assets/js/FileStorage';
import fs from 'fs';
import * as _ from 'lodash';

export default {
  components: { pagination2 },
  data() {
    return {
      proxy: null,
      products: [],
      currentPage: 1,
      perPage: 8,
      selectedWatchCount: 0,
      removeProducts: [],
    };
  },
  created() {
    // window.addEventListener('keyup', this.commandKeypress);
  },
  mounted() {
    this.products = _.cloneDeep(this.$store.state.flag.storage.products);
    // console.log(this.products);
    console.log(this.products);
    // this.products.forEach(item => {
    //   if (item.name.includes('리차드밀')) {
    //     console.log('zzz');
    //     item.price1 = 890000
    //     item.price2 = 990000;
    //   }
    //   item.name = item.name.replace(' 오토매틱 무브먼트', '');
    //   item.name = item.name.replace(' 오토매틱', '');
    //   item.name = item.name.replace(' 쿼츠무브먼트', '');
    //   item.name = item.name.replace(' 쿼츠 무브먼트', '');
    //   item.name = item.name.replace(' 쿼츠', '');
    //   item.name = item.name.replace('쿼츠', '');
    //   item.name = item.name.replace(' 수동형', '');
    // });
    // this.$store.dispatch('addData', {
    //   key: 'products',
    //   value: this.products,
    // });
    // console.log(this.$store.state.flag.storage.sWatch22222222.map(item => `${item.price2} ${item.name}`))
    // this.$store.dispatch('addData', {
    //   key: 'ssWatch',
    //   value: _.cloneDeep(this.$store.state.flag.storage.sWatch22222222),
    // });

    // this.getSelectedWatchCount();
    // this.products = _.cloneDeep(this.$store.state.flag.storage.ssWatch);
    // this.$store.dispatch('addData', {
    //   key: 'sssWatchBackUp1',
    //   value: this.products,
    // });
    // this.products = _.cloneDeep(this.$store.state.flag.storage.selectedWatch);
    // console.log(this.$store.state.flag.storage.sWatch);
    // this.$store.dispatch('addData', {
    //   key: 'sWatch22222222',
    //   value: this.$store.state.flag.storage.sWatch,
    // });

    // for (let i = 0; i < this.$store.state.flag.storage.watchCategory.length; i += 1) {
    //   console.log(i);
    //   const cate = this.$store.state.flag.storage.watchCategory[i];
    //   if (cate.category) {
    //     for (let i = 0; i < cate.category.length; i += 1) {
    //       this.products = this.products.concat(cate.category[i].products.map(item => ({
    //         ...item,
    //         category: `${cate.name}-${cate.category[i].name}`,
    //       })));
    //     }
    //   } else {
    //     this.products = this.products.concat(cate.products.map(item => ({
    //       ...item,
    //       category: cate.name,
    //     })));
    //   }
    // }
  },
  computed: {
    selectedWatch() {
      return (this.$store.state.flag.storage.selectedWatch) ? this.$store.state.flag.storage.selectedWatch.length : 0;
    },
  },
  methods: {
    productsSaveCSV() {
      let text = 'ID,이름,"할인 가격","정상 가격"\n';
      text = text + this.$store.state.flag.storage.products.map(item => `${item.id},"${item.name}",${item.price1},${item.price2}`).join('\n');
      fs.writeFileSync('C:\\Users\\chlrl\\Downloads\\goodItem.csv', text, 'utf8');
    },
    loadCSV() {
      const item = fs.readFileSync("C:\\Users\\chlrl\\Downloads\\wc-product-export-11-7-2019-1562790291374.csv");
      const products = item.toString().split('\n');
      const result = [];
      for (let i = 1; i < products.length; i += 1) {
        const items = products[i].split(',');
        result.push({
          id: items[0],
          name: items[1].replace(/"/g, ''),
          price1: items[2],
          price2: items[3],
          img: items[4].replace('"http://dcd13.com/wp-content/uploads/2019/07/', ''),
        })
      }
      this.$store.dispatch('addData', {
        key: 'products',
        value: result,
      });
    },
    test3() {
      this.products.forEach((item, index) => {
        try {
          fs.copyFileSync(`C:\\workspace\\project\\socialup\\socialup-admin-electron\\watch\\${item.img}`, `C:\\workspace\\project\\socialup\\socialup-admin-electron\\thumbnail\\${index}.jpg`);
        } catch(e) {
          console.log(`${item.name} error`)
        }
      })
    },
    test2() {
      const items1 = [...new Set([...this.$store.state.flag.storage.productList])];
      const removes = fs.readdirSync('C:\\Users\\chlrl\\Downloads\\watch');
      // console.log(items1);
      // console.log(removes);
      for (let i = 0; i < removes.length; i += 1) {
        const index = items1.indexOf(removes[i]);
        if (index >= 0) {
          items1.splice(index, 1);
        }
      }
      // console.log(items1);
      const article = fs.readFileSync("C:\\Users\\chlrl\\Downloads\\item.csv");
      let text = article.toString();
      items1.forEach((item) => {
        text = text.replace(`<img class=""alignleft wp-image-8529 size-full"" src=""http://dcd13.com/wp-content/uploads/watch/${item}"" alt="""" width=""1280"" height=""859"" />`, '');
        text = text.replace(`http://dcd13.com/wp-content/uploads/2019/07/${item}, `, '');
        text = text.replace(`http://dcd13.com/wp-content/uploads/2019/07/${item}"`, '');
      });
      fs.writeFileSync('C:\\Users\\chlrl\\Downloads\\item2.csv', text, 'utf8');

    },
    copy222() {
      console.log(new Set([...this.$store.state.flag.storage.productList]));
    },
    saveRemoveProductData() {
      this.$store.dispatch('addData', {
        key: 'removeProductList',
        value: this.$store.state.flag.storage.removeProductList.concat(this.removeProducts),
      });
      this.removeProducts = [];
      console.log(this.$store.state.flag.storage.removeProductList);
    },
    loadData() {
      // const article = fs.readFileSync("C:\\Users\\chlrl\\Downloads\\item.csv");
      // const list = article.toString().match(/i[0-9-]*\.jpg/g);
      // this.$store.dispatch('addData', {
      //   key: 'productList',
      //   value: list,
      // });
    },
    commandKeypress(value) {
      console.log(value);
      if (value.code === 'ArrowLeft') {
        this.changePage(Number(this.currentPage) - 1);
      } else if (value.code === 'ArrowRight') {
        this.changePage(Number(this.currentPage) + 1);
      } else if (value.code === 'Digit1') {
        const product = this.products.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)[0];
        this.removeProducts.push(product);
      } else if (value.code === 'Digit2') {
        const product = this.products.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)[1];
        this.removeProducts.push(product);
      } else if (value.code === 'Digit3') {
        const product = this.products.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)[2];
        this.removeProducts.push(product);
      } else if (value.code === 'Digit4') {
        const product = this.products.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)[3];
        this.removeProducts.push(product);
      }
      console.log(this.removeProducts);
      console.log(this.currentPage);
    },
    copyImageToNewImage() {
      const watches = _.cloneDeep(this.$store.state.flag.storage.ssWatch);
      for (let i = 0; i < watches.length; i += 1) {
        const item = watches[i];
        console.log(item.name);
        item.newImages = [];
        for (const image of item.images) {
          const name = `i${new Date().getTime()}-${Math.floor(Math.random() * 100)}.jpg`;
          console.log(`${image} to ${`watch\\${name}`}`);
          try {
            // fs.createReadStream(image).pipe(fs.createWriteStream(`watch\\${name}`));
            fs.copyFileSync(image, `watch\\${name}`);
            item.newImages.push(name);
          } catch (e) {
            console.log('no');
          }
        }
      }
      this.$store.dispatch('addData', {
        key: 'ssWatch',
        value: watches,
      });
      console.log(watches);
    },
    makeCSV() {
      const watches = this.$store.state.flag.storage.ssWatch;
      const csv = []
      for (let i = 0; i < watches.length; i += 1) {
        let images = watches[i].newImages.slice(0, 4).map((item) => {
          return `http://decade.asia/wp-content/uploads/watch/${item}`;
        }).join(', ');
        let imageHtmls = watches[i].newImages.map((item) => {
          return `<img class=""alignleft wp-image-8529 size-full"" src=""http://decade.asia/wp-content/uploads/watch/${item}"" alt="""" width=""1280"" height=""859"" />`;
        }).join(' ');
        const splitCate = watches[i].category.split('_');
        console.log(splitCate.length);
        let category = '';
        if (splitCate.length === 2) {
          category = `${splitCate[0]}, ${splitCate[0]} > ${splitCate[1]}`;
        } else if(splitCate.length === 1) {
          category = `${splitCate[0]}`;
        } else {
          category = watches[i].category;
        }
        // `8530,simple,,"${watches[i].name}",1,0,visible,,"&nbsp;\n\n<img class=""alignnone wp-image-8652 size-full"" src=""http://dcd13.com/wp-content/uploads/descript.jpg"" alt="""" width=""1280"" height=""960"" />\n<img class=""alignleft wp-image-8529 size-full"" src=""http://decade.asia/wp-content/uploads/2019/06/i1561655751530-16.jpg"" alt="""" width=""1280"" height=""859"" /> <img class=""alignleft wp-image-8528 size-full"" src=""http://decade.asia/wp-content/uploads/2019/06/i1561655751514-0.jpg"" alt="""" width=""1280"" height=""859"" /> <img class=""alignleft wp-image-8527 size-full"" src=""http://decade.asia/wp-content/uploads/2019/06/i1561655751502-76.jpg"" alt="""" width=""1280"" height=""859"" /> <img class=""alignleft wp-image-8526 size-full"" src=""http://decade.asia/wp-content/uploads/2019/06/i1561655751488-53.jpg"" alt="""" width=""1280"" height=""859"" />",,,taxable,,1,,,0,0,,,,,1,,250000,350000,"TAG HEUER, TAG HEUER > 까레라",,,"http://dcd13.com/wp-content/uploads/2019/06/i1561655751488-53.jpg, http://dcd13.com/wp-content/uploads/2019/06/i1561655751502-76.jpg, http://dcd13.com/wp-content/uploads/2019/06/i1561655751514-0.jpg, http://dcd13.com/wp-content/uploads/2019/06/i1561655751530-16.jpg",,,,,,,,,0`
        csv.push(`2502,simple,,"${watches[i].name}",1,0,visible,,"&nbsp;<img class=""alignnone wp-image-8652 size-full"" src=""http://dcd13.com/wp-content/uploads/descript.jpg"" alt="""" width=""1280"" height=""960"" />${imageHtmls}",,,taxable,,1,,,0,0,,,,,1,,${watches[i].price2},${watches[i].price1},"${category}",,,"${images}",,,,,,,,,0`);
      }
      console.log(csv.join('\r\n'));

    },
    test() {
      console.log(this.$store.state.flag.storage.ssWatch);
      const watches = _.cloneDeep(this.$store.state.flag.storage.ssWatch);

      watches.forEach((item) => {
        item.name = item.name.replace('[아이더블유씨]', '[IWC]');
        item.name = item.name.replace('[I.W.C]', '[IWC]');
        item.name = item.name.replace('[로렉스]', '[ROLEX]');
        item.name = item.name.replace('[CHANEL ]', '[CHANEL]');
        item.name = item.name.replace('[론진]', '[LONGINES]');
        item.name = item.name.replace('[브라이틀링]', '[BREITLING]');
        item.name = item.name.replace('[ JAEGER-LECOULTRE]', '[JAEGER-LECOULTRE]');
        item.name = item.name.replace('[예거 르쿨트르]', '[JAEGER-LECOULTRE]');
        item.name = item.name.replace('[오데마피게]', '[AUDEMARS PIGUET]');
        item.name = item.name.replace('[오메가]', '[OMEGA]');
        item.name = item.name.replace('[까르띠에]', '[CARTIER]');
        item.name = item.name.replace('[태그호이어]', '[TAG HEUER]');
      //   // console.log(item.name);

        item.category = item.category.replace('I.W.C', 'IWC');
        item.category = item.category.replace('디올', 'DIOR');
        item.category = item.category.replace('로렉스', 'ROLEX');
        item.category = item.category.replace('론진', 'LONGINES');
        item.category = item.category.replace('리차드밀', 'RICHARD MILLE');
        item.category = item.category.replace('몽블랑', 'MONTBLANC');

        item.category = item.category.replace('루이비통', 'LOUIS VUITTON');
        
        item.category = item.category.replace('바쉐론 콘스탄틴', 'VACHERON CONSTANTIN');
        item.category = item.category.replace('반클리프 아펠', 'VANCLEEF&ARPELS');
        item.category = item.category.replace('벨앤로스', 'BELL&ROSS');
        item.category = item.category.replace('불가리', 'BVLGARI');
        item.category = item.category.replace('베르사체', 'VERSACE');
        item.category = item.category.replace('브라이틀링', 'BREITLING');
        item.category = item.category.replace('브레게', 'BREGUET');
        item.category = item.category.replace('블랑팡', 'BLANCPAIN');
        item.category = item.category.replace('샤넬', 'CHANEL');
        item.category = item.category.replace('쇼파드', 'CHOPARD');

        item.category = item.category.replace('에르메스', 'HERMES');

        item.category = item.category.replace('예거 르쿨트르', 'JAEGER LE COULTRE');
        item.category = item.category.replace('오데마피계', 'AUDEMARS PIGUET');
        item.category = item.category.replace('로저드뷔', 'ROGER DUBUIS');
        item.category = item.category.replace('오메가', 'OMEGA');
        item.category = item.category.replace('위블로', 'HUBLOT');
        item.category = item.category.replace('제니스', 'ZENITH');
        item.category = item.category.replace('투더', 'TUDOR');
        item.category = item.category.replace('파네라이', 'OFFICINE PANERAI');
        item.category = item.category.replace('OFFICINE PANERAI', 'PANERAI');
        item.category = item.category.replace('파텍필립', 'PATEK PHILIPPE');
        item.category = item.category.replace('프랭크 뮬러', 'FRANCK MULLER');
        item.category = item.category.replace('피아제', 'PIAGET');
        item.category = item.category.replace('까르띠에', 'CARTIER');
        item.category = item.category.replace(' CARTIER', ' 까르띠에');
        item.category = item.category.replace('태그호이어', 'TAG HEUER');

        item.category = item.category.replace('^', '_');

        item.category = item.category.replace('IWC_파일럿', 'IWC_파일럿-IWC');
        item.category = item.category.replace('ZENITH_파일럿', 'ZENITH_파일럿-제니스');
        item.category = item.category.replace('VACHERON CONSTANTIN_기타', 'VACHERON CONSTANTIN_기타-바쉐론콘스탄틴');
        item.category = item.category.replace('CHANEL_기타', 'CHANEL_기타-샤넬');
        item.category = item.category.replace('PANERAI_기타', 'PANERAI_기타-파네라이');
        item.category = item.category.replace('BREGUET_투어빌론', 'BREGUET_투어빌론-브레게');
        item.category = item.category.replace('FRANCK MULLER_투어빌론', 'FRANCK MULLER_투어빌론-프랭크뮬러');


        // console.log(item.category);
        // item.price2 = Math.floor(item.price2/10000)*10000 + 9000;
        // item.price1 = item.price2 + 100000;
        console.log(`${item.price2} ${item.price1}`)
      });

      const categorys = [];
      watches.forEach((item) => {
        if(!categorys.includes(item.category))
        console.log(item.category);
        categorys.push(item.category);
      });

      this.$store.dispatch('addData', {
        key: 'sssWatchBackUp1',
        value: watches,
      });

    },
    random3000() {
      const item = 3000*(Math.floor(Math.random()*4));
      return item;
    },
    saveSwatch() {
      this.$store.dispatch('addData', {
        key: 'ssWatch',
        value: this.products,
      });
    },
    saveProducts() {
      this.$store.dispatch('addData', {
        key: 'products',
        value: _.cloneDeep(this.products),
      });
    },
    changeValue(value) {
      this.$store.dispatch('addData', {
        key: 'sWatch',
        value: this.products,
      });
    },
    copySelectedWatch() {
      const watches = _.cloneDeep(this.$store.state.flag.storage.selectedWatch);
      for (let i = 0; i < watches.length; i += 1) {
        const item = watches[i];
        console.log(item.name);
        item.newImages = [];
        let index = 0;
        for (const image of item.images) {
          const name = `i${new Date().getTime()}-${Math.floor(Math.random() * 100)}.jpg`;
          console.log(`${image} to ${`watch\\${name}`}`);
          try {
            // fs.createReadStream(image).pipe(fs.createWriteStream(`watch\\${name}`));
            fs.copyFileSync(image, `watch\\${name}`);
            item.newImages.push(name);
            index += 1;
          } catch (e) {
            console.log('no');
          }
        }
      }
      this.$store.dispatch('addData', {
        key: 'sWatch',
        value: watches,
      });
      console.log(watches);
    },
    saveSelectedWatch() {
      const storage = new FileStorage(null, 'watch');
      storage.set('watch', this.$store.state.flag.storage.selectedWatch);
    },
    checkExist(product) {
      return (this.$store.state.flag.storage.selectedWatch) ? !this.$store.state.flag.storage.selectedWatch.filter(item => item.file === product.file)[0] : true;
    },
    getSelectedWatchCount() {
      this.selectedWatchCount = (this.$store.state.flag.storage.ssWatch) ? this.$store.state.flag.storage.ssWatch.length : 0;
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
      this.currentPage = value;
      // this.getSelectedWatchCount();
      if (this.products && this.products.length > 0) {
        console.log(this.products.length);
        this.saveProducts();
      }
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
