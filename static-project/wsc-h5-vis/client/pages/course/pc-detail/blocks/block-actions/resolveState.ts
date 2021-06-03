import openLoginDialog from '../../components/dialog-login/index';
import { startBuy } from '../../modules/buy';
import { toLiveRoom } from '../../modules/navigation/live';

enum SellStatus {
  SELLING = 1,
  UNSELL = 2,
}

export enum ActionState {
  CAN_ENTER, // 显示“进入直播间”
  NEED_LOGIN, // 显示“进入直播间”
  UNSELL, // 显示“课程已下架”
  NEED_LOGIN_BUY, // 显示“立即报名”
  NEED_BUY, // 显示“立即报名”
}

export const resolveActionState = (
  isOwnAsset: boolean,
  sellStatus: SellStatus,
  hasLogin: boolean,
) => {
  if (isOwnAsset) {
    if (hasLogin) {
      return ActionState.CAN_ENTER;
    } else {
      return ActionState.NEED_LOGIN;
    }
  } else {
    if (sellStatus === SellStatus.SELLING) {
      if (hasLogin) {
        return ActionState.NEED_BUY;
      } else {
        return ActionState.NEED_LOGIN_BUY;
      }
    } else {
      return ActionState.UNSELL;
    }
  }
};

export const actionText = {
  [ActionState.CAN_ENTER]: '进入直播间',
  [ActionState.NEED_LOGIN]: '进入直播间',
  [ActionState.UNSELL]: '课程已下架',
  [ActionState.NEED_LOGIN_BUY]: '立即报名',
  [ActionState.NEED_BUY]: '立即报名',
};

export const actionClassName = {
  [ActionState.CAN_ENTER]: 'action--active',
  [ActionState.NEED_LOGIN]: 'action--active',
  [ActionState.UNSELL]: 'action--disabled',
  [ActionState.NEED_LOGIN_BUY]: 'action--active',
  [ActionState.NEED_BUY]: 'action--active',
};

export const actionHandler = {
  [ActionState.CAN_ENTER]: function enterLiveRoom() {
    const vm = this as any;
    toLiveRoom(vm.goodsData, vm.needCollectInfo);
  },
  [ActionState.NEED_LOGIN]: login,
  [ActionState.UNSELL]: () => {},
  [ActionState.NEED_LOGIN_BUY]: login,
  [ActionState.NEED_BUY]: function() {
    const vm = this as any;
    const {
      goodsType,
      goodsData,
    } = vm;
    startBuy({
      goodsType,
      goodsData,
      alias: goodsData.alias,
    });
  },
};

function login() {
  openLoginDialog();
}
