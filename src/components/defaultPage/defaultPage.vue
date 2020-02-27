<template>
  <div class="defaultPage">
    <div class="innerPage">
      <img class="noRecord" src="./img/noRecord.png" />
      <p>暂无记录</p>
    </div>
  </div>
</template>

<script>
export default {
  name:"defaultPage"
};
</script>

<style scoped>
.defaultPage {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
}

.innerPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.noNet {
  width: 2.46rem;
  height: 1.84rem;
}

.noRecord {
  width: 2.4rem;
  height: 1.84rem;
}

p {
  font-size: 0.3rem;
  color: #888;
  line-height: 1;
  margin: 0.4rem 0 0.3rem 0;
}

.tryAgain {
  width: 2rem;
  height: 0.68rem;
  border: 1px #ef3d34 solid;
  border-radius: 0.4rem;
  font-size: 0.32rem;
  color: #ef3d34;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
