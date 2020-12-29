<template>
  <div class="mobile-support">
    <div class="md-layout md-alignment-center-center" style="margin-top: 20px;">
      <md-button class="md-primary md-raised kakao-style" style="background-color: yellow;" @click="openKakao">
        <img src="../../assets/img/kakao.png" alt="" style="width: 25px; height:25px;">
        카카오톡 플러스친구 1:1 문의하기
        </md-button>
    </div>
    <div class="md-layout">
        <div class="">
          <div class="col-lg-12">
            <div class="accordion-wrapper" v-for="(qnaName, index2) in Object.keys(qnas)" :key="index2*100">
              <div id="accordion">
                <md-subheader style="margin: 20px 0 0 0;" v-if="qnaName !== '전체'">
                  <h5>{{qnaName}}</h5>
                </md-subheader>
                <div class="card" v-for="(qna, index) in qnas[qnaName]" :key="index">
                  <div class="card-header" :id="`heading${index2*100 + index}`">
                    <h5 class="mb-0">
                      <a data-toggle="collapse" :data-target="`#collapse${index2*100 + index}`" aria-expanded="true" :aria-controls="`collapse${index2*100 + index}`" style="color: black; font-size: 15px;">
                        {{qna.question}}
                      </a>
                    </h5>
                  </div>
                  <div :id="`collapse${index2*100 + index}`" class="collapse" :aria-labelledby="`heading${index2*100 + index}`" data-parent="#accordion">
                    <div class="card-body" v-html="qna.answer">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor,
  },
  data() {
    return {
      qna: {
        question: null,
        category: null,
        answer: null
      },
      qnas: {},
    }
  },
  mounted() {
    this.getQNAs();
  },
  methods: {
    openKakao() {
      window.open('https://pf.kakao.com/_DxhISj', '카카오톡 플러스친구', 'width=500, height=750');
    },
    getQNAs() {
      this.$http.get('api/qna').then((response) => {
          if(response.data || response.data.length > 0) {
            response.data.forEach((element) => {
              if(this.qnas[element.category]) {
                this.qnas[element.category] = this.qnas[element.category].concat(element);
              } else {
                this.qnas[element.category] = [element];
              }
              this.qnas = _.cloneDeep(this.qnas);
              console.log(this.qnas);
            });
          }
        }
      )
    },
    insertQNA() {
      this.$http.post('api/qna', this.qna).then(
        response => {
          if(response.data) {
            if (this.qnas[response.data.category]) {
              this.qnas[response.data.category] = this.qnas[response.data.category].concat(response.data);
            } else {
              this.qnas[response.data.category] = [response.data];
            }
            this.qnas = _.cloneDeep(this.qnas);
          }
        }
      )
    },
  }
}
</script>

<style lang="css">
.kakao-style {
  background-color: #ffe812 !important;
  color: black !important;
}
</style>
