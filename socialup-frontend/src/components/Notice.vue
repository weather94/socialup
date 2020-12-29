<template>
  <div class="faq-page-content-area">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="section-title"><!-- section title -->
              <h2 class="title">주의 사항</h2>
              <br>
          </div><!-- //. section title -->
        </div>
      </div>
        <div class="row">
          <div class="col-lg-12">
            <b-form-group label="Stacked  checkboxes">
              <b-form-checkbox-group stacked v-model="selected" name="flavour2" :options="options">
              </b-form-checkbox-group>
            </b-form-group>
            1. 인스타그램 계정 생성 시점이 최소 2주일 이상 이어야 하며, 프로필 사진 필수, 닉네임(유저네임)설정 및 게시물 최소 6장 이상 등록 되어 있어야 합니다.<br>
            2. 팔로잉 최소 10명 이상, 전화번호, 이메일 설정 및 인증 받으셔야 합니다.<br>
            3. 다른 프로그램 사용 절대 불가(그램블러, 언팔어플, 품앗이어플(라이크미 등), 각종 인스타그램 관리프로그램<br>
            4. 본인임 확인요청이 뜨는 경우 본인임 버튼 클릭해주시면 됩니다.<br>
            5. 비밀번호 변경 금지(자동관리 대행만 해당)<br>
            – 서비스 진행 도중 비밀번호를 변경하는 오류 발생 또는 서비스가 중단 될 수 있습니다.<br>
            – 반드시 카톡으로 미리 알려주시기 바랍니다.<br>
            6. 일부 활동 주의<br>
            – 무리한 좋아요나 팔로잉은 해당 기능 정지 될 수 있으니 주의<br>
            7. 주기적인 포스팅<br>
            – 신규 게시물이 없으면 팔로워 증가 효과가 낮아지고 일부 기능만 이용시 인스타그램에서 봇으로 의심할 수 있습니다.<br>
            – 자동관리 및 인기게시물 작업만 해당함<br>
            8. 자동관리 기능<br>
            – 기본 24시간 작동이나 봇으로 인지되어 차단 당할 수 있으니 자연스런 구동을 위해 새벽시간 일시정지 옵션이 좋습니다.<br>
            – 선팔 작업으로 팔로잉이 일시적으로 증가하지만 일정 시간 내 맞팔 없는 경우 자동 언팔 진행됩니다<br>
            9. 인스타그램 규정<br>
            – 인스타그램 규정을 위반하는 게시물은 계정이 삭제될 수 있습니다.<br>
            – 사행성 불법도박, 이미테이션, 성인광고 게시물은 경고 없이 서비스 중단 됩니다<br>
            10. 설정 및 관리<br>
            – 인스타웨이브는 회원이 직접 인스타그램을 관리하는 도구일 뿐이며, 어떠한 진행도 직접 관여하지 않습니다.<br>
            – 자동관리툴 이지만 매일 접속해 계정 상태 및 활동 내역 등을 확인 하고 직접 관리 해 불이익이 없도록 하시기 바랍니다.<br>
            11. 책임<br>
            – 인스타웨이브 이용 후 회원(인스타그램 등록ID)차단, 밴 등은 인스타그램 정책으로 인스타웨이브에서는 일체 책임을 지지 않습니다.<br>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
