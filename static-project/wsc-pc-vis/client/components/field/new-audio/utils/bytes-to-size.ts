const byteCount = window.navigator.userAgent.indexOf('Mac OS X') !== -1 ? 1000 : 1024;

export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Byte';
  }
  const i = Math.floor(Math.log(bytes) / Math.log(byteCount));
  return `${Math.round(bytes / Math.pow(byteCount, i))} ${sizes[i]}`;
}
