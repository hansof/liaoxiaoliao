<template>
  <div class="fatie">
<!-- 正在支付loading -->
    <div class="loadpay">
    </div>
    <div class="Tips">
      <marqueeLeft :sendVal="newItems"></marqueeLeft>
    </div>
    <div class="padding024">
      <div class="ticbar">
        <img
          @click="findIntroduce(result)"
          :src="result.avatar"
          class="headimg"
          :onerror="defaultHead"
          alt
        />
        <div class="username">{{result.nickname}} <img src="@/assets/img/bsz.png" v-if="result.valid=='1'" class="bsz" alt="" /> </div>
        <a href="javascript:;" class="gzbtn" @click="follow(0)" v-if="followFlag=='0'">+关注</a>
        <a href="javascript:;" class="gzbtn gzbtn_" @click="follow(1)" v-if="followFlag=='1'">已关注</a>
        <a href="javascript:;" class="linkLiao" @click="locationNowSell">{{result.sellCount}}条料正在售卖></a>
        <div class="clear"></div>
      </div>
      <div class="biaoti" v-if="isHide">{{result.title}}</div>
      <div class="biaotitime" v-if="isHide">{{result.publishTimeDiff}}</div>
    </div>
    <div class="height16"></div>
    <div class="isHide" v-if="!isHide">
      <template
        v-if="result.publisherUserNo == userInfo.wxUser.userNo"
      >您好，此料内容涉嫌违规，系统已关闭，不支持用户继续查看，如有疑问可联系客服。</template>
      <template v-else>您好，此料内容已关闭，暂不支持查看，如有疑问可联系作者</template>
    </div>
    <div class="padding024" v-if="isHide">
      <div class="fontsize32">对阵</div>
      <div
        class="liansai"
      >{{resetTime(result.endSaleTime)}}{{result.teamId}} {{result.league}} {{this.$util.pattern(result.endSaleTime,'MM/dd HH:mm')}}</div>
      <div class="selectCount">
        <div class="duizhen">
          <div v-if="isLq(result.teamId)">
            <div class="home_l">
              <img :src="result.awayLogo||require('@/assets/img/head.png')" class="homelog" alt />
              <div class="home">{{result.awayTeam}}(客)</div>
            </div>
            <div class="vs">VS</div>
            <div class="aw_r">
              <img :src="result.homeLogo||require('@/assets/img/head.png')" class="awlog" alt />
              <div class="aw">{{result.homeTeam}}(主)</div>
            </div>
          </div>
          <!-- 足球， -->
          <div v-if="!isLq(result.teamId)">
            <div class="home_l">
              <img :src="result.homeLogo||require('@/assets/img/head.png')" class="homelog" alt />
              <div class="home">{{result.homeTeam}}</div>
            </div>
            <div class="vs">VS</div>
            <div class="aw_r">
              <img :src="result.awayLogo||require('@/assets/img/head.png')" class="awlog" alt />
              <div class="aw">{{result.awayTeam}}</div>
            </div>
          </div>
          <div class="clear"></div>
          <!-- 付费前隐藏结果 style="display:none;"-->
          <table cellpadding="1" cellspacing="1" id="teamCont" v-if="single">
            <template v-for="(item,index) in result.odds">
              <!-- 竞彩足球 -->
              <tr
                class="wanfa"
                :key="'jczq_'+index"
                :class="'wf'+index"
                v-if="item.playType=='3006'||item.playType=='3010'"
              >
                <td v-if="result.unsupport.indexOf(item.playType) > -1" colspan="4" class>
                  <p>{{item.playType=='3006'?'暂未开盘让球胜平负玩法':'暂未开盘胜平负玩法'}}</p>
                </td>
                <td
                  width="8%"
                  :class="{bgred:(item.playType=='3006')}"
                  v-if="result.unsupport.indexOf(item.playType) <= -1"
                >{{item.odds.handicap || 0 }}</td>
                <td
                  width="31%"
                  :class="{'selected': bindstate(result.betCode,'3006','3_') }"
                  v-if="(item.playType=='3006') && result.unsupport.indexOf(item.playType) <= -1"
                >
                 <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3006','3'),'borDivBlack':JSON.stringify(result.result)!='{}'&& !bindRed(result.result,'3006','3'),'jianzhong':bindRed(result.result,'3006','3')&&bindstate(result.betCode,'3006','3_')}" v-if="bindstate(result.betCode,'3006','3_')|| bindRed(result.result,'3006','3')"></span>
                  <p
                    :class="{'selected': bindstate(result.betCode,'3006','3_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3006','3_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3006','3') }"
                  >让胜&nbsp;{{item.odds['3']}}</p>
                </td>
                <td
                  width="31%"
                  :class="{'selected':bindstate(result.betCode,'3010','3_')}"
                  v-if="(item.playType=='3010') && result.unsupport.indexOf(item.playType) <= -1" >
                 <span class="borDiv" :class="{'borDivBlack':JSON.stringify(result.result)!='{}' && !bindRed(result.result,'3010','3'),'borDivRed':bindRed(result.result,'3010','3'),'jianzhong':bindRed(result.result,'3010','3')&&bindstate(result.betCode,'3010','3_')}" v-if="bindstate(result.betCode,'3010','3_')|| bindRed(result.result,'3010','3')"></span>
                  <p
                    :class="{'selected':bindstate(result.betCode,'3010','3_')&& JSON.stringify(result.result)=='{}','selectedRed':bindRed(result.result,'3010','3'),'selectedBlack':bindstate(result.betCode,'3010','3_') && JSON.stringify(result.result)!='{}'}"
                  >胜&nbsp;{{item.odds['3']}}</p>
                </td>

                <td
                  width="31%"
                  :class="{'selected':bindstate(result.betCode,'3006','1_')}"
                  v-if="(item.playType=='3006') && result.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3006(1_'+item.odds['1']+')'"
                  :wanfaNum="item.playType"
                >
                 <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3006','1'),'borDivBlack':JSON.stringify(result.result)!='{}'&& !bindRed(result.result,'3006','1'),'jianzhong':bindRed(result.result,'3006','1')&&bindstate(result.betCode,'3006','1_')}" v-if="bindstate(result.betCode,'3006','1_')|| bindRed(result.result,'3006','1')"></span>
                  <p
                    :class="{'selected':bindstate(result.betCode,'3006','1_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3006','1_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3006','1')}"
                  >让平&nbsp;{{item.odds['1']}}</p>
                </td>
                <td
                  width="31%"
                  :class="{'selected':bindstate(result.betCode,'3010','1_')}"
                  v-if="(item.playType=='3010') && result.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3010(1_'+item.odds['1']+')'"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3010','1'),'borDivBlack':JSON.stringify(result.result)!='{}'&&!bindRed(result.result,'3010','1'),'jianzhong':bindRed(result.result,'3010','1')&&bindstate(result.betCode,'3010','1_')}" v-if="bindstate(result.betCode,'3010','1_')||bindRed(result.result,'3010','1')"></span>
                  <p
                    :class="{'selected':bindstate(result.betCode,'3010','1_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3010','1_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3010','1')}"
                  >平&nbsp;{{item.odds['1']}}</p>
                </td>

                <td
                  :class="{'selected':bindstate(result.betCode,'3006','0_')}"
                  v-if="(item.playType=='3006') && result.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3006(0_'+item.odds['0']+')'"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3006','0'),'borDivBlack':JSON.stringify(result.result)!='{}'&&!bindRed(result.result,'3006','0'),'jianzhong':bindRed(result.result,'3006','0')&&bindstate(result.betCode,'3006','0_')}" v-if="bindstate(result.betCode,'3006','0_')||bindRed(result.result,'3006','0')"></span>
                  <p
                    :class="{'selected':bindstate(result.betCode,'3006','0_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3006','0_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3006','0')}"
                  >让负&nbsp;{{item.odds['0']}}</p>
                </td>
                <td
                  :class="{'selected':bindstate(result.betCode,'3010','0_')}"
                  v-if="(item.playType=='3010') && result.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3010(0_'+item.odds['0']+')'"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3010','0'),'borDivBlack':JSON.stringify(result.result)!='{}'&&!bindRed(result.result,'3010','0'),'jianzhong':bindRed(result.result,'3010','0')&&bindstate(result.betCode,'3010','0_')}" v-if="bindstate(result.betCode,'3010','0_')||bindRed(result.result,'3010','0')"></span>
                  <p
                    :class="{'selected':bindstate(result.betCode,'3010','0_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3010','0_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3010','0')}"
                  >负&nbsp;{{item.odds['0']}}</p>
                </td>
              </tr>
              <!-- 竞彩篮球 -->
              <tr
                class="wanfa"
                :key="'jclq'+index"
                :class="'wf'+index"
                v-if="item.playType=='3001'||item.playType=='3002'"
                :wanfaNum="item.playType"
              >
                <td v-if="result.unsupport.indexOf(item.playType) > -1" colspan="3">
                  <p>{{item.playType=='3002'?'暂未开盘让分胜负玩法':'暂未开盘胜负玩法'}}</p>
                </td>
                <td
                  width="35%"
                  :class="{'selected':bindstate(result.betCode,'3002','0_')}"
                  v-if="(item.playType=='3002') && result.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3002(0_'+item.odds['0']+')'"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3002','0'),'borDivBlack':JSON.stringify(result.result)!='{}'&& !bindRed(result.result,'3002','0'),'jianzhong':bindRed(result.result,'3002','0')&&bindstate(result.betCode,'3002','0_')}" v-if="bindstate(result.betCode,'3002','0_')||bindRed(result.result,'3002','0')"></span>
                  <p
                    :class="{'selected':bindstate(result.betCode,'3002','0_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3002','0_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3002','0')}"
                  >客胜&nbsp;{{item.odds['0']}}</p>
                </td>
                <td
                  width="35%"
                  :class="{'selected':bindstate(result.betCode,'3001','0_')}"
                  v-if="(item.playType=='3001') && result.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3001(0_'+item.odds['0']+')'"
                  :wanfaNum="item.playType"
                >
                 <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3001','0'),'borDivBlack':JSON.stringify(result.result)!='{}'&&!bindRed(result.result,'3001','0'),'jianzhong':bindRed(result.result,'3001','0')&&bindstate(result.betCode,'3001','0_')}" v-if="bindstate(result.betCode,'3001','0_')||bindRed(result.result,'3001','0')"></span>
                  <p
                     :class="{'selected':bindstate(result.betCode,'3001','0_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3001','0_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3001','0')}"
                  >客胜&nbsp;{{item.odds['0']}}</p>
                </td>
                <td
                  width="30%"
                  v-if="(item.playType=='3001') && result.unsupport.indexOf(item.playType) <= -1"
                >
                  <p style="color:#ACA395">胜负</p>
                </td>
                <td
                  width="30%"
                  v-if="(item.playType=='3002') && result.unsupport.indexOf(item.playType) <= -1"
                >
                  <p style="color:#ACA395">主&nbsp;{{item.odds.handicap}}</p>
                </td>

                <td
                  :class="{'selected':bindstate(result.betCode,'3002','3_')}"
                  v-if="(item.playType=='3002') && result.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3002(3_'+item.odds['3']+')'"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3002','3'),'borDivBlack':JSON.stringify(result.result)!='{}'&&!bindRed(result.result,'3002','3'),'jianzhong':bindRed(result.result,'3002','3')&&bindstate(result.betCode,'3002','3_')}" v-if="bindstate(result.betCode,'3002','3_')||bindRed(result.result,'3002','3')"></span>
                  <p
                    :class="{'selected':bindstate(result.betCode,'3002','3_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3002','3_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3002','3')}"
                  >主胜&nbsp;{{item.odds['3']}}</p>
                </td>
                <td
                  :class="{'selected':bindstate(result.betCode,'3001','3_')}"
                  v-if="(item.playType=='3001') && result.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3001(3_'+item.odds['3']+')'"
                  :wanfaNum="item.playType"
                >
                 <span class="borDiv" :class="{'borDivRed':bindRed(result.result,'3001','3'),'borDivBlack':JSON.stringify(result.result)!='{}'&&!bindRed(result.result,'3001','3'),'jianzhong':bindRed(result.result,'3001','3')&&bindstate(result.betCode,'3001','3_')}" v-if="bindstate(result.betCode,'3001','3_')||bindRed(result.result,'3001','3')"></span>
                  <p
                    :class="{'selected':bindstate(result.betCode,'3001','3_')&& JSON.stringify(result.result)=='{}','selectedBlack':bindstate(result.betCode,'3001','3_') && JSON.stringify(result.result)!='{}','selectedRed':bindRed(result.result,'3001','3')}"
                  >主胜&nbsp;{{item.odds['3']}}</p>
                </td>
              </tr>
            </template>
          </table>
          <!-- <table cellpadding="1" cellspacing="1" >
                    <tr class="wanfa">
                        <td width='8%'>1</td>
                        <td width='31%' class="selected" ><p class="selected">胜&emsp;2.5</p></td>
                        <td width='31%'><p>平&emsp;3.75</p></td>
                        <td ><p>负&emsp;4.77</p></td>
                    </tr>
                    <tr class="wanfa">
                        <td class="bgred">+1</td>
                        <td class="selected"><p class="selected">胜&emsp;2.5</p></td>
                        <td ><p>平&emsp;3.75</p></td>
                        <td ><p>负&emsp;4.77</p></td>
                    </tr>
          </table>-->
        </div>
      </div>
    </div>
    <div class="height16" v-if="isHide"></div>
    <div class="padding024" v-if="isHide">
      <div class="fontsize32">详情 <img src="@/assets/img/bzf.png" class="bzf_png" v-if="result.ifReturn=='1'" alt=""></div>
      <!-- 付费查看内容 style="display:none;" -->
      <div class="detailcont" v-if="single">
        <!-- {{result.content}} -->
        <div v-html="result.content"></div>
        <div class="updataimg">
          <ul>
            <li v-for="(item,index) in result.images" :key="'img'+index">
              <img
                :src="item+'?x-oss-process=image/resize,w_1000/quality,q_50/auto-orient,1'"
                class="bigimg"
                :class="{height100: bigWidth}"
                @load="checkImg(item)"
                preview="3"
                alt
              />
            </li>
            <!-- <li>
                        <img src="@/assets/img/ceshi.jpg" class="bigimg" alt="">
                    </li>
                    <li>
                        <img src="@/assets/img/ceshi.jpg" class="bigimg" alt="">
            </li>-->
            <div class="clear"></div>
          </ul>
        </div>
      </div>
      <!--  -->
      <div class="zhezhao" v-if="!single">
        <!-- <p>{{'共含'+result.contentLength+'文字、'+result.imageSize+'张图片'}}</p> -->
        <p v-if="result.price=='0'">此料免费</p>
        <p v-else-if="result.valid=='1'">套餐内查看</p>
        <p v-else>付费后查看</p>
        <template v-if="result.price != '0'&&result.valid!=1">
        <ul class="payselect" >
          <li :class="{'selected':payNum==1}" @click="paySelect(1)"><img src="@/assets/img/weixin.png" alt=""></li>
          <li :class="{'selected':payNum==2}" v-if="false" @click="paySelect(2)"><img src="@/assets/img/zhifubao.png" alt=""></li>
          <div class="clear"></div>
        </ul>
        </template>
        <a
          href="javascript:;"
          class="subBtn"
          @click="sure(result.matchDate)"
          v-if="result.price&&result.valid!='1'"
        >{{result.price=='0'?'立即查看':(Number(result.price)/100+'元查看')}}</a>
        <a
          href="javascript:;"
          class="subBtn"
          @click="sure(result.matchDate)"
          v-if="result.valid=='1'"
        >立即查看</a>
      </div>
    </div>
    <div class="height16" v-if="isHide && single && result.publisherUserNo != userInfo.wxUser.userNo"></div>
    <div class="padding024" v-if="isHide && single && result.publisherUserNo != userInfo.wxUser.userNo">
      <div class="logocode">
        <img src="@/assets/img/logocode.png"  alt="">
      </div>
    </div>
    <div class="height16" v-if="!!result.appendContent && isHide"></div>
    <div class="padding024" v-if="!!result.appendContent && isHide">
      <div class="fontsize32">
        追加料详情
        <span>最新</span>
        <label>{{this.$util.pattern(result.appendTime,"MM/dd HH:mm")}}</label>
      </div>
      <!-- 付费查看内容 style="display:none;" -->
      <div class="detailcont" v-if="single" v-html="result.appendContent"></div>
      <!-- 追加详情end -->
    </div>
    <a
      href="javascript:;"
      class="addBtn"
      @click="locationURL(result.auditStatus)"
      v-if="result.auditStatus == 1 &&result.publisherUserNo == userInfo.wxUser.userNo && isHide"
    >追加料详情</a>
    <div class="saveCont" v-if="result.publisherUserNo == userInfo.wxUser.userNo && isHide">
      <a
        href="javascript:;"
        :class="{save:result.auditStatus == 1,addBtn:result.auditStatus != 1}"
        @click="saveqrcode"
        v-if="result.publisherUserNo == userInfo.wxUser.userNo && isHide"
      >料二维码</a>
    </div>
    <div class="tousu" v-if="result.publisherUserNo != userInfo.wxUser.userNo && single" @click="locationComplaint">投诉此料</div>
    <div class="height1"></div>
  </div>
