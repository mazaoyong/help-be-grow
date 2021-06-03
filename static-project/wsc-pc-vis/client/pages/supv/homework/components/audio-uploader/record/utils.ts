/**
 * 将文件的Byte转换为可读性更好的GB\MB\KB\B
 *
 * @param  {number} size    大小，单位Byte
 * @param  {number} toFixed 保留几位小数，默认值为1
 * @return {string}         格式化后的字符串
 * @example
 * formatFileSize(1024) => '1 MB'
 */
export function formatFileSize(size, toFixed?: number) {
  size = +size || 0;

  if (toFixed === void 0) {
    toFixed = 1;
  }

  if (size >= 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024 * 1024)).toFixed(toFixed)} GB`;
  } else if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(toFixed)} MB`;
  } else if (size >= 1024) {
    return `${(size / 1024).toFixed(toFixed)} KB`;
  }
  return `${size.toFixed(toFixed)} B`;
}

export function secondsToColonTime(seconds: number) {
  let minute = parseInt(String(seconds / 60), 10) || 0;
  const secondMid = Math.round(seconds % 60) || 0;
  const secondLast = secondMid < 10 ? `0${secondMid}` : `${secondMid}`;
  return `${minute}:${secondLast}`;
}

export function responseParse(file) {
  let {
    attachmentFullUrl,
    attachmentId,
    attachmentSize,
    attachmentTitle,
    attachmentUrl,
    categoryId,
    createTime,
    fileExt,
    isDelete,
    kdtId,
    mediaExpireTime,
    mediaId,
    mediaType,
    thumbUrl,
    ...rest
  } = file;
  return {
    attachment_file: attachmentUrl || file.attachment_file,
    attachment_full_url: attachmentFullUrl || file.attachment_full_url,
    attachment_id: `${attachmentId}` || file.attachment_id,
    attachment_size: `${attachmentSize}` || file.attachment_size,
    attachment_title: attachmentTitle || file.attachment_title,
    attachment_url: attachmentFullUrl || file.attachment_url,
    category_id: categoryId || file.category_id,
    create_time: createTime || file.create_time,
    file_ext: fileExt || file.file_ext,
    is_delete: `${isDelete}` || file.is_delete,
    kdt_id: `${kdtId}` || file.kdt_id,
    media_expire_time: mediaExpireTime || file.media_expire_time,
    media_id: `${mediaId}` || file.media_id,
    media_type: mediaType || file.media_type,
    thumb_file: attachmentUrl || file.thumb_file,
    thumb_url: thumbUrl || file.thumb_url,
    ...rest,
  };
}

export function createObjectURL(object) {
  return window.URL ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

export function formatError(resp, options: { maxSize?: number } = {}) {
  const DefaultErrorMsg = '系统异常，请稍后再试';

  if (!resp) {
    return DefaultErrorMsg;
  }

  // 针对七牛返回的 error 信息特殊处理
  if (typeof resp.error === 'string') {
    if (options.maxSize && resp.error.includes('exceed FsizeLimit')) {
      return `文件不能超过${formatFileSize(options.maxSize)}，请调整后重新上传`;
    }

    const errorMap = {
      'limited mimeType': '不支持当前上传的文件格式，请调整后重新上传',
      'exceed FsizeLimit': '文件大小超限，请调整后重新上传',
      token: DefaultErrorMsg,
    };
    for (let key of Object.keys(errorMap)) {
      if (resp.error.includes(key)) {
        return errorMap[key];
      }
    }
  }
  if (typeof resp === 'string') {
    return resp || DefaultErrorMsg;
  }
  if (typeof resp.msg === 'string') {
    return resp.msg || DefaultErrorMsg;
  }
  if (typeof resp.name === 'string' && typeof resp.message === 'string') {
    return `${resp.name}: ${resp.message}`;
  }
  if (typeof resp.toJSON === 'function') {
    return resp.toJSON() || DefaultErrorMsg;
  }

  return DefaultErrorMsg;
}

export function getPauseResumeTime(pauseList: number[], resumeList: number[]) {
  const diffArray = pauseList.map((o, index) => {
    if (o && resumeList[index]) {
      return resumeList[index] - o;
    } else {
      return 0;
    }
  });
  return diffArray.reduce((previous, current) => {
    return previous + current;
  }, 0);
};
