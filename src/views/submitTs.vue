<template>
  <div class="submitTs">
    <div class="typeText">投诉描述（必填）</div>
    <textarea name placeholder="请输入投诉详情" class="contentText" @input="numcont" maxlength="200" id="content" ref="content" cols="30" rows="10"></textarea>
    <div class="numberCont" >{{numberCont}}/200</div>
    <div class="clear"></div>
    <div class="typeText">
      证据截图（选填）
      <span>{{images.length}}/4</span>
    </div>
    <canvas id="myCanvas"></canvas>
    <ul class="imgCont">
      <template v-for="(item , index) in images">
        <li :key="'img'+index">
          <img
            src="../assets/img/remove.png"
            :data-remove="index"
            @click="removearr(index)"
            ref="dataremove"
            class="removeimg"
            alt
          />
          <div class="overflowbigimg">
            <img
              :src="'data:image/jpeg;base64,'+item"
              class="bigimg"
              @load="checkImg('data:image/jpeg;base64,'+item,$event)"
              preview="1"
              alt
            />
          </div>
        </li>
      </template>
      <li v-if="isupload">
        <div class="shizi_div">
          <input
            type="file"
            accept="image/*"
            name="imageFile"
            class="uploadBtn"
            @focus="sl1=sl2=sl3=false"
            @change="upload()"
          />
        </div>
      </li>
      <div class="clear"></div>
    </ul>
    <div class="typeText">联系方式（选填）</div>
    <input type="text" placeholder="请输入手机号或者微信号，方便及时联系到您"  maxlength="20"  ref="myPhone" class="myPhone" />
    <div class="clear"></div>
    <a href="javascript:;" class="submitBtn" @click="submiData">提交</a>
  </div>
</template>
<script>
export default {
  name: "submitTs",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      images: [],
      isupload: true,
      numberCont:0,
      files:[]
    };
  },
  methods: {
    checkImg(link, e) {
      let that = this;
      let img = new Image();
      let fontSize = Number(
        document.documentElement.style.fontSize.replace("px", "")
      );
      img.src = link;
      img.onload = function() {
        if (img.width >= img.height) {
          e.path[0].style.height = "100%";
          e.path[0].style.width = "auto";
        } else {
          e.path[0].style.height = "auto";
          e.path[0].style.width = "100%";
        }
      };
      return;
    },
    /**
     * 删除图片
     */
    removearr(n) {
      let udimg = this.images
        .slice(0, n)
        .concat(this.images.slice(n + 1, this.images.length));
      this.images = udimg;
      let unfile= this.files.slice(0, n).concat(this.files.slice(n + 1, this.files.length));
      this.files = unfile;
      if (this.images.length < 4) {
        this.isupload = true;
      }
    },
    submiData() {
      console.log(1);
      if(this.$refs.content.value.length < 5 || this.$refs.content.value.length>200 ){
        this.$util.blackTs('投诉详情须大于5，小于200字');
        return
      }
      let paramJson = {
        path: "api-server/form/resource/feedback/submit",
          data: {
            userNo: this.userInfo.wxUser.userNo,
            content:this.$refs.content.value,
            category: this.$route.query.typeId,
            images:this.files.length && this.files,
            relation: this.$refs.myPhone.value,
            contentId:this.$route.query.orderId
          }
        };
      this.formDataRequest(paramJson, res => {
         console.log(2);
        if (res.data.errorCode == "0000") {
          this.$router.replace({path:"/success",query:{orderId:this.$route.query.orderId}});
        }
      });

     
    },
    //图片压缩上传
    upload() {
      this.sl1 = false;
      this.sl3 = false;
      this.sl2 = false;
      let file = document.querySelector("input[type=file]").files[0]; // 获取选择的文件，这里是图片类型
      let reader = new FileReader();
      reader.readAsDataURL(file); //读取文件并将文件以URL的形式保存在resulr属性中 base64格式
      reader.onload = e => {
        // 文件读取完成时触发
        let result = e.target.result; // base64格式图片地址
        var image = new Image();
        image.src = result; // 设置image的地址为base64的地址
        image.onload = () => {
          var canvas = document.querySelector("#myCanvas");
          var context = canvas.getContext("2d");
          canvas.width = image.width; // 设置canvas的画布宽度为图片宽度
          canvas.height = image.height;
          context.drawImage(image, 0, 0, image.width, image.height); // 在canvas上绘制图片
          let dataUrl = canvas.toDataURL("image/jpeg", 0.1); // 0.70为压缩比，可根据需要设置，设置过小会影响图片质量

          // dataUrl 为压缩后的图片资源，可将其上传到服务器
          this.images.push(dataUrl.split(",")[1]);
          this.files.push(document.querySelector("input[type=file]").files[0]);
          //this.images.push(this.convertBase64UrlToBlob(dataUrl))
          //console.log(this.convertBase64UrlToBlob(dataUrl));
          //this.bs.push(this.convertBase64UrlToBlob(dataUrl));
          //this.blobToDataURL(this.bs[0])
          if (this.images.length >= 4) {
            this.isupload = false;
          }
          this.$previewRefresh(); //upload后, 刷新preview插件
        };
      };
    },
    numcont(e){
      this.numberCont=e.target.value.length;
      if(e.target.value.length > 200){
        e.target.value=e.target.value.substr(0,200);
      }

    }
  }
};
</script>

<style scoped>
#myCanvas {
  display: none;
}
input {
  -webkit-appearance: none;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #bebebe;
}
.typeText {
  height: 0.76rem;
  font-size: 0.26rem;
  color: #888888;
  text-indent: 0.24rem;
  line-height: 1rem;
  width: 100%;
  overflow: hidden;
}
.contentText {
  width: 100%;
  float: left;
  height: 1.5rem;
  border: none;
  font-size: 0.28rem;
  color: #333333;
  padding: 0.25rem 0.24rem;
  line-height: 0.35rem;
}
.numberCont {
  font-size: 0.26rem;
  padding: 0 0.2rem;
  background: #fff;
  color: #bebebe;
  float: left;
  width: 100%;
  text-align: right;
  line-height: 0.8rem;
  height: 0.8rem;
}
.imgCont {
  background: #fff;
  width: 100%;
  padding: 0.3rem 0;
  /* padding-left: 0.24rem; */

}
.imgCont li {
  width: 1.42rem;
  height: 1.42rem;
  float: left;
  position: relative;
  margin: 0 .225rem;
  border-radius: 0.06rem;
}
.imgCont li img.removeimg {
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
  width: 0.3rem;
  height: 0.3rem;
  z-index: 111;
}
.shizi_div {
  height: 1.42rem;
  width: 1.42rem;
  background: url(../assets/img/shizi.png) no-repeat center center;
  background-color: #f4f4f4;
  background-size: 0.6rem 0.6rem;
  border-radius: 0.06rem;
}
.uploadBtn {
  width: 100%;
  height: 100%;
  opacity: 0;
  float: left;
}
.myPhone {
  width: 100%;
  font-size: 0.28rem;
  text-indent: 0.24rem;
  height: 0.9rem;
  color: #333333;
  float: left;
}
.submitBtn {
  width: 80%;
  height: 0.94rem;
  display: block;
  font-size: 0.36rem;
  color: #fff;
  text-align: center;
  background: #1aad19;
  line-height: 0.94rem;
  border-radius: 0.1rem;
  margin: 0.6rem auto;
}
.typeText span {
  float: right;
  height: auto;
  margin-right: 0.24rem;
  color: #bebebe;
}
.imgCont li .overflowbigimg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0.06rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>