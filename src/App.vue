<template>
  <div id="app">
    <div id="buffer" @touchmove.prevent>
      <loadIng></loadIng>
    </div>
    <!-- <router-view></router-view> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
import axios from "axios";
import loadIng from "./components/loadIng/loadIng";
export default {
  components: {
    loadIng
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>
<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  // padding:0 .24rem;
}
#buffer {
  display: none;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 6000;
  background: rgba(255, 255, 255, 0.5);
}
</style>