</template>
<script>
// @ is an alias to /src
import marqueeLeft from "@/components/marqueeLeft/marqueeLeft";
export default {
  name: "ldetail",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      aliPay:this.$store.getters.getAliPay,
      result: {
        images: [],
        day: "",
        price:0,
        contentLength:0,
        imageSize:0
      },
      single: false, //支付表示  true已经支付，false未支付
      loadPay: false, //true代表微信支付成功
      lastNum:10,
      setTimeoutFlag:"",
      followFlag: 0,
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"',
      bigWidth: false,
      newItems:[
                {name: '料小料', detail: '料小料是一款知识变现工具，内容仅代表发布者个人观点，发布者对内容负有全部责任！'},
                {name: '料小料', detail: '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'},
                {name: '料小料', detail: '料小料是一款知识变现工具，内容仅代表发布者个人观点，发布者对内容负有全部责任！'},
                {name: '料小料', detail: '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'}
            ],
      isHide:true,
      selectArr:[],
      selectArr2:[],
      payNum:1
    };
  },
  watch: {
    "result.images": function(res) {
      this.$previewRefresh(); //upload
    }
  },
  mounted() {
    document.getElementById("buffer").style.display = "none";
    // if (window.history && window.history.pushState) {
    //   window.addEventListener("popstate", this.goBack, false);
    // }
  },
  created() {
    document.body.style.overflow="auto"
    if(!!this.aliPay){
        this.lastTime();
        this.loadPay=true;
     }
    this.detail();
    //this.lastTime();
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("setAliPay", '');
    this.$author("false");
    this.$comfirm("false");
    // if (this.$util.getUrlParam("quit") == "true" && to.name!="mySell") {
    //   WeixinJSBridge.call("closeWindow");
    // }
    next(true);
  },
  //这里我要注释销毁事件，因为按物理返回键的时候，先销毁了，并没有执行goBack，所以加个延时销毁
  // destroyed() {
  //   setTimeout(()=>{
  //     window.removeEventListener("popstate", this.goBack, false);
  //   }, 50)
  // },
  methods: {
    findIntroduce(item) {
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/findIntroduce",
          data: {
            userNo: item.publisherUserNo
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.$author({
              headImg: item.avatar, //头像
              userName: item.nickname, //注意：凯哥这边的接口，昵称字段都是nickname小写的；吴哥那边的昵称字段都是驼峰写法nickName
              content:
                res.data.data == null || res.data.data == ""
                  ? "暂未设置资料内容"
                  : res.data.data, //内容有则展示，无则展示“暂无介绍”
              contentCss:
                res.data.data == null || res.data.data == ""
                  ? { "text-align": "center" }
                  : { "text-align": "left" }, //有内容时，靠左排版；暂无介绍时，居中展示
              followUserNo: item.publisherUserNo, //你所点击的作者的头像
              followStatus: item.follow, //你对此作者的当前关注状态
              followFlag: false
                // item.follow == "" || item.follow == null ? false : true //是否展示关注组件，关注列表、我的粉丝页面，不展示关注组件（因为页面里已经有关注组件了，没必要在弹框里再展示）；对于料详情，若是自己查看自己发的料，则不展示关注组件
            })
              .then(res => {})
              .catch(res => {});
          } else {
          }
        }
      );
    },
    // goBack() {
    //   this.$author("false");
    //   this.$comfirm("false");
    //   if (this.$util.getUrlParam("quit") == "true") {
    //     WeixinJSBridge.call("closeWindow");
    //   } else if(location.href.split("#/")[1] == "myproduct"){
    //     this.$router.replace({ path: "/myproduct" });
    //   } else {
    //     this.$router.replace({ path: "/mySell" });
    //   }
    // },
    isLq(str) {
      return Number(str) > 300;
    },
    checkImg(link) {
      let that = this;
      let img = new Image();
      img.src = link;
      img.onload = function() {
        if (img.width >= img.height) {
          that.bigWidth = true;
        } else {
          that.bigWidth = false;
        }
      };
    },
    detail() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/detail",
          data: {
            userno: wxUser.userNo,
            orderId: this.$route.query.orderId,
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            res.data.value.content= res.data.value.content&&res.data.value.content.replace(/\s/g,'&nbsp;');
            res.data.value.appendContent=res.data.value.appendContent&&res.data.value.appendContent.replace(/\s/g,'&nbsp;');
            this.result = res.data.value;
            this.single = res.data.value.payment == "1";
            this.followFlag = res.data.value.follow;
            if(this.single && this.loadPay){
              clearTimeout(this.setTimeoutFlag);
              this.$comfirm("false");
            }else{
              if(!this.single && this.loadPay && this.lastNum==0){
                this.$store.commit("setAliPay", '');
                this.loadPay=false;
                clearTimeout(this.setTimeoutFlag);
                this.$comfirm("false");
                this.$util.blackTs("支付失败，请稍后重试");
              }
            }
          } else if (res.data.errorCode == "3010") {
            res.data.value.content=res.data.value.content&&res.data.value.content.replace(/\s/g,'&nbsp;');
            res.data.value.appendContent=res.data.value.appendContent&&res.data.value.appendContent.replace(/\s/g,'&nbsp;');
            this.isHide = false;
            this.result = res.data.value;
            this.followFlag = res.data.value.follow;
            document.body.style.background = "#fff";
          }
        }
      );
    },
    //绑定赔率选中状态
    bindstate(code,matchType,str){
      let betCode = code.split('*')[1].split('|');
      let res = false;
      for(let i=0; i <betCode.length; i++){
        if(betCode[i].indexOf(matchType) > -1 && betCode[i].indexOf(str) > -1){
          res=true;
          break;
        }
      }
      return res
    },
    bindRed(obj,matchType,num){
      let res=false;
      if(JSON.stringify(obj)!="{}"){
        res=obj[matchType] && obj[matchType].indexOf(num) > -1
      }
      return res;
    },

    //关注接口
    follow(index) {
      if (index == "1") {
        //关注
        this.$comfirm({
          title: "提示",
          content: "您确定取消关注吗？",
          confirmBtn: "确定",
          cancelBtn: "取消"
        })
          .then(res => {
            this.userFollow(index);
          })
          .catch(res => { });
      } else {
        if(this.userInfo.subscribe != 1){
          this.$subScription()
        }
        //关注
        this.userFollow(index);
      }
    },
    userFollow(index) {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/follow",
          data: {
            userNo: wxUser.userNo,
            expertUserNo: this.result.publisherUserNo,
            state: index
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.followFlag = res.data.message == "关注成功" ? "1" : "0";
          }
        }
      );
    },
    saveqrcode() {
      this.$router.push({
        path: "/qrcode",
        query: { orderId: this.$route.query.orderId }
      });
    },
    resetTime(str) {
      let strDate = str;
      let mydate = new Date(strDate);
      let myddy = mydate.getDay(); //获取存储当前日期
      let weekday = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      return weekday[myddy];
    },
    sure(times) {
     
          if (times < new Date().getTime() && this.result.price != "0") {
            this.$comfirm({
              title: "购买提醒",
              content: "该场比赛官方已截期，请确认是否继续查看。",
              confirmBtn: "继续查看",
              contentCss: { "text-align": "left" },
              cancelBtn: "取消"
            })
              .then(res => {
               this.purchase();  //余额支付
                // this.toPayment(); //微信支付
              })
              .catch(res => {});
          } else {
            this.purchase();  //余额支付
           //     this.toPayment(); //微信支付
          }
     
    },
    // payType(){
    //   if(this.payNum== 1){
    //       if (times < new Date().getTime() && this.result.price != "0") {
    //         this.$comfirm({
    //           title: "购买提醒",
    //           content: "该场比赛官方已截期，请确认是否继续查看。",
    //           confirmBtn: "继续查看",
    //           contentCss: { "text-align": "left" },
    //           cancelBtn: "取消"
    //         }).then(res => {
    //            // this.purchase();  //余额支付
    //             this.toPayment(); //微信支付
    //         }).catch(res => {});
    //       } else {
    //         // this.purchase();  //余额支付
    //             this.toPayment(); //微信支付
    //       }
    //   }else if(this.payNum == 2){

    //   }
    // },
    /** 
     * 支付宝支付
    */
    // aliPay(){
    //   let wxUser = this.userInfo.wxUser;
    //   this.ajaxRequest({
    //     path:"api-server/apih5/payment/aliPay/charge",
    //     data:{
    //         userno: wxUser.userNo,
    //         // amount: this.result.price, //充值金额
    //         amount: 1, //充值金额
    //         openId: this.userInfo.openId,
    //         orderId: this.$route.query.orderId
    //     }
    //   },res=>{
    //     if(res.data.errorCode=='0000'){
    //       this.$router.push({
    //         path: "/aliPay",
    //         query: { url: res.data.value.payUrl}
    //       });
    //     }else{
    //       this.$util.blackTs(res.data.message);
    //     }
    //   });
    // },
    purchase() {
      let payType="";
      this.lastNum=10;
      if(this.payNum== 1){
        payType='wechatPay'
      }else if(this.payNum == 2){
        payType='aliPay'
      }else if(this.payNum==0 && this.result.price!='0' && this.result.valid!=1){
        this.$util.blackTs('请选择支付方式');
        return;
      }
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/purchase",
          data: {
            userno: wxUser.userNo,
            orderId: this.$route.query.orderId,
            payType:payType,
            openId:this.userInfo.openId,
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            debugger
            // if (this.result.price != 0) {
            //   this.$util.blackTs("支付成功");
            // }
            if(res.data.value.payType=='wechatPay'){
              this.payObj = res.data.value;
              this.onBridgeReady();
            }else if(res.data.value.payType=='aliPay'){
              this.$store.commit("setAliPay", 'true');
              this.$router.push({
              path: "/aliPay",
              query: { url: res.data.value.payUrl,orderId:this.$route.query.orderId
              }});
            }

          } else if (res.data.errorCode == "2001") {
            //余额不足发起微信支付
            //this.toPayment();
          } else if (res.data.errorCode == "3012") {
            //已经付款
            this.detail();
          } else if (res.data.errorCode == "3010") {
            // 此料被驳回涉及违法违规信息
            this.$util.blackTs("该料已关闭，暂不支持查看！");
          }else{
            this.$util.blackTs(res.data.message);
          }
        }
      );
    },
    locationURL(status) {
      if (status == 2) {
        this.$util.blackTs("只能追加一次");
      } else {
        this.$router.push({
          path: "/addContent",
          query: { orderId: this.$route.query.orderId }
        });
      }
    },
    // toPayment() {
    //   let wxUser = this.userInfo.wxUser;
    //   this.ajaxRequest(
    //     {
    //       path: "api-server/apih5/payment/wechatPay/charge",
    //       data: {
    //         userno: wxUser.userNo,
    //         amount: this.result.price, //充值金额
    //         openId: this.userInfo.openId,
    //         orderId: this.$route.query.orderId
    //       }
    //     },
    //     res => {
    //       if (res.data.errorCode == "0000") {
    //         this.payObj = res.data.value;
    //         this.onBridgeReady();
    //       } else {
    //         that.$comfirm({
    //           title: "支付失败",
    //           content: res.data.message,
    //           confirmBtn: "知道了"
    //         });
    //       }
    //     }
    //   );
    // },
    //发起支付
    onBridgeReady() {
      let that = this;
      WeixinJSBridge.invoke("getBrandWCPayRequest", this.payObj, function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          //that.$util.blackTs("支付成功");
          that.lastTime();
          that.loadPay=true;
          // that.single = true;
        } else {
          that.$comfirm({
            title: "支付失败",
            content: "支付失败，请稍后重试",
            confirmBtn: "知道了"
          });
          that.single = false;
        }
      });
    },
    paySelect(index){
        this.payNum=index;
    },
    locationComplaint() {
      this.$router.replace({ path: "/complaint",query:{orderId:this.$route.query.orderId} });
    },
    locationNowSell() {
      this.$router.push({ path: "/nowSell",query:{userno:this.result.publisherUserNo,nickname:this.result.nickname} });
    },
    /** 
     * 正在支付倒计时逻辑，总共4个方法lastTime，loadPaytab，loadPayFN，loadPayFN_A
    */
    lastTime(){
      this.setTimeoutFlag=setTimeout(() => {
        this.loadPaytab();
        if(this.lastNum==0){
            clearTimeout(this.setTimeoutFlag);
            this.detail();
        }else{
          if(this.lastNum % 3==0){
             this.detail();
          }
          this.lastNum=--this.lastNum;
        }
      }, 1000);
    },
    loadPaytab(){
          this.lastTime();
          this.loadPayFN();
    },
    loadPayFN(){
      this.$comfirm({
        content: "正在支付中("+this.lastNum+")...",
        confirmBtn: "请稍后",
      }).then(res => {
        this.loadPayFN_A();
      });
    },
    loadPayFN_A(){
          this.$comfirm({
            content: "正在支付中("+this.lastNum+")...",
            confirmBtn: "请稍后",
          }).then(res => {
            this.loadPayFN();
          });
    }
  },
  components: {
    marqueeLeft
  }
};
</script>

