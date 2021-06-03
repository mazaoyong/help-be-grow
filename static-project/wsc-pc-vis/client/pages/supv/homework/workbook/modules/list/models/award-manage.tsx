import {
  React,
  useMemo,
  useContext,
  useCallback,
  createModel,
  useState,
  useEffect,
} from '@youzan/tany-react';
import { CampusContext } from '../components/campus-filter';
import WorkbookService from 'domain/workbook-domain/services';
import EditPopover from '../components/edit-popover';
import { Icon, Notify } from 'zent';
import { Pop } from '@zent/compat';
import {
  IExerciseRewardTableData,
  IExerciseRewardTableDTO,
  IExerciseRewardArray,
} from 'domain/workbook-domain/types';
import '../blocks/award-manage/index.scss';
const { getExerciseReward, saveExerciseReward } = WorkbookService;
const IS_AWARD_MANAGE_LEAD = 'isAwardManageLead';
interface ICompareResult {
  result: boolean;
  errorText?: string;
}

const AwardManageModel = () => {
  const { targetKdtId, isHeadquarters } = useContext(CampusContext);
  const [tableData, setTableData] = useState<IExerciseRewardTableDTO>([]);
  const [awardData, setAwardData] = useState<IExerciseRewardArray>([]);
  const [showPopIndex, setShowPopIndex] = useState(-1);
  const isAwardManageLead = window.localStorage.getItem(IS_AWARD_MANAGE_LEAD);
  const isShowLeadState = (isAwardManageLead === 'false' || !isAwardManageLead);
  const [isShowLead, setShowLead] = useState(isShowLeadState);

  useEffect(() => {
    fetchAwardManage();
  }, [targetKdtId]);

  const fetchAwardManage = useCallback(() => {
    return getExerciseReward({
      query: {
        kdtId: targetKdtId,
      },
    })
      .then(({ awardData = [] }) => {
        const tempData: IExerciseRewardArray = awardData;
        setAwardData(tempData);
        const awardTableDataObj = {};
        tempData.forEach(awardItem => {
          if (awardItem.awardList) {
            awardItem.awardList.forEach((item: IExerciseRewardTableData, index) => {
              item.awardAmount = item.awardAmount || null;
              item.awardNode = awardItem.awardNode;
              // 设置key
              item.id = item.awardNode + '' + index;
              if (!awardTableDataObj[item.awardNode]) awardTableDataObj[item.awardNode] = [];
              awardTableDataObj[item.awardNode].push(item);
            });
          }
        });
        const awardTableData: IExerciseRewardTableDTO = Array.prototype.concat.call(
          [],
          awardTableDataObj[1] || [],
          awardTableDataObj[3] || [],
          awardTableDataObj[2] || [],
        );
        setTableData(awardTableData);
      })
      .catch(() => {});
  }, [targetKdtId]);

  const handleChange = async (editValue, row) => {
    if (editValue > 9999) {
      return { result: false, errorText: '积分设置不得超过9999' };
    }
    const tableDataItem: IExerciseRewardTableData = tableData[row];
    if (tableDataItem.awardNode !== 3) {
      // result: false 校验失败
      const compareResult = handleCompareResult(tableDataItem, editValue);
      if (compareResult && !compareResult.result) return compareResult;
    }

    const tempTableData: IExerciseRewardTableDTO = [...tableData];
    tempTableData[row] = { ...tempTableData[row], awardAmount: editValue };
    const awardDataCatetory = awardData.find(
      item => item.awardNode === tableDataItem.awardNode,
    ) || { awardList: [] };
    const awardDataCatetoryItem = awardDataCatetory.awardList.find(
      item => item.type === tableDataItem.type,
    ) || { awardAmount: 0 };
    const preValue = awardDataCatetoryItem.awardAmount;
    awardDataCatetoryItem.awardAmount = editValue || null;
    await saveExerciseReward({ query: { awardData } })
      .then(() => {
        Notify.success('修改成功');
        fetchAwardManage();
      })
      .catch(err => {
        awardDataCatetoryItem.awardAmount = preValue;
        Notify.error(err);
      });
    return { result: true };
  };

  const handleCompare = (once: number, limit: number, item: IExerciseRewardTableData) => {
    const text = item.awardNode === 1 ? '提交' : '分享';
    if (once > limit) {
      return { errorText: `每日上限需大于等于每次${text}`, result: false };
    } else if (limit % once !== 0) {
      return { errorText: `每日上限需是每次${text}的倍数`, result: false };
    }
    return { result: true };
  };

  const findAssociate = (item): IExerciseRewardTableData | undefined => {
    return tableData.find(
      (tableItem: IExerciseRewardTableData) =>
        tableItem.awardNode === item.awardNode && item.type !== tableItem.type,
    );
  };

  const handleCompareResult = (tableDataItem, editValue) => {
    const associate: IExerciseRewardTableData | undefined = findAssociate(tableDataItem);
    if (!associate) return;
    const associateAmount = associate.awardAmount || 0;
    // 每日积分 1 每日上限 2
    let compareResult: ICompareResult = { result: true };
    if (editValue && associateAmount) {
      if (tableDataItem.type === 1) {
        compareResult = handleCompare(editValue, associateAmount, tableDataItem);
      } else {
        compareResult = handleCompare(associateAmount, editValue, tableDataItem);
      }
    }
    if (!compareResult.result) {
      return compareResult;
    }
  };

  const handleLeadClose = () => {
    setShowLead(false);
    window.localStorage.setItem(IS_AWARD_MANAGE_LEAD, 'true');
  };

  const renderLeadPop = Content => (
    <Pop
      visible={isShowLead}
      position="bottom-center"
      trigger="none"
      content={
        <div>
          <span>点击此处编辑奖励</span>
          <Icon className="reward-lead-close__btn" type="close" color="#D8D8D8" onClick={handleLeadClose}></Icon>
        </div>
      }
    >
      {Content}
    </Pop>
  );

  const columns = useMemo(() => {
    const unit = tableData[0]?.awardBizId || '积分';
    return [
      {
        title: '奖励节点',
        colSpan: 2,
        bodyRender: (data, { row }) => {
          if (data.awardNode === 2) {
            return {
              props: {
                rowSpan: row === 3 ? 2 : 0,
              },
              children: '分享奖励',
            };
          } else {
            return {
              props: {
                rowSpan: row === 0 ? 3 : 0,
              },
              children: '作业奖励',
            };
          }
        },
      },
      {
        colSpan: 0,
        bodyRender: (data, { row }) => {
          const awardText = {
            1: { text: '提交作业', rowSpan: 2, startRow: 0 },
            3: { text: '被评选为优秀作业', rowSpan: 1, startRow: 2 },
            2: { text: '分享作业', rowSpan: 2, startRow: 3 },
          };
          const { text, rowSpan, startRow } = awardText[data.awardNode];
          return {
            props: {
              rowSpan: row === startRow ? rowSpan : 0,
            },
            children: text,
          };
        },
      },
      {
        title: '奖励梯度',
        name: 'type',
        bodyRender: data => {
          const { awardNode, type } = data;
          const awardText = { 1: '每次提交', 2: '每次分享' };
          if (awardNode === 3) {
            return '每次被评为优秀作业';
          } else {
            return type === 1 ? awardText[awardNode] : '每日上限';
          }
        },
      },
      {
        title: `${unit}奖励`,
        name: 'awardAmount',
        width: '360px',
        bodyRender: (data, { row }) => {
          const Content = data.awardAmount ? (
            <span>
              送{data.awardAmount}
              {data.awardBizId}
            </span>
          ) : (
            '-'
          );
          return (
            <div className="points-reward">
              {row === 0 && !isHeadquarters ? (
                renderLeadPop(Content)
              ) : (
                Content
              )}
              {!isHeadquarters && (
                <div className="points-reward__edit">
                  <EditPopover
                    unit={data.awardBizId}
                    value={data.awardAmount || 0}
                    onOpen={() => setShowPopIndex(row)}
                    onHide={() => setShowPopIndex(-1)}
                    onOk={value => handleChange(value, row)}
                  />
                  {showPopIndex === row && (
                    <Icon type="edit-o" className="shortcut-icon edit-o edit-replace" />
                  )}
                </div>
              )}
            </div>
          );
        },
      },
    ];
  }, [tableData, showPopIndex, isShowLead]);

  return {
    columns,
    tableData,
    fetchAwardManage,
  };
};

export type AssignmentListModelType = ReturnType<typeof AwardManageModel>;
export default createModel(AwardManageModel);
