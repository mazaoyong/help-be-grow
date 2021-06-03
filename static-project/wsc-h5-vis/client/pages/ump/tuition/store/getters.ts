/**
 * 该文件函数注释没有使用 jsDoc
 */
import { GetterTree } from 'vuex';
import { get } from 'lodash';
import args from '@youzan/utils/url/args';
import {
  ActivityStatus,
  IActionButton,
  IBlockMainConfig,
  ICourseItemConfig,
  IPopupCoursesConfig,
  IState,
} from '../types/store';
import {
  InstanceProgressStatus,
  InstanceStatus,
  TemplateStatus,
} from '../types/activity';
import buildUrl from '@youzan/utils/url/buildUrl';
import { DEFAULT_AVATAR } from '../constants';

import { formatMoney } from '../utils';

const getters: GetterTree<IState, IState> = {
  // 获取分享给别人的链接，source 字段标明了来源是海报/微信/复制链接
  // fromId 是分享的标示
  // 2020-11-10 添加来源标识，格式如edu=TUITION::[instanceId]
  shareLink(_, getters) {
    const _instanceId = getters.instanceId;
    return (source: string) => args.add(getters.pageLink, {
      source,
      fromId: _instanceId,
      eduOrigin: `TUITION::${_instanceId}`,
    });
  },

  isWeapp() {
    // @ts-ignore
    const { miniprogram = { }, platformInfo = {} } = _global;

    return miniprogram.isWeapp && platformInfo.mobile_system === 'ios';
  },

  // pageLink
  pageLink(state) {
    const alias = get(state, 'templateInfo.alias', 0);
    const kdtId = String(window._global.kdt_id);
    return buildUrl(
      `/wscvis/ump/tuition/${alias}?kdt_id=${kdtId}`,
      'h5',
      kdtId,
    );
  },

  // 活动模板 id ,区别于 alias，在 B 端表明活动，用来查询活动商品列表
  templateId(state) {
    return get(state, 'templateInfo.id', 0);
  },

  // 活动实例的 id
  instanceId(state) {
    return get(state, 'instanceInfo.id', 0);
  },

  // 最大可攒到的金额，即最高阶段的金额
  maxAmount(state): number {
    const { templateInfo } = state;
    return formatMoney(get(templateInfo, 'highestPhases.amount', 0));
  },

  freeTuition(
    state,
  ): { exists: boolean; amount: number; formattedAmount: number } {
    const lowestPhases = get(state, 'templateInfo.lowestPhases', {});
    return {
      /** 最低阶段的助力人数为 0，表示可以免费领学费啦！ */
      exists: lowestPhases.helpCnt === 0,
      amount: lowestPhases.amount,
      formattedAmount: formatMoney(lowestPhases.amount),
    };
  },

  /** 活动状态
   *  根据模板的状态和实例的状态组合出活动的状态（ViewState）
   *
   * @param {Object} state - state
   * @return {number} - 活动状态
   */
  activityStatus(state): ActivityStatus {
    const { templateInfo, instanceInfo, hasInstance } = state;
    const { status: templateStatus } = templateInfo;
    const { progressStatus, instanceStatus } = instanceInfo;

    /** 0x1 【活动未开始】模版未开始 */
    if (templateStatus === TemplateStatus.NOT_STARTED) {
      return ActivityStatus.NOT_STARTED;
    }
    if (templateStatus === TemplateStatus.PROCESSING) {
      /** 0x2 【活动未参加】模版进行中，还没创建实例 */
      if (!hasInstance) {
        return ActivityStatus.NOT_JOIN;
      }
      /** 0x3 【活动已兑换】模版进行中，实例状态已经兑换 */
      if (instanceStatus === InstanceStatus.REDEEMED) {
        return ActivityStatus.REDEEMED;
      }
      /** 0x4 【活动集赞中】模版进行中，实例状态集赞也在进行中 */
      if (progressStatus === InstanceProgressStatus.PROCESSING) {
        return ActivityStatus.ONGOING;
      }
      /** 0x5 【活动已集齐赞】模版进行中，实例状态集赞已集齐 */
      if (progressStatus === InstanceProgressStatus.FULL) {
        return ActivityStatus.FULL;
      }
    }
    /** 0x6 【活动已结束】模版已结束，实例状态不管
     * @todo 兜底逻辑
     */
    return ActivityStatus.OVER;
  },

  // 当前已经攒到的学费
  currentTuitionAmount(state) {
    if (!state.hasInstance) {
      return 0;
    }
    return formatMoney(get(state, 'instanceInfo.tuitionAmount', 0));
  },

  // ----⬇---- 复用的组件 UI 显示逻辑 ----⬇----

  // 邀请提示
  inviteTip(state, getters): string {
    const template = (remainFriendsCount: number, amount: number) => {
      return `只需邀请<span class="amount">${remainFriendsCount}</span>位好友，即可攒到<span class="friends-count">${formatMoney(
        amount,
      )}</span>元`;
    };
    /** 文案逻辑过于复杂 */
    switch (getters.activityStatus) {
      // 没加入或未开始的时候，得判断能不能免费领学费
      case ActivityStatus.NOT_JOIN:
      case ActivityStatus.NOT_STARTED:
        const {
          freeTuition: { exists, amount, formattedAmount },
        } = getters;
        if (exists) {
          return `免费领${formattedAmount}元学费`;
        }
        const lowestPhases = get(state, 'templateInfo.lowestPhases', {});
        return template(lowestPhases.helpCnt, amount);
      case ActivityStatus.FULL:
        return '已完成助力，快去兑换课程吧';
      // 进行中的话，需要计算离下一阶段还有多少人
      case ActivityStatus.ONGOING:
        const friendsCount = get(state, 'boostFriendsCount', 0);
        const nextPhase = get(state, 'instanceInfo.nextPhaseInfo', {
          helpCnt: 0,
          amount: 0,
        });
        const remainFriendsCount = nextPhase.helpCnt - friendsCount;
        return template(remainFriendsCount, nextPhase.amount);
      default:
        /**
           ActivityStatus.OVER:
           ActivityStatus.REDEEMED:
         */
        return '';
    }
  },

  // 主操作按钮
  mainActionButton(_, getters): IActionButton {
    const {
      freeTuition: { exists, formattedAmount },
      activityStatus,
    } = getters;
    switch (activityStatus) {
      case ActivityStatus.OVER:
      case ActivityStatus.NOT_STARTED:
        return {
          text: '进店逛逛',
          action: 'enterShop',
        };
      case ActivityStatus.FULL:
      case ActivityStatus.REDEEMED:
        if (exists) {
          return {
            text: `免费送好友 ${formattedAmount} 元学费`,
            action: 'share',
          };
        } else {
          return {
            text: `分享活动给好友`,
            action: 'share',
          };
        }
      case ActivityStatus.ONGOING:
        return {
          text: `邀请好友帮我攒`,
          action: 'share',
        };
      default:
        if (exists) {
          return {
            text: `免费领 ${formattedAmount} 元学费`,
            action: 'join',
          };
        } else {
          return {
            text: `邀请好友帮我攒`,
            action: 'join',
          };
        }
    }
  },

  // 课程是否显示降价
  courseItemIsCutTag(_, getters): ICourseItemConfig['cutTag'] {
    if (getters.activityStatus === ActivityStatus.FULL) {
      return {
        text: `立减¥${getters.currentTuitionAmount}元`,

        isVisible: true,
      };
    }
    return {
      text: '',
      isVisible: false,
    };
  },

  // 课程的操作按钮
  courseItemActionButton(_, getters): ICourseItemConfig['actionButton'] {
    const { activityStatus, currentTuitionAmount } = getters;

    if (
      (activityStatus === ActivityStatus.FULL ||
        activityStatus === ActivityStatus.ONGOING) &&
      currentTuitionAmount > 0
    ) {
      return {
        text: '去兑换',
        action: 'redeem',
      };
    }

    return {
      text: '去看看',
      action: 'toCourseDetail',
    };
  },

  // 进度条的 pop 提示
  progressBarPopTip(_, getters): string {
    return `最高${getters.maxAmount}元`;
  },

  // 是否显示冻结提示条
  isFrozenTipVisible(state, getters) {
    if (getters.activityStatus === ActivityStatus.OVER) {
      return false;
    }
    const { instanceInfo } = state;
    return instanceInfo.instanceStatus === InstanceStatus.FREEZING;
  },

  // ----⬇---- Header 头部区块的 UI 显示逻辑（注释请看返回值定义） ----⬇----
  blockHeaderIsBroadCasterVisible(_, getters): boolean {
    /** 活动未开始不需要请求弹幕 */
    return getters.activityStatus !== ActivityStatus.NOT_STARTED;
  },

  // ----⬇---- BlockMain 主区块的 UI 显示逻辑（注释请看返回值定义） ----⬇----
  blockMainTitle(state, getters): IBlockMainConfig['title'] {
    switch (getters.activityStatus) {
      case ActivityStatus.NOT_STARTED:
        return '活动未开始';
      case ActivityStatus.OVER:
        return '很遗憾，活动已结束';
      case ActivityStatus.REDEEMED:
        const {
          instanceInfo: { paidOrderInfo: { verifiedTuitionAmount = 0 } = {} },
        } = state;
        return `你已经使用学费兑换课程<br>节省 <span class="amount">${formatMoney(
          verifiedTuitionAmount,
        )}</span> 元`;
      default:
        return '我的学费';
    }
  },

  // ----⬇---- BlockMain 主区块的 UI 显示逻辑（注释请看返回值定义） ----⬇----
  blockMainTitleHasMargin(_, getters): boolean {
    switch (getters.activityStatus) {
      case ActivityStatus.NOT_STARTED:
      case ActivityStatus.OVER:
        return true;
      default:
        return false;
    }
  },

  blockMainAmount(_, getters): IBlockMainConfig['amount'] {
    const amount = getters.currentTuitionAmount;
    switch (getters.activityStatus) {
      case ActivityStatus.NOT_STARTED:
      case ActivityStatus.OVER:
      case ActivityStatus.REDEEMED:
        return {
          isVisible: false,
          amount,
        };
      default:
        return {
          isVisible: true,
          amount,
        };
    }
  },

  blockMainMainButton(_, getters): IBlockMainConfig['mainButton'] {
    const buttonConfig = getters.mainActionButton;
    return {
      ...buttonConfig,
      hasMotion: buttonConfig.action !== 'enterShop',
    };
  },

  blockMainIsRedeemButtonVisible(
    _,
    getters,
  ): IBlockMainConfig['isRedeemButtonVisible'] {
    return [
      ActivityStatus.FULL,
      ActivityStatus.ONGOING,
      ActivityStatus.NOT_JOIN,
    ].includes(getters.activityStatus);
  },

  blockMainGoods(state, getters): IBlockMainConfig['goods'] {
    const {
      instanceInfo: { paidOrderInfo },
    } = state;

    if (getters.activityStatus === ActivityStatus.REDEEMED) {
      return {
        isVisible: true,
        data: paidOrderInfo,
      };
    }
    return {
      isVisible: false,
    };
  },

  blockMainCountdown(state, getters): IBlockMainConfig['countdown'] {
    const { activityStatus } = getters;
    const {
      templateInfo: { endAt, startAt },
    } = state;

    switch (activityStatus) {
      case ActivityStatus.OVER:
      case ActivityStatus.REDEEMED:
        return {
          isVisible: false,
        };
      case ActivityStatus.NOT_STARTED:
        return {
          isVisible: true,
          time: startAt - Date.now(),
          suffix: '后开始',
        };
      default:
        return {
          isVisible: true,
          time: endAt - Date.now(),
          suffix: '后结束',
        };
    }
  },

  blockMainBottomButton(state, getters): IBlockMainConfig['bottomButton'] {
    if (getters.activityStatus === ActivityStatus.REDEEMED) {
      return {
        isVisible: true,
        text: '进店逛逛',
        action: 'enterShop',
      };
    }
    return {
      isVisible: false,
    };
  },

  // ===========   BoostFriends 区块的 UI 显示逻辑（注释请看返回值定义）    ====================

  blockFriendsIsVisible(state, getters): boolean {
    if (
      [
        ActivityStatus.NOT_STARTED,
        ActivityStatus.NOT_JOIN,
        ActivityStatus.OVER,
      ].includes(getters.activityStatus)
    ) {
      return false;
    }
    return state.boostFriendsCount > 0;
  },

  // ===========   popupCourses 课程弹窗的 UI 显示逻辑（注释请看返回值定义）    ====================

  blockProgressIsVisible(_, getters) {
    return ![ActivityStatus.OVER, ActivityStatus.REDEEMED].includes(
      getters.activityStatus,
    );
  },

  blockProgressConfig(state, getters) {
    const phases = get(state, 'templateInfo.helpPhases', []);
    // let progress = 0;
    // if (getters.activityStatus === ActivityStatus.FULL) {
    //   progress = 100;
    // }
    // if (getters.activityStatus === ActivityStatus.ONGOING) {
    //   // progress = 100;
    //   const nextPhase = get(state, 'instanceInfo.nextPhaseInfo', { helpCnt: 0, amount: 0 });

    // }
    const { activityStatus } = getters;
    return {
      phases,
      count: state.boostFriendsCount,
      notStart: activityStatus === ActivityStatus.NOT_JOIN || activityStatus === ActivityStatus.NOT_STARTED,
    };
  },

  // ===========   blockCourblocses 课程区块的 UI 显示逻辑（注释请看返回值定义）    ====================
  blockCoursesIsShowMoreButtonVisible(state): boolean {
    return state.coursesCount > 3;
  },

  // ===========   popupCourses 课程弹窗的 UI 显示逻辑（注释请看返回值定义）    ====================

  popupCoursesIsCardVisible(_, getters): IPopupCoursesConfig['isCardVisible'] {
    return [
      ActivityStatus.FULL,
      ActivityStatus.ONGOING,
      ActivityStatus.NOT_JOIN,
    ].includes(getters.activityStatus);
  },

  popupCoursesCardSubtitle(_, getters): IPopupCoursesConfig['subtitle'] {
    // switch (getters.activityStatus) {
    //   case ActivityStatus.NOT_JOIN:
    //     return '你还没有学费，仅能原价报名，快去领学费吧';
    //   case ActivityStatus.ONGOING:
    //     return '再邀请3为好友，即可再攒200元';
    //   case ActivityStatus.FULL:
    //     return '已完成助力，快去兑换课程吧';
    //   default:
    //     return getters.inviteTip;
    // }

    return getters.inviteTip;
  },

  popupCoursesCardActionButton(
    _,
    getters,
  ): IPopupCoursesConfig['actionButton'] {
    const { activityStatus } = getters;
    /** 在没有实例和进行中的时候才显示按钮 */
    const isVisible =
      activityStatus === ActivityStatus.NOT_JOIN ||
      activityStatus === ActivityStatus.ONGOING;
    return {
      ...getters.mainActionButton,
      isVisible,
    };
  },

  popupCoursesMiniCardDesc(_, getters): IPopupCoursesConfig['miniCardDesc'] {
    if (getters.activityStatus === ActivityStatus.ONGOING ||
      getters.activityStatus === ActivityStatus.FULL) {
      return getters.inviteTip.split('，');
    }
    return ['', ''];
  },

  // ===========   popupBoost 助力弹窗的 UI 显示逻辑（注释请看返回值定义）    ====================

  popupBoostAvatar(state): string {
    return get(state, 'boostInfo.fromInstanceAvatar', DEFAULT_AVATAR);
  },
  popupBoostButton(state, getters): IActionButton {
    const { exists, formattedAmount } = getters.freeTuition;
    let text = '帮他攒学费';
    if (!state.hasInstance && exists) {
      text += `，我领${formattedAmount}元学费`;
    }
    return {
      text,
      action: 'boost',
    };
  },

  // ===========   popupFriends 助力弹窗的 UI 显示逻辑（注释请看返回值定义）    ====================
  popupFriendsButton(_, getters) {
    if (getters.activityStatus !== ActivityStatus.ONGOING) {
      return {
        isVisible: false,
      };
    }
    return {
      text: '继续邀请攒学费',
      action: 'share',
      isVisible: true,
    };
  },
};

export default getters;
