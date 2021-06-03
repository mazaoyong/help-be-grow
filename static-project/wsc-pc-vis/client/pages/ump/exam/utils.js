import React, { Component } from 'react';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import getTime from 'date-fns/get_time';

export const returnPic = obj => {
  const path = obj || {};
  return {
    url: path.cover || path.url || '',
    width: get(path, 'picture.width') || path.width || 0,
    height: get(path, 'picture.height') || path.height || 0,
  };
};

// 返回题目的媒体类型
const returnMedia = (media = {}, type) => {
  const returnVideo = isType => {
    return isType
      ? {
        video_id: media.videoId,
        cover_url: get(media, 'video.coverUrl'),
        status: get(media, 'video.videoStatus'),
        video_size: media.mediaSize,
        video_name: media.video_name,
      }
      : {
        video_id: 0,
        cover_url: '',
        status: -999,
        video_size: 0,
        video_name: '',
      };
  };
  const returnAudio = isType => {
    return isType
      ? {
        name: media.mediaName,
        path: media.descUrl,
        size: media.mediaSize,
      }
      : {
        name: '',
        path: '',
        size: 0,
      };
  };

  const returnCover = isType => {
    return isType
      ? {
        cover: media.descUrl,
      }
      : {
        cover: '',
      };
  };

  return {
    video: {
      ...returnVideo(type === 2),
    },
    audio: {
      ...returnAudio(type === 3),
    },
    cover: {
      ...returnCover(type === 1),
    },
  };
};

export const setMedia = (media = {}, type) => {
  const descUrlMap = {
    1: get(media, 'cover.cover'),
    2: get(media, 'video.cover_url'),
    3: get(media, 'audio.path'),
  };
  const videoIdMap = {
    1: 0,
    2: get(media, 'video.video_id'),
    3: 0,
  };
  const mediaSizeMap = {
    1: get(media.cover, 'picture.attachment_size', 0) || media.mediaSize,
    2: get(media, 'video.video_size'),
    3: get(media, 'audio.size'),
  };
  const mediaNameMap = {
    1: get(media.cover, 'picture.attachment_title', '') || media.mediaName,
    2: get(media, 'video.video_name'),
    3: get(media, 'audio.name'),
  };

  return {
    descUrl: descUrlMap[type] || '',
    height: get(media.cover, 'picture.height', 0) || media.height || 0,
    width: get(media.cover, 'picture.width', 0) || media.width || 0,
    mediaSize: mediaSizeMap[type] || 0,
    mediaName: mediaNameMap[type] || '',
    videoId: videoIdMap[type] || 0,
  };
};

export const tryCatch = cb => {
  try {
    return cb && cb();
  } catch (error) {
    return undefined;
  }
};

// 基本消息设置 将后端数据转换成表单所需数据
export const formatBasisDataToForm = data => {
  return {
    ...data,
    coverPic: {
      ...data.coverPic,
      cover: get(data, 'coverPic.url'),
    },
    questionBackgroundPic: {
      ...data.questionBackgroundPic,
      cover: get(data, 'questionBackgroundPic.url'),
    },
    backgroundPic: {
      ...data.backgroundPic,
      cover: get(data, 'backgroundPic.url'),
    },
    startMenuPic: {
      ...data.startMenuPic,
      cover: get(data, 'startMenuPic.url'),
    },
    nextQuestionMenuPic: {
      ...data.nextQuestionMenuPic,
      cover: get(data, 'nextQuestionMenuPic.url'),
    },
    rangeTime: [data.startAt, data.endAt],
    shopInfo: { applicableCampusList: data.applicableCampusList || [],
      applicableCampusType: data.applicableCampusType },
  };
};

// 基本消息设置 将表单数据转换成提交所需的数据格式
export const formatBasisDataToQuery = (data, { examId }) => {
  const {
    backgroundPic,
    coverPic,
    nextQuestionMenuPic,
    questionBackgroundPic,
    startMenuPic,
    shopInfo = {},
  } = data;

  return {
    backgroundPic: {
      ...returnPic(backgroundPic),
    },
    coverPic: {
      ...returnPic(coverPic),
    },
    startAt: getTime(data.rangeTime[0]),
    endAt: getTime(data.rangeTime[1]),
    id: +examId,
    mode: 1,
    nextQuestionMenuPic: {
      ...returnPic(nextQuestionMenuPic),
    },
    questionBackgroundPic: {
      ...returnPic(questionBackgroundPic),
    },
    summary: data.summary,
    startMenuPic: {
      ...returnPic(startMenuPic),
    },
    style: data.style,
    status: 1,
    title: data.title,
    applicableCampusKdtIds: formatShopList(shopInfo.applicableCampusList || []),
    applicableCampusType: shopInfo.applicableCampusType,
  };
};

const formatShopList = (shops = []) => {
  const shopKdtList = [];
  shops.forEach(item => {
    shopKdtList.push(item.kdtId);
  });
  return shopKdtList;
};

// 题目设置区域 将后端数据转换成表单所需的数据结构
export const formatTitleDataToForm = data => {
  const newData = [];
  const dataCopy = cloneDeep(data);
  const isDataArray = Array.isArray(dataCopy);
  const processData = isDataArray ? dataCopy : [dataCopy];

  processData.forEach(element => {
    const media = element.media || {};
    newData.push(
      Object.assign(element, {
        media: {
          ...(media || {}),
          ...returnMedia(media, element.mediaType),
        },
        backgroundPic: {
          ...element.backgroundPic,
          cover: get(element, 'backgroundPic.url'),
        },
        itemStyle: get(element, 'itemList[0].style', 1), // 选项格式
        itemList: element.itemList.map(item => {
          return {
            ...item,
            itemPic: {
              ...item.itemPic,
              cover: get(item, 'itemPic.url', ''),
            },
          };
        }),
      }),
    );
  });
  return isDataArray ? newData : newData[0];
};

