import React from 'react';
import { Button } from 'zent';
import { Dialog, EasyList } from '@youzan/ebiz-components';
import formatMoney from '@youzan/utils/money/format';
import { get } from 'lodash';
import { format as formatTime } from 'date-fns';
import { formatConsumeNumber } from '@ability-center/edu-admin/signin';

import { getSignInRecordHistory } from '../../domain/apis';
import { SignInTag } from '../signin-tag';

import type { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';
import type { IEasyGridColumn, IListProps } from '@youzan/ebiz-components/es/types/easy-list';

import './styles.scss';

const { openDialog, DialogBody, DialogFooter } = Dialog;
const { List, EasyGrid } = EasyList;
interface ISignInHistoryProps {
  studentLessonNo: number;
  targetKdtId?: number;
  userId?: number;
}
export const SignInHistory: React.FC<IDialogChildrenProps<void, ISignInHistoryProps>> = (props) => {
  const { studentLessonNo, targetKdtId = _global.kdtId } = props.data;

  const fetchHistory = React.useCallback<IListProps['onSubmit']>(
    (query) => {
      const { page } = query;
      return getSignInRecordHistory({
        query: { studentLessonNo, kdtId: String(targetKdtId) },
        pageRequest: {
          pageNumber: page,
          pageSize: 5,
        },
      }).then(({ content, pageable, total }) => {
        return {
          dataset: content,
          pageInfo: {
            page: pageable.pageNumber,
            total,
          },
        };
      });
    },
    [studentLessonNo, targetKdtId],
  );

  const columns = React.useMemo<IEasyGridColumn[]>(
    () => [
      {
        title: '签到状态',
        bodyRender(data) {
          return <SignInTag state={data.signInStatus} />;
        },
      },
      {
        title: '消耗课时',
        bodyRender(data) {
          const consumeSlaveNum = get(data, 'consumeSlaveNum');
          const consumeNum = formatConsumeNumber(get(data, 'consumeNum'));
          return (
            <div className="signin-list__duoLine-cell">
              <p className="ellipsis">{consumeNum}</p>
              {consumeSlaveNum !== 0 && (
                <p className="ellipsis description">
                  (含赠送{formatConsumeNumber(consumeSlaveNum)})
                </p>
              )}
            </div>
          );
        },
      },
      {
        title: '消耗金额（元）',
        textAlign: 'right',
        bodyRender(data) {
          const { consumeTuition, consumeNum } = data;
          let isCourseAssets = consumeTuition !== undefined;
          if (consumeNum === -1) {
            // 如果是非课时资产
            isCourseAssets = consumeTuition > 0;
          }
          return isCourseAssets ? formatMoney(consumeTuition) : '-';
        },
      },
      {
        title: '签到人',
        bodyRender(data) {
          return (
            <div className="signin-list__duoLine-cell">
              <p className="ellipsis">{data.operator || '-'}</p>
              {
                /** 如果是商家操作，则额外展示商家操作人信息 */ data.operatorType === 1 && (
                  <p>{data.shopOperatorMobile || '-'}</p>
                )
              }
            </div>
          );
        },
      },
      {
        title: '签到时间',
        bodyRender(data) {
          return formatTime(data.signInTime, 'YYYY-MM-DD HH:mm:ss');
        },
      },
    ],
    [],
  );

  return (
    <div className="signin-history__container">
      <DialogBody>
        <List mode="none" onSubmit={fetchHistory} defaultFilter={{ pageSize: 5 }}>
          <EasyGrid rowKey="operateId" columns={columns} />
        </List>
      </DialogBody>
      <DialogFooter>
        <Button type="primary" onClick={props.dialogref.close}>
          确定
        </Button>
      </DialogFooter>
    </div>
  );
};

export const openSignInHistoryDialog = (
  data: ISignInHistoryProps & {
    studentName: string;
  },
) => {
  const { studentName, ...restProps } = data;
  openDialog(SignInHistory, {
    title: `${studentName}的历史签到状态`,
    data: restProps,
  })
    .afterClosed()
    .catch(() => {
      /** do nothing */
    });
};
