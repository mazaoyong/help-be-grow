import ajax from 'captain-ajax';
import { Toast } from 'vant';

function getCdnAudio(url) {
  // 获取音频时长
  return ajax({
    url: `${url}?avinfo`,
    noXRequestedWithHeader: true,
  });
}

function getDuration(data) {
  // amr音频在ios中可能获取不正确的时间
  return Math.floor(+data.format.duration);
}

function getAudioTranscodeSrc(url) {
  const transcodeParam = '?avthumb/mp3/ab/64k/writeXing/0';
  let suffix = '';

  // amr音频需要强制在线转码，mp3音频直接播放
  if (/\.amr$/i.test(url)) {
    suffix = transcodeParam;
  }

  return url + suffix;
}

export default {
  getAudioInfo(url) {
    const audioUrl = url.split('?')[0].replace('http:', 'https:');
    const hasSuffix = audioUrl.indexOf('64k') > -1;
    const compressedAudioUrl = hasSuffix ? audioUrl : `${audioUrl}@64k.mp3`;

    // 先尝试获取压缩音频
    return getCdnAudio(compressedAudioUrl).then((data) => {
      return {
        url: compressedAudioUrl,
        duration: getDuration(data),
      };
    }).catch(() => {
      // 获取压缩音频失败，则降级获取原音频
      return getCdnAudio(audioUrl).then((data) => {
        return {
          url: getAudioTranscodeSrc(audioUrl),
          duration: getDuration(data),
        };
      }).catch((err) => {
        Toast('音频信息获取失败');
        throw err;
      });
    });
  },
};
