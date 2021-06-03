import React from 'react';
import { Button, Notify } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import {
  IDialogChildrenProps,
  IDialogSubmitEffect,
  IopenDialogOptions,
} from '@youzan/ebiz-components/es/types/dialog';
import {
  ClassifyList,
  IClassifyTreeItem,
  IMoveClassifyProps,
  IMoveClassifyData,
} from '@ability-center/supv/question-bank';

import { isValidateTreeType } from './utils';
import './styles.scss';

const { openDialog, DialogBody, DialogFooter } = Dialog;

const ModifyClassify: React.FC<IDialogChildrenProps<IMoveClassifyData, IMoveClassifyProps>> = (
  props,
) => {
  const { dialogref, data, loadingState } = props;
  const { onSelect, selectedTreeNode, depPointer, showSubtitle = true, needSystemDefault } = data;
  const [selectedTargetParentId, setTargetParentId] = React.useState(0);
  const [selectedTargetId, setTargetId] = React.useState(0);
  const [targetTreeNode, setTargetTreeNode] = React.useState<IClassifyTreeItem | undefined>();

  const handleConfirm = React.useCallback(() => {
    let error;
    if (targetTreeNode && selectedTreeNode) {
      error = isValidateTreeType(selectedTreeNode, targetTreeNode);
    }
    if (!error) {
      dialogref.submit({
        targetParentId: selectedTargetParentId,
        targetId: selectedTargetId,
        rowData: targetTreeNode,
      });
    } else Notify.error(error);
  }, [selectedTreeNode, targetTreeNode, dialogref, selectedTargetParentId, selectedTargetId]);

  const setConfirmInfo = React.useCallback(
    (targetId, rowData: IClassifyTreeItem) => {
      setTargetId(targetId || 0);
      setTargetParentId(rowData.parentId || 0);
      setTargetTreeNode(rowData);
      if (onSelect) {
        onSelect(targetId, rowData);
      }
    },
    [onSelect],
  );

  return (
    <div className="move-classify__container">
      <DialogBody>
        {showSubtitle && <h2 className="move-classify__subtitle">请选择要移动到的位置</h2>}
        <div className="move-classify__list">
          <ClassifyList
            needSystemDefault={needSystemDefault || false}
            popPosition="top-right"
            onClickItem={setConfirmInfo}
            omitChild={depPointer || []}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={dialogref.close}>取消</Button>
        <Button
          type="primary"
          loading={loadingState}
          onClick={handleConfirm}
          disabled={targetTreeNode === undefined}
        >
          确定
        </Button>
      </DialogFooter>
    </div>
  );
};

const openMoveClassifyDialog = (
  moveProps: IMoveClassifyProps,
  dialogOptions?: {
    submitEffect?: IDialogSubmitEffect<IMoveClassifyData>;
  } & Omit<IopenDialogOptions<IMoveClassifyProps>, 'data'>,
) => {
  return openDialog<IMoveClassifyData, IMoveClassifyProps>(
    ModifyClassify,
    Object.assign(
      {
        title: '移动',
        dialogId: 'moveClassify',
        data: moveProps,
        style: { width: '480px' },
      },
      dialogOptions,
    ),
  );
};

export default openMoveClassifyDialog;
export type { IMoveClassifyData, IMoveClassifyProps };
