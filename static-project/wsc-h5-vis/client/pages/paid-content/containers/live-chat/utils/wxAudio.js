import { ZNB } from '@youzan/wxsdk';
import { Toast } from 'vant';

import apis from 'pct/api';
import { newMsg } from '../utils/msg';
import { isOnlineVoice } from '../utils/index';
import ua from '@youzan/utils/browser/ua';

let recordMinuteCallbackFn = () => {};
let recordCallbackFn = () => {};
let errorFn = () => {};
const localVoices = {};

class WxAudio {
  static uploadVoice = ({
    isShowProgressTips = 0,
    localId,
    msgObj = null, // 如果有值表示重新加载该条资源
  } = {}) => {
    return new Promise((resolve, reject) => {
      const msg = msgObj || localVoices[localId];
      // 如果是重试，则无需进行 uploadVoice 操作
      if (msg && isOnlineVoice(msg.fromMsg.mediaUrl)) {
        return recordMinuteCallbackFn({
          type: 'end-parsed',
          value: msg,
        });
      }
      window.wx.uploadVoice({
        localId,
        isShowProgressTips,
        success: (res) => {
          const serverId = res.serverId; // 返回音频的服务器端ID
          apis.postAudioHigh({
            mediaId: serverId,
            useHigh: true,
          }, true)
            .then((data) => {
              msg.fromMsg.mediaUrl = data;
              msg.fromMsg.content = data;
              recordMinuteCallbackFn({
                type: 'end-parsed',
                value: msg,
              });
              resolve(msg);
            })
            .catch(() => {
              errorFn({
                type: 'error',
                value: msg,
              });
              reject(msg);
            });
        },
        fail: () => {
          errorFn({
            type: 'error',
            value: msg,
          });
          reject(msg);
        },
      });
    });
  }

  // 一分钟自动结束事件监听
  static addRecordMinuteListener = (fn) => {
    recordMinuteCallbackFn = fn;
  }

  // 主动停止录音事件监听
  static addRecordListener = (fn) => {
    recordCallbackFn = fn;
  }

  static addErrorListener = (fn) => {
    errorFn = fn;
  }

  constructor() {
    this.init();
    this.remainRecordTime = 60;
    this.visChatRecordTime = 0;
    this.isTriggerSixtyOver = false;
    this.timer = null;
  }

  // 开始 60s 计时
  startMinuteLeft(cbFn) {
    this.timer && clearInterval(this.timer);
    this.remainRecordTime = 60;
    let s = new Date().getSeconds();
    let time = +new Date();
    const fn = () => {
      if (+new Date() - this.visChatRecordTime > 59000) {
        this.remainRecordTime = 60;
        clearInterval(this.timer);
        if (!this.isTriggerSixtyOver) {
          this.reloadRecord();
        }
      }
      if (new Date().getSeconds() !== s) {
        this.remainRecordTime = 60 - parseInt((+new Date() - time) / 1000);
        cbFn(this.remainRecordTime);
      }
      s = new Date().getSeconds();
    };
    fn();
    this.timer = setInterval(fn, 100);
  }

  // 清除倒计时
  clearMinuteTimer() {
    clearInterval(this.timer);
    this.remainRecordTime = 60;
  }

  // 再次录音
  reloadRecord() {
    this.stopRecord(60, true)
      .then(() => {
        return this.startRecord();
      })
      .then(() => {
        recordMinuteCallbackFn({
          type: 'start',
          value: '',
        });
      });
  }

  // 开始录音
  startRecord() {
    return new Promise((resolve, reject) => {
      ZNB.getWx().then(wx => {
        wx.startRecord({
          success: () => {
            this.visChatRecordTime = +new Date();
            this.isTriggerSixtyOver = false;
            resolve();
          },
          cancel: () => {
            reject();
            Toast.fail('用户拒绝授权录音');
          },
          fail: (err) => {
            reject(err.errMsg);
            // 开启失败时先操作一次停止录音
            // 解决录音时刷新页面后 wx 继续录音的问题
            wx.stopRecord();
            if (err.errMsg) {
              if (err.errMsg.split(':')[1] !== 'fail') {
                Toast.fail(err.errMsg);
              }
            }
          },
        });
      });
    });
  }

  // 停止录音
  stopRecord(diffTime, isContinue) {
    return new Promise((resolve, reject) => {
      window.wx.stopRecord({
        success: (res) => {
          console.info('[utils wxAudio] wx.stopRecord success => res', res);
          if (!res.localId) {
            // 上报
            try {
              apis.postSkynetJson({
                log: {
                  key: 'pct-chat-recordtime-log',
                  message: '停止录音时报错',
                  recordTime: (+new Date() - this.visChatRecordTime),
                  user: _global.visBuyer,
                  uaInfo: navigator.userAgent,
                  isTriggerSixtyOver: this.isTriggerSixtyOver,
                  res,
                },
              });
            } catch (error) {
            }
            return this.isTriggerSixtyOver ? false : errorFn({
              type: 'error-wxerr',
              value: 'stop-fail',
            });
          }
          const msg = newMsg({
            content: res.localId,
            msgType: 'voice',
            during: +diffTime,
          });
          localVoices[res.localId] = msg;

          if (isContinue) {
            // 自动连续录音
            recordMinuteCallbackFn({
              type: 'end',
              value: msg,
            });
          } else {
            recordCallbackFn({
              type: 'end',
              value: msg,
            });
          }

          WxAudio.uploadVoice({
            localId: res.localId,
          })
            .then((data) => {
              resolve(data);
            })
            .catch((data) => {
              reject(data);
            });
        },
        fail: (res) => {
          reject(res);
          Toast(res.errMsg);
        },
      });
    });
  }

  // 重置录音
  resetRecord() {
    return new Promise((resolve, reject) => {
      window.wx.stopRecord({
        success: (res) => {
          resolve(res.localId);
        },
        fail: (res) => {
          reject(res);
        },
      });
    });
  }

  init() {
    ZNB.getWx().then(wx => {
      wx.onVoiceRecordEnd({
        complete: (res) => {
          try {
            let message = '';
            if ((+new Date() - this.visChatRecordTime > 60000) && this.visChatRecordTime > 0) {
              message = '大于 60s';
            } else {
              message = '不大于 60s';
            }
            apis.postSkynetJson({
              log: {
                key: 'pct-chat-recordtime-log',
                message: `触发 onVoiceRecordEnd 且计时${message}`,
                recordTime: (+new Date() - this.visChatRecordTime),
                user: _global.visBuyer,
                uaInfo: navigator.userAgent,
                res,
              },
            });
          } catch (error) {
          }
          // 修复部分情况 complete 先于倒计时触发的问题，或者字啊触发 stopRecord 时还未 success 的情况下 complete 先触发了
          if (res.localId && ua.isIOS()) {
            this.isTriggerSixtyOver = true;
            this.timer && clearInterval(this.timer);
            const msg = newMsg({
              content: res.localId,
              msgType: 'voice',
              during: 60,
            });
            localVoices[res.localId] = msg;
            recordCallbackFn({
              type: 'end',
              value: msg,
            });
            WxAudio.uploadVoice({
              localId: res.localId,
            });
          } else {
            errorFn({
              type: 'error-wxerr',
              value: 'onVoiceRecordEnd',
            });
          }
        },
      });
    });
  }
}

export default WxAudio;
