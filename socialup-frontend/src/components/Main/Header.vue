<template>
  <header class="header-area header-bg" id="home">
      <div class="container">
          <div class="row justify-content-center">
              <div class="col-lg-8">
                  <div class="header-inner">
                      <h1 class="title wow fadeInDown">인스타 마케팅 <span class="base-color">SOCIAL UP</span></h1>
                      <p>소셜업을 통해 인스타그램을 스마트하게 관리하여 팔로워와 좋아요를 증가시키고 고객들과 가장 가까운곳에서 소통하세요.</p>
                      <div class="btn-wrapper wow fadeInUp">
                        <router-link :to="{ path: '/service' }" class="boxed-btn btn-rounded">시작하기</router-link>
                        <router-link :to="{ path: '/service' }" class="boxed-btn btn-rounded blank">알아보기</router-link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </header>
  <!-- <header class="header-area header-style-two" >
    <div class="header-carousel-two">
      <div class="single-header-carosuel-two-item" style="background-image: url(src/assets/img/marketing2.jpg)">
        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <div class="header-inner">
                <h1 class="title">인스타 마케팅 <span class="base-color">SOCIAL UP</span></h1>
                <p>소셜업을 통해 인스타그램을 스마트하게 관리하여 팔로워와 좋아요를 증가시키고 고객들과 가장 가까운곳에서 소통하세요.</p>
                <div class="btn-wrapper">
                  <a href="#" class="boxed-btn">시작하기</a>
                  <a href="#" class="boxed-btn blank">알아보기</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="single-header-carosuel-two-item" style="background-image: url(src/assets/img/marketing.jpg)">
        <div class="container">
          <div class="row">
            <div class="col-lg-8">
              <div class="header-inner">
                <h1 class="title">소셜 마케팅 <span class="base-color">SOCIAL UP</span></h1>
                <p>소셜업을 통해 SNS를 효율적으로 관리하고 유저들과 소통하여 자신의 고객으로 만들어 보세요.</p>
                <div class="btn-wrapper">
                  <a href="#" class="boxed-btn">시작하기</a>
                  <a href="#" class="boxed-btn blank">알아보기</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header> -->
</template>

<script>
export default {

}
</script>

<style lang="css">

</style>
