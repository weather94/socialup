<template>
  <section class="pricing-plan-area gray-bg">
      <div class="container">
          <div class="row justify-content-center">
              <div class="col-lg-8">
                  <div class="section-title"><!-- section title -->
                      <h2 class="title">인스타그램</h2>
                      <div class="separator">
                          <span></span>
                          <span></span>
                          <span></span>
                      </div>
                  </div><!-- //. section title -->
              </div>
          </div>
          <div class="row">
              <div class="col-lg-4 col-md-6">
                  <div class="single-price-plan-01"><!-- single price plan 01 -->
                      <div class="price-header">
                          <div class="icon">
                              <i class="flaticon-rocket-ship"></i>
                          </div>
                          <h4 class="name">소통 서비스</h4>
                          <div><span class="price">33,000</span>/월</div>
                      </div>
                      <div class="price-body">
                          <ul>
                              <li>자동 좋아요</li>
                              <li>자동 팔로우</li>
                              <li>자동 댓글</li>
                              <li>언팔로우</li>
                              <li>대시보드</li>
                          </ul>
                      </div>
                      <div class="price-footer">
                          <router-link :to="{ path:'/payment' }" class="btn-boxed blank">시작하기</router-link>
                      </div>
                  </div><!-- //. single price plan one -->
              </div>
              <div class="col-lg-4 col-md-6">
                  <div class="single-price-plan-01"><!-- single price plan 01 -->
                      <div class="price-header">
                          <div class="icon rotate">
                              <i class="flaticon-start"></i>
                          </div>
                          <h4 class="name">포스팅 + DM</h4>
                          <div><span class="price">33,000</span>/월</div>
                      </div>
                      <div class="price-body">
                          <ul>
                              <li>시간별 업로드</li>
                              <li>반복 업로드</li>
                              <li>예약 무제한</li>
                              <li>자동 DM</li>
                              <li>예약 DM</li>
                          </ul>
                      </div>
                      <div class="price-footer">
                          <router-link :to="{ path:'/payment' }" class="btn-boxed blank">시작하기</router-link>
                      </div>
                  </div><!-- //. single price plan one -->
              </div>
              <div class="col-lg-4 col-md-6">
                  <div class="single-price-plan-01"><!-- single price plan 01 -->
                      <div class="price-header">
                          <div class="icon">
                              <i class="flaticon-send"></i>
                          </div>
                          <h4 class="name">소통 포스팅 DM</h4>
                          <div><span class="price">55,000</span>/월</div>
                      </div>
                      <div class="price-body">
                          <ul>
                              <li>팔로우 + 좋아요</li>
                              <li>댓글</li>
                              <li>언팔로우</li>
                              <li>대시보드</li>
                              <li>포스팅 + DM</li>
                          </ul>
                      </div>
                      <div class="price-footer">
                          <router-link :to="{ path:'/payment' }" class="btn-boxed blank">시작하기</router-link>
                      </div>
                  </div><!-- //. single price plan one -->
              </div>
          </div>
      </div>
    </section>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
