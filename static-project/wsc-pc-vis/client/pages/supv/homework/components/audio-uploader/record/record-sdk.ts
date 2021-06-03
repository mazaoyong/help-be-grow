// import { Notify } from 'zent';
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';
import get from 'lodash/get';
import upload from './upload';
import { RecordingStatus, IUploadVoiceProps } from './types';
import { getPauseResumeTime } from './utils';

const localVoices = {};
const WX_AUDIO_RECORD_DIFF_TIME = 1000;

class WxAudio {
  static uploadVoice({
    localId = 0,
    file = null,
    msgObj = null, // 如果有值表示重新加载该条资源
    formatName = () => '',
  }: IUploadVoiceProps) {
    return new Promise((resolve, reject) => {
      const msg = msgObj || localVoices[localId];
      // 如果是重试，则无需进行 uploadVoice 操作
      if (msg && isOnlineVoice(msg.url)) {
        resolve(msg);
        return;
      }
      const options = {
        tokenUrl: `${_global.url.v4}/vis/commom/material/getPublicBroadLimitAudioUploadToken.json`,
        kdtId: get(window, '_global.kdtId', get(window, '_global.kdt_id', '')),
        scope: 'kdt_img',
        onProgress() {

        },
        silent: true,
        maxSize: 500 * 1024 * 1024,
        onError() {
          reject({
            msg: '上传音频失败',
            type: 'error:uploadVoiceToYz',
            value: msg,
          });
        },
        onSuccess(res) {
          msg.url = res[0].attachment_url;
          msg.name = res[0].attachment_title;
          msg.audioId = res[0].attachment_id;
          resolve(msg);
        },
        uploadUrl: '//upload.qiniup.com',
        timeout: 24 * 60 * 60 * 1000,
        fileName(timestamp) {
          return formatName(timestamp);
        }
      };
      const uploadResult = upload(options, [{ file: file }], options);
      uploadResult && uploadResult
        .then(() => {
          console.log('上传成功');
        });
    });
  }

  get isRecording() {
    return this._recordStatus !== RecordingStatus.UN_START;
  }

  _fileIndex: number;
  _remainRecordTime: number; // 剩余的录音时间
  _visChatRecordTime: number; // 开始录音的时间戳
  _pauseTime: number[];
  _resumeTime: number[];
  _timer: number;
  _countTime: number;
  _isAscendCount: boolean; // 输出时间是倒计时还是正计时
  _isContinuous: boolean; // 是否需要连续录 x 分钟的音
  _maxSize: number;
  addRecordListener: ({ type: string, value: any }) => void;
  addErrorListener: ({ type: string, value: any }) => void;
  formatData: ({ url: string, localId: number }) => object;
  formatName: (timestamp: string) => string;
  rec: Recorder;
  _recordStatus: RecordingStatus;

  constructor(config) {
    this._countTime = config.countTime || 60 * 5;
    this._remainRecordTime = this._countTime;
    this._visChatRecordTime = +new Date();
    this._timer = 0;
    this._fileIndex = 0;
    this._recordStatus = RecordingStatus.UN_START;
    this._pauseTime = []; // 暂停录音的时间
    this._resumeTime = []; // 恢复录音的时间

    this._isAscendCount = config.isAscendCount || false;
    this._isContinuous = config.isContinuous || false;
    this._maxSize = config.maxSize || 500 * 1024 * 1024;
    this.addRecordListener = config.addRecordListener;
    this.addErrorListener = config.addErrorListener;
    this.formatData = config.formatData || ((data) => data);
    this.formatName = config.formatName || ((data) => data);

    this.init();
  }

  // 开始 60s 计时
  startMinuteLeft(cbFn: (time: number) => void) {
    this._timer && clearInterval(this._timer);
    this._remainRecordTime = this._countTime;
    let s = new Date().getSeconds();
    let startTime = this._visChatRecordTime;
    // 重新开始录音时需要将中间态置空
    this._resumeTime = [];
    this._pauseTime = [];
    const fn = () => {
      if (this._recordStatus !== RecordingStatus.RECORD_PAUSE) {
        const resumePauseDiff = getPauseResumeTime(this._pauseTime, this._resumeTime);
        if (+new Date() - startTime - resumePauseDiff > this._countTime * 1000 - 100) {
          this._remainRecordTime = this._countTime;
          clearInterval(this._timer);
          if (this._isContinuous) {
            this.reloadRecord();
          } else {
            this.stopRecord();
          }
        }
        if (new Date().getSeconds() !== s) {
          this._remainRecordTime = this._countTime -
          parseInt(String((+new Date() - startTime - resumePauseDiff) / 1000));
          cbFn(this._isAscendCount ? (this._countTime - this._remainRecordTime) : this._remainRecordTime);
        }
        s = new Date().getSeconds();
      }
    };
    fn();
    this._timer = window.setInterval(fn, 100);
  }

  // 清除倒计时
  clearMinuteTimer() {
    clearInterval(this._timer);
    this._remainRecordTime = this._countTime;
  }

