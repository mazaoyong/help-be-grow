import pick from 'lodash/pick';
import omit from 'lodash/omit';

export function formatContent(param) {
  const { mediaType } = param;
  let data;

  // 图文内容
  if (+mediaType === 1) {
    const textDTOKeys = ['content', 'preview'];
    const textDTO = pick(param, textDTOKeys);
    data = omit(param, textDTOKeys);
    data.textContentDTO = textDTO;
  }

  // 音频内容
  if (+mediaType === 2) {
    const audioDTOKeys = [
      'audioWholeSize',
      'audioText',
      'audioPreviewSize',
      'audioWholeName',
      'audioSummary',
      'audioPreviewName',
      'audioPreviewText',
      'content',
      'preview',
    ];
    const audioDTO = pick(param, audioDTOKeys);
    data = omit(param, audioDTOKeys);
    data.audioContentDTO = audioDTO;
  }

  // 视频内容
  if (+mediaType === 3) {
    const videoDTOKeys = [
      'videoPreviewText',
      'videoPreviewSize',
      'videoWholeName',
      'videoPreviewId',
      'videoId',
      'videoText',
      'videoWholeSize',
      'videoPreviewName',
    ];

    const videoDTO = pick(param, videoDTOKeys);
    data = omit(param, videoDTOKeys);
    if (videoDTO.videoPreviewId === '') {
      videoDTO.videoPreviewId = undefined;
    };
    data.videoContentDTO = videoDTO;
  }

  let singleChecked = data.isSingleChecked ? 1 : 0;
  let columnChecked = data.isColumnChecked ? 2 : 0;
  data.sellerType = singleChecked + columnChecked;

  return data;
}
