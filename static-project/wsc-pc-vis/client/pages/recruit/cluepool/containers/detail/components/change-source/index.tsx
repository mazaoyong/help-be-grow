import React, { useState, useEffect } from 'react';
import { Dialog } from '@youzan/ebiz-components';
import { Button, Notify } from 'zent';
import { DialogWrapper } from '@ability-center/common';
import { modifySource } from '../../../../api';
import SourceSelect from './SourceSelect';
import './styles.scss';

const { DialogFooter } = Dialog;

export interface IChangeSourceProps {
  clueId: number;
  identityNo: string;
  onAddSuccess?: () => void;
  source?: any;
  close: () => void;
}

const clsNamePrefix = 'clue-change-source';
function ChangeSource(props: IChangeSourceProps) {
  const { close, clueId, identityNo, source, onAddSuccess } = props;
  const [loading, setLoaing] = useState(false);
  const [sourceIds, setSourceIds] = useState<number[]>([]);
  const [updateFlag, setUpdateFlag] = useState(0);

  useEffect(() => {
    if (source) {
      setSourceIds([source.groupId, source.sourceId]);
    }
  }, [source]);

  const onChange = ({ value }) => {
    if (value.length > 0) {
      setSourceIds(value);
    }
  };

  const onSubmit = () => {
    setLoaing(true);
    const sourceId = sourceIds[sourceIds.length - 1];
    modifySource({
      newSourceId: sourceId,
      clueId,
      identityNo,
    }).then(() => {
      setLoaing(false);
      onAddSuccess && onAddSuccess();
      Notify.success('修改成功');
      close();
    }).catch(err => {
      setLoaing(false);
      Notify.error(err);
    });
  };

  return (
    <div className={`${clsNamePrefix}`}>
      <div className={`${clsNamePrefix}__content`}>
        <label style={{ width: '85px' }}>
          <em className="zent-form__required">*</em>选择来源：
        </label>
        <SourceSelect value={sourceIds} onChange={onChange} updateFlag={updateFlag}/>
        <div className="tags-dialog__link-group">
          <a onClick={() => setUpdateFlag(Date.now())}>刷新</a>
          <a href="/v4/vis/edu/page/clue/source" target="_blank" rel="noopener noreferrer">
            添加来源
          </a>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => close()}>取消</Button>
        <Button type="primary" loading={loading} onClick={onSubmit}>
          保存
        </Button>
      </DialogFooter>
    </div>
  );
}
export default DialogWrapper(ChangeSource);
