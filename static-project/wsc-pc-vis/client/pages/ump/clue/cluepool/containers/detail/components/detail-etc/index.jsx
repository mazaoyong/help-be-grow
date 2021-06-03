// 详情右侧
import React, { useCallback, useMemo } from 'react';
import { Tag, Tabs, Dialog, Notify } from 'zent';
import { checkAccess } from '@youzan/sam-components';
import { useWillUnmount } from '../../../../utils/hooks';
import { Dialog as ebizDialog } from '@youzan/ebiz-components';
import store from '../../store';
import getCurClueId from '../../utils/get-cur-clueid';
import './style.scss';

import ChangePhaseDialog from '../change-phase-dialog';
import CluePhase from '../clue-phase';
import ClueRecords from '../clue-records';
import AddTagDialog from '../add-tag-dialog';
import { changeStateAPI } from '../../../../api';

const { openDialog } = ebizDialog;
const { closeDialog } = Dialog;
const TabPanel = Tabs.TabPanel;

const ChangePhaseDialogID = 'ChangePhaseDialogID';
const AddTagDialogID = 'AddTagDialogID';

const DetailEtc = () => {
  const clueId = getCurClueId();
  const { tags, phase, owners, giveUpPhase, kdtId, roleId } = store.useStoreState();

  useWillUnmount(() => closeDialog(ChangePhaseDialogID));

  const isOwner = useMemo(
    () => owners.filter(({ userId }) => userId === _global.userId).length > 0,
    [owners],
  );
  const isShopAdmin = useMemo(
    () => kdtId === window._global.kdtId && roleId === 1 && owners.length > 0,
    [kdtId, roleId, owners],
  );
  const isDeleted = useMemo(() => phase === 8, [phase]);
  // 是否属于当前用户店铺
  const isOwnStore = useMemo(() => window._global.kdtId === kdtId, [kdtId]);

  const onChangePhase = useCallback(() => {
    const dialogRef = openDialog(ChangePhaseDialog, {
      dialogId: ChangePhaseDialogID,
      title: '更改阶段',
      style: { width: '610px' },
      data: {
        clueId,
      },
    });

    dialogRef.afterClosed().then(({ phase, orderNo }) => {
      store.setGlobalLoading(true);
      changeStateAPI(clueId, phase, orderNo)
        .then(() => {
          Notify.success('更新阶段成功');
          store.getDetail();
        })
        .catch(msg => {
          Notify.error(msg || '网络错误');
          store.setGlobalLoading(false);
        });
    });
  }, [clueId]);

  const onAddTag = useCallback(() => {
    const dialogRef = openDialog(AddTagDialog, {
      dialogId: AddTagDialogID,
      title: '添加标签',
      data: {
        selected: tags.map(({ tagId }) => tagId),
      },
      style: { width: '450px' },
    });

    dialogRef
      .afterClosed()
      .then(() => {
        store.getDetail();
      })
      .catch(() => { });
  }, [tags]);

  // 是否可以编辑线索和标签
  // 备注：
  // 1.已删除的线索不能更改阶段和标签
  // 2.店铺管理员可以更改阶段和标签
  // 3.线索拥有者，并且在线索所在的店铺，并且有编辑线索的权限才能更改阶段和标签
  const canEditPhaseAndTag = !isDeleted && (isOwner ? (isOwnStore && checkAccess('编辑')) : isShopAdmin);
  return (
    <article className="clue-detail__etc">
      <section className="clue-detail__etc__phase">
        <header className="clue-detail__etc__header">
          <h3>阶段</h3>
          {canEditPhaseAndTag && (
            <span className="cursor-link" onClick={onChangePhase}>
              更改阶段
            </span>
          )}
        </header>
        <article>
          <CluePhase onChangePhase={canEditPhaseAndTag && onChangePhase} phase={phase} giveUpPhase={giveUpPhase} />
        </article>
      </section>
      <hr color="#EBEDF0" />
      <section className="clue-detail__etc__tags">
        <header className="clue-detail__etc__header">
          <h3>标签</h3>
          {canEditPhaseAndTag && (
            <span className="cursor-link" onClick={onAddTag}>
              添加标签
            </span>
          )}
        </header>
        <article className="clue-detail__etc__tags__container">
          {tags.map(({ tagId, name }) => (
            <Tag key={tagId} theme="green" outline>
              {name}
            </Tag>
          ))}
          {tags.length === 0 && <div className="gray no-tag">暂无标签</div>}
        </article>
      </section>
      <section className="clue-detail__etc__tabs">
        <Tabs activeId={1}>
          <TabPanel tab="动态记录" id={1}>
            <ClueRecords />
          </TabPanel>
        </Tabs>
      </section>
    </article>
  );
};

export default DetailEtc;
