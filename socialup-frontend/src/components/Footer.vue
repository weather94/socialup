<template>
  <footer class="footer-area footer-bg">
      <div class="footer-top"><!-- footer top -->
          <div class="container">
            <div class="row align-items-start footer-first">
              <div class="col-lg-4 col-md-6">
                  <div class="footer-widget about_widget"><!-- footer widget -->
                      <div class="footer-logo">
                          <a href="#"><img src="http://socialup.kr/src/assets/img/logogray.png" alt="footer logo"></a>
                      </div>
                  </div><!-- //. footer widget-->
              </div>
              <div class="col-lg-4 col-md-6 ali" style="margin-bottom: 20px;">
                <span>카카오톡 1:1 상담</span>
                <a class="footer-kakao" target="_blank" href="javascript:void(0);" onclick="window.open('https://pf.kakao.com/_DxhISj', '카카오톡 플러스친구', 'width=500, height=750')">소셜업 @socialup</a>
              </div>
              <div class="col-lg-4 col-md-6 ali">
                <span>고객센터 (10:00 ~ 18:00)</span>
                <h3 class="footer-contact">070-0000-0000</h3>
              </div>
            </div>
            <div class="row footer-second">
              <div class="col-12 footer-info">
                <span>카우버드</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>대표 최기상</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </div>
            <div class="row footer-last">
              <div class="col-12 footer-info">
                <span>사업자등록번호 733-22-00801</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>통신판매업신고번호 : 2018-전북남원-1014호</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </div>
            <div class="row footer-last">
              <div class="col-12 footer-info">
                <span>주소 전라북도 남원시 용성로 168-11</span>
              </div>
            </div>
            <div class="row footer-last">
              <div class="col-12 footer-info">
                <span><router-link :to="{ path: '/terms', params: {} }">이용약관</router-link></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span><router-link :to="{ path: '/terms', params: {} }">개인정보처리방침</router-link></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>개인정보관리책임자: 최기상 <a href="mailto:cowbird2018@gmail.com">cowbird2018@gmail.com</a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </div>
            <!-- <div class="row">
                <div class="col-lg-12 col-md-12">
                    <div class="footer-widget about_widget">
                        <ul class="social-icons">
                            <li><a href="#"><i class="fab fa-facebook-f"></i></a> </li>
                            <li><a href="#"><i class="fab fa-twitter"></i></a> </li>
                            <li><a href="#"><i class="fab fa-linkedin-in"></i></a> </li>
                            <li><a href="#"><i class="fab fa-instagram"></i></a> </li>
                        </ul>
                    </div>
                </div>
            </div> -->
          </div>
      </div><!-- //. footer top -->
  </footer>
</template>

<script>
export default {
}
</script>

<style lang="css" scoped>
.footer-area * {
  color: #5a5a5a;
}
.footer-contact {
  font-size: 35px;
  font-weight: 500;
  display: block;
}
.footer-kakao {
  font-size: 30px;
  margin-top: 10px;
  font-weight: 600;
  display: block;
}
.footer-first {
  border-bottom: #7a7a7a solid 1px;
}
.footer-second {
  margin-top: 20px;
}
.footer-last {
  margin-top: 3px;
}
.footer-info {
  font-size: 14px;
}
.footer-info-light {
  color: black;
}
</style>
