import React, { useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import { Grid, Icon, Notify } from 'zent';
import { ListPopupEditor } from '@youzan/ebiz-components';
import { ListPopupEditorType } from '@youzan/ebiz-components/es/list-popup-editor';
import ShareUrl from './share-url';
import { ILiveAssistantEntryDTO, IAssistantEntryItemDTO, ActorType } from '../types';
import style from '../style.m.scss';

import * as Api from '../api';

interface IPorps extends ILiveAssistantEntryDTO {
  onUpdate: () => any;
  alias: string;
}

const nameValidator = (value: string) => {
  if (!value) return '助教姓名不能为空';
  if (value.length > 8) return '助教姓名不能超过8个字';
  return '';
};

const getColumns = ({ onDelete, onEdit, editDomRef, lastAdd }) => {
  return [
    {
      title: '助教姓名',
      bodyRender(item: IAssistantEntryItemDTO) {
        const ref = item.account === lastAdd ? editDomRef : null;
        return (
          <div data-account={item.account} ref={ref}>
            <ListPopupEditor
              type={ListPopupEditorType.STR}
              initialValue={item.name}
              validate={nameValidator}
              onSubmit={name => onEdit(name, item.account)}
            >
              <span>{item.name}</span>
            </ListPopupEditor>
          </div>
        );
      },
    },
    {
      title: '频道号',
      name: 'account',
    },
    {
      title: '密码',
      name: 'channelPassword',
    },
    {
      title: '操作',
      align: 'right',
      width: '60px',
      bodyRender(item: IAssistantEntryItemDTO) {
        return (
          <a href="javascript:void" onClick={() => onDelete(item.account)}>
            移除
          </a>
        );
      },
    },
  ];
};

const AssistantManage: React.FC<IPorps> = props => {
  const { url, assistantEntryItemDTOList = [], onUpdate, alias } = props;
  const assistantList = useMemo(() => assistantEntryItemDTOList.reverse(), [
    assistantEntryItemDTOList,
  ]);
  const lastAddRef = useRef(0);
  const editDomRef = useRef<HTMLDivElement>(null);

  // 在每次list更新之后
  // 根据添加的account去手动触发编辑框的显示。。
  useLayoutEffect(() => {
    const account = lastAddRef.current;
    const editDom = editDomRef.current;
    if (account) {
      if (editDom) {
        const targetButton = editDom.querySelector<HTMLAnchorElement>('.list-popup-editor_trigger');
        if (targetButton) {
          targetButton.click();
        }
      }
      lastAddRef.current = 0;
    }
  }, [assistantList]);

  const handleAddClick = useCallback(() => {
    Api.addAssistant({ alias, name: '-', actorType: ActorType.ASSISTANT })
      .then(({ account }) => {
        lastAddRef.current = account;
        onUpdate();
      })
      .catch(error => Notify.error(error));
  }, [onUpdate, alias]);

  const handleDeleteClick = useCallback(
    account => {
      Api.deleteAssistant({ alias, account })
        .then(() => {
          onUpdate();
        })
        .catch(error => Notify.error(error));
    },
    [onUpdate, alias],
  );

  const handleEditClick = useCallback(
    (name, account) => {
      Api.updateAssistant({ alias, name, account })
        .then(() => {
          onUpdate();
        })
        .catch(error => Notify.error(error));
    },
    [onUpdate, alias],
  );

  const lastAdd = lastAddRef.current;
  const columns = useMemo(() => {
    return getColumns({
      editDomRef,
      onDelete: handleDeleteClick,
      onEdit: handleEditClick,
      lastAdd,
    });
  }, [handleDeleteClick, handleEditClick, lastAdd]);

  return (
    <div className={style['assistant-manage']}>
      <ShareUrl label="助教链接：" url={url} />

      <Grid
        className="assietant-manage__content"
        columns={columns}
        datasets={assistantList}
      />

      {assistantList.length < 5 && (
        <div className="manage__add-row">
          <a href="javascript:void(0)" onClick={handleAddClick}>
            <Icon type="plus-circle-o" />
            <span>添加助教</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default AssistantManage;
