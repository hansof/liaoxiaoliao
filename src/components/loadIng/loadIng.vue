<template>
  <div class="wrapp">
            <div class="load-9">
            <div class="k-spinner">
                <div class="k-bubble-1"></div>
                <div class="k-bubble-2"></div>
            </div>
            <div class="loadinfo">加载中</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name:'loadIng'
  }
</script>

<style scoped>
.wrapp{ width: 1.5rem; height: 1.5rem; border-radius: .2rem; position:absolute; top: 50%; left: 50%; transition-duration: 0ms; transform: translate3d(-0.75rem, -0.75rem, 0px);z-index: 6000; }
.loadinfo{  font-size: .30rem; color: #3c3939; margin: .2rem; text-align: center;}
.k-spinner {
    animation: k-loadingI 2s linear infinite;
}
.k-spinner {
    position: relative;
    width: 0.8rem;
    height: 0.8rem;
    margin: 0 auto;
}
.k-bubble-1, .k-bubble-2 {
    animation: k-loadingIb 2s ease-in-out infinite;
    background-color: #FFC107;
}
.k-bubble-2 {
    animation-delay: -1.0s;
}
.k-bubble-1,
.k-bubble-2 {
	position: absolute;
	top: 0;
	width: .5rem;
	height: .5rem;
	border-radius: .5rem;
	background-color: #628be6
}

.k-bubble-2 {
	top: auto;
	bottom: 0;
    border-radius: 1rem;
    background-color: #ef3d34;
}


@keyframes k-loadingI {
	100% {
		transform: rotate(360deg)
	}
}

@keyframes k-loadingIb {
	0%,
	100% {
		transform: scale(0)
	}
	50% {
		transform: scale(1)
	}
}
</style>
