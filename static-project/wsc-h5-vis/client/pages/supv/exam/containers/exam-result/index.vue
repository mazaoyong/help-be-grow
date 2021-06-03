<template>
  <div>
    <div v-if="!isLoading">
      <exam-result
        :record-detail="recordDetail"
        :percent-rank="percentRank"
        :result="result"
        :take-coupon-count="takeCouponCount"
        :draw-infos="drawInfos"
        @openCard="inviteCard"
        @openFriend="inviteFriend"
      />
      <card-share
        ref="cardshare"
        v-model="cardShareDisplay"
        :draw-infos="drawInfos"
      />
      <wx-share
        v-model="wxShareDisplay"
        :data="wxShareData"
      />
    </div>
    <div v-else class="loading-container">
      <van-loading
        type="spinner"
        class="detail-loading"
        color="white"
      />
    </div>
  </div>
</template>

<script>
import { Toast, Loading } from 'vant';
import { setShareData, getShareLink } from '@youzan/wxsdk';
import { ExamResult } from '@youzan/vis-ui';
import isEmpty from 'lodash/isEmpty';

import CardShare from './components/CardShare.vue';
import WxShare from './components/WxShare.vue';
import { getExamRecordApi, getShareApi } from '../../api';

/** 店铺类型
 * isEduSingleStore: 店铺角色是否为教育单店
 * isEduHqStore: 店铺角色是否为教育总部
 * isEduBranchStore: 店铺角色是否为教育分店
 * isEduChainStore: 店铺角色是否为教育连锁店铺
 */
import { isEduHqStore } from '@youzan/utils-shop';

const global = window._global || '';

export default {
  name: 'result',

  components: {
    'exam-result': ExamResult,
    'card-share': CardShare,
    'wx-share': WxShare,
    [Loading.name]: Loading,
  },

  data() {
    return {
      isLoading: true,
      recordDetail: {},
      percentRank: 0,
      result: {},
      takeCouponCount: 0,
      // 长图分享数据
      drawInfos: {},
      cardShareDisplay: false,
      wxShareData: '',
      wxShareDisplay: false,
      title: '',
    };
  },

  mounted() {
    const visBuyer = global.visBuyer || {};
    // 绘图需要的头像信息
    this.drawInfos.avatarSrc = visBuyer.finalAvatar || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';
    // 绘图需要的昵称信息
    const nickName = visBuyer.finalUsername || '小伙伴';
    // 坑: 绑定手机号登陆后通过baseAcl可以拿到buyer, 仅强制微信授权拿不到buyer?
    if (!isEmpty(global.buyer)) {
      if (global.buyer.nick_name && global.buyer.mobile && (global.buyer.nick_name === global.buyer.mobile)) {
        const mobile = global.buyer.nick_name || global.buyer.mobile || '';
        if (mobile.length > 7) {
          this.drawInfos.user = mobile.replace(mobile.slice(3, 7), '****');
        } else {
          this.drawInfos.user = nickName;
        }
      } else {
        this.drawInfos.user = nickName;
      }
    } else {
      this.drawInfos.user = nickName;
    }

    getExamRecordApi({
      examId: this.$route.query.examId || 0,
      identity: this.$route.query.identity || '',
    })
      .then(res => {
        if (res.data) {
          this.recordDetail = res.data.recordDetail;
          this.percentRank = res.data.percentRank;
          this.result = res.data.result;
          this.takeCouponCount = res.data.takeCouponCount;

          // 绘图需要的结果信息
          this.drawInfos.displayFinishDesc = this.result.display || 0;
          this.drawInfos.resultTitle = this.result.title || '';
          this.drawInfos.resultStyle = this.result.style || 0;
          this.drawInfos.resultDesc = this.result.description || '';
          this.drawInfos.resultPic = this.result.descPic.url || '';

          return getShareApi({
            examId: this.$route.query.examId || 0,
            identity: this.$route.query.identity || '',
          });
        }
      })
      .then(res => {
        if (res.data) {
          this.isLoading = false;

          const share = res.data;
          if (share) {
            const examDTO = share.examDTO || {};
            document.title = examDTO.title || '趣味测试';
            // 绘图结果需要title
            this.drawInfos.finishDesc = `我刚完成了【${examDTO.title}】，正确率为${Math.floor(this.recordDetail.percentNum * 100)}%，超过了${Math.floor(this.percentRank * 100)}%的参与者，一起来测下吧。` || '';
            // 分享的url，总部预览时分享总部的预览连接，校区及单店分享正式推广连接
            const shareUrl = this.$route.query.identity && isEduHqStore ? `https://h5.youzan.com/wscvis/exam/detail?examId=${this.$route.query.examId}&kdtId=${global.kdt_id}&identity=${this.$route.query.identity}` : `https://h5.youzan.com/wscvis/exam/detail?examId=${this.$route.query.examId}&kdtId=${global.kdt_id}`;
            // 绘图需要的二维码信息
            this.drawInfos.shareUrl = share.shareUrl || shareUrl;
            this.drawInfos.shareTitle = share.examDTO.title;
            setShareData({
              title: `我刚参与了${examDTO.title}的测试，快来一起测下吧`,
              timeline_title: `我刚参与了${examDTO.title}的测试，快来一起测下吧`,
              desc: `${examDTO.joinUserCount}人已参与`,
              link: getShareLink(shareUrl),
              cover: examDTO.coverPic.url || 'https://img01.yzcdn.cn/public_files/2019/01/02/b05d7b0a659c523a686aff45fa0de316.png',
            });
          }
        }
      })
      .catch(e => {
        this.isLoading = false;
        console.log(e.msg);
        Toast(e.msg);
      });
  },

  methods: {
    inviteCard() {
      this.cardShareDisplay = true;
    },
    inviteFriend() {
      this.wxShareData = '点击右上角，分享给好友';
      this.wxShareDisplay = true;
    },
  },
};
</script>

