import { DatePicker } from '@zent/compat';
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, FormControl, FormError } from 'zent';
import { Dialog as EbizDialog } from '@youzan/ebiz-components';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';
import format from 'date-fns/format';
import { desensitivePhone } from 'fns/text/caculate';
import { getStuAssetInfo } from '../../../../../api/student-detail';
import { IEditAvailableTimeReturns, IEditAvailableTimeProps, StuAssetInfo } from './types';
import TipDialog from './TipDialog';
import './style.scss';

const { DialogBody, DialogFooter } = EbizDialog;
const { operator = { operatorName: '-', operatorPhone: '-' } } = window._global;

const DialogFooterWrapper = props => (
  <DialogFooter>
    <Button onClick={props.onCancel}>取消</Button>
    <Button type="primary" onClick={props.onOk} loading={props.btnLoading}>
      确定
    </Button>
  </DialogFooter>
);

// 对备注进行校验的 hook
const useMarkCheck = (mark: string): [string, () => Promise<unknown>] => {
  const [inputMarkErrorMsg, setInputMarkErrorMsg] = useState<string>('');

  const checkMarkInput = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (mark && mark.length > 100) {
        setInputMarkErrorMsg('最多输入100字');
        reject();
      } else {
        setInputMarkErrorMsg('');
        resolve();
      }
    });
  }, [mark]);

  useEffect(() => {
    checkMarkInput();
  }, [mark, checkMarkInput]);

  return [inputMarkErrorMsg, checkMarkInput];
};

// 备注字段的逻辑 hook
const useMarkInput = (): [string, (e: any) => void] => {
  const [mark, setMark] = useState<string>('');

  const handleMarkChange = useCallback(
    (e) => {
      setMark(e.target.value);
    },
    [],
  );

  return [mark, handleMarkChange];
};

// 时间字段的逻辑 hook
const useTimeChoose = (data) => {
  const now = new Date();
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  // 设置禁用时间，可设置时间不能早于今天
  const getDiesableDate = time => {
    const currentTime = time.getTime();
    const defaultTime = data.startTime;
    const beforeNow = currentTime < new Date(defaultTime).getTime();
    return beforeNow;
  };

  // 今天之前的时间以及默认时间之前都禁用
  const disablePast = time => {
    const defaultTime = data.startTime || now;
    const _startTime = new Date(format(defaultTime, 'YYYY-MM-DD 00:00:00')).getTime();
    const currentTime = new Date(time).getTime();
    return currentTime < _startTime;
  };

  return {
    now,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    getDiesableDate,
    disablePast
  };
};

// 学员资产信息
const useStuAssetInfo = (data) => {
  const [assetInfo, setAssetInfo] = useState({
    lastSignTime: 0,
    validityEndTime: 0
  });
  useEffect(() => {
    const { assetNo, studentId } = data;
    getStuAssetInfo({
      assetNo,
      studentId
    }).then((res: StuAssetInfo) => {
      setAssetInfo(res);
    });
  }, [data]);
  return [assetInfo];
};

const EditAvailableTime: React.FC<IDialogChildrenProps<IEditAvailableTimeReturns, IEditAvailableTimeProps>> = props => {
  const { loadingState, data, dialogref } = props;
  const [rangeTip, setRangeTip] = useState('');
  const [assetInfo]: StuAssetInfo[] = useStuAssetInfo(data);
  const {
    now,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    getDiesableDate,
    disablePast
  } = useTimeChoose(data);
  const [mark, handleMarkChange] = useMarkInput();
  const [inputMarkErrorMsg, checkMarkInput] = useMarkCheck(mark);

  const submit = useCallback(() => {
    const defaultTime = startTime || data.startTime || now;
    const _end = endTime || data.endTime;
    checkMarkInput()
      .then(() => {
        dialogref.submit({
          ...data,
          startTime: format(defaultTime, 'YYYY-MM-DD 00:00:00'),
          endTime: format(_end, 'YYYY-MM-DD 23:59:59'),
          mark,
        });
      });
  }, [checkMarkInput, data, dialogref, endTime, mark, now, startTime]);

  const handleOk = useCallback(
    () => {
      const _end = endTime || data.endTime;
      if (!_end) {
        setRangeTip('请填写有效期的截止日期');
        return void 0;
      }
      if (assetInfo.lastSignTime) {
        if (new Date(_end + ' 23:59:59').getTime() < assetInfo.lastSignTime) {
          setRangeTip(`学员最后签到日期为${format(assetInfo.lastSignTime, 'YYYY-MM-DD')}，有效期无法修改到该日期之前`);
          return void 0;
        }
      }
      if (assetInfo.validityEndTime > new Date(_end).getTime()) {
        TipDialog({
          assetInfo,
          endTime: _end,
          onOk: () => {
            submit();
          },
          callback: () => {}
        });
      } else {
        submit();
      }
    },
    [endTime, data.endTime, assetInfo, submit],
  );

  // 关闭对话窗
  const closeDialog = () => {
    setEndTime('');
    dialogref.close();
  };

  return (
    <>
      <DialogBody>
        <div className="available-change__field">
          <FormControl
            required
            label="有效期："
            invalid={!!rangeTip}
          >
            <>
              <DatePicker
                value={startTime || data.startTime || format(now, 'YYYY-MM-DD')}
                format="YYYY-MM-DD"
                disabled={!!data.startTime}
                disabledDate={disablePast}
                onChange={val => setStartTime(val as string)}
              />
              <span style={{ margin: '0 10px' }}>至</span>
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={getDiesableDate}
                value={endTime || data.endTime}
                onChange={val => setEndTime(val as string)}
              />
              {rangeTip && (<FormError className="field-dialog-item__error">{rangeTip}</FormError>)}
            </>
          </FormControl>
        </div>

        <div className="available-change__field">
          <div className="available-change__field-label">操作人：</div>
          <span>{`${operator.operatorName} ${desensitivePhone(operator.operatorPhone)}`}</span>
        </div>

        <FormControl
          required={false}
          label="备注："
          invalid={!!inputMarkErrorMsg}
          className="field-dialog-item"
        >
          <Input
            type="textarea"
            onChange={handleMarkChange}
            width="426px"
            onBlur={checkMarkInput}
            className="dialog-mark"
            placeholder="修改原因，100字以内"
            value={mark}
          />
          <p className="dialog-mark-desc">商家备注用户不可见</p>
          {inputMarkErrorMsg && (<FormError className="field-dialog-item__error">{inputMarkErrorMsg}</FormError>)}
        </FormControl>
      </DialogBody>
      <DialogFooterWrapper
        onCancel={closeDialog}
        onOk={handleOk}
        btnLoading={loadingState}
      />
    </>
  );
};

export default EditAvailableTime;
