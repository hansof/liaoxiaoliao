<template>
  <div
    class="guessStatus"
    :class="{ success: guessClass=='success', fail: guessClass=='fail', wait: guessClass=='wait', noResult: guessClass=='noResult', shenHe: guessClass=='shenHe'}"
  ></div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "follow",
  props: ["guessClass"],
  data() {
    return {}
  },
  methods: {}
};
</script>

<style scoped>
.guessStatus {
  width: 0.8rem;
  height: 0.74rem;
}

.success {
  background: url(success.png) no-repeat center center;
  background-size: 100%;
}

.fail {
  background: url(fail.png) no-repeat center center;
  background-size: 100%;
}

.wait {
  background: url(wait.png) no-repeat center center;
  background-size: 100%;
}

.noResult {
  background: url(noResult.png) no-repeat center center;
  background-size: 100%;
}

.shenHe {
  background: url(shenHe.png) no-repeat center center;
  background-size: 100%;
}
</style>
