// promoteVer > currVer --> true
const versionCompare = (currVer, promoteVer) => {
  currVer = currVer || '0.0.0';
  promoteVer = promoteVer || '0.0.0';
  if (currVer === promoteVer) return false;
  var currVerArr = currVer.split('.');
  var promoteVerArr = promoteVer.split('.');
  var len = Math.max(currVerArr.length, promoteVerArr.length);
  for (var i = 0; i < len; i++) {
    const proVal = ~~promoteVerArr[i];
    const curVal = ~~currVerArr[i];
    if (proVal < curVal) {
      return false;
    } else if (proVal > curVal) {
      return true;
    }
  }
  return false;
};

export default versionCompare;
