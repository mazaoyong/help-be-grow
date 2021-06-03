import map from 'lodash/map';
import { decodeHTML } from 'fns/text/html-entities';
import { getTextLengthAndPos } from 'fns/text/caculate';

const common = {
  title: '', //
  author: '',
  summary: '', //
  assistTxtType: 1,
  joinLevelDiscount: 0,
  joinGroupSetting: {
    groupOpen: 0,
  },
  collectInfoSetting: {
    mobile: 0,
    weiXin: 0,
    name: 0,
    contactAddress: 0,
    gender: 0,
  },
  showInStore: 1,
  isSingleChecked: false,
  isColumnChecked: true, //
  columnAlias: '', //
  hasColumn: false,
  status: 1,
  pictureDTO: '', //
  cover: '', //
  mediaType: 2, //
  price: 0,
  content: '', //
  preview: '',
  sellerType: 2,
};

function formatTitle(title, exts = ['mp3', 'amr', 'mpeg']) {
  // 名称去掉后缀名
  const decodedTitle = decodeHTML(title);
  const match = decodedTitle.match(/.+(\.(.*?))$/);
  if (match && exts.includes(match[2].toLowerCase())) {
    return decodedTitle.replace(match[1], '');
  }
  // [length(overSize=-1), index]
  const isOverLength = getTextLengthAndPos(decodedTitle, {
    maxium: 40,
  })[0];
  if (isOverLength === -1) {
    return decodedTitle.substr(0, 40);
  }
  // 如果视频标题中没有后缀名，并且长度没有超过40个字符
  return decodedTitle;
}

export default function makeBatchData(type, data, columnInfo) {
  const picture = {
    picId: columnInfo.pic_id,
    picHeight: columnInfo.pic_height,
    picWidth: columnInfo.pic_width,
    cover: columnInfo.cover,
  };

  const filledColumn = Object.assign({}, common, {
    summary: columnInfo.summary,
    columnAlias: columnInfo.alias,
    pictureDTO: picture,
    cover: columnInfo.cover,
  });

  // 视频
  if (type === 'video') {
    return map(data, item => {
      let title = formatTitle(item.file_name || item.video_name, [
        'mp4',
        'mov',
        'm4v',
        'flv',
        'x-flv',
        'mkv',
        'wmv',
        'avi',
        'rmvb',
        '3gp',
      ]);

      return Object.assign({}, filledColumn, {
        title,
        videoWholeName: item.video_name,
        videoWholeSize: String(item.video_size), // RC的upload返回的size是number
        videoId: item.video_id,
        videoPreviewName: '',
        videoPreviewSize: '',
        videoPreviewId: '',
        mediaType: 3,
      });
    });
  }

  // 音频
  return map(data, item => {
    // 名称去掉后缀名
    let title = formatTitle(item.attachment_title);

    return Object.assign({}, filledColumn, {
      title,
      audioWholeName: item.attachment_title,
      audioWholeSize: String(item.attachment_size), // 保险一下，确定这个为String
      content: item.attachment_full_url,
      mediaType: 2,
      audioSummary: '',
      audioPreviewName: '',
      audioPreviewSize: '',
    });
  });
}
