<template>
  <div class="blog-page-content-area">
      <div class="container">
          <div class="row">
              <div class="col-lg-12">
                  <div class="row justify-content-center">
                      <div class="col-lg-3 col-md-3 review-item" v-if="this.$store.state.member.member">
                          <div class="single-latest-news-grid-item">
                              <div class="content">
                                  <ul class="post-meta">
                                      <li>{{this.$store.state.member.member.email}}</li>
                                      <li><a href="#">{{new Date().toLocaleDateString()}}</a></li>
                                  </ul>
                                  <b-form>
                                    <b-form-group id="exampleInputGroup1" label-for="exampleInput1">
                                      <b-form-input id="exampleInput1" type="text" v-model="board.title" required placeholder="제목"></b-form-input>
                                    </b-form-group>
                                    <b-form-group id="exampleInputGroup2" label-for="exampleInput2">
                                      <b-form-textarea id="exampleInput2" v-model="board.content" :rows="3" :max-rows="3" required placeholder="내용"></b-form-textarea>
                                    </b-form-group>
                                    <b-form-group id="exampleInputGroup3" label-for="exampleInput3">
                                      <b-button class="float-right" type="button" @click="insertReview">등록하기</b-button>
                                    </b-form-group>
                                  </b-form>
                              </div>
                          </div>
                      </div>
                      <div class="col-lg-3 col-md-3 review-item" v-for="(review, index) in reviews" :key="index">
                          <div class="single-latest-news-grid-item">
                              <div class="content">
                                  <ul class="post-meta">
                                      <li>By <a href="#">{{`${review.writerName.slice(0, 5)}******`}}</a></li>
                                      <li><a href="#">{{new Date(review.regDate).toLocaleDateString()}}</a></li>
                                  </ul>
                                  <a href="#"><h4 class="title">{{review.title}}</h4></a>
                                  <p>{{review.content}}</p>
                              </div>
                              <button v-if="$store.state.member.member && $store.state.member.member.grade >= 10" @click.stop="deleteReview(review)">삭제</button>
                          </div>
                      </div>
                  </div>
                  <div class="col-lg-12">
                      <div class="post-pagination-wrapper">
                          <ul>
                              <li><a class="next page-numbers" href="javascript:void(0)" @click="getReviews">더 보기</a></li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div class="col-lg-4">
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.getReviews();
  },
  data() {
    return {
      page: 1,
      reviews: [],
      board: {
        title: null,
        category: 'insta-review',
        content: null
      }
    }
  },
  methods: {
    getReviews() {
      this.$http.get('api/board', {params: {page: this.page, size: 6, category: this.board.category}}).then(
        response => {
          if (response.data && response.data.length > 0) {
            this.reviews = this.reviews.concat(response.data);
            this.page++;
          }
        }
      );
    },
    insertReview() {
      this.$http.post('api/board', this.board).then(
        response => {
          if (response.data) {
            this.$store.dispatch('addFrontReviews', response.data);
            alert('리뷰가 등록되었습니다.')
          }
        }
      );
    },
    deleteReview(review) {
      this.$http.delete(`api/board/${review.id}`).then((response) => {
        if(response.data) {
          this.reviews = this.reviews.filter(item => item.id !== review.id);
        }
      });
    },
  }
}
</script>

<style lang="css">
.review-item{
  padding: 10px !important;
  margin: 10px;
  border: 1px solid #e9e9e9;
}
</style>
