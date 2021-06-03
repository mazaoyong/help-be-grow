<template>
  <div class="support-invitation">
    <div class="support-invitation__content">
      <div class="support-invitation__content-cover">
        <img-wrap
          :height="'260px'"
          :src="cover"
          :fullfill="'!580x580.jpg'"
          :cover="false"
        />
      </div>

      <div v-if="!isDeleted" class="support-invitation__content-info">
        <div class="info">
          <div class="support-invitation__content-info-title">
            {{ title }}
          </div>
          <div class="support-invitation__content-info-detail">
            <span v-if="content.author">
              主讲人:{{ content.author }}
            </span>
            <span v-if="content.author && content.price" class="devide" />
            <span v-if="content.price">
              价值{{ content.price / 100 || 0 }}元的付费知识
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="support-invitation__activity">
      <div class="support-invitation__activity-pannel" :style="minHeight">
        <div class="support-invitation__activity-source">
          <img class="avatar" :src="praiseDetail.avatar">
          <span class="description">
            {{ sourceDescription }}
          </span>
        </div>

        <div class="support-invitation__activity-button">
          <template v-if="buttonInfo.bigButtons.length > 0">
            <van-button
              v-for="(bigBtn, index) in buttonInfo.bigButtons"
              :key="index"
              :data-type="bigBtn.type"
              :href="bigBtn.url"
              :class="bigBtn.class"
              class="support-invitation__activity-button-big"
              @click="onButtonClick"
            >
              {{ bigBtn.text }}
            </van-button>
          </template>
          <template v-if="buttonInfo.miniButtons.length > 0">
            <van-button
              v-for="(minBtn, index) in buttonInfo.miniButtons"
              :key="index"
              :data-type="minBtn.type"
              :href="minBtn.url"
              :class="minBtn.class"
              class="support-invitation__activity-button-min"
              @click="onButtonClick"
            >
              {{ minBtn.text }}
            </van-button>
          </template>
        </div>

        <div class="support-invitation__activity-tips">
          <!-- 暂时还没人为你点赞~ -->
          {{ clickedDescription }}
        </div>

        <div class="support-invitation__activity-list">
          <div
            v-for="(item, index) in totalAvatars"
            :key="index"
            class="support-invitation__activity-list-item"
          >
            <img :src="item.avatar">
          </div>
        </div>

        <div class="support-invitation__activity-explain" @click="onShowExplain">
          助力说明
        </div>
      </div>
    </div>

    <van-popup v-model="showExplainDlg" class="support-invitation__activity-explain-popup">
      <div class="popup-title">
        助力说明
      </div>
      <div class="popup-content">
        <div class="popup-content-item">
          1.集齐所有好友助力，即可免费获得这门课程的学习链接；
        </div>
        <div class="popup-content-item">
          2.每个人只能在1个课程下给1位好友助力，但是可以给同一个好友分享的不同课程助力；
        </div>
        <div class="popup-content-item">
          3.商家如果关闭了助力活动，则无法为好友助力，以及无法再发起助力。
        </div>
      </div>
      <div class="popup-btn" @click="onCloseExplain">
        确认
      </div>
    </van-popup>

    <van-popup v-model="showGuide" class="guide-popup">
      <template v-if="isGuide">
        <div class="guide-popup__image" />
        <p class="guide-popup__text">
          快戳右上角，分享给好友
        </p>
      </template>

      <div v-if="isCard" class="groupon-share-card">
        <div class="img-content">
          <img :src="cardImage">
        </div>
        <p class="note">
          长按保存图片，发微信好友或微信群
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import get from 'lodash/get';
import { Button, Popup, Toast } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import Args from 'zan-utils/url/args';
import isEmpty from 'lodash/isEmpty';
import { getPaidContentShareLink } from 'pct/utils/share';
import { setShareData } from '@youzan/wxsdk';
import { uploadNetMaterial, getImageWidth, getScreenRatio } from 'pct/utils';
import apis from 'pct/api';
import { getCommonWeappCode, getCommonSwanCode } from '../../../../common-api/utils';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import * as SafeLink from '@youzan/safe-link';
import { checkAndLogin } from '@/common/utils/login';

