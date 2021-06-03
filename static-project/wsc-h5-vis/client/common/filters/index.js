// 数字转货币
const numberToCurrency = (number, symbol, places, thousand, decimal) => {
  number = number || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : '¥';
  thousand = thousand || ',';
  decimal = decimal || '.';

  console.log('filter', number, symbol, places, thousand, decimal);

  const negative = number < 0 ? '-' : '';
  const i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '';
  let j = (j = i.length) > 3 ? j % 3 : 0; // eslint-disable-line
  return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '');
};

// 日期裁剪
const sliceData = (data, start, end) => {
  if (typeof data === 'undefined' || !data.length) return '';
  return data.slice(start, end);
};

const cent2yuan = (value) => {
  return (value / 100).toFixed(2);
};

export default {
  numberToCurrency,
  sliceData,
  cent2yuan,
};
