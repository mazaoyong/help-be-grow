import * as React from 'react';
import { Notify, InlineLoading } from 'zent';
import cx from 'classnames';
import { IRecordProps } from './types';
import { secondsToColonTime } from './utils';
import RecordSdk from './record-sdk';
import './style.scss';
import { MAX_SIZE_DEFAULT } from '../constants';

const RecordWithRef = React.forwardRef<any, IRecordProps>((props, ref) => {
  const recordRef = React.useRef<RecordSdk>();

  const [isShow, setShow] = React.useState(() => {
    // 接收消息关闭
    document.addEventListener(`audioUploaderRecord-${props.anchor}`, (ev: any) => {
      if (ev.detail.type === 'show') {
        setShow(ev.detail.show);
      }
    });
    return false;
  });

  const [uploadingLoading, setUploadingLoading] = React.useState(false);

  const [currentTime, setCurrentTime] = React.useState(0);
  const [currentTimeFormat, setCurrentTimeFormat] = React.useState('00:00');
  const [isPause, setPause] = React.useState(false);
  const [isRecording, setIsRecordTrue] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    value: {
      isPause,
      isRecording,
    }
  }));

  const startMinuteLeft = () => {
    recordRef.current && recordRef.current.startMinuteLeft((currentTime) => {
      console.log('[record-uploader] 倒计时', currentTime);
      setCurrentTime(currentTime);
    });
  };

  const resetState = () => {
    setCurrentTime(0);
    setPause(false);
    setIsRecordTrue(false);
  };

  React.useEffect(() => {
    setCurrentTimeFormat(secondsToColonTime(currentTime));
  }, [currentTime]);

  React.useEffect(() => {
    recordRef.current = new RecordSdk({
      isAscendCount: props.isAscendCount,
      isContinuous: props.isContinuous,
      countTime: props.countTime,
      maxSize: props.maxSize || MAX_SIZE_DEFAULT,
      formatName: props.formatName,
      // 录音时的回调
      addRecordListener: (data) => {
        const handleMap = {
          'end': () => {
            resetState();
          },
          'pause': () => {
            setIsRecordTrue(false);
            setPause(true);
          },
          'resume': () => {
            setIsRecordTrue(true);
            setPause(false);
          },
          'end-parsed': () => {
            console.info('[record-uploader] 每次上传成功', data.value);
            const value = data.value;
            setUploadingLoading(false);
            const event = new CustomEvent(`audioUploaderRecord-${props.anchor}`, { 'detail': {
              list: [{
                attachment_url: value.url,
                attachment_id: value.audioId,
                attachment_title: value.name,
              }],
              type: 'data',
            } });
            document.dispatchEvent(event);
            setShow(false);
          },
          'reset': () => {
            // 初始化状态
            resetState();

            setShow(false);
          },
          start: () => {
            setCurrentTime(0);
            setIsRecordTrue(true);
            setUploadingLoading(false);
            startMinuteLeft();
            console.info('[record-uploader] 开始录音', data.value);
          },
        };
        handleMap[data.type]();
      },
      // 错误回调
      addErrorListener: data => {
        resetState();
        const handleMap = {
          'error:uploadVoiceToYz': () => {
            console.info('[record-uploader] 错误 上传有赞音频网络错误');
            Notify.warn('上传录音失败');
          },
          'error:startFail': () => {
            console.info('[record-uploader] 错误 触发了 startFail');
            Notify.warn('开始录音失败');
          },
          'error:limitRecord': () => {
            console.info('[record-uploader] 错误 limitRecord', data.value);
            Notify.warn('录音时间过短');
          },
          'error:stopFail': () => {
            console.info('[record-uploader] 错误 stopFail');
            Notify.warn('结束录音失败');
          },
          'error:maxSize': () => {
            console.info('[record-uploader] 错误 maxSize');
            Notify.warn(`录音最大不能超过 ${data.value.maxSize / 1024 / 1024}MB`);
          }
        };
        handleMap[data.type]();
      },
    });
  }, []);

  const handleStart = React.useCallback(() => {
    recordRef.current && recordRef.current.startRecord();
  }, []);

  const handleEnd = React.useCallback(() => {
    recordRef.current && recordRef.current.stopRecord();
    setUploadingLoading(true);
  }, []);

  const handlePause = React.useCallback(() => {
    recordRef.current && recordRef.current.pauseRecord();
  }, []);

  const handleResume = React.useCallback(() => {
    recordRef.current && recordRef.current.resumeRecord();
  }, []);

  const handleCancel = React.useCallback(() => {
    if (isRecording || isPause) {
      recordRef.current && recordRef.current.resetRecord();
    } else {
      setShow(false);
    }
  }, [isPause, isRecording]);

  const renderController = () => {
    let el: React.ReactElement;
    if (!isRecording && !isPause) {
      el = (
        <div
          className="audio-uploader-record__controller__controll-circle"
          onClick={handleStart}
        >
          开始
        </div>
      );
    } else if (isRecording) {
      el = (
        <>
          <div className="audio-uploader-record__controller__controll-wave" />
          <div
            className="audio-uploader-record__controller__controll-circle"
            onClick={handlePause}
          >
            暂停
          </div>
        </>
      );
    } else if (isPause) {
      el = (
        <div
          className="audio-uploader-record__controller__controll-circle"
          onClick={handleResume}
        >
          继续
        </div>
      );
    } else {
      el = <></>;
    }
    return el;
  };

  const renderFinish = () => {
    let el: React.ReactElement;
    if (!(!isRecording && !isPause)) {
      if (!uploadingLoading) {
        el = (
          <span onClick={handleEnd}>完成</span>
        );
      } else {
        el = (
          <InlineLoading
            loading
            icon="circle"
            iconText=""
          />
        );
      }
    } else {
      el = <></>;
    }
    return el;
  };

  return (
    <>
      {
        isShow ? (
          <div className={cx('audio-uploader-record', props.className)}>
            <div
              className="audio-uploader-record__header"
            >
              <div className="audio-uploader-record__header-countdown">
                {currentTimeFormat} / {secondsToColonTime(props.countTime)}
              </div>
            </div>
            <div className="audio-uploader-record__controller">
              <div
                onClick={handleCancel}
                className="audio-uploader-record__controller__cancel"
              >
                <span>取消</span>
              </div>
              <div className="audio-uploader-record__controller__controll">
                {renderController()}
              </div>
              {
                <div
                  className="audio-uploader-record__controller__finish"
                >
                  {
                    renderFinish()
                  }
                </div>
              }
            </div>
          </div>
        ) : null
      }
    </>
  );
});

export default RecordWithRef;
