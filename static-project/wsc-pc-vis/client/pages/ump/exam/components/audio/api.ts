import rawAjax from 'zan-ajax';

interface IOptionType {
  url: string;
  method?: string;
  dataType?:
    | 'json'
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'text'
    | 'stream'
    | 'JSON'
    | 'TEXT'
    | 'STREAM'
    | 'BLOB'
    | 'DOCUMENT'
    | 'ARRAYBUFFER';
  contentType?: string;
  headers?: { [key: string]: string };
  noXRequestedWithHeader?: boolean;
}

// 获取音频元信息
export function getAudioMetaInfo(url: string) {
  const options: IOptionType = {
    url: `${url}?avinfo`,
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    noXRequestedWithHeader: true,
  };

  return rawAjax(options);
}
