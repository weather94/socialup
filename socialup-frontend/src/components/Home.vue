<template>
  <div id="home">
    <Nav/>
    <div class="router-view-content">
      <router-view/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Nav from './Nav'
import Footer from './Footer'

export default {
  components: {
    'Nav': Nav,
    'Footer': Footer
  },
  name: 'app',
}
</script>

<style lang="scss">
</style>
