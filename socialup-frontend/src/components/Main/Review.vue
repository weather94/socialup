<template>
  <section class="latest-news-area" v-if="reviews.length > 0">
      <div class="container">
          <div class="row justify-content-center">
              <div class="col-lg-8">
                  <div class="section-title"><!-- section title -->
                      <h2 class="title">REVIEWS</h2>
                      <div class="separator">
                          <span></span>
                          <span></span>
                          <span></span>
                      </div>
                  </div><!-- //. section title -->
              </div>
          </div>
          <div class="row">
              <div class="col-lg-4 col-md-6" v-for="(review, index) in reviews" :key="index">
                  <div class="single-latest-news-grid-item"><!-- single latest news grid item -->
                      <div class="content">
                          <ul class="post-meta">
                              <li>By <a href="#">{{`${review.writerName.slice(0, 6)}*****`}}</a></li>
                              <li><a href="#">{{new Date(review.regDate).toLocaleDateString()}}</a></li>
                          </ul>
                          <a href="#"><h4 class="title">{{review.title}}</h4></a>
                          <p>{{review.content}}</p>
                          <router-link :to="{ path: '/reviews' }" class="readmore">Read more <i class="flaticon-right-arrow"></i></router-link>
                      </div>
                  </div><!-- //.single latest news grid item -->
              </div>
          </div>
      </div>
  </section>
</template>

<script>
export default {
  mounted() {
    this.getReviews();
  },
  data() {
    return {
      reviews: [],
    }
  },
  methods: {
    getReviews() {
      this.$http.get('api/board', {params: {page: 1, size: 3, category: 'insta-review'}}).then(
        response => {
          if (response.data && response.data.length > 0) {
            this.reviews = this.reviews.concat(response.data);
            this.page++;
          }
        });
    },
  },
}
</script>

<style lang="css">
</style>
