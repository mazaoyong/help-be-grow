import { isSameDay, parse, format } from 'date-fns';

enum ButtonText {
  PENDING = '打开还未开始',
  TO_CLOCK_IN = '我要打卡',
  TO_ADD_CLOCK_IN = '补打卡',
  HAD_CLOCK_IN = '已打卡',
  OUT_OF_ADD_CLOCK_IN = '补打卡次数已用完',
  TIME_OUT = '打卡已结束',
  OFF_SHELF = '打卡下架'
}

export enum ProceedStatusEnum {
  PENDING = 0,
  DOING,
  DONE
}

enum ClockInStatusEnum {
  DELETED = 0,
  ON_SHELF,
  OFF_SHELF
}

const AVAILABLE_COLOR_SCHEME = {
  color: '#fff',
  backgroundColor: '#00B389',
};

const NOT_AVAILABLE_COLOR_SCHEME = {
  color: '#999',
  backgroundColor: '#E5E5E5',
};

function getButtonSetting(
  data: any
): {
    primaryText: string;
    secondaryText: string;
    buttonScheme: typeof AVAILABLE_COLOR_SCHEME;
    showButton: boolean;
    canPunch: boolean; // 是否能打卡
  } {
  const {
    isCompleted,
    proceedStatus,
    listDate,
    startAt,
    endAt,
    supportRepairGci,
    repairTimesLeft,
    status,
    buttonCopy,
  } = data;
  const now = new Date();
  const isClockTime = isSameDay(now, listDate);
  // 判断是否有打卡任务
  const listDateTimestamp = parse(listDate).getTime();
  const startAtTimestamp = parse(format(startAt, 'YYYY/MM/DD 00:00:00')).getTime();
  const endDateTimestamp = parse(format(endAt, 'YYYY/MM/DD 23:59:59')).getTime();
  const isCanCheckClock = listDateTimestamp >= startAtTimestamp && listDateTimestamp <= endDateTimestamp;
  let buttonStatus = NOT_AVAILABLE_COLOR_SCHEME;
  let buttonText =
    proceedStatus === ProceedStatusEnum.PENDING
      ? ButtonText.PENDING
      : ButtonText.TIME_OUT;
  let additionText = '';
  let canPunch = false;
  if (isCanCheckClock) {
    // 在打卡时间内，根据是否完成来决定按钮文字
    if (isClockTime || isCompleted) {
      buttonText = isCompleted
        ? ButtonText.HAD_CLOCK_IN
        // 自定义打卡文案
        : (buttonCopy || ButtonText.TO_CLOCK_IN);
      canPunch = !isCompleted;
      buttonStatus = !isCompleted ? AVAILABLE_COLOR_SCHEME : NOT_AVAILABLE_COLOR_SCHEME;
    } else {
      // 如果不是打卡时间，说明是打卡时间之前，需要校验是否能够补卡
      if (supportRepairGci) {
        if (Number(repairTimesLeft) > 0) {
          buttonStatus = AVAILABLE_COLOR_SCHEME;
          buttonText = ButtonText.TO_ADD_CLOCK_IN;
          additionText = `还剩${repairTimesLeft}次补打卡机会`;
          canPunch = true;
        } else {
          buttonText = ButtonText.OUT_OF_ADD_CLOCK_IN;
        }
      }
    }
  }

  const isOffShelf = status === ClockInStatusEnum.OFF_SHELF;
  if (isOffShelf) {
    // 如果打卡下架了
    return {
      primaryText: ButtonText.OFF_SHELF,
      buttonScheme: NOT_AVAILABLE_COLOR_SCHEME,
      secondaryText: '',
      showButton: true,
      canPunch: false,
    };
  }

  return {
    primaryText: buttonText,
    secondaryText: additionText,
    buttonScheme: buttonStatus,
    showButton: true,
    canPunch,
  };
}

export default getButtonSetting;
