<template>
  <div class="commitSuccess">
    <img class="success" src="./img/success.png" />
    <h3 class="isDoing">提现处理中</h3>
    <p
      class="detail"
    >您有{{money.drawAmount}}元的提现正在处理，{{money.canGet}}元到账金额将在24小时内直接打入您的提现{{money.bankType}}账户</p>
    <div class="btn" @click="toHome">我知道了</div>
  </div>
</template>

<script>
export default {
  name: "commitSuccess",
  data() {
    return {
      money: this.$store.getters.getMoney
    };
  },
  created() {},
  mounted() {
    console.log(this.$store);
  },
  methods: {
    toHome() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style scoped>
.commitSuccess {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 0.4rem;
}
.success {
  width: 1.86rem;
  height: 1.86rem;
}
.isDoing {
  font-size: 0.4rem;
  color: #000;
  line-height: 1;
  padding: 0.6rem 0 0.32rem 0;
}
.detail {
  font-size: 0.26rem;
  line-height: 0.4rem;
  color: #888;
}
.btn {
  width: 4.2rem;
  height: 0.98rem;
  border: 1px #979797 solid;
  border-radius: 0.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 0.32rem;
  color: #888;
  margin-top: 0.74rem;
}
</style>