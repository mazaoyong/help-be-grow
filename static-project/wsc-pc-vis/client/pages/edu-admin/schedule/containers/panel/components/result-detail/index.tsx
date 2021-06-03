import React, { FC, useState, useCallback, useMemo } from 'react';
import { Grid, ClampLines } from 'zent';
import { IResultDetailProp } from '../../types';
import './styles.scss';

const RESULT_DETAIL_PAGESIZE = 5;

const columns = [
  {
    title: '日程名称',
    width: '50%',
    bodyRender({ agendaName, lessonNo, kdtId }) {
      if (agendaName) {
        return (
          <div
            className="agenda-name"
            onClick={() => {
              window.open(`${_global.url.v4}/vis/edu/page/schedule#/detail?lessonNo=${lessonNo}&kdtId=${kdtId}`);
            }}
          >
            <ClampLines
              lines={1}
              popWidth={150}
              text={agendaName}
            />
          </div>
        );
      } else {
        return '-';
      }
    },
  },
  {
    title: '失败原因',
    width: '50%',
    bodyRender({ message }) {
      if (message) {
        return (
          <ClampLines
            lines={1}
            popWidth={150}
            text={message}
          />
        );
      } else {
        return '-';
      }
    },
  },
];

const ResultDetail: FC<IResultDetailProp> = ({ result, total, userSelected }) => {
  const failCount = result.length;

  const [current, setCurrent] = useState(1);

  const displayResultByPage = useMemo(() => {
    const currentResult = result
      .slice((current - 1) * RESULT_DETAIL_PAGESIZE, current * RESULT_DETAIL_PAGESIZE);
    // 后端接口现没有支持”日程编号 - 日程名称“关联，需要后续优化 2020.3.14
    const agendaIdList = currentResult.map(agenda => agenda.actionKey);
    return userSelected
      .filter(agenda => agendaIdList.includes(agenda.lessonNo))
      .map((agenda, index) => ({
        lessonNo: agenda.lessonNo,
        kdtId: agenda.kdtId,
        agendaName: agenda.lessonName || agenda.eduCourseName,
        message: currentResult[index].message || '-',
      }));
  }, [current, result, userSelected]);

  const onChange = useCallback(({ current }) => {
    setCurrent(current);
  }, []);

  return (
    <div className="result-detail-dialog">
      <span className="title">
        {(total - failCount)
          ? `${total - failCount}条日程删除成功，${failCount}条日程删除失败。`
          : `${failCount}条日程删除失败。`}
      </span>
      <Grid
        rowKey="actionKey"
        className="result-detail-grid"
        columns={columns}
        datasets={displayResultByPage}
        pageInfo={failCount > RESULT_DETAIL_PAGESIZE ? {
          pageSize: RESULT_DETAIL_PAGESIZE,
          total: failCount,
          current,
        } : undefined}
        paginationType="lite"
        onChange={onChange}
      />
    </div>
  );
};

export default ResultDetail;
