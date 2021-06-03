/**
 * 对一天内的日程进行排序，转变为一个二维数组
 *
 * 将日程按照 startTime 进行排序
 * 对每一个日程进行遍历，将其与而为数组的每一行的最后一个的 endTime 对比
 * 如果大于或等于 endTime 则将其 push 进该行，
 * 如果小如 endTime，则与下一行对比，都不匹配，怎新加一行并 push
 */

export interface ISortData {
  startTime: number; // 开始时间戳
  endTime: number; // 结束时间戳
  overlap?: boolean; // 是否跟其他日程有时间上的重叠
  resourceName?: string;
  [key: string]: any;
}

// 对列表进行排序
const sortData = (data: ISortData[]) => {
  const rows: ISortData[][] = [];

  data = data.sort((a, b) => (a.startTime >= b.startTime ? 1 : -1));

  // 计算每个日程是否和其他日程有时间重叠
  for (var i = 0; i < data.length; i++) {
    // if (data[i].date === '2019-12-11' && new Date(data[i].startTime).getHours() > 16) {
    //   console.log('data[i]', data[i]);
    // }
    const { startTime: startTimeI, endTime: endTimeI } = data[i];
    // data[i].overlap = false;
    for (var j = 0; j < data.length; j++) {
      if (i === j) continue;
      const { startTime: startTimeJ, endTime: endTimeJ } = data[j];
      if (!(startTimeJ >= endTimeI || endTimeJ <= startTimeI)) {
        data[i].overlap = true;
        break;
      }
    }
  }

  for (let v of data) {
    // if (v.date === '2019-12-11' && v.overlap) {
    //   console.log('v', v, new Date(v.startTime));
    // }
    let tmp = false;

    for (let row of rows) {
      if (
        new Date(row[row.length - 1].endTime).getTime() <=
        new Date(v.startTime).getTime()
      ) {
        row.push(v);
        tmp = true;
        break;
      }
    }

    if (tmp === false) {
      rows.push([v]);
    }
  }

  return rows;
};

export default sortData;
