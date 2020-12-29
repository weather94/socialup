<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    this.$http.get('api/member/whoami').then((result) => {
      if (result.data) {
        this.$store.dispatch('setMember', result.data);
      }
    })
  },
}
</script>

<style lang="scss">
@import "~material-design-icons/iconfont/material-icons.css";

a:link{
  color: #5A5A5A !important;
}
a:hover {
  text-decoration: none !important;
}
.router-view-content{
  min-height: 80vh;
}
.w-click-box:hover {
  background-color: #e7e7e7;
  cursor: pointer;
}
.w-click-box2:hover {
  background-color: #e7e7e7;
}
.modal-open {
  padding-right: 0px !important;
}
.w-input {
  padding: 10px;
}
.w-tmargin-50 {
  margin-top: 50px;
}
.w-tmargin-15 {
  margin-top: 15px;
}
.w-bmargin-15 {
  margin-bottom: 15px;
}
.w-rmargin-15 {
  margin-right: 15px;
}
.w-padding-10 {
  padding: 10px !important;
}
.align-center {
  align-items: center;
}
.w-vpadding-15 {
  padding-top: 15px;
  padding-bottom: 15px;
}
.w-cwhite {
  color: white;
}
.single-price-plan-01 {
  margin-bottom: 20px;
}
  .w-follow {
    color: #448aff !important;
  }
  .w-like {
    color: red !important;
  }
  .w-unfollow {
    color: black !important;
  }
  .align-center {
    text-align: center;
  }
</style>