const isPC = window.innerWidth > 600;
const global = window._global;
const hasAttention = global.mp_data.mp_weixin !== undefined;
const DEFAULT_USER_INFO = 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';

export default {
  name: 'support-invitation',

  config: {
    title: '好友助力',
  },

  components: {
    'van-button': Button,
    'van-popup': Popup,
    'img-wrap': ImgWrap,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      /* alias: '', */
      // 内容信息
      content: {},

      // 当前赞详情
      praiseDetail: {},

      // 集赞活动详情
      praiseActivityDetail: {},

      // 当前用户状态信息
      userInfo: {},

      // 二维码
      qrCode: '',

      // 已点赞用户列表
      clickedPraiseUserList: [],

      // 内容alias
      targetAlias: '',

      // 发起者信息
      sourceInfo: {
        avatar: 'https://img01.yzcdn.cn/upload_files/2018/05/09/Fi8MJ42-EVZha_HTl6kzvfaR1DSZ.png!730x0.jpg',
      },

      // 文案信息状态
      textStatus: {
        isZanEnough: false, // 赞满
        isNormalPaid: false, // 正常购买
        isPromotionEnd: false, // 活动是否结束
        isSourceZaning: false, // 发起人集赞中
        hasClicked: false, // 已经点过赞
        hasClickedCurrent: false, // 是否为当前活动点过赞
        notClicked: false, // 未点过赞,
        friendPriaseEnough: false, // 好友已集满赞
      },
      // 按钮信息状态
      buttonStatus: {
        showPaidBtn: false, // 已购买，查看内容
        showBigPublicBtn: false, // 显示大按钮‘关注公众号’
        showSourceSmallBtn: false, // 显示发起人按钮，分享+生成图片
        showBigClickBtn: false, // 显示点赞人大按钮‘为好友点赞’
        showFriendSmallBtn: false, // 显示点赞人按钮，关注公众号+我也要学习
      },
      // 按钮组信息
      buttonInfo: {
        bigButtons: [],
        miniButtons: [],
      },

      sourceDescription: '',

      avatars: [],
      totalAvatars: [],

      // 默认头像
      defaultAvatar: 'https://img01.yzcdn.cn/public_files/2018/04/08/praise-default.png',
      // 默认内容图片
      defaultCover: 'https://img01.yzcdn.cn/public_files/2018/04/08/default.png',
      // 封面高度计算
      coverWrapHeight: isPC ? 210 : 260,
      coverWidth: '',
      coverHeight: '',
      coverScale: 1,
      showExplainDlg: false,
      buttons: [],
      showLogin: false,
      showGuide: false,
      officialCode: '',
      isCode: false,
      isGuide: false,
      isCard: false,
      // 已有多少人点赞
      hasClickedNum: 0,
      shareData: {},
      cover: '',
      isDeleted: false,
      cardImage: '',
      title: '',
    };
  },

  computed: {
    minHeight() {
      const minHeight = window.innerHeight - 260;
      return {
        minHeight: minHeight + 'px',
      };
    },
    alias() {
      return this.$route.query.alias;
    },
    type() {
      return Args.get('type');
    },
    zanAlias() {
      return Args.get('zanAlias');
    },

    fetchFunc() {
      return this.type === 'column' ? apis.getColumn : apis.getContent;
    },

    clickedDescription() {
      if (this.userInfo.isBuilder) {
        // 发起人角色
        return this.hasClickedNum > 0 ? `已有${this.hasClickedNum}个人为你助力了！` : '暂时还没人为你助力~';
      } else {
        // 点赞人角色
        return this.hasClickedNum > 0 ? `已有${this.hasClickedNum}个人为Ta助力了！` : '暂时还没人为Ta助力~';
      }
    },
  },

  created() {
    checkAndLogin(() => {
      this.getSupportInfo();
    });
  },

  methods: {
    // 获取当前集赞活动信息
    getSupportInfo() {
      const detailParams = {
        zanSetAlias: this.zanAlias,
      };
      apis.getPraiseDetail(detailParams).then((data) => {
        this.praiseActivityDetail = data.collectZan;
        this.praiseDetail = data.zanSet;
        this.userInfo = data.zanSetUserStatus;
        this.clickedPraiseUserList = data.givingZanRecordList || [];
        // this.targetAlias = this.praiseDetail.target_alias;
        // weapp采用小程序码
        const miniprogram = global.miniprogram || {};
        const { isWeapp, isSwanApp } = miniprogram;
        const h5Link = `https://h5.youzan.com/wscvis/knowledge/index?kdt_id=${global.kdt_id}&zanAlias=${this.zanAlias}&alias=${this.alias}&type=${this.type}&page=supportinvitation`;
        if (isWeapp) {
          // 生成小程序码
          const data = {
            page: `/packages/edu/webview/index`,
            targetUrl: encodeURIComponent(h5Link),
          };
          getCommonWeappCode(data)
            .then(res => {
              this.qrCode = res;
            })
            .catch(err => {
              console.warn(err);
            });
        } else if (isSwanApp) {
          const data = {
            targetUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(h5Link)}`,
          };
          getCommonSwanCode(data)
            .then(res => {
              this.qrCode = res;
            })
            .catch(err => {
              console.warn(err);
            });
        } else {
          this.qrCode = data.collectZanQrCode.h5;
        }
        this.hasClickedNum = this.clickedPraiseUserList.length;
        this.parseAvatars();
      })
        .finally(() => {
          if (isEmpty(this.content)) {
            this.getContent(this.alias);
          }
        });
    },

    // 获取商品内容
    getContent(targetAlias) {
      this.fetchFunc({
        alias: targetAlias,
      })
        .then((data) => {
          this.content = data;
          this.cover = this.content.cover;
          this.parseTitle();
        })
        .catch((err) => {
          this.cover = this.defaultCover;
          this.isDeleted = true;
          console.log(err);
        })
        .finally(() => {
          this.shareData = {
            desc: this.content.summary,
            cover: this.content.cover,
            title: this.content.title,
          };
          this.setShareInfo(this.shareData);
          this.parseButtonAndTipStatus();
        });
    },

    parseTitle() {
      const length = this.content.title.length;
      this.title = length <= 20 ? this.content.title : this.content.title.substr(0, 20) + '...';
    },

    // 处理点赞用户头像数组
    parseAvatars() {
      const avatarsTmp = [];
      (this.clickedPraiseUserList || []).forEach((item) => {
        avatarsTmp.push({ avatar: item.avatar });
      });
      // avatarsTmp = this.avatars;
      console.log(avatarsTmp);
      const len = this.clickedPraiseUserList.length;
      const remainNum = this.praiseActivityDetail.collectNum - len;
      for (let i = 0; i < remainNum; i++) {
        avatarsTmp.push({ avatar: this.defaultAvatar });
      }
      this.totalAvatars = avatarsTmp;
    },

    // 处理按钮
    parseButtonAndTipStatus() {
      if (this.content.status === 1) {
        // 内容已上架
        if (this.userInfo.isBuilder) {
          // 当前用户为发起者
          if (this.content.isPaid === 1 || this.content.isFree || (this.content.vipInfo || {}).isVipFree) {
            // 内容已被购买
            if (this.praiseDetail.status === 1) {
              // 集满赞
              this.textStatus.isZanEnough = true;
              this.buttonStatus.isZanEnough = true;
            } else {
              // 正常购买
              this.textStatus.isNormalPaid = true;
              this.buttonStatus.isNormalPaid = true;
            }
            this.buttonStatus.showPaidBtn = true;
          } else {
            // 内容未被购买
            if (this.praiseDetail.status === 1) {
              // 集满赞
              this.textStatus.isZanEnough = true;
              this.buttonStatus.showPaidBtn = true;
            } else if (this.praiseActivityDetail.processState === 1 && this.praiseActivityDetail.isDelete === 0) {
              // 促销进行中,且未失效或删除， 集赞中
              this.textStatus.isSourceZaning = true;
              this.buttonStatus.showSourceSmallBtn = true;
            } else if (!this.praiseActivityDetail.skuStock.stock && !this.praiseActivityDetail.couponStock) {
              this.textStatus.unavailable = true;
              this.buttonStatus.showBigPublicBtn = true;
            } else {
              // 其他的活动状态统一处理
              this.textStatus.isPromotionEnd = true;
              this.buttonStatus.showBigPublicBtn = true;
            }
          }
        } else {
          // 当前用户为点赞人
          if (this.praiseActivityDetail.processState === 1 && this.praiseActivityDetail.isDelete === 0) {
            // 促销进行中,且未失效或删除
            if (this.praiseDetail.status === 0) {
              // 集赞中
              if (this.userInfo.isGiving) {
                // 点过赞
                this.textStatus.hasClicked = true;
                this.buttonStatus.showFriendSmallBtn = true;
              } else {
                // 未点过赞
                this.textStatus.notClicked = true;
                this.buttonStatus.showBigClickBtn = true;
              }
            } else {
              // 赞满
              this.textStatus.friendPriaseEnough = true;
              this.buttonStatus.showFriendSmallBtn = true;
            }
          } else if (!this.praiseActivityDetail.skuStock.stock && !this.praiseActivityDetail.couponStock) {
            this.textStatus.unavailable = true;
            this.buttonStatus.showBigPublicBtn = true;
          } else {
            // 其他的活动状态统一处理
            this.textStatus.isPromotionEnd = true;
            this.buttonStatus.showBigPublicBtn = true;
          }
        }
      } else {
        // 内容被删除，或未上架
        this.textStatus.unavailable = true;
        this.buttonStatus.showBigPublicBtn = true;
      }

      this.parseTextInfo(this.textStatus);
      this.parseButtonInfo(this.buttonStatus);
    },
    // 文案展示处理
    parseTextInfo(textStatus) {
      let textInfo = '';
      if (textStatus.isZanEnough) {
        // 发起人角色，赞满
        textInfo = '恭喜，快去领取奖励吧！';
      } else if (textStatus.isNormalPaid) {
        // 发起人角色，正常购买
        textInfo = '您已拥有该课程，快去查看课程吧';
      } else if (textStatus.isSourceZaning) {
        // 发起人角色，集赞中
        if (this.praiseActivityDetail.prizeChannel === 0) { // 免费领取
          textInfo = `获得${this.praiseActivityDetail.collectNum}个助力，即可获得免费听讲资格！`;
        } else if (this.praiseActivityDetail.prizeChannel === 1) { // 优惠券
          textInfo = `获得${this.praiseActivityDetail.collectNum}个助力，即可获得课程优惠券！`;
        }
      } else if (textStatus.isPromotionEnd) {
        // 活动结束，失效，删除统一文案提示
        textInfo = '很遗憾，活动结束了';
      } else if (textStatus.friendPriaseEnough) {
        // 点赞人角色，好友赞已满
        textInfo = '好友已完成任务';
      } else if (textStatus.notClicked) {
        // 点赞人角色，未点过赞
        textInfo = `需要${this.praiseActivityDetail.collectNum}个好友助力，快来帮我！`;
      } else if (textStatus.hasClicked) {
        // 点赞人角色，点过赞
        textInfo = '您已助力了';
      } else if (textStatus.unavailable) {
        // 内容不可用
        textInfo = '晚了一步，商品已领完，有疑问请联系商家';
      }

      this.sourceDescription = textInfo;
    },
    // 按钮展示处理
    parseButtonInfo(buttonStatus) {
      const miniButtons = [];
      const bigButtons = [];
      const shareFriend = {
        text: '分享给朋友',
        type: 'share',
      };
      const createPicture = {
        text: '生成海报',
        type: 'createPicture',
      };
      const attention = {
        text: '关注公众号',
        type: 'attention',
        class: 'js-open-follow',
      };
      const newPraise = {
        text: '我也要去听课',
        type: 'link',
        url: this.type === 'column' ? `/wscvis/knowledge/index?page=columnshow&alias=${this.alias}&kdt_id=${global.kdt_id}` : `/wscvis/knowledge/index?page=contentshow&alias=${this.alias}&kdt_id=${global.kdt_id}`,
      };
      const toHome = {
        text: '进店逛逛',
        type: 'home',
        url: `${global.wap_url.wap}/showcase/homepage?kdt_id=${global.kdt_id}`,
      };
      if (buttonStatus.showPaidBtn) {
        const isReward = this.userInfo.isReward;
        const firstPriceChannel = this.praiseActivityDetail.prizeChannel === 1;
        const isNormalPaid = buttonStatus.isNormalPaid;
        let url;
        let text = isReward ? '查看奖励' : '领取奖励';
        if (firstPriceChannel) {
          url = `https://h5.youzan.com/wscump/coupon/collection?kdt_id=${global.kdt_id}`;
        } else if (this.type === 'column') {
          url = `/wscvis/knowledge/index?page=columnshow&alias=${this.alias}&kdt_id=${global.kdt_id}`;
        } else {
          url = `/wscvis/knowledge/index?page=contentshow&alias=${this.alias}&kdt_id=${global.kdt_id}`;
        }
        if (isNormalPaid) {
          text = '查看课程';
          if (this.type === 'column') {
            url = `/wscvis/knowledge/index?page=columnshow&alias=${this.alias}&kdt_id=${global.kdt_id}`;
          } else {
            url = `/wscvis/knowledge/index?page=contentshow&alias=${this.alias}&kdt_id=${global.kdt_id}`;
          }
        }
        // 如果还没有领取商品 并且有信息采集项，需要跳转单独的领取页面
        if (!isReward) {
          const rewriteUrl =
            isNormalPaid || get(this.content, 'collectInfoSetting.customizeItems', []).length > 0;
          if (rewriteUrl) {
            const redirectUrl = location.origin + url;
            url = 'https://h5.youzan.com/wscvis/edu/get-course?kdt_id=' + global.kdt_id +
                  '&channel=collectZan&bizId=' + this.praiseDetail.id +
                  '&type=' + this.praiseDetail.owlType +
                  '&alias=' + this.alias +
                  '&redirectUrl=' + encodeURIComponent(redirectUrl);
          }
        }
        // 发起人角色，已购买或满赞
        bigButtons.push({
          text,
          type: (firstPriceChannel && !isNormalPaid) || !isReward
            ? 'absoluteLink'
            : 'link',
          url,
        });
      } else if (buttonStatus.showSourceSmallBtn) {
        // 发起人角色，集赞中，小按钮：分享给朋友，生成图片
        miniButtons.push(shareFriend);
        miniButtons.push(createPicture);
      } else if (buttonStatus.showBigPublicBtn) {
        // 活动结束，失效，统一处理
        if (hasAttention) {
          // 有公众号
          bigButtons.push({
            text: '关注公众号 了解精彩课程',
            type: 'attention',
            class: 'js-open-follow',
          });
        } else {
          // 无公众号
          bigButtons.push(toHome);
        }
      } else if (buttonStatus.showFriendSmallBtn) {
        // 点赞人角色，显示关注公众号，我也要去听课
        if (hasAttention) {
          miniButtons.push(attention);
          miniButtons.push(newPraise);
        } else {
          bigButtons.push(newPraise);
        }
      } else if (buttonStatus.showBigClickBtn) {
        // 点赞人角色，未点赞
        bigButtons.push({
          text: '为好友助力',
          type: 'click',
        });
      }
      this.buttonInfo.bigButtons = bigButtons;
      this.buttonInfo.miniButtons = miniButtons;
    },

    onButtonClick(evt) {
      const type = evt.target.getAttribute('data-type');
      if (type === 'share') {
        // 引导好友分享
        this.showGuide = true;
        this.isCode = false;
        this.isCard = false;
        this.isGuide = true;
      } else if (type === 'createPicture') {
        // 绘制海报
        this.showGuide = true;
        this.isGuide = false;
        this.isCode = false;
        // this.isCard = true;
        this.makeCard();
      } else if (type === 'click') {
        // 为好友点赞
        this.clickPraise();
      } else if (type === 'link') {
        // this.$router.push(evt.target.getAttribute('href'));
        SafeLink.redirect({
          url: evt.target.getAttribute('href'),
          kdtId: window._global.kdt_id,
        });
      } else if (type === 'absoluteLink') {
        SafeLink.redirect({
          url: evt.target.getAttribute('href'),
          kdtId: window._global.kdt_id,
        });
      } else if (type === 'home') {
        SafeLink.redirect({
          url: evt.target.getAttribute('href'),
          kdtId: window._global.kdt_id,
        });
      }
    },

    // 点赞
    clickPraise() {
      const clickParams = {
        zanId: this.praiseActivityDetail.id,
        zanSetId: this.praiseDetail.id,
      };

      apis.clickPraise(clickParams).then((data) => {
        if (data) {
          this.sourceDescription = '感谢你为我助力';
          this.buttonStatus.showFriendSmallBtn = true;
          this.parseButtonInfo(this.buttonStatus);
          this.hasClickedNum++;
          setTimeout(() => {
            this.getSupportInfo();
          }, 2000);
        }
      }).catch((err) => {
        Toast(err);
      });
    },

    /*
      * 修改分享内容
      */
    setShareInfo(data) {
      const title = `快来帮我助力，加入《${data.title}》的学习中吧！`;
      setShareData({
        notShare: false,
        desc: data.desc,
        link: getPaidContentShareLink(window.location.href, this.$route),
        title: title,
        cover: data.cover,
      });
    },

    /* 生成分享卡片 */
    makeCard() {
      const _this = this;
      if (this.cardImage) {
        this.isCard = true;
      } else {
        this.getCanvasData().then(function(data) {
          Toast.clear();
          _this.cardImage = data;
          _this.isCard = true;
        })
          .catch((err) => {
            console.log(err);
            Toast('生成卡片失败，等会再来试试吧~');
          });
      }
    },

    getCanvasData() {
      Toast.loading({
        duration: 10000,
      });

      return new Promise((resolve, reject) => {
        const qrImg = new Image();
        // const bannerImg = new Image();
        // const avatarImg = new Image();
        const content = this.content;
        const collectNum = this.praiseActivityDetail.collectNum;
        let title = content.title;
        const author = content.author;
        const price = (content.price / 100).toFixed(2);
        qrImg.src = this.qrCode;
        this.uploadAvatar(this.praiseDetail.avatar).then((avatar) => {
          Promise.all([
            this.loadUrlImage(avatar),
            this.loadUrlImage(content.cover),
          ]).then(([avatarImg, bannerImg]) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const ratio = getScreenRatio(ctx);
            canvas.width = 325 * ratio;
            canvas.height = 475 * ratio;
            canvas.style.width = '325px';
            canvas.style.height = '475px';
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

            this.drawTopRoundRect(0, 0, 325, 475, 6, ctx);
            ctx.clip();
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 325, 475);

            // 商品大图
            const bannerImgWidth = getImageWidth(bannerImg, 325, 172);
            ctx.beginPath();
            ctx.drawImage(
              bannerImg,
              (325 - bannerImgWidth.width) / 2,
              (172 - bannerImgWidth.height) / 2,
              bannerImgWidth.width,
              bannerImgWidth.height,
            );

            // 商品信息容器
            // 商品名称 20 length
            ctx.fillStyle = '#222';
            ctx.font = '500 13px Arial';
            let titleLength = 0;
            if (title.length <= 20) {
              titleLength = ctx.measureText(title).width;
              ctx.fillText(`${title}`, (325 - titleLength) / 2, 198);
            } else {
              title = title.substr(0, 20) + '...';
              titleLength = ctx.measureText(title).width;
              ctx.fillText(`"${title}"`, (325 - titleLength) / 2, 198);
            }

            // 作者
            ctx.fillStyle = '#999';
            ctx.font = '11px Arial';
            let authorText = '';
            authorText = (author ? `主讲人:${author} | ` : '') + `价值${price}元的付费知识`;
            const textLength = ctx.measureText(authorText).width;
            ctx.fillText(authorText, (325 - textLength) / 2, 222);

            // 两端的小圆圈
            ctx.fillStyle = 'rgba(0, 0, 0, .5)';
            ctx.arc(0, 243, 10, 0.5 * Math.PI, 1.5 * Math.PI, true);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(325, 243, 10, 0.5 * Math.PI, 1.5 * Math.PI);
            ctx.fill();
            ctx.closePath();

            // 分割线
            ctx.save();
            ctx.setLineDash([5, 3]);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#d0d0d0';
            ctx.beginPath();
            ctx.moveTo(10, 243);
            ctx.lineTo(315, 243);
            ctx.stroke();
            ctx.restore();

            // 发起人
            // 背景
            ctx.beginPath();
            ctx.fillStyle = '#efefef';
            /* ctx.arc(70, 528, 44, 0.5 * Math.PI, 1.5 * Math.PI); */
            ctx.fillRect(35, 260, 254, 44);
            ctx.arc(289, 282, 22, 0.5 * Math.PI, 1.5 * Math.PI, true);
            ctx.fill();

            // 发起人头像
            ctx.save();
            ctx.arc(37, 282, 21, 0, 2 * Math.PI, true);
            ctx.clip();
            ctx.drawImage(avatarImg, 15, 260, 44, 44);
            ctx.restore();

            // 文案
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            const inviteText = `需要${collectNum}个助力,快来帮我！`;
            ctx.fillText(inviteText, 62, 287);

            // 二维码容器
            ctx.fillStyle = '#999';
            ctx.font = '11px Arial';
            const qrText = '长按识别二维码，为我助力吧';
            const qrTextLength = ctx.measureText(qrText).width;
            ctx.fillText(qrText, (325 - qrTextLength) / 2, 463);

            // 二维码
            ctx.drawImage(qrImg, 100, 322, 128, 128);
            resolve(canvas.toDataURL('image/png'));
          }).catch((err) => {
            console.error(err, '获取图片失败');
          });
        });
      });
    },

    loadUrlImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = src;
        img.onload = () => {
          resolve(img);
        };
      });
    },

    /**
       * top圆角矩形
       */
    drawTopRoundRect(x, y, width, height, radius, context) {
      context.beginPath();
      context.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
      context.lineTo(width - radius + x, y);
      context.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
      context.lineTo(width + x, height + y - radius);
      context.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
      context.lineTo(radius + x, height + y);
      context.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
      context.closePath();
    },

    uploadAvatar(avatarImg) {
      return new Promise((resolve, reject) => {
        uploadNetMaterial(avatarImg).then(res => {
          let avatar = DEFAULT_USER_INFO;
          if (res.code === 0) {
            avatar = res.data.url;
            if (typeof avatar === 'string') {
              avatar = avatar.replace(/^http:/, 'https:');
            }
          }
          resolve(avatar);
        })
          .catch(error => {
            console.error(error, '上传头像失败');
          });
      });
    },

    onShowExplain() {
      this.showExplainDlg = true;
    },

    onCloseExplain() {
      this.showExplainDlg = false;
    },
  },
};
</script>

