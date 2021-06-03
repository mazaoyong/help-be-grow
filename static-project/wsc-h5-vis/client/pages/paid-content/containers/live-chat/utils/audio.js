import UA from 'zan-utils/browser/ua';

let audio;
let nextFn = () => {};
const isAndroid = UA.isAndroid();

class Audio {
  constructor() {
    this.init();
  }

  init() {
    if (audio) {
      return;
    }
    audio = document.createElement('audio');
    window.__paidcontent_live_audioManager = audio;

    // 缓冲时显示loading
    audio.addEventListener('waiting', () => {
      nextFn('waiting');
    });
    // 可播放时隐藏loading
    audio.addEventListener('canplaythrough', () => {
      nextFn('canplaythrough');
    });
    // 播放结束后重置播放状态
    audio.addEventListener('ended', () => {
      nextFn('ended');
    });
    // 监听错误消息
    // 网络不好的情况也会走到这个步骤
    audio.addEventListener('error', (e) => {
      nextFn('error');
    });
    audio.preload = isAndroid ? 'none' : false;
  }

  loadAudio(item, next) {
    const url = item.fromMsg.mediaUrl;
    if (!url) return;
    if (next) {
      nextFn = (type) => {
        next(type);
      };
    }

    let audioUrl = url.replace('http:', 'https:');
    audioUrl = audioUrl.search(/\?avthumb\/mp3/) > -1 ? url : `${url}?avthumb/mp3/ab/256k/writeXing/0`;
    audio.src = audioUrl.replace(/\/\/img\.yzcdn\.cn/, '//img01.yzcdn.cn');
    audio.__msgId = item.fromMsg.msgId;
  }

  play() {
    audio.play();
  }

  pause() {
    audio.pause();
  }

  set(type, value) {
    audio[type] = value;
  }

  get(type) {
    return audio[type];
  }
};

export default Audio;
