import { Pop } from '@zent/compat';
import React, { FC, useContext, useState, Fragment, useCallback } from 'react';
import { Grid, ClampLines, Icon, Button, Dialog, Notify, BlockLoading } from 'zent';
import { IGridColumn } from 'zent/es/grid/types';
import { Link as SamLink } from '@youzan/sam-components';
import { get, findIndex } from 'lodash';
import toSnakeCase from '@youzan/utils/string/toSnakeCase';
import toCamelCase from '@youzan/utils/string/toCamelCase';
import uuid from 'uuid';
import { arrayColumnWrapper, IArrayColumnParam, isEduHqStore } from 'fns/chain';
import { openDeleteLessonDialog } from '../delete-lesson-dialog';
import editLessonDialog from '../edit-lesson-dialog';
import ResultDetail from '../result-detail';
import { getScheduleData } from '../../format';
import { IViewCellData, IActionResult, IGridSortType } from '../../types';
import { context } from '../../store';
import { chainSupportOnlySingle, chainSupportHq } from '../../../../chain';
import { ScheduleNewDialog } from '../../../../../../new-dialogs';
import { batchDeleteLesson, getActionResult } from '../../../../api';
import { TimingTask } from '@youzan/ebiz-components';
import TrialTag from '../../../../components/trial-tag';
import './style.scss';

const { openDialog, closeDialog } = Dialog;

// 序号 title
const HelpEle = ({ text }) => (
  <Pop trigger="hover" position="top-center" content={text}>
    <Icon type="help-circle-o" />
  </Pop>
);

const MAX_BATCHDELETE_NUM = 100;

let selectedLessonList: string[] = [];

type GridColumns = (IGridColumn & IArrayColumnParam)[];

const getColumnsByKdtId = (kdtId) => {
  const columns: GridColumns = ([
    {
      title: '上课时间',
      name: 'startTime',
      width: 150,
      className: 'name',
      bodyRender: (data: IViewCellData) => {
        const lessonDate: string = (data.lessonTime || '').split(' ')[0];
        const lessonTime: string = (data.lessonTime || '').split(' ')[1];
        return <>
          <div>{lessonDate || '-'}</div>
          <div>{lessonTime || ''}</div>
        </>;
      },
      needSort: true,
    },
    {
      title: '班级',
      name: 'className',
      defaultText: '-',
      bodyRender: ({ className }) => {
        return <ClampLines lines={2} text={className || '-'} />;
      },
    },
    {
      title: '课程',
      name: 'eduCourseName',
      defaultText: '-',
      bodyRender: ({ eduCourseName, isTrial }) => {
        return <div className="schedule_list__educoursename">
          {!!isTrial && <TrialTag />}
          <ClampLines lines={2} text={eduCourseName || '-'} />
        </div>;
      },
    },
    {
      title: '课节',
      name: 'lessonName',
      defaultText: '-',
      bodyRender: ({ lessonName }) => {
        return <ClampLines lines={1} text={lessonName || '-'} />;
      },
    },
    {
      title: '老师',
      name: 'teacherName',
      defaultText: '-',
      width: 80,
      bodyRender: ({ teacherName }) => {
        return teacherName || '-';
      },
    },
    {
      title: '助教',
      name: 'assistantNames',
      defaultText: '-',
      width: 80,
      bodyRender: ({ assistantNames }) => {
        return <ClampLines lines={1} text={assistantNames.join('、') || '-'} />;
      },
    },
    {
      title: '上课地点',
      name: 'addressName',
      defaultText: '-',
      width: 100,
      bodyRender: ({ addressName }) => {
        return addressName || '-';
      },
      chainState: chainSupportOnlySingle,
    },
    {
      title: '上课校区',
      name: 'shopName',
      width: 100,
      defaultText: '-',
      bodyRender: ({ shopName }) => {
        return shopName || '-';
      },
      chainState: chainSupportHq(kdtId),
    },
    {
      title: '教室',
      name: 'classroomName',
      defaultText: '-',
      width: 100,
      bodyRender: ({ classroomName }) => {
        return classroomName || '-';
      },
    },
    {
      title: '预约规则',
      name: 'appointRule',
      width: 100,
      defaultText: '-',
      bodyRender: ({ appointRule }) => {
        return appointRule === 1 ? '需预约' : '无需预约';
      },
    },
    {
      title: (
        <>
          预约情况<HelpEle text="已预约人数/可预约人数" />
        </>
      ),
      defaultText: '-',
      width: 130,
      bodyRender: ({ appointRule, lessonCase }: IViewCellData) => {
        if (appointRule === 0) {
          return '-';
        }
        return `${lessonCase.hadAppointNum}/${lessonCase.shouldAppointNum}`;
      },
    },
    {
      title: (
        <>
          签到情况<HelpEle text="有签到状态人数/应到人数" />
        </>
      ),
      defaultText: '-',
      width: 130,
      bodyRender: ({ lessonCase }: IViewCellData) => {
        if (lessonCase.hadSignInNum === 0) { // ref: https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=75689
          return '待签到';
        }
        return `${lessonCase.hadSignInNum}/${lessonCase.shouldSignInNum}`;
      },
    },
    {
      title: '操作',
      width: 220,
      bodyRender: (data: IViewCellData) => {
        return <Operator data={data} />;
      },
      fixed: 'right',
    },
  ]);

  return columns;
};

