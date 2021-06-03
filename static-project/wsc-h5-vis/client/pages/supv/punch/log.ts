export function logEnterPage(logType: string, logId: number) {
  if (logType && logId) {
    _global.spm.logType = logType;
    _global.spm.logId = logId;
  }
  window.yzlogInstance &&
    window.yzlogInstance.log({
      et: 'display',
      ei: 'enterpage',
      en: '浏览页面',
      pt: logType || '',
    });
}