  // 再次录音
  reloadRecord() {
    this.stopRecord(this._countTime, true)
      .then(() => {
        return this.startRecord();
      });
  }

  // 开始录音
  startRecord() {
    return new Promise<void>((resolve, reject) => {
      this.rec.open(() => {
        this.rec.start();
        resolve();
        this._visChatRecordTime = +new Date();
        ++this._fileIndex;
        this.addRecordListener({
          type: 'start',
          value: '',
        });
        this._recordStatus = RecordingStatus.RECORDING;
      }, (msg, isUserNotAllow) => {
        // 用户拒绝未授权或不支持
        console.log((isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg);
        reject({
          msg: (isUserNotAllow ? 'UserNotAllow，' : '') + '无法录音:' + msg
        });
        this.addErrorListener({
          type: 'error:startFail',
          value: msg,
        });
        this._recordStatus = RecordingStatus.UN_START;
      });
    });
  }

  pauseRecord() {
    this.rec.pause();
    this._recordStatus = RecordingStatus.RECORD_PAUSE;
    this._pauseTime.push(+new Date());
    this.addRecordListener({
      type: 'pause',
      value: '',
    });
  }

  resumeRecord() {
    this.rec.resume();
    this._recordStatus = RecordingStatus.RECORDING;
    this._resumeTime.push(+new Date());
    this.addRecordListener({
      type: 'resume',
      value: '',
    });
  }

  // 停止录音
  stopRecord(_?: number, isContinue?: boolean) {
    return new Promise((resolve, reject) => {
      // 操作时间过短 reject
      const now = +new Date();
      const resumePauseDiff = getPauseResumeTime(this._pauseTime, this._resumeTime);
      // 是否点了暂停后直接点结束了
      const whenPauseStop = this._pauseTime.length > this._resumeTime.length
        ? now - this._pauseTime[this._pauseTime.length - 1] : 0;

      const timeDiff = now - this._visChatRecordTime - resumePauseDiff - whenPauseStop;
      if (timeDiff < WX_AUDIO_RECORD_DIFF_TIME) {
        this.addErrorListener({
          type: 'error:limitRecord',
          value: timeDiff,
        });
        this._recordStatus = RecordingStatus.UN_START;
        this.clearMinuteTimer();
        return this.resetRecord()
          .then(() => {
            reject({ msg: '录音时间过短 ' });
          })
          .catch(() => {
            reject({ msg: '录音时间过短 ' });
          });
      }

      this.rec.stop((blob, duration) => {
        console.info('[record-sdk] stopRecord success => res', blob, duration);
        this.rec.close();
        this._recordStatus = RecordingStatus.RECORD_FINISH;

        const msg = {
          ...this.formatData({
            url: '',
            localId: this._fileIndex,
          }),
          url: '',
          localId: this._fileIndex,
        };

        localVoices[this._fileIndex] = msg;

        this.clearMinuteTimer();

        if (blob.size > this._maxSize) {
          return this.addErrorListener({
            type: 'error:maxSize',
            value: {
              blob,
              maxSize: this._maxSize
            },
          });
        }

        if (isContinue) {
          // 自动连续录音
          this.addRecordListener({
            type: 'end-sequential',
            value: msg,
          });
        } else {
          this.addRecordListener({
            type: 'end',
            value: msg,
          });
        }

        WxAudio.uploadVoice({
          localId: this._fileIndex,
          file: blob,
          formatName: this.formatName,
        })
          .then((data) => {
            resolve(data);

            this._recordStatus = RecordingStatus.UPLOADED;

            this.addRecordListener({
              type: 'end-parsed',
              value: data,
            });
          })
          .catch((data) => {
            reject(data);

            this._recordStatus = RecordingStatus.UPLOAD_FAIL;

            this.addErrorListener({
              type: data.type,
              value: data.value,
            });
            this.clearMinuteTimer();
          });
      }, (msg) => {
        console.log('录音失败:' + msg);
        this.rec.close();
        reject({
          msg: '录音失败',
        });
        this.addErrorListener({
          type: 'error:stopFail',
          value: msg,
        });
        this._recordStatus = RecordingStatus.UN_START;
        this.clearMinuteTimer();
      });
    });
  }

  // 重置录音
  resetRecord() {
    return new Promise((resolve, reject) => {
      this.rec.stop((blob) => {
        this.rec.close();
        this.addRecordListener({
          type: 'reset',
          value: blob,
        });
        this.clearMinuteTimer();
        resolve(blob);
      }, (msg) => {
        this.rec.close();
        this.clearMinuteTimer();
        reject({
          msg: msg,
        });
      });
    });
  }

  init() {
    this.rec = Recorder({
      type: 'mp3',
      sampleRate: 16000,
      bitRate: 16,
      onProcess: function() {
      }
    });
  }
}

export default WxAudio;

export const isOnlineVoice = (url) => {
  return url && url.search(/http/) > -1;
};
