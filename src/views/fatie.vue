<template>
  <div class="fatie"  v-if="liaocontentF">
    <div class="disabled" v-if="!isSubcont"></div>
    <div class="Tips"> 
       <marqueeLeft :sendVal='newItems'></marqueeLeft >
       </div>
    <div class="padding024">
      <div class="fontsize32">标题</div>
      <div class="artTitle_c">
        <textarea
          id="liaotitle"
          ref="liaotitle"
          class="liaotitle"
          placeholder="请输入标题（标题未付费用户也可见）"
          maxlength="50"
          @focus="sl1=false;sl2=false;sl3=false"
         v-model="result.title"
         @input="maxlength($event)"
        ></textarea>
      </div>
    </div>
    <div class="height16"></div>
    <div class="padding024">
      <div class="fontsize32">对阵</div>
      <div class="selectCount">
        <ul>
          <li class="li_b">
            <p
              @click="sl1=!sl1;sl2=false;sl3=false"
              :data-val="sl1_val"
              ref="lotteryType"
            >{{resetStr(sl1_val)}}</p>
            <ul v-show="sl1">
              <img class="sanjiao" src="@/assets/img/sanjiao.png" alt />
              <template v-for="(value, key, index) in itemlist">
                <li
                  class="retinabb"
                  @click="selectFn({val:key,index:'1'})"
                  :key="index+'1'+key"
                  v-if=" key !='checked'"
                >{{resetStr(key)}}</li>
              </template>
            </ul>
          </li>
          <li class="li_b">
            <p @click="sl2=!sl2;sl1=false;sl3=false" :data-time="sl2_val">
              <label>{{resetTime(sl2_val)}}</label>
            </p>
            <ul v-show="sl2">
              <img class="sanjiao" src="@/assets/img/sanjiao.png" alt />
              <template v-for="(value,key) in itemlist[sl1_val].dateSelect">
                <li
                  class="retinabb"
                  @click="selectFn({val:value,index:'2'})"
                  ref="datatime"
                  :key="'time'+key"
                >{{resetTime(value)}}</li>
              </template>
            </ul>
          </li>
          <li class="li_b">
            <p @click="sl3=!sl3;sl1=false;sl2=false" :data-matchnum="sl3_val" ref="datamatchnum">
              <label for>{{sl3_val_text}}</label>
            </p>
            <div class="scrollDiv" v-show="sl3 && sl2_val!='请选择'">
              <img class="sanjiao" src="@/assets/img/sanjiao.png" alt />
              <ul class="width369">
                <template v-for="item in itemlist[sl1_val].result">
                  <li
                    @click="selectFn({val:item,index:'3'});sl3_val_text=item.teamId+' '+item.homeTeam+'vs'+item.awayTeam"
                    :key="item.matchNum"
                    v-if="item.day==resetTimeNum && sl1_val=='jczq' "
                  >{{item.teamId+" "+item.homeTeam+"vs"+item.awayTeam}}</li>
                  <li
                    @click="selectFn({val:item,index:'3'});sl3_val_text=item.teamId+' '+item.awayTeam+'vs'+item.homeTeam"
                    :key="item.matchNum"
                    v-if="item.day==resetTimeNum && sl1_val=='jclq' "
                  >{{item.teamId+" "+item.awayTeam+"vs"+item.homeTeam}}</li>
                </template>
                <div class="clear"></div>
                <!-- <li class="retinabb" @click="selectFn({val:'001029',index:'3'})">001030</li>
                <li class="retinabb" @click="selectFn({val:'001031',index:'3'})">001031</li>-->
              </ul>
            </div>
          </li>
          <div class="clear"></div>
        </ul>
        <div class="duizhen" v-if="sl3_val!=''">
          <div
            v-if="sl1_val=='jclq'"
            ref="jclqObj"
            :data-time="matchcont.weekday+matchcont.teamId"
            :data-duizhen="matchcont.awayTeam+' VS '+matchcont.homeTeam"
          >
            <div class="home">{{matchcont.awayTeam}}(客)</div>
            <div class="vs">VS</div>
            <div class="aw">{{matchcont.homeTeam}}(主)</div>
          </div>
          <div
            v-if="sl1_val=='jczq'"
            ref="jczqObj"
            :data-time="matchcont.weekday+matchcont.teamId"
            :data-duizhen="matchcont.homeTeam+' VS '+matchcont.awayTeam"
          >
            <div class="home">{{matchcont.homeTeam}}</div>
            <div class="vs">VS</div>
            <div class="aw">{{matchcont.awayTeam}}</div>
          </div>
          <table id="teamCont">
            <template v-for="(item,index) in matchcont.odds">
              <!-- 竞彩足球 -->
              <tr
                class="wanfa"
                :key="'jclq_'+index"
                :class="'wf'+index"
                v-if="(item.playType=='3006'||item.playType=='3010')"
                :wanfaNum="item.playType"
                :ref="'wf'+index"
              >
                <td v-if="matchcont.unsupport.indexOf(item.playType) > -1" colspan="4" class>
                  <p>{{item.playType=='3006'?'暂未开盘让球胜平负玩法':'暂未开盘胜平负玩法'}}</p>
                </td>
                <td
                  width="8%"
                  :class="{bgred:(item.playType=='3006')}"
                  v-if="matchcont.unsupport.indexOf(item.playType) <= -1"
                >{{item.odds.handicap || 0 }}</td>
                <td
                  width="31%"
                  @click="oddsFn({index:'3',code:item.playType,handicap:matchcont.handicap,odds:matchcont.odds})"
                  :class="{'selected':selectArr2.includes('3')}"
                  v-if="(item.playType=='3006') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3006*3_'+item.odds['3']"
                  :wanfaNum="item.playType"
                >
                 <span class="borDiv" v-if="selectArr2.includes('3')"></span>
                  <p :class="{'selected':selectArr2.includes('3')}">
                  
                    <span class="leftText">让胜</span>
                    <span class="rightText">&ensp;{{item.odds['3']}}</span>
                  </p>
                </td>
                <td
                  width="31%"
                  @click="oddsFn({index:'3',code:item.playType,handicap:matchcont.handicap,odds:matchcont.odds})"
                  :class="{'selected':selectArr.includes('3')}"
                  v-if="(item.playType=='3010') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3010*3_'+item.odds['3']"
                  :wanfaNum="item.playType"
                >
                 <span class="borDiv" v-if="selectArr.includes('3')"></span>
                  <p :class="{'selected':selectArr.includes('3')}">
                    <span class="leftText">胜&ensp;</span>
                    <span class="rightText">&ensp;{{item.odds['3']}}</span>
                  </p>
                </td>

                <td
                  width="31%"
                  @click="oddsFn({index:'1',code:item.playType,handicap:matchcont.handicap,odds:matchcont.odds})"
                  :class="{'selected':selectArr2.includes('1')}"
                  v-if="(item.playType=='3006') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3006*1_'+item.odds['1']"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" v-if="selectArr2.includes('1')"></span>
                  <p :class="{'selected':selectArr2.includes('1')}">
                    <span class="leftText">让平</span>
                    <span class="rightText">&ensp;{{item.odds['1']}}</span>
                  </p>
                </td>
                <td
                  width="31%"
                  @click="oddsFn({index:'1',code:item.playType,handicap:matchcont.handicap,odds:matchcont.odds})"
                  :class="{'selected':selectArr.includes('1')}"
                  v-if="(item.playType=='3010') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3010*1_'+item.odds['1']"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" v-if="selectArr.includes('1')"></span>
                  <p :class="{'selected':selectArr.includes('1')}">
                    <span class="leftText">平&ensp;</span>
                    <span class="rightText">&ensp;{{item.odds['1']}}</span>
                  </p>
                </td>

                <td
                  @click="oddsFn({index:'0',code:item.playType,handicap:matchcont.handicap,odds:matchcont.odds})"
                  :class="{'selected':selectArr2.includes('0')}"
                  v-if="(item.playType=='3006') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3006*0_'+item.odds['0']"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" v-if="selectArr2.includes('0')"></span>
                  <p :class="{'selected':selectArr2.includes('0')}">
                    <span class="leftText">让负</span>

                    <span class="rightText">&ensp;{{item.odds['0']}}</span>
                  </p>
                </td>
                <td
                  @click="oddsFn({index:'0',code:item.playType,handicap:matchcont.handicap,odds:matchcont.odds})"
                  :class="{'selected':selectArr.includes('0')}"
                  v-if="(item.playType=='3010') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3010*0_'+item.odds['0']"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" v-if="selectArr.includes('0')"></span>
                  <p :class="{'selected':selectArr.includes('0')}">
                    <span class="leftText">负&ensp;</span>
                    <span class="rightText">&ensp;{{item.odds['0']}}</span>
                  </p>
                </td>
              </tr>
              <!-- 竞彩篮球 -->
              <tr
                class="wanfa"
                :key="'jclq_'+index"
                :class="'wf'+index"
                v-if="item.playType=='3001'||item.playType=='3002'"
                :wanfaNum="item.playType"
              >
                <td v-if="matchcont.unsupport.indexOf(item.playType) > -1" colspan="3">
                  <p>{{item.playType=='3002'?'暂未开盘让分胜负玩法':'暂未开盘胜负玩法'}}</p>
                </td>
                <td
                  width="35%"
                  @click="oddsFn({index:'1',code:item.playType,handicap:matchcont.handicap,rows:'2'})"
                  :class="{'selected':slRed3}"
                  v-if="(item.playType=='3002') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3002*0_'+item.odds['0']"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" v-if="slRed3"></span>
                  <p :class="{'selected':slRed3}">
                    <span class="leftText">客胜</span>
                    <span class="rightText">&ensp;{{item.odds['0']}}</span>
                  </p>
                </td>
                <td
                  width="35%"
                  @click="oddsFn({index:'4',code:item.playType,handicap:matchcont.handicap,rows:'1'})"
                  :class="{'selected':win3}"
                  v-if="(item.playType=='3001') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3001*0_'+item.odds['0']"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" v-if="win3"></span>
                  <p :class="{'selected':win3}">
                    <span class="leftText">客胜</span>
                    <span class="rightText">&ensp;{{item.odds['0']}}</span>
                  </p>
                </td>

                <td
                  width="30%"
                  v-if="(item.playType=='3001') && matchcont.unsupport.indexOf(item.playType) <= -1"
                >
                  <p style="color:#ACA395">胜负</p>
                </td>
                <td
                  width="30%"
                  v-if="(item.playType=='3002') && matchcont.unsupport.indexOf(item.playType) <= -1"
                >
                  <p style="color:#ACA395">
                    <span class="leftText">主&ensp;</span>
                    <span class="rightText">&ensp;{{matchcont.handicap}}</span>
                  </p>
                </td>

                <td
                  @click="oddsFn({index:'3',code:item.playType,handicap:matchcont.handicap,rows:'2'})"
                  :class="{'selected':slRed0}"
                  v-if="(item.playType=='3002') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3002*3_'+item.odds['3']"
                  :wanfaNum="item.playType"
                >
                <span class="borDiv" v-if="slRed0"></span>
                  <p :class="{'selected':slRed0}">
                    <span class="leftText">主胜</span>
                    <span class="rightText">&ensp;{{item.odds['3']}}</span>
                  </p>
                </td>
                <td
                  @click="oddsFn({index:'6',code:item.playType,handicap:matchcont.handicap,rows:'1'})"
                  :class="{'selected':win0}"
                  v-if="(item.playType=='3001') && matchcont.unsupport.indexOf(item.playType) <= -1"
                  :data-code="'3001*3_'+item.odds['3']"
                  :wanfaNum="item.playType"
                >
                 <span class="borDiv" v-if="win0"></span>
                  <p :class="{'selected':win0}">
                    <span class="leftText">主胜</span>
                    <span class="rightText">&ensp;{{item.odds['3']}}</span>
                  </p>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </div>
    </div>
    <div class="height16"></div>
    <div class="padding024">
      <div class="fontsize32">详情</div>
      <textarea
        contenteditable="true"
        placeholder="请输入您的分析，用户付费后才可见"
        ref="liaocontent"
        class="artTitle min-height"
        id="liaocontent"
        maxlength="3000"
        v-model="result.content"
        @focus="sl1=false;sl2=false;sl3=false"
      ></textarea>
      <div class="clear"></div>
      <div class="updataimg">
        <canvas id="myCanvas"></canvas>
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
          <li v-if="isupload">
            <div class="shizi_div">
              <input
                type="file"
                accept="image/*"
                name="imageFile"
                class="uploadBtn"
                multiple="multiple"
                @focus="sl1=sl2=sl3=false"
                @change="upload($event)"
              />
            </div>
          </li>
          <div class="clear"></div>
        </ul>
      </div>
    </div>
    <div class="height16"></div>
    <div class="padding024">
      <div class="fontsize32">价格</div>
      <ul class="itemprice" id="itemprice">
        <li v-for="(item,index) in moneyitem" :key="'money_'+index">
          <p
            :class="{selected:num===index}"
            @click="getNum(index)"
            :data-price="item.replace(/(元)|(免费)/g,'')"
          >{{item}}</p>
        </li>
      </ul>
      <div class="artTitle_c">
        <input
          id="custom"
          ref="liaoprice"
          class="priceinput"
          type="text"
          pattern="\d*"
          placeholder="自定义价格"
          @focus="sl1=sl2=sl3=false"
          @keyup="hasValue($event)"
          @keydown="haskeydown($event)"

          maxlength="3"
          v-model="priceself"
        />
        <!-- <div
          id="custom" ref='liaoprice'
          class="priceinput"
          contenteditable="true"
          data-text="自定义价格"
          @scroll="scrollEvent"
        ></div>-->
      </div>
      <div class="selectCont">
         <div class="selectBtn" :class="{selectBtn_:bzf}" @click="bzfFun"></div>
         <div class="selectText">不中返还</div>
         <img src="@/assets/img/wenhao.png" class="wenhao" @click="tips()" alt="">
      </div>
    </div>
    <div class="subcont" >
      <div class="subBtn" @click="toQrcode(1)" v-if="isSubcont" >生成二维码</div>
      <div class="saveCont" v-if="isSubcont">
        <a href="javascript:;" class="save" @click="toQrcode(0)">保存草稿</a>
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import marqueeLeft from '@/components/marqueeLeft/marqueeLeft'
import axios from 'axios'
export default {
  name: "fatie",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      orderId:this.$route.query.orderId,
      sl1: false,
      sl2: false,
      sl3: false,
      liaocontentF:false,
      sl1_val: "jczq",
      sl2_val: "请选择",
      sl3_val: "",
      sl3_val_text: "请选择比赛",
      slRed3: false, //让球胜平负
      slRed1: false,
      slRed0: false,
      isSubcont:true,
      distance: 0,
      win3: false, //胜
      win1: false, //平
      win0: false, //负
      isupload: true,
      priceself: "",
      bigWidth: false,
      itemlist: {
        jczq: {
          dateSelect: []
        },
        jclq: {
          dateSelect: []
        }
      },
      bzf:false,
      bs: [],
      matchcont: {
        odds: {}
      },
      imagesHTML: [],
      files: [],
      moneyitem: ["免费", "18元", "38元", "58元", "88元"],
      num: "",
      tabnum: "",
      newItems:[
                {name: '料小料', detail: '料小料是一款知识变现工具，内容仅代表发布者个人观点，发布者对内容负有全部责任！'},
                {name: '料小料', detail: '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'},
                {name: '料小料', detail: '料小料是一款知识变现工具，内容仅代表发布者个人观点，发布者对内容负有全部责任！'},
                {name: '料小料', detail: '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'}
                ],
      result:{title:"",content:""},
      textcontent:"",
      imagesUrl:[],
      selectArr:[],
      selectArr2:[],
      from: ""
    };
  },
  watch: {
    "itemlist": function(res) {
      if(!!this.$route.query.orderId){
        this.detail();
      }else{
        this.liaocontentF=true;
      }
    },
    "result.images": function(res) {
      this.$previewRefresh(); //upload
    }
  },
  mounted() {
     try{
        window.scrollTo( 0,0);
      }catch(e){
        console.log(e)
      }
      if (!this.$util.getCookie("useInstruction")) {
        this.$util.setCookie("useInstruction", "hasShow", true);
        this.$comfirm({
          title: "使用须知",
          content:
            "<p>1、料内容请尽量避免使用，必中、稳中、内幕等含有诱导性文字，避免产生不必要纠纷。</p><p style='margin-top: 0.3rem;'>2、料小料是一款知识变现工具，内容仅代表发布者个人观点，发布者对内容负有全部责任！</p>",
          contentCss: { "text-align": "left" },
          confirmBtn: "我知道了"
        })
          .then(res => {
          })
          .catch(res => {
          });
      }
    if (window.history && window.history.pushState && this.$util.getUrlParam("quit") == "true") {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.goBack, false);
    }
  },
  destroyed() {
    window.removeEventListener("popstate", this.goBack, false);
  },
  created() {
     if(!this.$route.query.orderId){
         this.liaocontentF=true;
      }
    this.match();
    this.weChatInputBug();
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      setTimeout(function() {
        vm.from = from.name;
      }, 0); //同步转异步操作
    });
  },
  beforeRouteLeave(to, from, next) {
      this.$util.setCookie("from", to.name);
      this.$comfirm("false");
      window.removeEventListener("popstate", this.goBack, false);
      // if (this.$util.getUrlParam("quit") == "true") {
      //   WeixinJSBridge.call("closeWindow");
      // }else{
            if (window.location.href.indexOf('&look') !== -1) { 
                    window.history.forward(1);
            }else{
               console.log("没有&look")
            }
      // }
      next(true);
  },
  methods: {
    // goBack() {
    //   this.$comfirm("false");
    //   if (this.$util.getUrlParam("quit") == "true") {
    //     WeixinJSBridge.call("closeWindow");
    //   }else{
    //         if (window.location.href.indexOf('&look') !== -1) { 
    //                 // console.log(window.location.href)
    //                 window.history.forward(1);
    //         }else{
    //           //  console.log("没有&look")
    //         }
    //   }
    // },
    bzfFun(){
      let priceEl = document.getElementById("itemprice").querySelector(".selected");
      if(Number(this.$refs.liaoprice.value.replace('元',"")[0]) >=1  || (!!priceEl && !!priceEl.getAttribute("data-price"))){
          this.bzf=!this.bzf
      }else{
        if(this.$refs.liaoprice.value.replace('元',"")== "" && !priceEl){
          this.bzf=!this.bzf
        }else{
          this.$util.blackTs("免费的料，不能参加不中返");
        }
      }
    },
    tips(){
      this.$comfirm({
        title:"不中返还",
        content:"1、如果您选择的比赛选项未中奖，则查看此料的费用自动退还给对应的付款者。<br/><br/>2、比赛取消、中断、腰斩等情况按未中奖处理。<br/><br/>3、用户付费后资金暂时会冻结在您的账户，等待确认赛果后再进行解冻或者返还用户。<br/><br/>4、包时套餐内查看的料不适合不中返还规则。",
        contentCss:{'text-align':'left','line-height': '0.44rem'},
        confirmBtn:"我知道了"
      });
    },
    goBack() {
      WeixinJSBridge.call('closeWindow');
    },
    detail() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/content/detail",
          data: {
            userno: wxUser.userNo,
            orderId: this.orderId,
          }
        },
        res => {
          if (res.data.errorCode == "0000") {
            res.data.value.content=res.data.value.content.replace(/<br\/>/g,'\n');
            this.result = res.data.value;
            this.liaocontentF=true;
            this.betCodeStr(this.result)
          }
        }
      );
    },
    betCodeStr(obj){
      if(obj.raceStatus==4){
          this.isSubcont=false;
          this.$comfirm({content:"本场比赛官方已经截期，不支持编辑、发布相关料内容"}).then(res=>{});
        
      }
      this.matchcont=obj;
       let betCodeArr=obj.betCode.split('*');
        if(betCodeArr.length == 2){
            if(betCodeArr[1].indexOf('3010') > -1 || betCodeArr[1].indexOf('3006') > -1){
              this.sl1_val="jczq"
            }else{
              this.sl1_val="jclq"
            }
        }else{
          this.sl1_val="jczq"
        }
        //绑定日期选择
        if(obj.day){
          this.sl2_val=obj.day.substr(0,4)+"-"+obj.day.substr(4,2)+"-"+obj.day.substr(6,2)
        }
        //绑定对阵选择
        this.sl3_val=obj.day+obj.teamId;
        if(this.sl1_val == "jczq"){
            this.sl3_val_text=obj.teamId+' '+obj.homeTeam+'vs'+obj.awayTeam
        }else{
            this.sl3_val_text=obj.teamId+' '+obj.awayTeam+'vs'+obj.homeTeam
        }
        //图片 等于三张隐藏图片选择按钮
        let IMGS=obj.images.join();
        this.imagesHTML=(IMGS.split(',')=="")?[]:IMGS.split(',');
        if (this.imagesHTML.length >= 3) {
            this.isupload = false;
        }
        //绑定价格
        if(obj.price!=""){
          if(obj.price==0){
            this.num=0;
          }else{
            for(let n =0; n<this.moneyitem.length; n++ ){
                if(this.moneyitem[n].replace('元','')==(obj.price/100)){
                  this.num=n;
                }
            }
            if(this.num==""){
              this.priceself=(obj.price/100+"元");
            }
          }
        }
        if(obj.ifReturn=='1'){
            this.bzf=true;
        }
      // 绑定选中结果
      if(obj.betCode.indexOf('3006(') > -1 || obj.betCode.indexOf('3010(') > -1){
        this.bindstate(obj.betCode,'3006','1_')&& this.selectArr2.push('1');
        this.bindstate(obj.betCode,'3006','0_')&& this.selectArr2.push('0');
        this.bindstate(obj.betCode,'3006','3_')&& this.selectArr2.push('3');
        this.bindstate(obj.betCode,'3010','3_')&& this.selectArr.push('3');
        this.bindstate(obj.betCode,'3010','1_')&& this.selectArr.push('1');
        this.bindstate(obj.betCode,'3010','0_')&& this.selectArr.push('0');

      }else{
        this.win1 = obj.betCode.indexOf('3002(1_') > -1;
        this.slRed3= obj.betCode.indexOf('3002(0_') > -1;
        this.slRed0 = obj.betCode.indexOf('3002(3_') > -1;
        this.win0 =obj.betCode.indexOf('3001(3_') > -1;
        this.slRed1 =obj.betCode.indexOf('3001(1_') > -1;
        this.win3 =obj.betCode.indexOf('3001(0_') > -1;
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
    selectFn(obj) {
      if (obj.index == 1) {
        //彩种
        this.sl1 = false;
        this.sl1_val = obj.val;
        this.sl3_val_text = "请选择比赛";
        // this.sl2_val = "请选择";
        this.sl3_val = "";
        this.sl2_val = (this.itemlist[this.sl1_val].dateSelect && this.itemlist[this.sl1_val].dateSelect[0]) || '请选择比赛';
      } else if (obj.index == 2) {
        //时间
        this.sl2 = false;
        this.sl2_val = obj.val;
        this.sl3_val_text = "请选择比赛";
        this.sl3_val = "";
      } else if (obj.index == 3) {
        //比赛
        this.sl3 = false;
        this.sl3_val = obj.val.matchNum;
        this.matchcont = obj.val;
      }
      this.slRed1 = this.slRed3 = this.slRed0 = false;
      this.win0 = this.win1 = this.win3 = false;
      this.selectArr=[];
      this.selectArr2=[];
    },
    sortJson(obj) {
      return obj;
    },
    sortNumber(a, b) {
      return b - a;
    },
    hasValue(e) {
        // debugger
      if(!!e.target.value.match(/^[1-9][\d]{0,2}/g)){
          this.priceself = !!e.target.value.match(/^[1-9][\d]{0,2}/g)?e.target.value.match(/^[1-9][\d]{0,2}/g)+'元':"";
          if (e.target.value != "") {
            this.num = "";
          }
      }else{
        e.target.value=""
      }

    },
    haskeydown(e){

       this.priceself = e.target.value.match(/^[1-9][\d]{0,2}/g)|| null;
      if (e.target.value != "") {
        this.num = "";
      }
    },
    maxlength(e){
      if(this.result.title.length>50){

          this.result.title=this.result.title.substr(0,50);
      }

    },
    oddsFn(obj) {
      this.sl1 = this.sl3 = this.sl2 = false;
      if (obj.code == "3006" || obj.code == "3010") {
       // 足球选中规则
        if(obj.code == "3010"){
          if(this.selectArr.includes(obj.index)){
            this.selectArr=this.selectArr.filter(function (ele){return ele != obj.index;});
          }else{
            if(obj.handicap.indexOf('-') > -1 && this.selectArr2.includes('0') && obj.index=='3'){
                this.$util.blackTs("不可包选比赛");
            }else if(obj.handicap.indexOf('+') > -1 && this.selectArr2.includes('3') && obj.index=='0'){
                this.$util.blackTs("不可包选比赛");
            }else{
               this.selectArr.push(obj.index)
               if(this.selectArr.length == 3){
                  this.selectArr.shift();
                  this.selectArr2=[];
                }
                if(this.selectArr.length+this.selectArr2.length >2){
                    this.selectArr2.shift();
                }
            }
          }
        }
        if(obj.code == "3006"){
          if(this.selectArr2.includes(obj.index)){
            this.selectArr2=this.selectArr2.filter(function (ele){return ele != obj.index;});
          }else{
            if(obj.handicap.indexOf('-') > -1 && this.selectArr.includes('3') && obj.index=='0'){
                this.$util.blackTs("不可包选比赛");
            }else if(obj.handicap.indexOf('+') > -1 && this.selectArr.includes('0') && obj.index=='3'){
              this.$util.blackTs("不可包选比赛");
            }else{
              this.selectArr2.push(obj.index)
              if(this.selectArr2.length == 3){
                this.selectArr2.shift();
                this.selectArr=[];
              }
             if(this.selectArr.length+this.selectArr2.length >2){
                    this.selectArr.shift();
              }
            }
          }
        }
      } else {
        //篮球选中规则
        // if(this.selectArr2.includes(obj.index)){
        //   this.selectArr2=this.selectArr2.filter(function (ele){return ele != obj.index;});
        // }else{
        //    this.selectArr2.push(obj.index)
        // }
        //  console.log(this.selectArr2);
        if (obj.index == "1") {
          this.slRed1 = this.slRed0 = false;
          this.slRed3 = !this.slRed3;
        }
        if (obj.index == "3") {
          this.slRed1 = this.slRed3 = false;
          this.slRed0 = !this.slRed0;
        }
        if (obj.index == "4") {
          this.win0 = this.win1 = false;
          this.win3 = !this.win3;
        }
        if (obj.index == "6") {
          this.win3 = this.win1 = false;
          this.win0 = !this.win0;
        }
      }
      // --------------------------
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
    toQrcode(index) {
      var wxUser = this.userInfo.wxUser;
      let paramJson = {};
      let teamCont = document.getElementById("teamCont");
      let priceEl = document
        .getElementById("itemprice")
        .querySelector(".selected");
      let price = "";
      let ifReturn =!!document.querySelector(".selectCont").querySelector(".selectBtn_");
      if (
        this.$refs.liaotitle.value.trim().length < 5 ||
        this.$refs.liaotitle.value.trim().length > 50
      ) {
        this.$util.blackTs("标题须大于5，小于50字");
        return;
      } else if (
        (this.$refs.lotteryType.dataset.val == "" ||
          this.sl3_val == "" ||
          !teamCont ||
          teamCont.querySelectorAll(".selected").length == 0)
      ) {
       this.$util.blackTs("请选择对阵、赔率");
       return;
      } else if ((
        this.$refs.liaocontent.value.trim().length < 10) ||
        this.$refs.liaocontent.value.trim().length > 3000
      ) {
        this.$util.blackTs("详情须大于10，小于3000字");
        return;
      }else if( this.$refs.liaoprice.value=="" && !priceEl){
        this.$util.blackTs("请选择或输入价格");
        return;
      }
      let r = this.files.filter(function (s) {
          return !!s && s // 注：IE9(不包含IE9)以下的版本没有trim()方法
      });


      price = priceEl && priceEl.getAttribute("data-price");
      paramJson.orderId = this.$route.query.orderId || this.orderId || "";
      paramJson.title = this.$refs.liaotitle.value;
      paramJson.lotteryType = this.$refs.lotteryType.dataset.val;
      paramJson.betCode = this.sl3_val+"*";
      paramJson.content = this.$refs.liaocontent.value.replace(/\r\n/g,"<br/>").replace(/\n/g,"<br/>");
      paramJson.price = Number(this.$refs.liaoprice.value.replace('元',''))*100 || Number(price) * 100;
      // paramJson.price = 1;
      paramJson.userno = wxUser.userNo;
      paramJson.accessToken = this.userInfo.token;
      paramJson.images = r;
      paramJson.imagesUrl = (!!this.orderId) ? this.result.images:"";
      paramJson.qrcode = index;
      paramJson.formType = "upload";
      paramJson.ifReturn = ifReturn?1:0;
      try {
        let el = teamCont.querySelectorAll("td.selected");
        let wfnum3010=[];
        let wfnum3006=[];
        let wfnum3002=[];
        let wfnum3001=[];
        for (let i = 0; i < el.length; i++) {
            
            if(el[i].dataset.code.indexOf('3010') > -1){
                wfnum3010.push(el[i].dataset.code.split('*')[1])
            }else if(el[i].dataset.code.indexOf('3006') > -1){
                wfnum3006.push(el[i].dataset.code.split('*')[1])
            }else if(el[i].dataset.code.indexOf('3002') > -1){
                wfnum3002.push(el[i].dataset.code.split('*')[1])
            }else if(el[i].dataset.code.indexOf('3001') > -1){
                wfnum3001.push(el[i].dataset.code.split('*')[1])
            }
        }
        if(wfnum3010.length || wfnum3006.length){
          if(wfnum3010.length && wfnum3006.length){
            paramJson.betCode+="3006("+wfnum3006.join()+")|3010("+wfnum3010.join()+")";
          }else{
            paramJson.betCode+=(wfnum3010.length)?"3010("+wfnum3010.join()+")":"3006("+wfnum3006.join()+")";
          }
        }else{
          if(wfnum3001.length && wfnum3002.length){
            paramJson.betCode+="3001("+wfnum3001.join()+")|3002("+wfnum3002.join()+")";
          }else{
            paramJson.betCode+=(wfnum3001.length)?"3001("+wfnum3001.join()+")":"3002("+wfnum3002.join()+")";
          }
        }
      } catch (e) {}
      this.formDataRequest(
        {
          path: "api-server/form/content/generator",
          data: paramJson
        },
        res => {
          if (res.data.errorCode == "0000") {
            if (index) {
              //this.$store.commit("setQrcode", res.data.value.qrcode);
              this.$util.setCookie("qrcode", "yes");
              this.$router.replace({
                path: "/qrcode",
                query: { orderId: res.data.value.orderId }
              });
              // this.router.go(-1);
            } else {
              this.$util.setCookie("save", "yes");
              this.$util.blackTs("保存成功");
              if(this.from == "home"){
                this.$router.replace({path: "/mySell"});
              } else if (this.from == "mySell") {
                window.history.back();
              }
            }
          } else if (res.data.errorCode == "3002") {
            this.$comfirm({
              title: "截期提醒",
              content: "本场比赛官方已经截期，不支持继续编辑内容！",
              contentCss: { "text-align": "left" }
            });
          } else {
            this.$util.blackTs(res.data.message);
          }
        }
      );
    },
    match() {
      let paramJson = {
        path: "api-server/apih5/content/match"
      };
      this.ajaxRequest(paramJson, res => {
        if (res.data.errorCode == "0000") {
          this.itemlist = res.data.value;
          if(!this.orderId && !!res.data.value.checked){
            this.sl1_val =(res.data.value.checked);
            this.sl2_val = res.data.value[res.data.value.checked].dateSelect[0];
          }
          // console.log(this.itemlist);
        }
      });
    },
    weChatInputBug() {
      //处理ios微信里, input获取焦点后, 焦点消失时的页面位移问题(页面底部有空白)
      let myFunction;
      let isWXAndIos = this.isWeiXinAndIos();
      if (isWXAndIos) {
        document.body.addEventListener("focusin", () => {
          this.distance = document.documentElement.scrollTop;
          // console.log(document.documentElement.scrollTop);
          clearTimeout(myFunction);
        });
        document.body.addEventListener("focusout", () => {
          clearTimeout(myFunction);
          myFunction = setTimeout(function() {
            window.scrollTo({
              top: this.distance,
              left: 0,
              behavior: "smooth"
            });
          }, 200);
        });
      }
    },
    isWeiXinAndIos() {
      let ua = "" + window.navigator.userAgent.toLowerCase();
      let isWeixin = /MicroMessenger/i.test(ua);
      let isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua);
      return isWeixin && isIos;
    },
    getNum(index) {
      this.sl1 = this.sl2 = this.sl3 = false;
      this.num = index;
      //this.$refs.liaoprice.value = "";
      this.priceself=""
      if(index==0){
        this.bzf=false;
      }
    },
    gettabNum(index) {
      this.tabnum = index;
    },
 upload(e) {
      let files_ = e.target.files || e.dataTransfer.files;
    //   debugger;
     
      if (!files_.length) return;
      for(let key in files_){
         let len=this.files.length;
        // if(key <= 2 && (this.imagesHTML.length) < 3 && len <3){
          this.picValue = files_[key];
          this.imgPreview(this.picValue);

        // }
      }
    },
    imgPreview(file) {
      let self = this;
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = async function() {
          let result = this.result;
          self.postImg(result,file);
        };
      }
    },
    postImg(baseImg,file) {
      if(this.imagesHTML.length<3){
        this.files[this.imagesHTML.length]=file;
        this.imagesHTML.push(baseImg);
       
      }
      if (this.imagesHTML.length >= 3) {
          this.isupload = false;
      }
      
        
      this.$previewRefresh(); //upload后, 刷新preview插件
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
    }
  },
  computed: {
    resetStr() {
      return str => {
        return str == "jczq" ? "竞彩足球" : "竞彩篮球";
      };
    },
    resetTime() {
      return str => {
        let mydate = new Date(str);
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
        return str.replace("20", "") + (weekday[myddy] || "");
      };
    },
    resetTimeNum() {
      // console.log(this.sl2_val.replace(/-/g, ""));
      return this.sl2_val.replace(/-/g, "");
    }
  },
  components:{
    marqueeLeft
  }
};
</script>

