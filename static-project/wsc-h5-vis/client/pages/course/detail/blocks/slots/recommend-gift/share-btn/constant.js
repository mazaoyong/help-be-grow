const ShareBtnTheme = {
  default:
    'https://img01.yzcdn.cn/upload_files/2020/11/20/FgWSGxIUKB4Mc5cF4vgt51x4Qc8S.png',
  '1,2,3,4,5,14':
    'https://img01.yzcdn.cn/upload_files/2020/11/20/FgWSGxIUKB4Mc5cF4vgt51x4Qc8S.png',
  '6,7,8':
    'https://img01.yzcdn.cn/upload_files/2020/11/20/FmlWM0UdQmQSikFqKTff1JzS1PKc.png',
  '9':
    'https://img01.yzcdn.cn/upload_files/2020/11/20/FqPI7kEecTy57zT0GPD-UXNZtmeH.png',
  '10,12':
    'https://img01.yzcdn.cn/upload_files/2020/11/20/FjmWYCEQMAGVpaEmdePTSCbzcFPS.png',
  '11':
    'https://img01.yzcdn.cn/upload_files/2020/11/20/Fm79fxCrkl5aTLIsIJKE29Io9_55.png',
  '13':
    'https://img01.yzcdn.cn/upload_files/2020/11/20/FlZ40v1gi8d6UO8gXiAxLiFStY_e.png',
};

const getShareBtnTheme = themeType => {
  try {
    for (let key in ShareBtnTheme) {
      if (key.split(',').includes(`${themeType + 1}`)) {
        return ShareBtnTheme[key];
      }
    }
    return ShareBtnTheme.default;
  } catch (e) {
    return ShareBtnTheme.default;
  }
};

export { getShareBtnTheme };
