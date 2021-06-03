// 线索详情阶段
import React, { memo, useMemo, useCallback } from 'react';
import { checkAccess } from '@youzan/sam-components';
import { Icon, Notify } from 'zent';
import cx from 'classnames';
import { phases } from '../../config';
import ChangePhaseDialog from '../change-phase-dialog';
import { Dialog as ebizDialog } from '@youzan/ebiz-components';
import { changeStateAPI } from '../../../../api';
import './style.scss';

const { openDialog } = ebizDialog;
const ChangePhaseDialogID = 'ChangePhaseDialogID';

interface IOwner {
  name: string;
  ownerId?: number;
  userId: number;
}
export interface ICluePhaseProps {
  needCheckAccess?: boolean;
  clueId: number;
  phase: number;
  owners: IOwner[];
  kdtId: number;
  roleId: number;
  afterDialogClose?: () => void;
  onChange?: () => void;
}

const CluePhaseItem = memo(({ text }: any) => {
  return (
    <dl className="clue-phase__item__dot">
      <dd>
        <i className="circle" />
      </dd>
      <dt>{text}</dt>
    </dl>
  );
});

const getItemClass = (i, cur) => {
  return cx({
    'clue-phase__item': true,
    active: cur < 7 && i <= cur,
  });
};

const CluePhaseInner = ({ phase: curPhase, onChangePhase }) => {
  const wrapClassName = useMemo(
    () =>
      cx({
        'clue-phase': true,
        pointer: onChangePhase,
        'give-up-phase': curPhase === 7 || curPhase === 8,
      }),
    [curPhase],
  );

  if (curPhase === 7 || curPhase === 8) {
    return (
      <ul className={wrapClassName}>
        <li className="clue-phase__item">
          <span className="icon">
            <Icon type="remove-o" />
          </span>
          <p>线索已{curPhase === 7 ? '放弃' : '删除'}</p>
        </li>
      </ul>
    );
  } else {
    return (
      <ul className={wrapClassName}>
        {phases.map((phase, i) => {
          return (
            <li key={phase.type}
              onClick={() => onChangePhase(phase.type)}
              className={getItemClass(phase.type, curPhase)}
            >
              {i !== 0 && <hr />}
              <CluePhaseItem text={phase.text} />
            </li>
          );
        })}
      </ul>
    );
  }
};

function CluePhase(props: ICluePhaseProps) {
  const { clueId, phase, owners, kdtId, roleId, afterDialogClose, onChange, needCheckAccess = true } = props;
  const isDeleted = useMemo(() => phase === 8, [phase]);
  const isOwner = useMemo(
    () => owners.filter(({ userId }) => userId === _global.userId).length > 0,
    [owners],
  );
  // 是否属于当前用户店铺
  const isOwnStore = useMemo(() => window._global.kdtId === kdtId, [kdtId]);
  const isShopAdmin = useMemo(
    () => kdtId === window._global.kdtId && roleId === 1 && owners.length > 0,
    [kdtId, roleId, owners],
  );
  // 是否可以编辑线索和标签
  // 备注：
  // 1.已删除的线索不能更改阶段和标签
  // 2.店铺管理员可以更改阶段和标签
  // 3.线索拥有者，并且在线索所在的店铺，并且有编辑线索的权限才能更改阶段和标签
  const canEditPhaseAndTag = !needCheckAccess || (
    !isDeleted && (isOwner ? isOwnStore && checkAccess('编辑') : isShopAdmin)
  );

  const onChangePhase = useCallback((phase) => {
    const dialogRef = openDialog(ChangePhaseDialog, {
      dialogId: ChangePhaseDialogID,
      title: '更改阶段',
      style: { width: '610px' },
      data: {
        clueId,
        initPhase: phase
      }
    });

    dialogRef.afterClosed().then(({ phase, orderNo }: any) => {
      afterDialogClose && afterDialogClose();
      changeStateAPI(clueId, phase, orderNo)
        .then(() => {
          Notify.success('更新阶段成功');
          onChange && onChange();
        })
        .catch(msg => {
          Notify.error(msg || '网络错误');
        });
    });
  }, [clueId, afterDialogClose, onChange]);
  return (
    <section className="clue-detail__etc__phase">
      <header className="clue-detail__etc__header">
        <h3>阶段</h3>
        {canEditPhaseAndTag && (
          <span className="cursor-link" onClick={() => onChangePhase(phase)}>
            更改阶段
          </span>
        )}
      </header>
      <article>
        <CluePhaseInner onChangePhase={canEditPhaseAndTag ? onChangePhase : null} phase={phase} />
      </article>
    </section>
  );
}

export default CluePhase;
