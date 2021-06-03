// Copy from wsc-h5-trade
// 拼接完整的地址
const ADDRESS_KEYS = [
  'country',
  'province',
  'city',
  'county',
  'community',
  'addressDetail',
  'address_detail', // 兼容旧版数据
  'houseNumber',
];

export function stringifyAddress(address) {
  const keys = ADDRESS_KEYS.slice(0);

  // 判断省市是否相同
  if (address[keys[1]] && address[keys[1]] === address[keys[2]]) {
    keys.splice(1, 1);
  }

  // 中国不需要展示
  if (address[keys[0]] === '中国') {
    keys.shift(0);
  }

  return keys
    .filter(key => address[key])
    .map(key => address[key])
    .join('');
}
