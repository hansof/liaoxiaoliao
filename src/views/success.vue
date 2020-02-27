<template>
    <div class="success">
        <img src="../assets/img/res.png" alt="">
        <div class="tousutype">投诉已提交</div>
        <div class="tousuinfo">我们会尽快核实投诉，并通过微信公众号通知您的审核结果，感谢您的支持。</div>
        <a href="javascript:;"  @click="closewindowsuccess" class="closeBtn">关闭</a>
    </div>
</template>
<script>
export default {
    name:"success",
    methods:{
        closewindowsuccess(){
            if(this.$route.query.orderId){
                  this.$router.replace({path:"/ldetail",query:{orderId:this.$route.query.orderId}});
            }else{
                    WeixinJSBridge.call('closeWindow');
            }
        }
    }
}
</script>
<style  scoped>
.success img{ width: 1.86rem; height: 1.86rem; margin: .9rem auto .6rem auto; display:inherit;}
.tousutype{ font-size:.4rem; color:#000000; margin-bottom: .45rem; text-align:center; line-height: 1; }
.closeBtn{ width:80%; height:0.94rem; display: block; font-size: .36rem; color:#fff; text-align: center; background:#1aad19; line-height: .94rem; border-radius: .1rem; margin: .6rem auto;    }
.tousuinfo{ font-size: .28rem; color:#888888; line-height: .4rem; padding: 0 .74rem;}
</style>