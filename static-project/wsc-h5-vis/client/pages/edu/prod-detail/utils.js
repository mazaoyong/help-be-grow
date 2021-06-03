import fullfillImage from 'zan-utils/fullfillImage';
import each from 'lodash/each';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import reduce from 'lodash/reduce';

const pointsName = _global.visPointsName || '积分';

function getRewardStr(rewards = [], courseSellType) {
  const hasReward = [0, 0, 0];
  let fullStr = '';
  let rewardStr = [];
  let courseTime = 0;
  let course = [];
  let point = 0;
  let ticket = [];
  each(rewards, reward => {
    const rewardNodeType = get(reward, 'rewardConditionDTO.rewardNodeType');
    const awardDTOList = get(reward, 'awardDTOList');
    // 1消课 2入学 3毕业
    if (rewardNodeType === 1) {
      hasReward[0] = 1;
    }
    if (rewardNodeType === 2) {
      hasReward[1] = 1;
    }
    if (rewardNodeType === 3) {
      hasReward[2] = 1;
    }
    each(awardDTOList, award => {
      switch (award.awardType) {
        case 1:
          const ticketName = get(award, 'voucherCouponAwardDetailDTO.title');
          ticketName && ticket.push(ticketName);
          break;
        case 2:
          courseTime += courseSellType === 1 ? award.awardValue / 100 : award.awardValue;
          break;
        case 3:
          const courseName = get(award, 'trialCourseProductAwardDetailDTO.title');
          courseName && course.push(courseName);
          break;
        case 4:
          point += award.awardValue;
          break;
      }
    });
  });
  if (courseTime) {
    rewardStr.push(`${courseTime}${courseSellType === 1 ? '课时' : '天有效期'}`);
  }
  if (course.length) {
    rewardStr.push(course.join('、'));
  }
  if (point) {
    rewardStr.push(`${point}${pointsName}`);
  }
  if (ticket.length) {
    rewardStr.push(ticket.join('、'));
  }
  rewardStr = rewardStr.join('、');
  switch (hasReward.join('')) {
    case '010':
      fullStr = `购买课程即可领取${rewardStr}入学奖励`;
      break;
    case '001':
      fullStr = `课程结束后即可领取${rewardStr}毕业奖励`;
      break;
    case '100':
      fullStr = `一边学习一边领取${rewardStr}消课奖励`;
      break;
    case '011':
    case '110':
    case '101':
    case '111':
      fullStr = `${rewardStr}等你来领`;
      break;
    default:
  }
  return fullStr;
}

const handleVideo = (video) => {
  return {
    width: +video.coverWidth,
    height: +video.coverHeight,
    coverUrl: video.coverUrl,
    videoUrl: video.videoUrl,
    countPlayedUrl: video.count_played_url, // 统计播放
  };
};

const handlePicture = (video, picture) => {
  const coverUrl = video.coverUrl || '';

  if (video.videoUrl) {
    picture = [{ url: coverUrl }].concat(picture);
  }

  return picture.map(item => fullfillImage(item.url, '!750x0.jpg'));
};

const handlePictureRadto = (video, picture) => {
  const { coverWidth, coverHeight } = video;
  let pictureRatio = 0;
  const showGoodsVideo = video.videoUrl;

  picture.forEach((item, index) => {
    if (showGoodsVideo && index === 0) {
      if (!coverWidth || !coverHeight) {
        pictureRatio = 1;
      } else {
        pictureRatio = Math.max(0.5, Math.min(1.3, Math.max(pictureRatio, +coverHeight / coverWidth)));
      }
      return;
    }
    if (!+item.width || !+item.height) {
      pictureRatio = 1;
      return;
    }
    // 将高宽比限制到0.5至1.5之间
    pictureRatio = Math.max(
      0.5,
      Math.min(1.3, Math.max(pictureRatio, +item.height / +item.width))
    );
  });

  return pictureRatio;
};

// 处理轮播，使得传入的格式符合组件所需要的
const handleImageSwpData = (video = {}, picture = []) => {
  const goodsVideo = handleVideo(video); // 获取视频
  const goodsPictures = handlePicture(video, picture); // 获取图片
  const goodsPictureRatio = handlePictureRadto(video, picture);

  return {
    goodsVideo,
    goodsPictures,
    goodsPictureRatio,
  };
};

/**
 * 驼峰格式字符串转为下划线格式
 *
 * @param {string} str 处理前字符串
 * @return {string} 处理后的字符串
 */
const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, item => `_${item[0].toLowerCase()}`);
};

/**
 * 将数组或者对象里的key从驼峰格式字符串转为下划线格式
 *
 * @param {Object|Array} value 待处理对象或者数组
 * @param {boolean} deep 是否递归处理
 * @return {Object|Array} 处理后的对象
 */
const mapKeysToSnakeCase = (value, deep = true) => {
  let res;
  if (Array.isArray(value) && value.length > 0) {
    res = [];
  } else if (isPlainObject(value) && Object.keys(value).length > 0) {
    res = {};
  } else {
    return value;
  }
  return reduce(value, (result, val, key) => {
    if (deep) {
      val = mapKeysToSnakeCase(val);
    }
    const newKey = typeof key === 'string' ? toSnakeCase(key) : key;
    result[newKey] = val;
    return result;
  }, res);
};

export {
  handleImageSwpData,
  mapKeysToSnakeCase,
  getRewardStr,
};