<style scoped>
.Tips {
  font-size: 0.28rem;
  color: #ef3d34;
  height: auto;
  background-color: #ffefee;
  text-align: justify;
  padding: 0.1rem 0;
}
.ticbar {
  padding-top: 0.4rem;
  position: relative;
}
.username {
  float: left;
  height: 0.8rem;
  font-size: 0.3rem;
  color: #333333;
  line-height: 0.8rem;
  padding-left: 0.2rem;
  display: flex;
  align-items: center;
}
.headimg {
  width: 0.8rem;
  height: 0.8rem;
  float: left;
  border-radius: 0.5rem;
}
.addBtn {
  width: 4.2rem;
  height: 0.98rem;
  text-align: center;
  color: #fff;
  font-size: 0.32rem;
  line-height: 0.98rem;
  background: #ef3d34;
  margin: auto;
  margin-top: 0.4rem;
  border-radius: 0.1rem;
  display: block;
}
.addBtn.setGray {
  background: #ececec;
  color: #8d8d8d;
}
.gzbtn {
  position: absolute;
  color: #fff;
  font-size: 0.26rem;
  width: 1.1rem;
  height: 0.4rem;
  text-align: center;
  background: #ef3d34;
  border-radius: 0.4rem;
  top: 0;
  bottom: 0;
  margin: auto 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: Center;
}
.gzbtn_ {
  background: #ececec;
  color: #888888;
}
.biaoti {
  font-size: 0.28rem;
  color: #333333;
  line-height: 0.4rem;
  padding-top: 0.25rem;
  position: relative;
  white-space: normal;
  word-break: break-all;
}
.biaotitime {
  font-size: 0.22rem;
  text-align: right;
  color: #b1b1b1;
  margin-top: 0.1rem;
}
.liansai {
  font-size: 0.24rem;
  color: #888888;
  position: relative;
  top: -0.07rem;
}
.detailcont {
  font-size: 0.3rem;
  color: #333333;
  /* text-indent: 0.6rem; */
  text-align: justify;
  word-wrap: break-word;
  word-break: normal;
}