// 题目设置区域 将表单数据转换成前后端交互所需数据结构
export const formatTitleDataToQuery = (data, { examId }) => {
  const examIdNum = +examId;
  return data.map((element, index) => {
    const {
      backgroundPic,
      description,
      itemList,
      itemRowNum,
      mediaType,
      questionType,
      scoreType,
      media = {},
      id,
      itemStyle,
    } = element;
    return {
      backgroundPic: {
        ...returnPic(backgroundPic),
      },
      description,
      examId: examIdNum,
      id,
      itemCount: itemList.length,
      itemRowNum,
      mediaType,
      questionType,
      scoreType,
      serialNo: index,
      media: {
        ...setMedia(media, mediaType),
      },
      itemList: itemList.map((item, itemIndex) => {
        return {
          detail: item.detail,
          examId: examIdNum,
          itemPic: {
            ...returnPic(item.itemPic),
          },
          id: item.id,
          questionId: id,
          scoreType: item.scoreType,
          style: itemStyle,
          score: item.score,
          serialNo: itemIndex,
        };
      }),
    };
  });
};

// 结果设置 将后端数据转换成表单所需数据结构
export const formatResultDataToForm = data => {
  const newData = [];
  const dataCopy = cloneDeep(data);
  const isDataArray = Array.isArray(dataCopy);
  const processData = isDataArray ? dataCopy : [dataCopy];
  processData.forEach(element => {
    newData.push({
      ...element,
      coupon: {
        couponRequired: get(element, 'coupon.couponId', 0) !== 0,
        couponId: get(element, 'coupon.couponId', 0),
        couponNum: get(element, 'coupon.giveCount', 0),
      },
      descPic: {
        ...element.descPic,
        cover: get(element, 'descPic.url'),
      },
    });
  });
  return isDataArray ? newData : newData[0];
};

// 如果当前的最低值n大于1，则新建的最高值应从n-1开始。更改RESULT_FORM_DATA中初始highpoint值
export const updateNewHighPoint = (formData, prevLowPoint) => {
  const conditions = formData && JSON.parse(formData.conditions);
  const newConditions = Object.assign({}, conditions, { highPoint: prevLowPoint - 1 });
  return Object.assign({}, conditions, { conditions: JSON.stringify(newConditions) });
};

// 结果设置 将表单数据转换成后端所需的数据
export const formatResultDataToQuery = (data, { examId, shareResult }) => {
  return data.map(element => {
    const { coupon } = element;
    return {
      coupon: {
        couponId: +coupon.couponId || 0,
        description: '',
        examId,
        giveCount: coupon.couponNum,
        id: 0,
        resultId: element.id,
      },
      conditions: element.conditions,
      display: shareResult ? 1 : 0,
      descPic: {
        ...returnPic(element.descPic),
      },
      description: element.description,
      examId,
      id: element.id,
      kdtId: _global.kdt_id,
      pushType: element.pushType,
      resultType: element.resultType,
      style: element.style,
      title: element.title,
    };
  });
};

// 完成页设置 将后端数据转换成表单所需的数据格式
export const formatFinishDataToForm = data => {
  return {
    ...data,
  };
};

// 完成页设置 将表单数据转换成后端所需的数据结构
export const formatFinishDataToQuery = (data, { examId }) => {
  const examIdNum = +examId;
  const { description, shareUrl, style, shareType, title, id } = data;
  return {
    description,
    shareUrl,
    style,
    shareType,
    title,
    shareId: id,
    examId: examIdNum,
  };
};

// 高阶组件 根据传入的 boolean 判断是否显示组件
export const canShowFactoryHOC = WrappedComponent => {
  return class HOC extends Component {
    render() {
      return this.props.canShow ? <WrappedComponent {...omit(this.props, ['canShow'])} /> : null;
    }
  };
};

/*
 * Utility to reorder list
 * Scans the list only once.
 */
export const reorder = (array, fromIndex, toIndex) => {
  const lastIndex = array.length - 1;
  const firstIndex = 0;
  const result = new Array(array.length);
  let tmp;

  if (fromIndex === toIndex) {
    return array;
  } else if (fromIndex < toIndex) {
    for (let i = firstIndex; i <= lastIndex; i++) {
      if (i === fromIndex) {
        tmp = array[i];
      } else if (i > fromIndex && i < toIndex) {
        result[i - 1] = array[i];
      } else if (i === toIndex) {
        result[i - 1] = array[i];
        result[i] = tmp;
      } else {
        result[i] = array[i];
      }
    }
  } else {
    for (let i = lastIndex; i >= firstIndex; i--) {
      if (i === fromIndex) {
        tmp = array[i];
      } else if (i < fromIndex && i > toIndex) {
        result[i + 1] = array[i];
      } else if (i === toIndex) {
        result[i] = tmp;
        result[i + 1] = array[i];
      } else {
        result[i] = array[i];
      }
    }
  }

  return result;
};

// 根据昵称和手机号生成下拉菜单客户文案
export const optionTextGen = ({ name, nickName, mobile }) => {
  if (name || nickName || mobile) {
    if (name) {
      return name + (mobile && `(${mobile})`);
    } else if (nickName) {
      return nickName + (mobile && `(${mobile})`);
    }
    return mobile;
  }
};

// 新建测试结果页面判断两个array元素是否完全相等，忽略conditions项
export const isEqualWithoutConditions = (arr1, arr2) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!isEqual(omit(arr1[i], 'conditions'), omit(arr2[i], 'conditions'))) {
      return false;
    }
  }
  return true;
};

// 字符串去除"."
export const omitDots = (string) => {
  return string.replace(/\./g, '');
};