<style scoped>
.fatie{ position: relative;}
.Tips {
  font-size: 0.28rem;
  color: #ef3d34;
  height: auto;
  background-color: #ffefee;
  text-align: justify;
  padding: .1rem 0;
}
#myCanvas {
  display: none;
}
input {
  -webkit-appearance: none;
}
.fontsize32 {
  font-size: 0.32rem;
  height: 0.88rem;
  line-height: 0.88rem;
  padding-left: 0.16rem;
  position: relative;
  color: #333333;
}
.padding024 {
  padding: 0 0.24rem;
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
.artTitle_c {
  height: auto;
  position: relative;
  width: 100%;
  overflow: hidden;
}
.artTitle {
  position: relative;
  height: 0.88rem;
  line-height: 0.88rem;
  overflow: scroll;
  width: 100%;
  background: #fafafa;
  border: 1px solid #ececec;
  z-index: 200;
  border-radius: 0.1rem;
  outline: 0;
  padding: 0 0.2rem;
  /* -webkit-user-modify: read-write-plaintext-only; */
  font-size: 0.28rem;
  color: #333333;
  -webkit-user-select: text;
  white-space: nowrap;
  outline: none;
  resize: none;
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
.priceinput {
  position: relative;
  height: 0.88rem;
  width: 100%;
  background: #fafafa;
  border: 1px solid #ececec;
  z-index: 200;
  border-radius: 0.1rem;
  outline: 0;
  padding: 0 0.2rem;
  /* -webkit-user-select: text;
  -webkit-user-modify: read-write-plaintext-only; */
  display: flex;
  justify-content: flex-start;
  align-items: Center;
  font-size: 0.28rem;
  color: #333333;
  word-wrap: break-word;
  word-break: break-all;
}
.uploadBtn {
  width: 100%;
  height: 100%;
  opacity: 0;
  float: left;
}
[contentEditable="true"]:empty:not(:focus):before {
  content: attr(data-text);
  color: #bebebe;
}
.selectCount ul {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}
.selectCount ul li {
  position: relative;
  flex-shrink: 1;
  -webkit-flex-shrink: 1;
  flex-basis: 0;
  font-size: 0.28rem;
  color: #333333; /*overflow: hidden;height:.64rem;*/
  height: 0.64rem;
  position: relative;
  z-index: 400;
  text-align: center;
}
.selectCount ul li.li_b:nth-child(1) {
  flex-grow: 2.9;
}
.selectCount ul li p {
  position: relative;
  z-index: 200;
  width: 100%;
  height: 100%;
  border-radius: 0.08rem;
  text-align: left;
  text-indent: 0.2rem;
  background: url(../assets/img/dsj.png) no-repeat right 0.2rem center;
  background-size: 0.24rem 0.14rem;
  background-color: #fafafa;
  display: flex;
  align-items: Center;
}
.selectCount ul li p label {
  width: 84%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.selectCount ul li.li_b:nth-child(2) {
  margin-left: 0.18rem;
  flex-grow: 4.5;
}
.selectCount ul li.li_b:nth-child(3) {
  margin-left: 0.18rem;
  flex-grow: 3.3;
}
.scrollDiv {
  position: absolute;
  width: auto;
  right: 0;
  right: 0;
  top: 0.75rem;
  z-index: 500;
  background: #fff;
  border-radius: 0.08rem;
  -webkit-box-shadow: 0px 0px 13px #eaeaea;
  box-shadow: 0px 0px 13px #eaeaea;
  display: block;
  height: auto;
  max-height: 5.2rem;
}
.selectCount ul li .scrollDiv ul {
  position: relative;
  top: 0;
  display: block;
  max-height: 5.2rem;
  overflow: auto;
  -webkit-box-shadow: 0px 0px 0px #eaeaea;
  box-shadow: 0px 0px 0px #eaeaea;
}
.selectCount ul li ul {
  position: absolute;
  top: 0.75rem;
  right: 0;
  width: 100%;
  height: auto;
  background: #fff;
  border-radius: 0.08rem;
  -webkit-box-shadow: 0px 0px 13px #eaeaea;
  box-shadow: 0px 0px 13px #eaeaea;
  display: block;
  max-height: 5.2rem;
}

.height16 {
  height: 0.16rem;
  background: #f5f5f5;
  width: 100%;
  margin-top: 0.3rem;
}

.selectCount ul li ul li {
  width: 100%;
  height: 0.86rem;
  line-height: 0.86rem;
  text-align: center;
  font-size: 0.28rem;
  color: #333333;
  position: relative;
  background: #fff;
  z-index: 2600;
  overflow: hidden;
  float: left;
  flex-shrink: 0;
  -webkit-flex-shrink: 0;
  flex-basis: 0;
  border-bottom: 1px solid #ececec;
}
/* .selectCount ul li ul li::after{
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  background: #ececec;
  bottom: 0px;
  left: 0;
} */
.selectCount ul li ul.width369 {
  width: 3.69rem;
  height: auto;
  /* max-height: 5.2rem;
  overflow: scroll; */
}
.selectCount ul li ul.width369 li {
  text-align: left;
  text-indent: 0.2rem;
}
.selectCount ul li.li_b {
  border: 1px solid #ececec;
  border-radius: 0.08rem;
}
.selectCount ul li.li_b ul li:nth-child(2) {
  border-top-left-radius: 0.08rem;
  border-top-right-radius: 0.08rem;
}

.selectCount ul li ul li:nth-last-child(1) {
  border-bottom-right-radius: 0.08rem;
  border-bottom-left-radius: 0.08rem;
}
.sanjiao {
  position: absolute;
  width: 0.3rem;
  height: 0.19rem;
  top: -0.19rem;
  right: 0.3rem;
  z-index: 300;
}

.updataimg {
  padding-top: 0.2rem;
}
.updataimg ul li {
  width: 1.2rem;
  height: 1.2rem;
  float: left;
  position: relative;
  margin-right: 0.3rem;
  border-radius: 0.06rem;
}
.updataimg ul li .overflowbigimg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0.06rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.updataimg ul li .bigimg {
  position: absolute;
  border-radius: 0.06rem;
  display: inherit;
  width: 100%;
  height: auto;
}

.updataimg ul li .height100 {
  width: auto;
  height: 100%;
}
.updataimg ul li img.removeimg {
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
.itemprice {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.2rem;
}
.itemprice li {
  flex-grow: 1;
  flex-shrink: 1;
  -webkit-flex-shrink: 1;
  flex-basis: 1rem;
  font-size: 0.28rem;
  position: relative;
  justify-content: space-between;
  text-align: center;
}
.itemprice li::after {
  content: "";
  position: absolute;
  border-radius: 0.1rem;
  /* background: #d9d9d9; */
  left: -1px;
  right: -1px;
  top: -1px;
  bottom: -1px;
  z-index: 100;
  border-radius: 0.08rem;
}
.itemprice li:nth-child(2) {
  margin-left: 0.18rem;
}
.itemprice li:nth-child(3) {
  margin-left: 0.18rem;
}
.itemprice li:nth-child(4) {
  margin-left: 0.18rem;
}
.itemprice li:nth-child(5) {
  margin-left: 0.18rem;
}
.itemprice li p {
  background: #fff;
  border-radius: 0.06rem;
  width: 100%;
  height: 0.68rem;
  position: relative;
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: Center;
  border: 1px solid #ececec;
}
.subcont {
  padding: 0.4rem;
  background: #f5f5f5;
  /* margin-top: 0.3rem; */
}
.subBtn {
  width: 4.2rem;
  height: 0.98rem;
  text-align: center;
  color: #fff;
  font-size: 0.32rem;
  line-height: 0.98rem;
  background: #ef3d34;
  margin: auto;
  border-radius: 0.1rem;
}
.saveCont {
  width: 4.2rem;
  height: 0.4rem;
  text-align: center;
  color: #fff;
  margin: 0.35rem auto;
}
.itemprice li p.selected {
  background: #ef3d34;
  color: #fff;
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
.duizhen table tr td .borDiv{
position: absolute;
height: 100%;
width: 100%;
top: 0px;
left: 0;
border: 1px solid #5694F3;
z-index: 120;
background: url(../assets/img/lanjian.png) no-repeat right top;
background-size:.4rem .4rem;
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
.home {
  float: left;
  width: 40%;
  font-size: 0.28rem;
  height: 0.88rem;
  font-weight: bold;
  color: #333333;
  line-height: 0.88rem;
  text-align: right;
}
.vs {
  float: left;
  width: 20%;
  text-align: center;
  font-size: 0.24rem;
  color: #888888;
  height: 0.88rem;
  line-height: 0.88rem;
}
.aw {
  float: left;
  width: 40%;
  text-align: left;
  font-size: 0.28rem;
  height: 0.88rem;
  font-weight: bold;
  color: #333333;
  line-height: 0.88rem;
  text-align: left;
}
.duizhen table tr td.bgred {
  background: #f35e56;
  color: #fff;
}
.duizhen table tr td .selected {
  color: #5694F3;
  position: relative;
  background: #f9fbff;
  z-index: 108;
}
/* .duizhen table tr td::before {
  content: "";
  position: absolute;
  background: #ececec;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 100;
} */
/* .duizhen table tr td.selected::after {
  content: "";
  position: absolute;
  background: #ef3d34;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 107;
  width: 100%;
  height: 100%;
}  */
.min-height {
  height: 2rem;
  overflow: scroll;
  line-height: 0.41rem;
  padding: 0.14rem 0.2rem;
  word-wrap: break-word;
  word-break: normal;
  white-space: normal;
  text-align: justify;
  float: left;
}
.save {
  font-size: 0.32rem;
  color: #f46d66;
  display: block;
  width: 1.7rem;
  height: 0.4rem;
  margin: 0 auto;
}
.disabled{position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: auto; z-index: 4000;}
.selectCont{
  display: flex;
  align-items:center;
  flex-direction:row;
  height: 1rem;
}
.selectBtn{
  background: url(../assets/img/wx.png) no-repeat center center;
  background-size: .28rem .28rem;
  width: .28rem; height: .28rem;
}
.selectBtn_{ background: url(../assets/img/yx.png) no-repeat center center;
  background-size: .28rem .28rem;}
.selectText{
font-size: .28rem;
color:#8e8e8e;
margin-left:.1rem; 
margin-right:.1rem; 
}
.wenhao{ width: .28rem; height: .28rem;}
</style>