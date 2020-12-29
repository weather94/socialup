<template>
  <div id="mobile">
    <div class="mobile-router-view-content">
      <router-view/> 
    </div>
    <div class="phone-viewport">
      <md-bottom-bar class="md-accent" md-active-item="/mobile/play">
        <md-bottom-bar-item id="/mobile" md-label="로그인" v-if="!this.$store.state.member.member" @click="router('/mobile')" md-icon="lock_open"></md-bottom-bar-item>
        <md-bottom-bar-item id="/mobile/register" md-label="회원가입" v-if="!this.$store.state.member.member" @click="router('/mobile/register')" md-icon="group_add"></md-bottom-bar-item>
        <md-bottom-bar-item id="/mobile/service" md-label="서비스" v-if="this.$store.state.member.member" @click="router('/mobile/service')" md-icon="favorite"></md-bottom-bar-item>
        <md-bottom-bar-item id="/mobile/play" md-label="계정관리" v-if="this.$store.state.member.member" @click="router('/mobile/play')" md-icon="assessment"></md-bottom-bar-item>
        <md-bottom-bar-item id="/mobile/mypage" md-label="마이페이지" v-if="this.$store.state.member.member" @click="router('/mobile/mypage')" md-icon="person"></md-bottom-bar-item>
        <md-bottom-bar-item id="/mobile/support" md-label="고객센터" v-if="this.$store.state.member.member" @click="router('/mobile/support')" md-icon="headset"></md-bottom-bar-item>
      </md-bottom-bar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    router(route) {
      this.$router.push(route);
    },
  }
}
</script>

<style lang="scss">
.phone-viewport {
    align-items: flex-end;
    overflow: hidden;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    bottom: 0px;
    z-index: 9;
    position: fixed;
    width: 100%;
    // border: 1px solid rgba(#000, .26);
    // background: rgba(#000, .06);
  }
#mobile {
  padding-bottom: 56px;
}
</style>