.fontsize32 {
  font-size: 0.32rem;
  height: 0.88rem;
  line-height: 0.88rem;
  padding-left: 0.16rem;
  position: relative;
  color: #333333;
  position: relative;
  font-weight: bold;
}
.padding024 {
  padding: 0 0.24rem 0.3rem 0.24rem;
  background: #fff;
}
.fontsize32::after {
  position: absolute;
  content: "";
  height: 0.2rem;
  background: #ef3d34;
  left: 0;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  width: 0.06rem;
}
.fontsize32 span {
  background: #fff0f0;
  position: absolute;
  width: 0.5rem;
  font-size: 0.2rem;
  border: 1px solid #ff9191;
  color: #f55a5a;
  border-radius: 0.04rem;
  height: 0.26rem;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  left: 1.85rem;
  display: flex;
  justify-content: center;
  align-items: Center;
}
.fontsize32 label {
  float: right;
  font-weight: normal;
  color: #888888;
  font-size: 0.26rem;
}
.artTitle_c {
  height: auto;
  position: relative;
  width: 100%;
}
.artTitle {
  position: relative;
  height: auto;
  width: 100%;
  background: #f7f7f7;
  border: none;
  z-index: 200;
  border-radius: 0.1rem;
  outline: 0;
  -webkit-user-modify: read-write-plaintext-only;
  font-size: 0.28rem;
  padding: 0.3rem;
  line-height: 0.37rem;
  color: #333333;
}
.artTitle_c::after {
  content: "";
  position: absolute;
  border-radius: 0.1rem;
  background: #d9d9d9;
  left: -1px;
  right: -1px;
  top: -1px;
  bottom: -1px;
  z-index: 100;
}
[contentEditable="true"]:empty:not(:focus):before {
  content: attr(data-text);
  color: #bebebe;
}
.height16 {
  height: 0.16rem;
  background: #f5f5f5;
  width: 100%;
}

