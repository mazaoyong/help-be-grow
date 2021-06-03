import { get } from 'lodash';
import { useCallback, useState } from 'react';
import { Notify } from 'zent';
import { IRequestByTaskIdType, IStudentInfoGrid } from '../../types';
import { findRowsByPageRequest, getValidateSummaryRequest } from './requests';

export default function useValidateSummary({ taskId, errOnly, current }) {
  const [taskTotal, setTaskTotal] = useState(0); // 导入任务包含的总数据条数
  const [total, setTotal] = useState(0); // 列表的总数
  const [listLoading, toggleListLoading] = useState(false);
  const [dataset, setDataset] = useState<IStudentInfoGrid[]>([]);

  const [errDataNo, setErrorDataNo] = useState(0);

  const getPageData = useCallback(
    (taskId: number, errData: boolean) => {
      toggleListLoading(true);
      const query = { taskId, rowStates: [10, 20] }; // 仅查看未导入的数据
      if (errData) {
        Object.assign(query, { rowValidateFlag: Number(errData) });
      }
      return findRowsByPageRequest(query, current, 10).then(res => {
        const { content, total } = res;
        const dataset = content.map(item => ({
          id: get(item, 'row.rowId'),
          ...item,
        }));

        setDataset(dataset || []);
        setTotal(total || 0);
        toggleListLoading(false);
      });
    },
    [current],
  );

  const getPageValidateSummary = useCallback(
    (query: IRequestByTaskIdType) => {
      if (!taskId) return;

      getValidateSummaryRequest(query)
        .then(res => {
          if (res) {
            const { expectRowNum, warnRowNum } = res;
            setErrorDataNo(warnRowNum);
            setTaskTotal(expectRowNum || 0);
            if (warnRowNum === 0) {
              getPageData(taskId, false);
            } else {
              getPageData(taskId, errOnly);
            }
          }
        })
        .catch(e => {
          Notify.error(e || '获取导入任务总览失败，请稍后重试');
        });
    },
    [taskId, getPageData, errOnly],
  );

  return {
    taskTotal,
    errDataNo,
    getPageValidateSummary,
    dataset,
    total,
    listLoading,
  };
}
