import format from 'date-fns/format';
import distanceOfDates from 'date-fns/difference_in_days';

type RepeatType = 1 | 2;
type TimeType = Date | string | number;
type FormatedRule = {weekDay: number, times: number};
type FormatedRules = Array<FormatedRule>;
interface RepeatRuleType {
  weekDay: number,
  startTime: string,
  endTime: string,
}

/**
 * 用于提交前检验扣课时数是否超过限制，根据班级的开课时间和结课时间推算
 *
 * @param {number} repeatType 重复类型
 * @param {string} startTime 课程开始时间
 * @param {string} endTime 课程结束时间
 * @param {Array} repeatRules 重复规则
 * @return {number} maxClassTimes
 */
export default function getMaxTimes(
  repeatType: RepeatType = 1,
  startTime: TimeType,
  endTime?: TimeType,
  repeatRules?: Array<RepeatRuleType>,
): number {
  let maxClassTimes = 999;
  if (startTime !== '' && endTime !== undefined) {
    // 格式化时间
    const formatedStartTime = format(startTime, 'YYYY-MM-DD 00:00:00');
    const formatedEndTime = format(endTime, 'YYYY-MM-DD 23:59:59');
    if (repeatType === 1) {
      // 暂时只处理
      maxClassTimes = getMaxClasTimesByClassTimeRange(formatedStartTime, formatedEndTime);
    }
    if (repeatType === 2 && repeatRules !== undefined) {
      maxClassTimes = getMaxClassTimesByWeekRepeatRules(
        formatedStartTime,
        formatedEndTime,
        repeatRules,
      );
    }
  }
  // 如果没有开始结束时间则不做限制，限制最大输入5位数
  return maxClassTimes;
}

/**
 * 在按天重复的情况下，获取两个时间之间的间隔天数，就是最大的课节总数
 *
 * @param {string} starTime 课程开始时间
 * @param {string} endTime 课程结束时间
 * @return {number}
 */
function getMaxClasTimesByClassTimeRange(starTime: string, endTime: string): number {
  let maxClassTimes = 9999;
  maxClassTimes = distanceOfDates(endTime, starTime) + 1;
  return maxClassTimes;
}

/**
 * 根据重复规则来计算最大课节数
 *
 * @param {string} startTime 课程开始时间
 * @param {string} endTime 课程结束时间
 * @param {Array} repeatRules 重复规则
 * @return {number}
 */
function getMaxClassTimesByWeekRepeatRules(
  startTime: string,
  endTime: string,
  repeatRules: Array<RepeatRuleType>,
): number {
  let maxClassTimes = 999;
  // 选中的开始时间和班级结束时间之间的时间间隔 startTime -> classEndTime
  const dayNumber = getMaxClasTimesByClassTimeRange(startTime, endTime);
  const formatedRules = formatRepeatConfig(repeatRules);
  // 说明存在符合规范的规则
  if (formatedRules[0].weekDay !== -1) {
    // 获取算子数，用于计算一个完整的星期需要重复多少个算子
    const operator = repeatRules.length;
    const offsetBegin = new Date(startTime).getDay() || 7;
    const offsetEnd = new Date(endTime).getDay() || 7;
    // 计算一共有能够遍历完完整的规则列表的次数
    const totalRulesRepeatTimes =
      Number(((dayNumber - 7 - offsetEnd + offsetBegin) / 7).toFixed(0)) * operator;
    // 计算偏差值
    const addBegin = formatedRules
      .filter((rule: FormatedRule) => rule.weekDay >= offsetBegin)
      .reduce((prev: number, cur: FormatedRule) => prev + cur.times, 0);
    const addEnd = formatedRules
      .filter((rule: FormatedRule) => rule.weekDay <= offsetEnd)
      .reduce((prev: number, cur: FormatedRule) => prev + cur.times, 0);
    maxClassTimes = totalRulesRepeatTimes + addBegin + addEnd;
  }
  return maxClassTimes;
}

function formatRepeatConfig(
  repeatRules: Array<RepeatRuleType>
): Array<FormatedRule> {
  let foramtedRules: FormatedRules = [{ weekDay: -1, times: 0 }];
  if (repeatRules.length > 0) {
    // 得到每条规则是在星期几的
    const rulesWeek = repeatRules.map((rule: RepeatRuleType) => rule.weekDay);
    foramtedRules = [] as Array<FormatedRule>;
    // 统计相同星期的规则数量
    rulesWeek.forEach((currentWeek: number) => {
      const exsitIndex = foramtedRules.findIndex((currentRule: FormatedRule | null) => {
        if (currentRule) {
          return currentRule.weekDay === currentWeek;
        }
        return false;
      });
      if (exsitIndex > -1) {
        const currentFormatedRule = foramtedRules[exsitIndex];
        const { times } = currentFormatedRule;
        foramtedRules[exsitIndex].times = times + 1;
      } else {
        foramtedRules.push({ weekDay: currentWeek, times: 1 });
      }
      return 0;
    });
  }
  // 只有在中转清除week-1的时候才会有设置项为null的时候
  return foramtedRules as Array<FormatedRule>;
}
