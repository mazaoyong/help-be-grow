import get from 'lodash/get';
import { computeDiscountPrice } from '../utils';

// import * as Log from '../track';

import { GOODS_TYPE } from 'constants/course/goods-type';
import { GROUPON_STATUS } from '../../constants';

const mutations = {
  INIT_DATA(state, payload) {
    this.commit('FORMAT_GOOD');
    this.commit('FORMAT_INVITE_INFO');
    this.commit('FORMAT_GROUPON_INFO');
    this.commit('FORMAT_JOINSETTING');
  },
  // 初始化错误信息
  INIT_ERROR_DATA(state, payload) {
    state.groupItem = payload.groupItem;
    state.waitFlush = payload.waitFlush;
    state.alertTitle = payload.alertTitle;
    state.isFetched = true;
    try {
      window.yzStackLog && window.yzStackLog.log({
        name: 'groupon-detail',
        message: '用户开团异常',
        extra: {
          payload,
        },
        level: 'warn',
      });
    } catch (error) {
    }
  },

  SET_SHARE_URL(state, url) {
    state.shareUrl = url;
  },

  // 格式化商品信息
  FORMAT_GOOD(state) {
    const { proDetail, proType, skuFormatModel } = state;
    let courseTitle = '';
    let picture = '';
    let desc = '';
    let salesNum = 0;
    if (proType === GOODS_TYPE.COURSE) {
      const { title, pictures, subTitle } = proDetail;
      const { soldNum } = skuFormatModel;
      courseTitle = title;
      picture = pictures[0];
      salesNum = soldNum;
      desc = subTitle;
    } else {
      const { title, cover, subscriptionsCount, summary } = proDetail;
      courseTitle = title;
      picture = cover;
      salesNum = subscriptionsCount;
      desc = summary;
    }

    state.title = courseTitle;
    state.picture = picture;
    state.desc = desc;
    state.salesNum = salesNum;
  },

  // 格式化邀请信息
  FORMAT_INVITE_INFO(state) {
    const { groupInfo, joinRecords = [] } = state.grouponDetail;
    const { isJoinedGroup } = groupInfo;
    let inviteInfo = {};
    const currentUserId = _global.visBuyer.buyerId;
    if (isJoinedGroup) {
      joinRecords.forEach(item => {
        if (item.buyerId === currentUserId) {
          inviteInfo = item;
        }
      });
    } else if (state.shareUserId) {
      // 如果有分享人的信息，且当前用户未参加当前团，邀请部分展示分享人信息
      joinRecords.forEach(item => {
        if (item.buyerId === Number(state.shareUserId)) {
          inviteInfo = item;
        }
      });
    } else {
      joinRecords.forEach(item => {
        if (item.isHead) {
          inviteInfo = item;
        }
      });
    }
    state.inviteInfo = inviteInfo;
  },

  // 判断用户是否参与其他进行中的拼团活动
  OTHER_GROUP(state, payload = []) {
    const groups = payload;
    const currentGroupId = state.groupId;
    groups.length > 0 && groups.forEach(item => {
      if (item.groupId !== currentGroupId && item.state === GROUPON_STATUS.GOING) {
        state.oterGroup = item;
      }
    });
  },

  // 格式化数据文案
  FORMAT_GROUPON_INFO(state) {
    const { proDetail, proType, grouponDetail, isOwnAsset, oterGroup, skuFormatModel } = state;
    const { groupInfo, goodsInfo, alertType } = grouponDetail;
    const { isGroupOnSuccess, isJoinedGroup, isGroupOnFailed, isEnd, gapNum, remindTime } = groupInfo;
    const { maxSkuPrice, minSkuPrice, skuInfo = {} } = goodsInfo;

    let overTip = '';
    let mainTip = '';
    let smallTip = '';
    // 计算最大优惠
    let maxDiscountPrice = 0;
    let originPriceArray = [];
    let activityPriceArray = [];

    // 是否展示最大优惠价格
    let showSmallMaxDiscount = false;
    let showMainMaxDiscount = false;

    // 活动价格及按钮处理
    for (let key in skuInfo) {
      // 线下课需要按照sku去计算最大优惠价
      if (proType === GOODS_TYPE.COURSE) {
        activityPriceArray.push({
          id: key,
          price: skuInfo[key],
        });
      } else {
        activityPriceArray.push(skuInfo[key]);
      }
    }
    const newGroupPrice = maxSkuPrice === minSkuPrice ? [minSkuPrice] : [minSkuPrice, maxSkuPrice];
    const newGroupSuffixText = newGroupPrice.length > 1 ? '起' : '';
    const newGroupBtn = {
      text: '开个新团',
      action: 'newGroup',
      type: 'mainBtn',
      price: newGroupPrice[0],
      suffix: newGroupSuffixText,
    };
    const joinGroupBtn = {
      text: '前往参团',
      action: 'joinGroup',
      type: 'mainBtn',
      price: newGroupPrice[0],
      suffix: newGroupSuffixText,
    };

    // 原价购买按钮
    let originPrice = 0;
    let originSuffixText = '';
    let stock = 0;

    // 原价处理
    if (proType === GOODS_TYPE.COURSE) {
      const { hasSku, minPrice, maxPrice, stockNum = 0, list = [], collectionId } = skuFormatModel;
      originPrice = minPrice === maxPrice ? [minPrice] : [minPrice, maxPrice];
      originSuffixText = originPrice.length > 1 ? '起' : '';
      stock = stockNum;
      if (hasSku) {
        list.forEach((item) => {
          originPriceArray.push({
            id: item.id,
            price: item.price,
          });
          // originPriceArray[item.id] = item.price;
        });
      } else {
        originPriceArray.push({
          id: collectionId,
          price: minPrice,
        });
      }
    } else {
      originPrice = [get(proDetail, 'price', 0)];
      originSuffixText = '';
      originPriceArray = originPrice;
    }

    const originBtn = {
      text: '直接购买',
      action: 'originPay',
      type: 'textBtn',
      price: originPrice[0],
      suffix: originSuffixText,
    };

    const inviteBtn = {
      text: '邀请好友参团',
      action: 'guideShare',
      type: 'mainBtn',
    };

    const cardBtn = {
      text: '生成分享海报',
      action: 'makeCard',
      type: 'textBtn',
    };

    const homeBtn = {
      text: '进店逛逛',
      action: 'toHome',
      type: 'mainBtn',
    };
    // 最大优惠价
    maxDiscountPrice = computeDiscountPrice(originPriceArray, activityPriceArray, proType);
    let buttons = [];
    // 知识付费的已购买和有进行中的团逻辑单独处理
    if (proType !== GOODS_TYPE.course && isOwnAsset && !isJoinedGroup) {
      mainTip = '你已拥有该门课程，不用再买了哦';
      buttons.push({
        text: '查看课程',
        action: 'toPct',
        type: 'mainBtn',
      });
    } else if (oterGroup.groupId) {
      mainTip = '你已有1个进行中的团啦，不能再买了哦';
      buttons.push({
        text: '查看我的团',
        action: 'selfGroup',
        type: 'mainBtn',
      });
    } else {
      if (isJoinedGroup) {
        // 用户参与了当前团
        if (isGroupOnSuccess) {
          mainTip = '拼团成功，祝你学习愉快！';
          buttons.push({
            text: '查看课程',
            action: 'toPct',
            type: 'mainBtn',
          });
        } else if (!isEnd) {
          // 活动未结束
          if (isGroupOnFailed) {
            // 拼团失败
            mainTip = '拼团失败，已退款';
            smallTip = '支付欠款将在1-15个工作日原路返还至你的账户';
            buttons.push(newGroupBtn);
            buttons.push(originBtn);
          } else {
            // 拼团进行中
            mainTip = `还差<em>${gapNum}</em>人，组队最高立减`;
            // 并发支付后参团的那个团已满，后端在支付完成后新开了一个团
            overTip = alertType === 3 ? '上个团已满，你已被选为新团长' : '';
            showMainMaxDiscount = true;
            state.showCountDown = true;
            buttons.push(inviteBtn);
            buttons.push(cardBtn);
          }
        } else {
          mainTip = '拼团失败，已退款';
          smallTip = '支付欠款将在1-15个工作日原路返还至你的账户';
          originBtn.type = 'mainBtn';
          buttons.push(originBtn);
        }
      } else {
        // 用户未参与了当前团
        if (proType === GOODS_TYPE.COURSE && stock === 0) {
          mainTip = '该课程已售罄，去看看其他课程吧';
          buttons.push(homeBtn);
        } else if (!isEnd) {
          if (isGroupOnSuccess) {
            // 团已满
            if (alertType === 2) {
              // 从上个团参团，上个团满，但是设置了团长价，参团失败
              mainTip = '上个团已满，去开个新团吧!';
              smallTip = '支付欠款将在1-15个工作日原路返还至你的账户';
            } else {
              mainTip = '此团已满员，去开个新团吧！';
              smallTip = '组队最高立省';
              showSmallMaxDiscount = true;
            }
            buttons.push(newGroupBtn);
            buttons.push(originBtn);
          } else if (isGroupOnFailed) {
            // 团失败
            mainTip = '此团已失效，去开个新团吧！';
            smallTip = '组队最高立省';
            showSmallMaxDiscount = true;
            buttons.push(newGroupBtn);
            buttons.push(originBtn);
          } else {
            mainTip = `<span>还差<em>${gapNum}</em>人，组队最高立减</span>`;
            showMainMaxDiscount = true;
            state.showCountDown = true;
            buttons.push(joinGroupBtn);
            buttons.push(originBtn);
          }
        } else {
          mainTip = '拼团活动已结束';
          originBtn.type = 'mainBtn';
          buttons.push(originBtn);
        }
      }
    }

    state.overTip = overTip;
    state.mainTip = mainTip;
    state.smallTip = smallTip;
    state.buttons = buttons;
    state.originPrice = originPrice;
    state.newGroupPrice = newGroupPrice;
    state.isJoinedGroup = isJoinedGroup;
    state.maxDiscountPrice = maxDiscountPrice;
    state.showMainMaxDiscount = showMainMaxDiscount;
    state.showSmallMaxDiscount = showSmallMaxDiscount;
    state.grouponEndAt = new Date().getTime() + remindTime * 1000;
    state.isFetched = true;
  },

  FORMAT_JOINSETTING(state) {
    const { joinGroupSetting, isOwnAsset, isJoinedGroup, grouponDetail } = state;
    const {
      groupOpen,
      popupAfterPurchasingOpen,
      qrCodeGuideText,
      groupPicture,
      guideTitle,
      guideCopy,
      buttonCopy,
    } = joinGroupSetting;
    const { isGroupOnFailed } = grouponDetail.groupInfo;

    if (groupOpen && popupAfterPurchasingOpen && (isOwnAsset || (!isGroupOnFailed && isJoinedGroup))) {
      state.isShowPromoteCard = 1;
      state.joinSettingInfo = {
        qrCodeGuideText,
        groupPicture,
        guideTitle,
        guideCopy,
        buttonCopy,
      };
    }
  },

  SET_SL(state, payload) {
    state.sl = payload;
  },
};

export default mutations;
