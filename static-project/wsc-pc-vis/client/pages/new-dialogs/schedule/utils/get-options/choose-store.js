import { getStoreList } from '../api';

export default function getClassStore(query) {
  const keyword = query;
  return getStoreList({ keyword }).then(data => {
    const options = [];
    data.forEach(item => {
      const { id, name } = item;
      options.push({ value: id, text: name });
    });
    return options;
  });
}