.sanjiao {
  position: absolute;
  width: 0.3rem;
  height: 0.19rem;
  top: -0.19rem;
  right: 0.3rem;
  z-index: 300;
}
.min-height {
  min-height: 2rem;
}
.updataimg {
  padding-top: 0.2rem;
  margin-bottom: 0.2rem;
}
.updataimg ul {
  width: 100%;
}
.updataimg ul li {
  position: relative;
  margin-left: 0.1rem;
  margin-right: 0.1rem;
  border-radius: 0.06rem;
  /* flex-grow: 1; */
  /* flex-shrink: 1; */
  /* -webkit-flex-shrink: 1; */
  /* flex-basis: 0; */
  float: left;
  width: 2.14rem;
  height: 2.14rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.updataimg ul li img {
  border-radius: 0.06rem;
  display: block;
  width: 100%;
  height: auto;
}

.updataimg ul li img.height100 {
  width: auto;
  height: 100%;
}

.shizi_div {
  height: 1.2rem;
  width: 1.2rem;
  background: url(../assets/img/shizi.png) no-repeat center center;
  background-color: #f4f4f4;
  background-size: 0.4rem 0.4rem;
  border-radius: 0.06rem;
}
.duizhen {
  width: 100%;
  padding-top: 0.12rem;
}
.duizhen table {
  width: 100%;
  font-size: 0.28rem;
  /* background: #ececec; */
  margin-top: 0.3rem;
  border: none;
}
.duizhen table tr:nth-child(1) {
  position: relative;
}
.duizhen table tr:nth-child(2) {
  position: relative;
}
.leftText,
.rightText {
  display: inline-block;
  flex-grow: 1; /* 自动补充满行*/
  flex-shrink: 1;
  -webkit-flex-shrink: 1;
  flex-basis: 0; /*每个元素的宽度*/
}
.rightText {
  text-align: left;
}
.leftText {
  text-align: right;
}
.duizhen table tr td {
  position: relative;
  text-align: center;
  background: #ececec;
}
.duizhen table tr {
  position: relative;
}
.duizhen table tr td p {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  height: 0.78rem;
  border: 1px solid #ececec;
}
.duizhen table tr td p {
  background: #f9fbff;
  color: #644f31;
  text-align: center;
  padding: 0.19rem 0;
  position: relative;
  z-index: 100;
  height: .78rem;
  width: auto;
  /* margin: 1px; */
   /* border: 1px solid #ececec;  */
   
}
.homelog {
  width: 0.64rem;
  height: 0.64rem;
  border-radius: 0.6rem;
  float: right;
  margin-left: 0.2rem;
}
.home {
  float: right;
  width: 68%;
  text-align: right;
  font-size: 0.28rem;
  height: 0.64rem;
  line-height: 0.64rem;
  overflow: hidden;
  text-overflow: ellipsis;
  /* display: -webkit-box; */
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-weight: bold;
}
.home_l {
  width: 39%;
  float: left;
}
.vs {
  float: left;
  width: 22%;
  text-align: center;
  color: #888888;
  font-size: 0.24rem;
  height: 0.64rem;
  line-height: 0.64rem;
}
.aw {
  float: left;
  text-align: left;
  font-size: 0.28rem;
  height: 0.64rem;
  line-height: 0.64rem;
  width: 68%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-weight: bold;
}
.awlog {
  width: 0.64rem;
  height: 0.64rem;
  border-radius: 0.6rem;
  float: left;
  margin-right: 0.2rem;
}
.aw_r {
  width: 39%;
  float: left;
}
.duizhen table tr td.bgred {
  background: #f35e56;
  color: #fff;
}
.duizhen table tr td .selected {
  color: #5694F3;
  position: relative;
  background: #f9fbff;
  z-index: 300;
}
.duizhen table tr td  p.selected{
  background: url(../assets/img/lanjian.png) no-repeat right top;
  background-size: .4rem .4rem;
  background-color: #f9fbff;
}
.duizhen table tr td  p.selectedBlack{
  background: url(../assets/img/weizhong.png) no-repeat right top;
  background-size: .4rem .4rem;
    background-color: #f9fbff;
}
.duizhen table tr td .borDiv{
position: absolute;
height: 100%;
width: 100%;
top: 0px;
left: 0;
border: 1px solid #5694F3;
z-index: 320;
background: url(../assets/img/lanjian.png) no-repeat right top;
background-size:.4rem .4rem;
/* background-color: #f9fbff; */
}

.duizhen table tr td .borDiv_bottom{
position: absolute;
height: 100%;
width: 100%;
top: 0px;
left: 0;
border: 1px solid #ef3d34;
z-index: 120;
}

.duizhen table tr td .borDivBlack{
position: absolute;
height: 100%;
width: 100%;
top: 0px;
left: 0;
border: none;
z-index: 120;
background: url(../assets/img/weizhong.png) no-repeat right top;
background-size:.4rem .4rem;
/* background-color: #f9fbff; */
}



.duizhen table tr td  p.selectedRed{
  /* background: url(../assets/img/jianzhong.png) no-repeat right top;
  background-size: .4rem .4rem; */
  color: #ef3d34;
  background-color: #f9fbff;
}
.bsz{ width: .78rem; height: .30rem; margin-left:.1rem; }

.duizhen table tr td .borDivRed{
position: absolute;
height: 100%;
width: 100%;
top: 0px;
left: 0;
border: 1px solid #ef3d34;
z-index: 120;
background:none;
/* background: url(../assets/img/jianzhong.png) no-repeat right top;
background-size:.4rem .4rem; */
/* background-color: #f9fbff; */
}
.duizhen table tr td .borderRed{
position: absolute;
height: 100%;
width: 100%;
top: 0px;
left: 0;
border: 1px solid #ef3d34;
z-index: 120;
background: noen;
}
.duizhen table tr td .jianzhong{
  background: url(../assets/img/jianzhong.png) no-repeat right top;
  background-size:.4rem .4rem;
}
/* 
.duizhen table tr td.selected::after {
  content: "";
  position: absolute;
  background: #ef3d34;
  left: -1px;
  right: -1px;
  top: -1px;
  bottom: -1px;
  z-index: 100;
} */
.zhezhao {
  height: 100%;
  width: 100%;
  position: relative;
}
.zhezhao p {
  font-size: 0.32rem;
  color: #ef3d34;
  text-align: center;
  margin-top: 0.8rem;
}
.zhezhao a {
  width: 4.2rem;
  height: 0.98rem;
  color: #fff;
  font-size: 0.32rem;
  text-align: center;
  line-height: 0.98rem;
  border-radius: 0.2rem;
  background: #ef3d34;
  margin: 0.5rem auto 0.7rem auto;
  display: block;
}
.height1{height: .1rem;}
.saveCont {
  width: 4.2rem;
  text-align: center;
  color: #fff;
  margin: 0.35rem auto;
  padding-bottom: 0.4rem;
}
.save {
  font-size: 0.32rem;
  color: #f46d66;
  display: block;
  width: 1.7rem;
  height: 0.4rem;
  margin: 0 auto;
  text-align: center;
}
.isHide {
  font-size: 0.32rem;
  color: #333333;
  text-align: center;
  background: #fff;
  padding: 1.8rem 0.7rem;
}
.payselect{ width: 100%; margin: 0.5rem 0 0 0; display: flex;
align-items: center;justify-content: center;}
.payselect li{
  width: 45%;
  float: left;
  height: 1rem;
  border-radius: .08rem;
  border: 1px solid #ececec;
  padding: 0.17rem 0.3rem;
}
.payselect li:nth-child(2){
  float: right;
}
.payselect li:nth-child(1) img{
  width: 2.10rem; 
}
.payselect li:nth-child(2) img{
  width: 2.42rem; 
}
.payselect li.selected{
  border:1px solid #ef3d34;
  background:url("../assets/img/jiaoxuan.png") no-repeat right bottom;
  background-size: .34rem .34rem;
}
.tousu{ width:2.78rem; height: .78rem; font-size: .32rem; color:#888888; text-align: center; line-height: .78rem; margin: .5rem auto; border-radius:.2rem; border: 2px solid #cccccc; }
.logocode{ width: 5.85rem;  margin: 0 auto; padding-top: .4rem; padding-bottom: .16rem;}
.logocode img{ width: 5.85rem; height: 1.85rem;}
.linkLiao{ font-size:.24rem; color: #5694f3; position: absolute;right:0; bottom: 0rem; line-height: 1; }
.loadpay{ position: fixed; z-index: 800; top: 0; bottom: 0; left: 0; right: 0; height: 100%; width: 100%; background: rgba(0, 0, 0, 0.2); display: none;}
.box{
	display:block;
	overflow: hidden;
	float:left;
	position:absolute;
	width:1.3rem;
	height:1.3rem;
	border:1px dotted #fff;
   top: 0;
   bottom: 0;
   margin: auto;
   right: 0;
   left: 0;
   background: rgba(0, 0, 0, 0.5)
}

.dot2 div{
	position:absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 16px;
	height: 16px;
	margin: auto;
	border-radius: 10px;
	background: #fff;
	opacity: 0.2;
	animation: dot2 1s linear infinite;
}

@keyframes dot2 {
	0% {
		opacity: 0.2;
	}
	25% {
		opacity: 1;
	}
	50% {
		opacity: 0.2;
	}
	100% {
		opacity: 0.2;
	}
}

.dot2 div:nth-child(1) {
	transform: rotate(0) translateX(30px);
	animation-delay: 0s;
}

.dot2 div:nth-child(2) {
	transform: rotate(45deg) translateX(30px);
	animation-delay: 0.1s;
}

.dot2 div:nth-child(3) {
	transform: rotate(90deg) translateX(30px);
	animation-delay: 0.2s;
}

.dot2 div:nth-child(4) {
	transform: rotate(135deg) translateX(30px);
	animation-delay: 0.3s;
}

.dot2 div:nth-child(5) {
	transform: rotate(180deg) translateX(30px);
	animation-delay: 0.4s;
}

.dot2 div:nth-child(6) {
	transform: rotate(225deg) translateX(30px);
	animation-delay: 0.5s;
}

.dot2 div:nth-child(7) {
	transform: rotate(270deg) translateX(30px);
	animation-delay: 0.6s;
}

.dot2 div:nth-child(8) {
	transform: rotate(315deg) translateX(30px);
	animation-delay: 0.7s;
}
.bzf_png{ width: .98rem; height: .28rem; display: inline-block; vertical-align: middle;}

</style>