<style lang="scss">
$c-black: #333;
$c-white: #fff;
$c-green: #00b389;

.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 4px;
  transform: translate(-50%, -50%);
}

.detail-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.exam-result {
  padding: 25px 20px;
  background-color: $c-white;

  &__rank {
    p {
      text-align: center;
    }

    p:nth-child(1) {
      margin-bottom: 10px;
      font-size: 18px;
      line-height: 25px;
      color: $c-black;
    }

    p:nth-child(2) {
      margin-bottom: 20px;
      font-size: 15px;
      line-height: 19px;
      color: #999;
    }
  }

  &__desc {
    padding: 20px 25px;
    margin-bottom: 20px;
    border-radius: 4px;
    box-shadow: 0 0 5px 3px #eee;

    p:nth-child(1) {
      margin-bottom: 20px;
      font-size: 18px;
      line-height: 25px;
      color: $c-black;
      text-align: center;
    }

    p:nth-child(2) {
      font-size: 16px;
      line-height: 20px;
      color: #666;
    }

    &__pic {
      width: 200px;
      height: 200px;
      margin: 0 auto;
    }
  }

  &__share {
    width: 280px;
    height: 37px;
    margin: 0 auto;

    &__btn {
      width: 126px;
      padding: 11px 0;
      font-size: 15px;
      text-align: center;
      border-radius: 18.5px;
    }

    &__btn-friend {
      float: left;
      color: $c-green;
      border: 1px solid $c-green;
    }

    &__btn-pic {
      float: right;
      color: $c-white;
      background-color: $c-green;
    }
  }
}

.exam-coupon {
  padding: 25px 20px;
  margin-top: 10px;
  background-color: #fff;

  &__title {
    margin-bottom: 20px;
    font-size: 18px;
    line-height: 24px;
    color: $c-black;
    text-align: center;
  }

  &__list {
    &__item {
      position: relative;
      height: 100px;
      margin-bottom: 20px;
      background-color: $c-white;
      border-top: 2px solid #e00;
      box-shadow: 0 0 5px 3px #eee;

      &-num {
        position: absolute;
        top: 5px;
        left: 0;
        display: inline-block;
        width: 31px;
        height: 18px;
        font-size: 14px;
        line-height: 18px;
        color: #fff;
        text-align: center;
        background: #e00;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
      }

      &__price {
        float: left;
        width: 50%;
        line-height: 102px;
        text-align: center;

        &--main {
          font-size: 24px;
        }
      }

      &__desc {
        float: right;
        width: 50%;
        padding-top: 16px;
        padding-bottom: 14px;

        &-type {
          margin-bottom: 11px;
          font-size: 17px;
          line-height: 24px;
          color: #4a4a4a;
        }

        &-use {
          font-size: 14px;
          line-height: 18px;
          color: #afafaf;
        }
      }
    }
  }
}
</style>
