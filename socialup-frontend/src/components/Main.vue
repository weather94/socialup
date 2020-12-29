<template>
  <div>
    <Header/>
    <InstaMarketing/>
    <IntroMovie/>
    <IntroService/>
    <Count/>
    <Review/>
    <div class="back-to-top">
      <i class="fas fa-angle-up"></i>
    </div>
  </div>
</template>

<script>
import Header from './Main/Header'
import InstaMarketing from './Main/InstaMarketing'
import IntroMovie from './Main/IntroMovie'
import IntroService from './Main/IntroService'
import Count from './Main/Count'
import Review from './Main/Review'

export default {
  components: {
    'Header': Header,
    'InstaMarketing': InstaMarketing,
    'IntroMovie': IntroMovie,
    'IntroService': IntroService,
    'Count': Count,
    'Review': Review,
  }
}
</script>

<style lang="css">
</style>
