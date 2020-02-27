<template>
  <div>
    <textarea  class="liaotitle"
          placeholder="请输入标题（标题未付费用户也可见）"
          maxlength="50" v-model="textValue"></textarea>
    <div style="padding:20px;">
      <div class="show">
        <!-- <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div> -->
        <ul>
          <template v-for="(item , index) in imagesHTML">
            <li :key="'img'+index">
              <img
                src="@/assets/img/remove.png"
                :data-remove="index"
                @click="removearr(index)"
                ref="dataremove"
                class="removeimg"
                alt
              />
              <div class="overflowbigimg">
                <img
                  :src="item"
                  class="bigimg"
                  @load="checkImg(item,$event)"
                  preview="1"
                  alt
                />
              </div>
            </li>
          </template>
          <!-- <li>
            <img src="@/assets/img/remove.png" class="removeimg" alt />
            <img src="@/assets/img/ceshi.jpg" class="bigimg" alt />
          </li>-->
          <!-- <li v-if="isupload">
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
          </li>-->
          <li >
            <div class="shizi_div">
              <input
                type="file"
                accept="image/*"
                name="imageFile"
                class="uploadBtn"
                multiple="multiple"
                @focus="sl1=sl2=sl3=false"
                @change="upload($event)"
                id="upload"
              />
            </div>
          </li>
          <div class="clear"></div>
        </ul>
      </div>
      <div style="margin-top:20px;">
        <input type="file" id="upload" accept="image" @change="upload" />
        <label for="upload"></label>
      </div>
    </div>
  </div>
</template> 
<script>
import Exif from "exif-js";
export default {
  data() {
    return {
      headerImage: "",
      imagesHTML:[],
      textValue:"这是该换行的\n这是该换行的\n\n这是该换行的\n"
    };
  },
  mounted() {},
  methods: {
    upload(e) {
      let files = e.target.files || e.dataTransfer.files;
    //   debugger;
      if (!files.length) return;
      for(let key in files){
        this.picValue = files[key];
        this.imgPreview(this.picValue);
      }
     
    },
    imgPreview(file) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = async function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (this.result.length <= 100 * 1024) {
            self.headerImage = this.result;
            self.postImg(data);
          } else {
            img.onload = function() {
              let data = self.compress(img, Orientation);
              self.headerImage = data;
              self.postImg(data);
            };
          }
        };
      }
    },
    postImg(baseImg) {
      //这里写接口
       this.imagesHTML.push(baseImg);
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //  计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      console.log("压缩前：" + initSize);
      console.log("压缩后：" + ndata.length);
      console.log(
        "压缩率：" + ~~((100 * (initSize - ndata.length)) / initSize) + "%"
      );
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    /**
     * 删除图片
     */
    removearr(n) {
      let udimg = this.imagesHTML
        .slice(0, n)
        .concat(this.imagesHTML.slice(n + 1, this.imagesHTML.length));
      this.imagesHTML = udimg;
      let unfile = this.files
        .slice(0, n)
        .concat(this.files.slice(n + 1, this.files.length));
      this.files = unfile;  
      if(!!this.orderId){
        let unresultimg=this.result.images.slice(0, n).concat(this.result.images.slice(n + 1, this.result.images.length));
        this.result.images=unresultimg;
      }
    
      if (this.imagesHTML.length < 3) {
        this.isupload = true;
      }
    },
     checkImg(link, e) {
      let that = this;
      let img = new Image();
      img.src = link
      img.onload = function() {
        if (img.width >= img.height) {
          e.path[0].style.height = "100%";
          e.path[0].style.width = "auto";
          //e.path[0].style.left= "-"+((((fontSize*1.2)/img.height)*img.width)/fontSize-1.2)/2+"rem";
        } else {
          e.path[0].style.height = "auto";
          e.path[0].style.width = "100%";
          //e.path[0].style.top= "-"+((((fontSize*1.2)/img.width)*img.height)/fontSize-1.2)/2+"rem";
        }
      };
      return;
    },
  }
};
</script> 
<style>
* {
  margin: 0;
  padding: 0;
}

.picture {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
ul li {
  width: 1.2rem;
  height: 1.2rem;
  float: left;
  position: relative;
  margin-right: 0.3rem;
  border-radius: 0.06rem;
}
ul li .overflowbigimg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0.06rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
ul li .bigimg {
  position: absolute;
  border-radius: 0.06rem;
  display: inherit;
  width: 100%;
  height: auto;
}
ul li .height100 {
  width: auto;
  height: 100%;
}
ul li img.removeimg {
  position: absolute;
  right: -0.1rem;
  top: -0.1rem;
  width: 0.3rem;
  height: 0.3rem;
  z-index: 111;
}
.shizi_div {
  height: 1.2rem;
  width: 1.2rem;
  background: url(../assets/img/shizi.png) no-repeat center center;
  background-color: #f4f4f4;
  background-size: 0.4rem 0.4rem;
  border-radius: 0.06rem;
}
.liaotitle {
  position: relative;
  height: auto;
  line-height: 0.4rem;
  width: 100%;
  background: #fafafa;
  border: 1px solid #ececec;
  z-index: 200;
  border-radius: 0.1rem;
  outline: 0;
  padding: 0.24rem 0.2rem;
  outline: none;
  resize: none;
  font-size: 0.26rem;
  color: #333333;
  -webkit-user-select: text;
  /* display: -webkit-box;    */
  /* -webkit-box-pack:center;   */
  /* -webkit-box-align:center;    */
  /* -webkit-box-orient: vertical;     */
  word-wrap: break-word;
  word-break: break-all;
  display: inherit;
}
</style>