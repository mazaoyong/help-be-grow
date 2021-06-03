// 看板详情弹窗 content
import React, { FC, useLayoutEffect, useRef, useMemo, useCallback, ReactElement } from 'react';
import { findDOMNode } from 'react-dom';
import { Tag, Dialog, ClampLines } from 'zent';
import { Link as SamLink } from '@youzan/sam-components';

import cx from 'classnames';
import { openDeleteLessonDialog } from '../delete-lesson-dialog';
import editLessonDialog from '../edit-lesson-dialog';
import { ScheduleDayDialogID } from '../schedule-day-dialog';
import { IViewCellData, conflictType } from '../../types';
import { format } from 'date-fns';
import { StateType, DispatchType } from '../../store';
import { switchWrapper } from 'fns/chain';
import { ScheduleNewDialog } from '../../../../../../new-dialogs';
import { getScheduleData } from '../../format';
import GotoPage from '../schedule/gotopage';
import TrialTag from '../../../../components/trial-tag';

const { closeDialog } = Dialog;

const EDIT_DIALOG_ID = 'edit_dialog_id';

export interface IDetailContentProps {
  data: IViewCellData;
  store: StateType;
  dispatch: DispatchType;
  position?: {
    top: number;
  };
  isInDialog?: boolean;
  closeDialog?: () => void;
}

const conflictMap = [
  { value: '1', tag: '老师冲突' },
  { value: '2', tag: '班级冲突' },
  { value: '3', tag: '教室冲突' },
];

const Conflict: FC<{ conflict: conflictType }> = ({ conflict }) => {
  return (
    <div>
      {conflictMap.map(({ value, tag }) => {
        return conflict.includes(value) ? (
          <Tag key={value} theme="red" outline>
            {tag}
          </Tag>
        ) : null;
      })}
    </div>
  );
};

const DetailContent: FC<IDetailContentProps> =
({ data, store, dispatch, position, isInDialog = false, closeDialog: closeParentDialog }) => {
  const ref = useRef(null);

  // 动态设置 pop 的位置
  useLayoutEffect(() => {
    // eslint-disable-next-line react/no-find-dom-node
    const dom = findDOMNode(ref.current) as HTMLElement;
    const parent =
      dom.parentElement &&
      dom.parentElement.parentElement &&
      dom.parentElement.parentElement.parentElement;
    if (parent) {
      dom.style.visibility = 'visible';
      if (position) {
        parent.style.top = `${position.top}px`;
      }
    }
  }, [position]);

  const {
    conflictResources,
    eduCourseName,
    lessonName,
    startTime,
    endTime,
    teacherName,
    className,
    classroomName,
    addressName,
    shopName,
    appointNumLeft,
    appointRule,
    isTrial,
    repeatType,
    assistantNames,
  } = data;

  const contentClass = useMemo(() => cx({
    'panel__schedule__detail-pop__content': true,
    conflict: conflictResources !== '0',
    deprecated: endTime < new Date().getTime(),
  }), [conflictResources, endTime]);

  const openScheduleDialog = useCallback<(operateType: number, query?: any) => void>((operateType, query = {}) => {
    ScheduleNewDialog.open('编辑日程', {
      lessonNo: data.lessonNo,
      isTry: isTrial,
      kdtId: data.kdtId,
      operateType: operateType,
      query: { ...query },
      afterSaveSucceed: (submitData: any, scheduleId: string) => {
        const { pageInfo, activeId, type: viewType } = store;
        if (viewType === 'view') {
          if (!activeId) {
            GotoPage(submitData, store, dispatch, scheduleId);
          } else {
            getScheduleData({ pageNumber: pageInfo.current }, store, dispatch, activeId);
          }
        }
      },
    });
  }, [data.lessonNo, data.kdtId, isTrial, store, dispatch]);

  const onOperationClick = useCallback<(e: MouseEvent, trigger: boolean) => void>((e, trigger) => {
    e.stopPropagation();
    if (isInDialog && closeParentDialog) {
      closeParentDialog();
    }
    closeDialog(ScheduleDayDialogID, { triggerOnClose: trigger });
  }, [closeParentDialog, isInDialog]);

  const dialogEdit = useMemo<ReactElement>(() => (
    <SamLink
      name="编辑"
      onClick={(e) => {
        onOperationClick(e, false);
        editLessonDialog(data, EDIT_DIALOG_ID, store, dispatch);
      }}
    >
      编辑
    </SamLink>
  ), [onOperationClick, data, store, dispatch]);

  const linkEdit = useMemo<ReactElement>(() => (
    <SamLink
      name="编辑"
      onClick={(e) => {
        onOperationClick(e, false);
        openScheduleDialog(2);
      }}
    >
      编辑
    </SamLink>
  ), [onOperationClick, openScheduleDialog]);

  const renderLocation = useCallback(() => {
    return switchWrapper({
      supportBranchStore: () => null,
      supportHqStore: () => {
        return shopName ? (
          <li>
            <span>上课校区：{shopName}</span>
          </li>
        ) : null;
      },
      supportSingleStore: () => {
        return addressName ? (
          <li>
            <span>上课地点：{addressName}</span>
          </li>
        ) : null;
      },
    });
  }, [addressName, shopName]);

  return (
    <article className={contentClass} ref={ref} style={{ visibility: position ? 'hidden' : 'visible' }}>
      <i className="triangle" />
      <header>
        {appointRule === 1 && <p className="status">需预约</p>}
        <div style={{ display: 'flex' }}>
          {isTrial === 1 && <TrialTag />}
          <h3 className="title">{className || eduCourseName || '-'}</h3>
        </div>
        <ClampLines className="subtitle" lines={2} text={lessonName} />
        {conflictResources !== '0' && <Conflict conflict={data.conflictResources} />}
      </header>
      <section>
        <ul>
          <li>
            <label>课程</label>：<span>{eduCourseName || '-'}</span>
          </li>
          <li>
            <label>时间</label>：{format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
          </li>
          {teacherName && (
            <li>
              <label>老师</label>：<span>{teacherName}</span>
            </li>
          )}
          {assistantNames.length !== 0 && (
            <li>
              <label>助教</label>：<span>{assistantNames.join('、')}</span>
            </li>
          )}
          {renderLocation()}
          {classroomName && (
            <li>
              <label>教室</label>：<span>{classroomName}</span>
            </li>
          )}
          {appointRule === 1 && (
            <li>
              <span>剩余名额：{appointNumLeft}</span>
            </li>
          )}
        </ul>
      </section>
      <footer>
        <span>
          <SamLink
            blank
            href={`${_global.url.v4}/vis/edu/page/schedule#/detail?lessonNo=${data.lessonNo}&kdtId=${data.kdtId}`}
            onClick={(e) => {
              onOperationClick(e, false);
            }}
          >
            日程详情
          </SamLink>
          <SamLink
            name="编辑"
            onClick={(e) => {
              onOperationClick(e, false);
              openScheduleDialog(1, {
                duplicate: true,
              });
            }}
          >
            复制
          </SamLink>
          {!!repeatType && [2, 3].includes(repeatType) ? dialogEdit : linkEdit}
        </span>
        <SamLink name="编辑" onClick={(e) => {
          onOperationClick(e, false);
          openDeleteLessonDialog(data, store, dispatch);
        }}>
          删除
        </SamLink>
      </footer>
    </article>
  );
};

export default DetailContent;
