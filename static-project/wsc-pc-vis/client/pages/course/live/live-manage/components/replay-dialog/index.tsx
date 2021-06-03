import React from 'react';
import { Radio, IRadioEvent, Button } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import './styles.scss';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';

export enum ReplayStatusEnums {
  DISABLED = 0,
  AVAILABLE,
}

interface IReplayDialogProps {
  currentState: ReplayStatusEnums;
  onStateChange?(status: ReplayStatusEnums): void;
}

const { openDialog, DialogBody, DialogFooter } = Dialog;

const ReplayDialogContent: React.FC<IDialogChildrenProps<ReplayStatusEnums, IReplayDialogProps>> = (
  props,
) => {
  const { data, dialogref } = props;
  const { onStateChange, currentState } = data;
  const [replayState, setReplayState] = React.useState(currentState);

  const handleStateChange = React.useCallback(
    (evt: IRadioEvent<ReplayStatusEnums>) => {
      const currentValue = evt.target.value;
      if (currentValue !== undefined) {
        setReplayState(currentValue);
        onStateChange && onStateChange(currentValue);
      }
    },
    [onStateChange],
  );

  return (
    <div className="live-manage__replayDialog">
      <DialogBody>
        <label className="label">回放功能：</label>
        <div className="field">
          <Radio.Group value={replayState} onChange={handleStateChange}>
            <Radio value={ReplayStatusEnums.AVAILABLE}>开启</Radio>
            <Radio value={ReplayStatusEnums.DISABLED}>关闭</Radio>
          </Radio.Group>
          <p className="helpDesc">
            开启回放后，订阅直播的用户可以观看直播回放。回放内容的准备需要一些时间，
            准备完成后用户即可观看回放；关闭后可再次开启。
          </p>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button onClick={dialogref.close}>取消</Button>
        <Button type="primary" onClick={() => dialogref.submit(replayState)}>
          保存
        </Button>
      </DialogFooter>
    </div>
  );
};

const openReplayDialog = (data: IReplayDialogProps) => {
  return openDialog<ReplayStatusEnums, IReplayDialogProps>(ReplayDialogContent, {
    title: '回放设置',
    dialogId: 'replaySetting',
    data,
  });
};

export default openReplayDialog;