interface IOperatorProps {
  data: IViewCellData;
}

const EDIT_DIALOG_ID = 'edit_dialog_id';

const Operator: FC<IOperatorProps> = ({ data }) => {
  const { store, dispatch } = useContext(context);
  const { repeatType, lessonCase } = data;
  const { hadSignInNum, shouldSignInNum } = lessonCase;

  const dialogEdit = (
    <SamLink
      name="编辑"
      className="ui-link--split"
      onClick={() => {
        editLessonDialog(data, EDIT_DIALOG_ID, store, dispatch);
      }}
    >
      编辑
    </SamLink>
  );

  const dialogLink = (
    <SamLink
      name="编辑"
      className="ui-link--split"
      onClick={() => {
        ScheduleNewDialog.open('编辑日程', {
          lessonNo: data.lessonNo,
          kdtId: data.kdtId,
          operateType: 2,
          isTry: data.isTrial,
        });
      }}
    >
      编辑
    </SamLink>
  );

  return (
    <Fragment>
      <SamLink
        blank
        className="ui-link--split"
        href={`${_global.url.v4}/vis/edu/page/schedule#/detail?lessonNo=${data.lessonNo}&kdtId=${data.kdtId}`}
      >
        日程详情
      </SamLink>
      <SamLink
        name="编辑"
        className="ui-link--split"
        onClick={() =>
          ScheduleNewDialog.open('新建日程', {
            lessonNo: data.lessonNo,
            kdtId: data.kdtId,
            query: {
              duplicate: true,
            },
            isTry: data.isTrial,
          })
        }
      >
        复制
      </SamLink>
      {!(shouldSignInNum !== 0 && hadSignInNum === shouldSignInNum) && (
        <Fragment>
          {!!repeatType && [2, 3].includes(repeatType) ? dialogEdit : dialogLink}
          <SamLink
            name="编辑"
            className="ui-link--split"
            onClick={() => openDeleteLessonDialog(data, store, dispatch)}
          >
            删除
          </SamLink>
        </Fragment>
      )}
    </Fragment>
  );
};

