<template>
    <div id="aliPay">
        <div class="rightLoop">
            <img src="@/assets/img/blacksj.png" class="blacksj" alt="">
            <div class="text_1">点击右上角“<img align="midden" src="@/assets/img/kongjian.png"/>”</div>
            <div class="text_2">选择浏览器中打开完成支付</div>
        </div>
        <div class="linkBtn" @click="locationURL">支付成功后，点击看内容</div>
    </div>
</template>
<script>
export default {
    mounted() {
        if(!this.$util.isWeiXin()){
            window.location.href=this.$route.query.url;
        }
    },
    methods:{
        locationURL(){
         
                this.$router.replace({path:'/ldetail',query:{orderId: this.$route.query.orderId}});
            
        },
    }
}
</script>
<style >
.rightLoop{ width:3.88rem; height:1.18rem; background:rgba(0,0,0,.35);border-radius:.17rem; position: absolute; top: .2rem; right: .24rem; }
.blacksj{ position: absolute; top: -.2rem; right: .17rem;; width:.4rem; height: .2rem; }
.text_1{ font-size: .32rem; color:#ffffff; text-align: center; line-height: .8rem;}
.text_1 img{ vertical-align: middle; display:inline-block; width:.8rem; height: .44rem;}
.text_2{ font-size:.24rem; text-align: center; line-height: 1; color:#fff; }
.linkBtn{width: 4.2rem; border: 2px solid #d9d9d9; border-radius: .1rem; position: fixed; bottom:1rem; font-size: .32rem; color:#ef3d34; text-align: center; line-height: .98rem; height: .98rem; left: 0; right: 0; margin-left:auto; margin-right: auto;  }


</style>