<style lang="scss">
  @import "var";
  @import 'mixins/index.scss';

  .support-invitation {
    &__content {
      position: relative;

      &-cover {
        /* position: relative;
        width: 100%;
        overflow: hidden;

        &-img {
          position: absolute;
          top: 50%;
          left: 50%;
          max-width: 100%;
          transform: translate(-50%, -50%);

          &-old {
            position: absolute;
            top: 12px;
            left: 50%;
            height: calc(100% - 24px);
            border-radius: 4px;
            transform: translateX(-50%);
          }
        } */
      }

      &-info {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background-image: linear-gradient(180deg, rgba(51, 51, 51, 0) 0%, rgba(51, 51, 51, 1) 100%);

        .info {
          height: 60px;
          padding: 10px 0;
          margin: 0 20px;
          text-align: center;
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
          box-sizing: border-box;

          div {
            font-size: 13px;
            color: $c-white;
          }
        }

        &-title {
          line-height: 25px;
        }

        &-detail {
          line-height: 20px;

          .devide {
            position: relative;
            display: inline-block;
            width: 1px;
            height: 15px;
            margin: 0 2px;
            vertical-align: text-top;

            &::after {
              @include border-retina(left);
            }
          }
        }
      }
    }

    &__activity {
      padding: 0 15px 20px;
      background-color: #333;

      &-pannel {
        position: relative;
        padding: 15px 0;
        background-color: $c-white;
        border-radius: 10px;
      }

      &-source {
        display: flex;
        height: 44px;
        margin: 0 15px;
        background-color: #efefef;
        border-radius: 25px;
        align-items: center;

        .avatar {
          width: 44px;
          height: 44px;
          vertical-align: middle;
          border-radius: 100%;
        }

        .description {
          padding-right: 15px;
          margin-left: 10px;
          font-size: 13px;
          line-height: 20px;
          color: $c-darker;
        }
      }

      &-button {
        display: flex;
        height: 44px;
        margin: 20px 15px;
        line-height: 44px;
        justify-content: space-between;

        &-big {
          width: 100%;
          font-size: 16px;
          color: $c-white;
          background-color: $c-red-light;
          box-shadow: 1px 2px 9px 1px rgba(255, 67, 67, .12);
        }

        &-min {
          width: 150px;
          font-size: 16px;

          &:first-child {
            color: $c-red-light;
            border-color: $c-red-light;
            box-shadow: 1px 2px 9px 1px rgba(255, 67, 67, .11);
          }

          &:last-child {
            color: $c-white;
            background-color: $c-red-light;
            box-shadow: 1px 2px 9px 1px rgba(255, 67, 67, .12);
          }
        }
      }

      &-tips {
        position: relative;
        padding-bottom: 15px;
        margin: 0 15px;
        font-size: 13px;
        color: $c-gray-dark;
        text-align: center;

        &::after {
          @include border-retina(bottom);
        }
      }

      &-list {
        display: flex;
        max-width: 320px;
        padding-top: 10px;
        margin: 0 auto;
        flex: 1;
        flex-wrap: wrap;

        &-item {
          width: 30px;
          height: 30px;
          margin: 5px;

          img {
            height: 100%;
            overflow: hidden;
            border-radius: 100%;
          }
        }
      }

      &-explain {
        position: absolute;
        bottom: 5px;
        width: 100%;
        padding: 5px;
        font-size: 14px;
        color: $c-gray-dark;
        text-align: center;

        &-popup {
          width: 315px;
          border-radius: 4px;

          .popup {
            &-title {
              padding: 20px 0;
              font-size: 16px;
              color: $c-black;
              text-align: center;
            }

            &-content {
              padding: 0 20px 20px;
              font-size: 14px;
              line-height: 18px;
              color: $c-gray-dark;
            }

            &-btn {
              position: relative;
              padding: 20px 0;
              font-size: 16px;
              color: $c-red-light;
              text-align: center;

              &::after {
                @include border-retina(top);
              }
            }
          }
        }
      }
    }

    .guide-popup {
      top: 0;
      right: 0;
      left: 0;
      width: 100%;
      background-color: inherit;
      transform: none;

      &__image {
        height: 230px;
        margin-top: 20px;
        margin-right: 20px;
        background-image: url(/public_files/2018/04/08/share-guide-book@2x.png);
        background-position: right;
        background-repeat: no-repeat;
        background-size: contain;
      }

      &__text {
        margin-top: 30px;
        font-size: 14px;
        color: $c-white;
        text-align: center;
      }

      .groupon-share-card {
        position: relative;
        margin: 50px;

        .img-content {
          img {
            max-width: 100%;
          }
        }

        .note {
          margin-top: 30px;
          font-size: 14px;
          color: $c-white;
          text-align: center;
        }
      }
    }
  }
</style>
