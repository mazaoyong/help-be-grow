import Args from 'zan-utils/url/args';

const getLastSpm = () => window._global.spm.logType + window._global.spm.logId ||
  `fake${window._global.kdt_id}`;

export default function setSpm(url) {
  const oldSpm = Args.get('spm');
  if (oldSpm) {
    let newSpm = '';
    const arr = oldSpm.split('_');
    if (arr.length > 2) {
      newSpm = `${arr[0]}_${arr[arr.length - 1]}`;
    }
    newSpm += `_${getLastSpm()}`;

    url += url.indexOf('?') > -1 ? `&spm=${newSpm}` : `?spm=${newSpm}`;
  } else {
    url += url.indexOf('?') > -1 ? `&spm=${getLastSpm()}` : `?spm=${getLastSpm()}`;
  }

  return url;
}
