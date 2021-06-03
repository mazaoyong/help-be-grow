import React from 'react';
import {
  Button,
  Input,
  Label,
  FormControl,
  FormError,
  IInputChangeEvent,
  IMEComposition,
} from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import cx from 'classnames';
import { IDialogChildrenProps, IDialogSubmitEffect } from '@youzan/ebiz-components/es/types/dialog';

import { IEditClassifyProps, IEditClassifyData } from './types';
import './styles.scss';

const { openDialog, DialogBody, DialogFooter } = Dialog;

const EmptyErrorMsg = '分类名称不能为空';
const LimitationErrorMsg = '分类名称不能超过40字';
const NoCategoryErrorMsg = '分类名称不能为“未分类”';
const ModifyClassify: React.FC<IDialogChildrenProps<
IEditClassifyData<IEditClassifyProps>,
IEditClassifyProps
>> = (props) => {
  const { data, dialogref, loadingState } = props;
  const [name, setName] = React.useState(data.type === 'edit' ? data.name : '');
  const [errorMsg, setErrorMsg] = React.useState<string>('');

  const targetId = React.useMemo(() => (data.type === 'edit' ? data.id : data.parentId || 0), [
    data,
  ]);

  const handleConfirm = React.useCallback(() => {
    if (!name) return;
    if (data.type === 'edit') {
      dialogref.submit({ type: 'edit', name, id: targetId });
    } else {
      dialogref.submit({ type: 'add', name, parentId: targetId || 0 });
    }
  }, [data.type, dialogref, name, targetId]);

  // 是在不想使用Form
  const simpleValidate = React.useCallback((passiveValue: string): Promise<string> => {
    if (!passiveValue) return Promise.resolve(EmptyErrorMsg);
    else if (passiveValue === '未分类') return Promise.resolve(NoCategoryErrorMsg);
    return Promise.resolve(passiveValue.length > 40 ? LimitationErrorMsg : '');
  }, []);

  const handleValidate = React.useCallback(
    (passiveValue: any) => {
      simpleValidate(passiveValue).then(setErrorMsg);
    },
    [simpleValidate],
  );

  const handleValueChange = React.useCallback(
    (evt: IInputChangeEvent) => {
      const curValue = evt.target.value;
      setName(curValue);
      setErrorMsg('');
    },
    [],
  );

  return (
    <div className="classify-list__edit-container">
      <DialogBody>
        <Label required>分类名称：</Label>
        <FormControl className={cx('edit-field-control', { 'has-error': errorMsg !== '' })}>
          <IMEComposition enable>
            <Input
              inline
              autoFocus
              type="text"
              width={376}
              value={name}
              className="input-filed"
              onBlur={() => handleValidate(name)}
              placeholder="请输入分类名称"
              onChange={handleValueChange}
              onPressEnter={handleConfirm}
            />
          </IMEComposition>
          <label htmlFor=".input-filed" className="input-count">
            {name.length}/40
          </label>
          <FormError style={{ marginTop: '.5em' }}>{errorMsg}</FormError>
        </FormControl>
      </DialogBody>
      <DialogFooter>
        <Button onClick={dialogref.close}>取消</Button>
        <Button
          type="primary"
          loading={loadingState}
          disabled={errorMsg !== ''}
          onClick={handleConfirm}
        >
          确定
        </Button>
      </DialogFooter>
    </div>
  );
};

const openModifyClassifyDialog = <T extends IEditClassifyProps['type']>(
  modifyProps: {
    type: T;
    submitEffect?: IDialogSubmitEffect<IEditClassifyData<T>>;
  } & IEditClassifyProps,
) => {
  const { type, submitEffect } = modifyProps;
  return openDialog<IEditClassifyData, IEditClassifyProps>(ModifyClassify, {
    title: type === 'add' ? '新建分类' : '重命名分类',
    dialogId: 'modifyClassify',
    data: modifyProps,
    submitEffect,
  });
};

export default openModifyClassifyDialog;
export type { IEditClassifyData, IEditClassifyProps };
