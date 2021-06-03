import formatDate from '@youzan/utils/date/formatDate';
import addZero from '@youzan/utils/string/addZero';

const now = new Date();
const dayMs = 24 * 60 * 60 * 1000;
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const columns = [
  {
    values: [],
  },
  {
    values: [],
  },
  {
    values: [],
  },
];

const dateList = [];

for (let n = 0; n < 364; n++) {
  const d = new Date(now.getTime() + n * dayMs);
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const day = weekDays[d.getDay()];

  columns[0].values.push(`${month}月${date}日&nbsp; ${day}`);
  dateList.push(formatDate(d, 'YYYY-MM-DD'));
}

const defaultHours = [];
for (let n = 0; n < 24; n++) {
  defaultHours.push(`${addZero(n)}时`);
}

const defaultMinutes = [];
for (let n = 0; n < 60; n++) {
  defaultMinutes.push(`${addZero(n)}分`);
}

function getHours(min = 0) {
  if (min === 0) {
    return defaultHours;
  }
  const values = [];
  for (let n = min; n < 24; n++) {
    values.push(`${addZero(n)}时`);
  }
  return values;
}

function getMinutes(min = 0) {
  if (min === 0) {
    return defaultMinutes;
  }
  const values = [];
  for (let n = min; n < 60; n++) {
    values.push(`${addZero(n)}分`);
  }
  return values;
}

columns[1].values = getHours(now.getHours());
columns[2].values = getMinutes(now.getMinutes());

export { dateList, getHours, getMinutes };
export default columns;
