import { Ref, ref } from '@youzan/tany-vue';
import WorkbookService from '@/domain/workbook-domain/services';
import { useRouter } from '../../router';
export interface IAwardList {
  awardBizId: string,
  awardAmount: number | null,
  type: number,
  awardNode?: number,
  limitAmount?: number | null,
  limitBizId?: string,
}

export interface IRewardArray {
  awardNode: number,
  awardList: Array<IAwardList>,
  awardAmount?: number | null,
}

export interface IAwardRulePopupModel {
  visible: Ref<boolean>;
  setVisible: Function;
  reward: Ref<Array<IRewardArray>>;
}

const AwardRulePopupModel = () => {
  const { route } = useRouter();
  const kdtId = route.value.query.kdt_id;
  window._global.kdt_id = Number(kdtId);
  const alias = route.value.query.alias;
  const reward = ref<any>([]);
  const labelText: any = {
    '1': '每次提交作业',
    '3': '评为优秀作业',
    '2': '每次分享作业',
  };
  WorkbookService.getWorkbookDetail({ alias }).then((workbook) => {
    const awardData = (workbook.reward || {}).awardData || [];
    reward.value = awardData.reduce((arr: any, awardDataItem: any) => {
      if (awardDataItem.awardList) {
        let tempItem: IRewardArray = { awardList: [], awardNode: 0 };
        awardDataItem.awardList.forEach((awardListItem: IAwardList) => {
          awardListItem.awardAmount = awardListItem.awardAmount || 0;
          // 奖励类型 1：积分 2: 每日上限积分
          tempItem = awardListItem.type === 1
            ? { ...tempItem, ...awardListItem }
            : {
              ...awardListItem,
              ...tempItem,
              limitAmount: awardListItem.awardAmount,
              limitBizId: awardListItem.awardBizId,
            };
        });
        if (tempItem.awardAmount) {
          arr.push({
            ...tempItem,
            awardNode: awardDataItem.awardNode,
            labelText: labelText[awardDataItem.awardNode],
          });
        }
      }
      return arr;
    }, []);
  });

  const visible = ref(false);
  const setVisible = (status: boolean) => {
    visible.value = status;
  };
  return {
    visible,
    setVisible,
    reward,
  };
};

export default AwardRulePopupModel;
