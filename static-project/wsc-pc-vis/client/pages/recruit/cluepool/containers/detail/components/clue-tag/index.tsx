import React, { useMemo, useCallback } from 'react';
import { checkAccess } from '@youzan/sam-components';
import { Dialog as ebizDialog } from '@youzan/ebiz-components';
import AddTagDialog from '../add-tag-dialog';
import { Tag } from 'zent';
import './style.scss';
const AddTagDialogID = 'AddTagDialogID';
const { openDialog } = ebizDialog;

interface ITag {
  tagId: number;
  name: string;
  systemTag: boolean;
}

interface IOwner {
  ownerName?: string;
  ownerId?: number;
  userId: number;
}

export interface IClueTagProps {
  // 线索ID
  clueId: number;
  needCheckAccess?: boolean;
  phase: number;
  owners: IOwner[];
  // 标签
  tags: ITag[];
  kdtId: number;
  roleId: number;
  // 添加回调事件
  onAdd?: () => void;
}

function IClueTag(props: IClueTagProps) {
  const { clueId, phase, owners, kdtId, roleId, onAdd, tags, needCheckAccess = true } = props;
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
  const onAddTag = useCallback(() => {
    const dialogRef = openDialog(AddTagDialog, {
      dialogId: AddTagDialogID,
      title: '添加标签',
      data: {
        selected: tags.filter(item => !item.systemTag).map(({ tagId }) => tagId),
        clueId: clueId,
        systemTags: tags.filter(item => item.systemTag),
      },
      style: { width: '450px' },
    });

    dialogRef
      .afterClosed()
      .then(() => {
        onAdd && onAdd();
      })
      .catch(() => {});
  }, [tags, clueId, onAdd]);
  return (
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
        {tags.map(({ tagId, name, systemTag }) => (
          <Tag key={tagId} theme={systemTag ? 'grey' : 'green'} outline>
            {name}
          </Tag>
        ))}
        {tags.length === 0 && <div className="gray no-tag">暂无标签</div>}
      </article>
    </section>
  );
}

export default IClueTag;
