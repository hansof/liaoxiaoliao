<template>
  <div class="myFans">
    <scroller :on-refresh="refresh" :on-infinite="infinite" ref="myscroller">
      <ul class="list">
        <template v-for="(item,index) in datalist">
          <li :key="'fans'+item.id">
            <img @click="findIntroduce(item)" :src="item.headImgUrl" :onerror="defaultHead" />
            <h3>{{item.nickName}}</h3>
            <a
              href="javascript:;"
              class="gzbtn"
              @click="follow(0,item.userNo,index)"
              v-if="item.follow=='0'||item.follow==null"
            >+关注</a>
            <a
              href="javascript:;"
              class="gzbtn gzbtn_"
              @click="follow(1,item.userNo,index)"
              v-if="item.follow=='1'"
            >已关注</a>
          </li>
        </template>
      </ul>
    </scroller>
    <default-Page v-show="noDateFlag"></default-Page>
  </div>
</template>

<script>
import defaultPage from "@/components/defaultPage/defaultPage";
export default {
  name: "myFans",
  data() {
    return {
      userInfo: this.$util.parse(this.$util.getCookie("userInfo")),
      datalist: [],
      lastId: null,
      followFlag: "0",
      noDate: false, //这是一个判断是否加载的开关
      noDateFlag: false,
      defaultHead: 'this.src="' + require("@/assets/img/head.png") + '"'
    };
  },
  components: {
    "default-Page": defaultPage
  },
  mounted() {},
  beforeRouteLeave(to, from, next) {
    this.$author("false");
    next(true);
  },
  methods: {
    findIntroduce(item) {
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/findIntroduce",
          data: {
            userNo: item.userNo
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.$author({
              headImg: item.headImgUrl,
              userName: item.nickName,
              content:
                res.data.data == null || res.data.data == ""
                  ? "暂未设置资料内容"
                  : res.data.data,
              contentCss:
                res.data.data == null || res.data.data == ""
                  ? { "text-align": "center" }
                  : { "text-align": "left" },
              followUserNo: item.userNo,
              followStatus: 1,
              followFlag: false
            })
              .then(res => {})
              .catch(res => {});
          } else {
          }
        }
      );
    },
    fansList() {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/fansList",
          data: {
            userNo: wxUser.userNo,
            lastId: this.lastId,
            pageSize: 20
          }
        },
        res => {
          if (res.data.code == "0000") {
            if (!res.data.data || JSON.stringify(res.data.data) == "{}") {
              this.noDate = true;
              if (!this.lastId) {
                this.noDateFlag = true;
              }
            } else {
              if (!this.lastId) {
                this.datalist = res.data.data;
              } else {
                this.datalist = this.datalist.concat(res.data.data);
              }
              this.lastId = res.data.data[res.data.data.length - 1].id;
            }
          } else if (res.data.code == "1001") {
            if (this.datalist.length == 0) {
              this.noDateFlag = true;
            }
            this.noDate = true;
          }
        }
      );
    },
    refresh() {
      this.lastId = null; //重置
      this.noDate = false; //重置数据判断
      setTimeout(() => {
        this.fansList();
        this.$refs.myscroller.finishPullToRefresh(); //刷新完毕关闭刷新的转圈圈
      }, 1700);
    },
    // 上拉加载
    infinite(done) {
      if (this.noDate) {
        this.$refs.myscroller.finishInfinite(true); //这个方法是不让它加载了，显示“没有更多数据”，要不然会一直转圈圈
      } else {
        setTimeout(() => {
          this.fansList();
          done(true); //进行下一次加载操作
        }, 1500);
      }
    },
    follow(state, userNo, index) {
      if (state == "1") {
        this.$comfirm({
          title: "提示",
          content: "您确定取消关注吗？",
          confirmBtn: "确定",
          cancelBtn: "取消"
        })
          .then(res => {
            this.userFollow(state, userNo, index);
          })
          .catch(res => {});
      } else {
        if(this.userInfo.subscribe != 1){
          this.$subScription()
        }
        //关注
        this.userFollow(state, userNo, index);
      }
    },
    userFollow(state, userNo, index) {
      let wxUser = this.userInfo.wxUser;
      this.ajaxRequest(
        {
          path: "api-server/apih5/account/user/follow",
          data: {
            userNo: wxUser.userNo,
            expertUserNo: userNo,
            state: state
          }
        },
        res => {
          if (res.data.code == "0000") {
            this.datalist[index].follow =
              res.data.message == "关注成功" ? 1 : 0;
          }
        }
      );
    }
  }
};
</script>

<style scoped>
.myFans {
}

.list li {
  height: 1.32rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.24rem;
  border-bottom: 1px solid #ececec;
}

.list li img {
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.2rem;
  border-radius: 50%;
}

.list li h3 {
  font-size: 0.3rem;
  color: #333;
  margin-right: auto;
}
.gzbtn {
  /* position: absolute; */
  color: #fff;
  font-size: 0.26rem;
  width: 1.1rem;
  height: 0.48rem;
  text-align: center;
  background: #ef3d34;
  border-radius: 0.4rem;
  /* top: 0;
  bottom: 0; */
  margin: auto 0;
  /* right: 0.24rem; */
  display: flex;
  justify-content: center;
  align-items: Center;
}
.gzbtn_ {
  background: #ececec;
  color: #888888;
}
</style>