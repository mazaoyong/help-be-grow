import { get } from 'lodash';
import { Toast } from 'vant';
import { ActionTree } from 'vuex';
import { setShareData } from '@youzan/wxsdk';
// @ts-ignore
import userInfoAuthorize from '@youzan/user-info-authorize';
import args from '@youzan/utils/url/args';
import { openCollectInfoPopupHOF } from 'components/info-collect-popup';
import { ActivityStatus, IActionButton, IState, ITrackPosterInfo } from '../types/store';
import {
  getUserHelpStatus,
  getDetailJson,
  postCollectZanJson,
  findGoodsByPage,
  getListHelperPagedJson,
  listAttributeByIdList,
  sendVerifyCode,
  postParticipateJson,
  getVuePoster,
} from '../api';

import {
  getShareQrcode,
  navigateToHomePage,
  navigateToOrderDetail,
  navigateToCourseDetailPage,
  navigateToActivityEmptyPage,
} from '../utils';

import { DEFAULT_AVATAR, DEFAULT_USERNAME } from '../constants';
import { Timings } from '@/common/directives/track';
import { InstanceProgressStatus } from '../types/activity';

const actions: ActionTree<IState, IState> = {

  // ⬇ 初始化整个 app，一系列 Actions 的组合。
  async initApp({ dispatch, commit, getters }, payload) {
    // ▶ 0. payload 中是页面的 query 参数
    const { alias, fromId, source } = payload;
    // ▶ 1.初始化活动信息
    try {
      await dispatch('initActivity', alias);
      dispatch('collectTuitionBaseInfo');
      dispatch('collectMainBtnInfo');
    } catch (err) {
      // ▶▶ 1.1 如果失败的话，重定向到活动不存在页面，后续步骤无需进行
      navigateToActivityEmptyPage();
      return;
    }

    /** ▶ 2.初始化引导弹窗（免费领 xxx 元学费）
     *  ▶▶ ① 分享场景不弹窗（有 fromId）
     *  ▶▶ ② 活动未开始、已结束、已参与活动等不弹窗（即状态为未参与）
     *  ▶▶ ③ 没有免费的学费不弹窗
    */
    if (!fromId && getters.activityStatus === ActivityStatus.NOT_JOIN) {
      const { exists } = getters.freeTuition;
      if (exists) {
        commit('setIsPopupGuideVisible', true);
      }
    }

    // ▶ 3.初始化助力信息（包括助力弹窗逻辑）
    await dispatch('initBoostInfo', payload);

    // ▶ 4.初始化商品数据
    dispatch('initGoodsData');
    // ▶ 5.初始化助力的好友数据
    dispatch('initBoostFriends');
    // ▶ 6.初始化分享信息
    dispatch('initShareInfo');

    // ▶ 7.必要的信息都已经初始化完成后，可以告知 ui 渲染页面了（取消骨架屏）
    commit('setAppIsReady', true);

    commit('setSource', source);
  },

  // ⬇ 如果是从分享链接点进来，那么得初始化助力信息
  async initBoostInfo({ commit, getters, state }, payload) {
    const { alias, fromId } = payload;
    // ▶ 0.没有 fromId，什么也不做
    if (!fromId) {
      return;
    }

    // ▶ 1.设置 state 的 fromInstanceId，其他场景要用到
    commit('setFromInstanceId', fromId);

    // ▶ 2.对一些场景进行判断
    const { activityStatus } = getters;
    // ▶▶ 2.1 活动没开始或已结束，啥也不做
    if (activityStatus === ActivityStatus.NOT_STARTED || activityStatus === ActivityStatus.OVER) {
      return;
    }
    // ▶▶ 2.2 自己点击自己的分享链接（即 fromId 与 instanceInfo.id 相同） ，啥也不做
    if (Number(fromId) === get(state, 'instanceInfo.id')) {
      return;
    }

    // ▶ 3.请求当前用户的助力状态，来进行操作
    try {
      const boostInfoData = await getUserHelpStatus(alias, fromId);
      commit('setBoostInfo', boostInfoData);
      const {
        hasActivityHelped,
        hasInstanceHelped,
        hasReachedFinalPhase,
        hasTuitionPaid,
      } = boostInfoData;
      // ▶▶ 3.1 判断各种异常场景
      // ▶▶▶ ①好友已支付/已集齐
      if (hasTuitionPaid || hasReachedFinalPhase) {
        Toast('你的好友已完成助力活动，无需助力');
        return;
      }
      // ▶▶▶ ②已经助力过这个好友的实例
      if (hasInstanceHelped) {
        Toast('你已经助力过该好友');
        return;
      }
      // ▶▶▶ ③已经助力过这个活动
      if (hasActivityHelped) {
        Toast('每人只能给一个好友助力，已超过可助力的次数');
        return;
      }
      // ▶▶ 3.2 正常场景下，弹出助力弹窗
      commit('setBoostPopupVisible', true);
    } catch (errMsg) {
      // ▶▶ 3.3 catch 下接口请求的报错
      Toast(errMsg);
    }
  },

  // ⬇ 初始化活动信息（模板以及实例）
  async initActivity({ commit }, alias) {
    // ▶ 1.请求活动信息
    const activityInfoData = await getDetailJson(alias);
    const { hasInstance, tuitionActivity, tuitionInstance } = activityInfoData;
    // ▶ 2.设置活动模板信息
    commit('setTemplateInfo', tuitionActivity);
    // ▶ 3.设置活动实例信息（ tuitionInstance 可能是 null ）
    commit('setInstanceInfo', tuitionInstance || {});
    // ▶ 4.设置有没有活动实例
    commit('setHasInstance', hasInstance);
    if (tuitionInstance && args.get('eduOrigin', location.href) === '') {
      // 如果有实例，需要给url添加来源参数
      const _final = args.add(location.href, { eduOrigin: `TUITION::${tuitionInstance.id}` });
      history.replaceState(null, '', _final);
    }
  },

  // ⬇ 初始化分享信息
  initShareInfo({ getters, dispatch }) {
    /** ▶ 1.初始化分享的信息，接口比较耗时，以下三种情况才请求海报（剩余情况请看定义）。
     *  ▶▶ ① 用户活动正在进行中
     *  ▶▶ ② 用户已经集满
     *  ▶▶ ③ 用户已经兑换
    */
    if (![
      ActivityStatus.FULL,
      ActivityStatus.ONGOING,
      ActivityStatus.REDEEMED,
    ].includes(getters.activityStatus)) {
      return;
    }
    // ▶ 2.初始化分享海报
    dispatch('initSharePoster');
    // ▶ 2.初始化微信分享的信息
    dispatch('initWechatShareInfo');
  },

  // 给好友助力的动作
  async boost({ state, commit, dispatch }) {
    try {
      await authorize();
    } catch {
      return;
    }
    const { fromInstanceId, hasInstance } = state;
    if (!fromInstanceId) {
      return;
    }
    postCollectZanJson(fromInstanceId)
      .then(isSuccess => {
        /** 太恶心了 太恶心了  isSuccess 居然有可能是 Object {code:xxx，success: false} */
        if (typeof isSuccess === 'boolean' && isSuccess) {
          Toast.success({
            message: '助力成功',
            duration: 1000,
            forbidClick: true,
            onClose: () => {
              commit('setBoostPopupVisible', false);
              if (!hasInstance) {
                dispatch('join');
              }
            },
          });
        } else {
          Toast.fail('助力失败');
        }
      })
      .catch(errMsg => {
        Toast(errMsg);
      });
  },

  initGoodsData({ state, commit }) {
    const {
      templateInfo: { id },
    } = state;
    findGoodsByPage(id).then(({ content = [], total = 0 }) => {
      commit('setCourses', content.filter((item:any) => Boolean(item)));
      commit('setCoursesCount', total);
    });
  },

  initBoostFriends({ state, commit }) {
    if (!state.hasInstance) {
      return;
    }
    const {
      instanceInfo: { id },
    } = state;

    getListHelperPagedJson(id).then(({ content = [], total = 0 }) => {
      commit('setBoostFriends', content);
      commit('setBoostFriendsCount', total);
    });
  },

  async join({ state, dispatch, getters }) {
    try {
      await authorize();
    } catch {
      return;
    }
    const alias = get(state, 'templateInfo.alias', '');
    const joinData : any = {
      alias,
      fromInstanceId: state.fromInstanceId,
    };
    const needInfoCollect = get(state, 'templateInfo.needCollectInfo', false);
    if (needInfoCollect) {
      try {
        const attributeIds = get(state, 'templateInfo.attributeIds', []);
        const needVerifyCode = !!get(state, 'templateInfo.needVerifyCode', false);
        const attributeData = await listAttributeByIdList(attributeIds);
        // 学员姓名和手机号必填，后端可能会返回 false，强制校验一下
        attributeData.forEach((item) => {
          if (['edu_stuContractPhone', 'edu_stuName'].includes(item?.attributeKey)) {
            item.needFill = true;
          }
        });
        const titleSuffix = getters.freeTuition.exists ? '领取学费' : '参与活动';
        const { attributeItems, verifyCode } = await openCollectInfoPopupHOF({
          title: `提交信息后${titleSuffix}`,
        })({
          props: {
            infoCollectionItems: attributeData,
            infoCollectDto: {},
            submitText: '提交',
            needVerifyCode,
            scene: 4,
          },
          on: {
            sendCaptcha: (
              mobile: string,
              callBack: (a: any, b?: any) => void,
            ) => {
              return sendVerifyCode(alias, mobile)
                .then(data => {
                  callBack(data);
                })
                .catch(errMsg => {
                  callBack(false, errMsg);
                });
            },
          },
        });
        // 信息采集完成触发埋点数据上报
        dispatch('runSubmitCollectInfo');

        joinData.attributeItems = attributeItems;
        joinData.verifyCode = verifyCode;
      } catch (errMsg) {
        Toast(errMsg || '信息采集错误，请重试');
        return;
      }
    }
    try {
      const isSuccess = await postParticipateJson(joinData);
      if (isSuccess) {
        try {
          await dispatch('initActivity', alias);
        } catch {
          Toast('获取活动信息错误，请刷新页面');
          return;
        }
        dispatch('initWechatShareInfo');
        await dispatch('initSharePoster');
        if (getters.freeTuition.exists) {
          Toast.success({ message: '成功获得学费',
            duration: 1000,
            onClose: () => {
              dispatch('share');
            },
          });
        } else {
          dispatch('share');
        }
      } else {
        Toast('发起活动失败，请刷新页面重试');
      }
    } catch (errMsg) {
      Toast(errMsg);
    }
  },

  enterShop() {
    // @todo
    navigateToHomePage();
  },

  share({ commit }) {
    commit('setPopupShareVisible', true);
  },

  toCourseDetail({ state }) {
    navigateToCourseDetailPage(state.tempCourseAlias);
  },

  redeem({ getters, commit, dispatch }, checkNeedConfirm = true) {
    const shouldShowConfirmPopup =
      getters.activityStatus === ActivityStatus.ONGOING;
    if (checkNeedConfirm && shouldShowConfirmPopup) {
      commit('setIsPopupConfirmVisible', true);
      return;
    }
    dispatch('toCourseDetail');
  },

  // ⬇ 初始化分享海报信息
  initSharePoster({ getters, state, commit, dispatch }) {
    // ▶ 1.准备生成海报需要的信息
    // ▶▶ ① .获取分享链接
    const shareLink = getters.shareLink('poster');
    //  ▶▶ ② 根据海报类型判断模板路径
    // 判断是预设海报还是自定义海报
    const posterType = get(state, 'templateInfo.bgType', 0) === 0 ? 'preset' : 'custom';
    const pathname = posterType === 'preset' ? 'ump/tuition/default' : 'ump/tuition/custom';
    // ▶▶ ③ 如果自定义海报的话，还需要取一下商家自定义的背景图
    const backgroundImage = get(state, 'templateInfo.bgUrl', '');
    // ▶▶ ④ 收集海报信息
    dispatch('collectPosterInfo', { pType: posterType, pId: '', pUrl: backgroundImage });
    // ▶▶ ⑤ 初始化分享信息的时候需要重置按钮状态
    dispatch('collectMainBtnInfo');
    // ▶ 2.生成分享二维码（该函数会根据环境自动生成对应的码）
    return getShareQrcode(shareLink).then(
      qrcodeUrl => {
        // ▶ 3.拼装海报需要的数据，请求生成海报接口
        const data = {
          avatar: state.userInfo.avatar || DEFAULT_AVATAR,
          name: state.userInfo.username || DEFAULT_USERNAME,
          qrCode: qrcodeUrl,
          maxTuition: getters.maxAmount,
          shopName: state.shopInfo.name,
          backgroundImage,
        };
        getVuePoster({
          pathname,
          data,
          snapshotConfig: {
            width: 300,
            height: 418,
          },
        })
          .then(res => {
            if (res) {
              // ▶ 3.获取海报图后，更新到 state
              commit('setPosterUrl', res.img);
            }
          });
      },
    );
  },

  // ⬇ 获取微信分享出去的封面
  initWechatShareInfo({ state, getters }) {
    // ▶ 1.拼装需要的数据
    const data = {
      avatar: state.userInfo.avatar || DEFAULT_AVATAR,
      name: state.userInfo.username || DEFAULT_USERNAME,
      maxTuition: getters.maxAmount,
    };
    // ▶ 2.请求生成海报接口
    return getVuePoster({
      pathname: 'ump/tuition/share',
      data,
      snapshotConfig: {
        width: 250,
        height: 200,
        quality: 100,
        type: 'png',
      },
    })
      .then(res => {
        const { img } = res || {};
        // ▶ 3.获得海报之后，设置微信分享参数

        let shareTitle = `最高可攒${getters.maxAmount}元，快来和我一起攒学费吧！`;

        const { currentTuitionAmount } = getters;

        if (currentTuitionAmount > 0) {
          shareTitle = `我已攒到${currentTuitionAmount}元！${shareTitle}`;
        }

        setShareData({
          link: getters.shareLink('wechat'),
          cover: img,
          title: shareTitle,
          desc: `去攒学费 >`,
        });
      });
  },

  toFrozenOrder({ state }) {
    const {
      instanceInfo: { paidOrderInfo },
    } = state;
    if (!paidOrderInfo.orderNo) {
      return;
    }
    navigateToOrderDetail(paidOrderInfo.orderNo);
  },

  showWeappTip() {
    Toast('小程序环境下暂时无法报名课程，请联系商家');
  },

  // 上报攒学费基本信息
  collectTuitionBaseInfo({ state }) {
    const { templateInfo, instanceInfo } = state;
    const { progressStatus, id = '' } = instanceInfo || {};
    if ($track) {
      $track.collect('tuition:name', templateInfo.name);
      $track.collect('tuition:id', String(id));
      $track.collect('tuition:isTopPhase', String(progressStatus === InstanceProgressStatus.FULL));
      $track.collect('needInfoCollect', String(templateInfo.needCollectInfo || false));
      $track.collect('tuitionInfoReady', 'true');
    }
  },

  collectMainBtnInfo({ getters }) {
    const mainBtnInfo: IActionButton = getters.mainActionButton;
    if ($track) {
      $track.collect('action:type', mainBtnInfo.action);
    }
  },

  runSubmitCollectInfo() {
    if ($track) {
      // 信息采集组件采用promise回调的机制，不绑定提交按钮，
      // 所以这里使用主动触发事件的方式来触发埋点
      $track.runTask('submitCollectedInfo', Timings.Interaction);
    }
  },

  collectPosterInfo(_, posterInfo: ITrackPosterInfo) {
    if ($track) {
      $track.collect('poster:type', posterInfo.pType);
      $track.collect('poster:id', posterInfo.pId);
      $track.collect('poster:url', posterInfo.pUrl);
    }
  },
};

export default actions;

async function authorize() {
  try {
    // @ts-ignore
    await userInfoAuthorize.open({
      needLogin: true,
      authTypeList: ['nicknameAndAvatar'],
    });
  } catch {
    Toast('您需要授权信息才可以参与活动');
    throw new Error();
  }
}
