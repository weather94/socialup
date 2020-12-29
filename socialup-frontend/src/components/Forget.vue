<template>
  <div class="contact-page-conent-aera">
      <div class="container">
        <div class="row justify-content-center">
          <h2 class="title">비밀번호 찾기</h2>
        </div>
        <div class="row justify-content-center">
          <b-form class="col-8 row">
            <div class="col-8">
              <b-form-input id="exampleInput2" type="email" required placeholder="이메일"></b-form-input>
            </div>
            <div class="col-4">
              <b-button type="submit" variant="primary">인증메일 발송</b-button>
            </div>
          </b-form>
          <br><br><br><br><br><br>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'asdasdasdasdz'
    }
  }

}
</script>

<style lang="css">

</style>