const TableWrap: FC<{}> = () => {
  const { store, dispatch } = useContext(context);
  const {
    tableData: { content, total, pageable },
    loading,
    kdtId,
  } = store;
  const columns = getColumnsByKdtId(kdtId);
  const [selected, setSelected] = useState<string[] | any>([]);
  const [totalSelectedRows, setTotalSelectedRows] = useState<IViewCellData[]>([]);
  const [gridSortType, setGridSortType] = useState<IGridSortType>('');
  const [gridSortBy, setGridSortBy] = useState('startTime');
  const [loadingText, setLoadingText] = useState('');

  const parseActionResult = useCallback((raw: IActionResult[]) => {
    const total = raw.length;
    if (!total) {
      return;
    }
    const failList = raw.filter(action => action.singleActionStatus !== 1);

    if (failList.length === 0) {
      Notify.success(`${total}条日程删除成功`);
      getScheduleData({}, store, dispatch);
    } else {
      const dialogId = uuid.v4();
      openDialog({
        dialogId,
        title: '删除日程结果',
        children: <ResultDetail result={failList} total={total} userSelected={totalSelectedRows} />,
        footer: (<Button type="primary" onClick={() => {
          getScheduleData({}, store, dispatch);
          closeDialog(dialogId);
        }}>
          我知道了
        </Button>),
      });
    };
  }, [totalSelectedRows]);

  const onDeleteConfirm = useCallback(() => {
    setLoadingText(`正在删除${selected.length}条上课日程`);
    let lock = false;
    const handlePolling = (timingTask: any, taskNo: string) => {
      getActionResult({
        taskNo,
        kdtId: _global.kdtId,
      })
        .then(res => {
          if (res && res.actionStatus === 1) {
            timingTask.stop();
            if (res && res.results && Array.isArray(res.results)) {
              parseActionResult(res.results);
            }
            setSelected([]);
          }
          lock = false;
        })
        .catch(err => {
          Notify.error(err || '网络错误，请稍后重试');
          dispatch({ type: 'loading', value: false });
        });
    };

    dispatch({ type: 'loading', value: true });
    const lessonDeleteModelList = isEduHqStore
      ? totalSelectedRows.map((lesson: IViewCellData) => ({
        kdtId: lesson.kdtId,
        lessonNo: lesson.lessonNo,
      }))
      : selected.map((lessonNo: string) => ({
        kdtId: _global.kdtId,
        lessonNo,
      }));

    batchDeleteLesson({
      lessonDeleteModelList,
    })
      .then(taskNo => {
        const timingTask = new TimingTask(20000, 1000);
        timingTask.start(() => {
          if (!lock) {
            lock = true;
            handlePolling(timingTask, taskNo);
          }
        }).catch(() => {
          timingTask.stop();
          // 20秒的轮询后如果还没有查询完成，则直接告知用户“操作成功”，防止不加轮询时限造成一直轮询或达到时限后没有用户提示。
          Notify.error('查询操作结果超时，请刷新后查看操作结果');
          getScheduleData({}, store, dispatch, store.activeId);
        });
      })
      .catch(err => {
        Notify.error(err || '网络错误，请稍后重试');
      })
      .finally(() => {
        setLoadingText('');
        setTotalSelectedRows([]);
      });
  }, [selected, totalSelectedRows, dispatch, store, parseActionResult]);

  const onBatchDelete = useCallback(() => {
    if (!selected || !selected.length) {
      Notify.error('请选择要批量删除的上课日程');
      return;
    }
    if (selected.length > MAX_BATCHDELETE_NUM) {
      Notify.error(`最多可批量删除${MAX_BATCHDELETE_NUM}条上课日程`);
      return;
    }
    const dialogId = uuid.v4();
    openDialog({
      dialogId,
      children: <div>确认删除选中的“{selected.length}”条上课日程吗？</div>,
      footer: (<div>
        <Button type="primary" onClick={() => {
          onDeleteConfirm();
          closeDialog(dialogId);
        }}>删除</Button>
        <Button onClick={() => closeDialog(dialogId)}>我再想想</Button>
      </div>),
    });
  }, [selected, onDeleteConfirm]);

  return (
    <div className="panel__table">
      <BlockLoading loading={loading} iconText={loadingText}>
        <Grid
          rowKey="lessonNo"
          columns={arrayColumnWrapper(columns) as any}
          datasets={content}
          scroll={{ x: 1700 }}
          pageInfo={{
            current: get(pageable, 'pageNumber'),
            pageSize: get(pageable, 'pageSize'),
            total,
          }}
          onChange={({
            current,
            sortBy = toCamelCase(get(pageable, 'sort.orders[0].property') || ''),
            sortType = (() => {
              let type = get(pageable, 'sort.orders[0].direction');
              if (!type) {
                return undefined;
              } else {
                return type.toLowerCase();
              }
            })(),
          }) => {
            setGridSortType(sortType as IGridSortType);
            setGridSortBy(sortBy || gridSortBy);
            const duplicate = pageable;
            duplicate.pageNumber = current! || 1;
            duplicate.sort = {
              orders: [
                {
                  property: toSnakeCase(sortBy || gridSortBy),
                  direction: sortType ? (sortType.toUpperCase()) : 'DESC',
                },
              ],
            };
            getScheduleData({ pageNumber: current }, store, dispatch);
          }}
          selection={{
            selectedRowKeys: selected,
            onSelect: (selectedRowKeys, selectedRows, changeRow) => {
              const prevSelected = [ ...totalSelectedRows ];

              setSelected(selectedRowKeys);
              if (Array.isArray(changeRow) && selectedRows.length > 0) { // 全选或多选
                const sum = [...totalSelectedRows, ...selectedRows];
                setTotalSelectedRows(sum.filter((row, index, arr) => {
                  return selectedRowKeys.includes(row.lessonNo) && arr.indexOf(row) === index;
                }));
              } else if (Array.isArray(changeRow) && selectedRows.length === 0) { // 全部取消
                setTotalSelectedRows(totalSelectedRows.filter(row => (
                  selectedRowKeys.includes(row.lessonNo)
                ))); // 现阶段zentGrid分页取消全选会把其他页选中项一起取消
              } else if (!Array.isArray(changeRow) && selectedRowKeys.includes(changeRow.lessonNo)) { // 单选
                prevSelected.push(changeRow);
                setTotalSelectedRows(prevSelected);
              } else if (!Array.isArray(changeRow) && !selectedRowKeys.includes(changeRow.lessonNo)) { // 单个取消选择
                prevSelected.splice(findIndex(prevSelected, ['lessonNo', changeRow.lessonNo]), 1);
                setTotalSelectedRows(prevSelected);
              }
              selectedLessonList = selectedRowKeys;
            },
            getCheckboxProps: data => {
              if (selectedLessonList.length && selectedLessonList.length >= MAX_BATCHDELETE_NUM) {
                return {
                  disabled: !selectedLessonList.includes(data.lessonNo),
                  reason: `批量删除最多可选${MAX_BATCHDELETE_NUM}条上课日程`,
                };
              }
              return {};
            },
          }}
          batchRender={() => (
            <>
              <span className="span-select-all">当页全选</span>
              <Button onClick={onBatchDelete}>批量删除</Button>
            </>
          )}
          sortType={gridSortType as IGridSortType}
          sortBy={gridSortBy}
        />
      </BlockLoading>
    </div>
  );
};

export default TableWrap;
