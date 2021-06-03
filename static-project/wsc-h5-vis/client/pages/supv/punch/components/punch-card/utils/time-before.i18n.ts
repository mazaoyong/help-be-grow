import { distanceInWordsToNow, format, getISODay } from 'date-fns';

function getDistanceToNowI18N(time: string | number) {
  const timeDistanceEng = distanceInWordsToNow(time, { addSuffix: true });
  if (timeDistanceEng === 'less than a minute ago') {
    return '刚刚';
  }

  // 时间状态机
  let matcher = null;
  let regExpObj = /(\d+)\s*minute(s?) ago$/;
  const timeDistanceRemoveFuzzyWord = timeDistanceEng.replace(/^(almost|about)\s*/, '');
  matcher = timeDistanceRemoveFuzzyWord.match(regExpObj);
  if (matcher !== null) {
    const minutes = matcher[1];
    return minutes + '分钟前';
  } else {
    regExpObj = /(\d+)\s*hour(s?) ago$/;
    matcher = timeDistanceRemoveFuzzyWord.match(regExpObj);
    if (matcher !== null) {
      const hours = matcher[1];
      return hours + '小时前';
    } else {
      regExpObj = /(\d+)\s*day(s?) ago$/;
      matcher = timeDistanceRemoveFuzzyWord.match(regExpObj);
      // 匹配到了天数
      if (matcher !== null) {
        const days = matcher[1];
        if (Number(days) <= 7) {
          const week = getISODay(time) - 1;
          const weekList = ['一', '二', '三', '四', '五', '六', '日'];
          return '星期' + weekList[week];
        }
      }
      return format(time, 'YYYY-MM-DD');
    }
  }
}

export default getDistanceToNowI18N;
