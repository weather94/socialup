<template>
  <div class="faq-page-content-area">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title">
              <h2 class="title">자주하는 질문</h2>
              <br>
          </div>
        </div>
      </div>
        <div class="row">
          <div class="col-lg-12">
            <b-form v-if="this.$store.state.member.member && this.$store.state.member.member.grade >= 10">
              <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
                <b-form-input id="exampleInput1" type="text" v-model="qna.category" required placeholder="카테고리"></b-form-input>
              </b-form-group>
              <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
                <b-form-input id="exampleInput2" type="text" v-model="qna.question" required placeholder="제목"></b-form-input>
              </b-form-group>
              <b-form-group id="exampleInputGroup3" label-for="exampleInput3">
                <vue-editor v-model="qna.answer"></vue-editor>
              </b-form-group>
              <b-form-group>
                <b-button class="float-right" type="button" @click="insertQNA">등록하기</b-button>
              </b-form-group>
            </b-form>
            <div class="accordion-wrapper" v-for="(qnaName, index2) in Object.keys(qnas)" :key="index2*100">
              <div id="accordion">
                <md-subheader style="margin: 20px 0 0 0;">
                  <h5>{{qnaName}}</h5>
                </md-subheader>
                <div class="card" v-for="(qna, index) in qnas[qnaName]" :key="index">
                  <div class="card-header" :id="`heading${index2*100 + index}`">
                    <h5 class="mb-0">
                      <a data-toggle="collapse" :data-target="`#collapse${index2*100 + index}`" aria-expanded="true" :aria-controls="`collapse${index2*100 + index}`" style="color: black;">
                        {{qna.question}}<button v-if="$store.state.member.member && $store.state.member.member.grade >= 10" @click.stop="deleteQNA(qna)">삭제</button>
                      </a>
                    </h5>
                  </div>
                  <div :id="`collapse${index2*100 + index}`" class="collapse" :aria-labelledby="`heading${index2*100 + index}`" data-parent="#accordion">
                    <div class="card-body" v-html="qna.answer"></div>
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
import * as _ from 'lodash'

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
    deleteQNA(qna) {
      this.$http.delete(`api/qna/${qna.id}`).then((response) => {
        if(response.data) {
          this.qnas[qna.category] = this.qnas[qna.category].filter(item => item.id !== qna.id);
        }
      });
    },
  }
}
</script>

<style lang="css">
</style>
