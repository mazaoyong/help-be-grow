import { ImagePreview } from 'vant';
import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';
import cdnDowngrade from '@/common/utils/cdn-downgrade';

const miniprogram = window._global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;

let images: string[] = [];
let videos: string[] = [];
let questionId = -1;
window.__imagePreview__ = (index: number) => {
  ImagePreview({
    images: images.map(url => cdnDowngrade(url)),
    startPosition: index,
  });
};
window.__playVideo__ = (index: number) => {
  const src = videos[index];
  if (src) {
    const popup = document.createElement('div');
    popup.className = 'exam-video-popup';
    popup.addEventListener('click', () => {
      document.body.removeChild(popup);
    });
    popup.setAttribute('style', 'position: fixed;z-index: 9999;top: 0;bottom: 0;left: 0;right: 0;background: #000;overflow:hidden;');
    const videoIframe = document.createElement('iframe');
    videoIframe.className = 'exam-video-iframe';
    videoIframe.src = src;
    const videoHeight = window.innerWidth * 0.75;
    const top = (window.innerHeight - videoHeight) / 2 - 50;
    videoIframe.setAttribute('style', `position: absolute;top: ${top}px;left: 0;width: 100%;height: ${videoHeight}px;object-fit: contain;overflow:hidden`);
    videoIframe.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    });
    popup.appendChild(videoIframe);
    document.body.appendChild(popup);
  }
};
export function serializeRichText(parsed: IContent[], {
  addListener = false,
  addStyle = false,
  addVideoListener = false,
}) {
  if (Array.isArray(parsed) && parsed.length) {
    return parsed.map((node) => getContent(node, {
      addListener,
      addStyle,
      addVideoListener,
    })).join('');
  }
  return '';
}

interface IContent {
  type: string;
  text: string;
  attr: string;
  src: string;
  nodes: IContent[];
}
function getContent(item: IContent, {
  addListener = false,
  addStyle = false,
  addVideoListener = false,
}): string {
  const { type, attr = '', src, text, nodes } = item;
  const width = (window.innerWidth - 127) / 2;
  if (type === 'a') {
    return `<a ${attr}>${text + nodes.map((node) => getContent(node, {
      addStyle,
      addVideoListener,
    })).join('')}</a>`;
  }
  if (type === 'img') {
    if (addListener) images.push(src);
    return `<${type} ${addStyle ? `style="width:${width}px;height:${width}px"` : ''} ${addListener ? `onclick="__imagePreview__(${images.length - 1})"` : ''} ${attr} src="${src}">`;
  }
  if (type === 'iframe') {
    if (isWeapp) return '<div></div>';
    if (addListener || addVideoListener) videos.push(src);
    return `<div class="exam-video-cover" ${addListener || addVideoListener ? `onclick="__playVideo__(${videos.length - 1})"` : ''}><iframe ${addStyle ? `style="width:${width}px;height:${width}px"` : ''} ${attr} src="${src}"></iframe></div>`;
  }
  if (Array.isArray(nodes) && nodes.length) {
    return `<div>${text + nodes.map((node) => getContent(node, {
      addListener,
      addStyle,
      addVideoListener,
    })).join('')}</div>`;
  }
  if (type === 'strong') {
    return `<strong>${text}</strong>`;
  }
  return `<div>${text}</div>`;
}

export function handleOptionContent(content: string, id?: number, {
  addListener = false,
  addStyle = false,
  addVideoListener = false,
} = {}) {
  if (!content) return '';

  if (addListener && id && questionId !== id) {
    images = [];
    videos = [];
    questionId = id;
  }

  // 如果是纯文本，直接返回
  if (!content.startsWith('{')) {
    return `<div>${content}</div>`;
  }

  let richTextObj, parsed, origin;
  try {
    richTextObj = JSON.parse(content);
    parsed = richTextObj.parsed || [];
    origin = richTextObj.origin || '';
  } catch (err) {
    parsed = content;
    origin = content;
  }

  if (parsed) {
    if (origin && !parsed.length) {
      return `<div>${origin}</div>`;
    }

    return serializeRichText(parsed, {
      addListener,
      addStyle,
      addVideoListener,
    });
  }
  return '';
}

export function convertAddressLike(value: any, dataType: any) {
  let currentValue = '';
  if (Array.isArray(value)) {
    let tempValue = value;
    if (dataType === TYPE_ENUMS.ADDRESS) {
      tempValue = value.slice(0, 3);
      tempValue.push({ code: 0, name: value[3] });
    } else {
      tempValue = value.slice(0, 3);
    }
    currentValue = JSON.stringify(tempValue);
  }
  return currentValue;
}

export function convertMultiSelect(value: any) {
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return '';
}
