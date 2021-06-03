import { IStoreState } from './state';
import { isSameDay } from 'date-fns';
import { get } from 'lodash';
import { GetterTree } from 'vuex';
import { getDiaryWithoutMyDiaryId } from '../utils/getterHandlers';

type IGetterMap = GetterTree<IStoreState, IStoreState>;

const getterMap: IGetterMap = {
  // 整合打卡详情的参数
  getPunchTaskParams(state) {
    const { alias, buttonSetting, task, calendar } = state;
    /**
     * alias
     * canPunch
     * taskId
     * punchType: 1 今天 2 不是今天
     */
    const taskId = task.config!.taskId;
    // 只有当有taskId的时候，打卡按钮才是可用的
    const canPunch = taskId !== undefined && buttonSetting.canPunch;
    const chooseDate = calendar.chooseDate;
    const punchType = chooseDate && isSameDay(chooseDate, new Date()) ? 1 : 2;

    return {
      alias,
      canPunch,
      taskId,
      punchType,
    };
  },

  // 整合打卡列表，需要将我的打卡和打卡列表整合
  getDiaryListWithMyDiary(state) {
    const { myDiary, diaryList, hasDiary } = state;
    let myDiaryId: number = -1;
    let combinedDiaryList: Array<Record<string, any>> = [];
    // 设置myDiaryId
    if (Object.keys(myDiary || {}).length > 0) {
      myDiaryId = myDiary.id;
      combinedDiaryList = [myDiary];
    }
    if (hasDiary && diaryList.length > 0) {
      const targetList = getDiaryWithoutMyDiaryId(diaryList, myDiaryId);
      combinedDiaryList = combinedDiaryList.concat(targetList);
    }
    return combinedDiaryList;
  },

  // 获取当前打卡的开始时间和需要编辑/新建的日历内容
  getModifyDiaryParams(state) {
    return {
      startDate: state.calendar.startDate,
      currentDate: state.calendar.chooseDate,
    };
  },

  getMyDiaryLogId(state) {
    return get(state.myDiary, 'userData.fansId');
  },
};

export default getterMap;
