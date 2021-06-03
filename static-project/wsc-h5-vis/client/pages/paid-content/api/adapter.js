import map from 'lodash/map';

// 获取全部内容列表
export function getAllContents(api) {
  return async function(data) {
    const { page_no: pageNumber } = data;
    const { content, total } = await api({ pageNumber });
    const list = map(content, item => {
      const { videoContentDTO, ...otherItem } = item;
      return Object.assign(otherItem, videoContentDTO);
    });
    return { list, total };
  };
}

// 获取专栏内容列表
export function getContentsAndLives(api) {
  return async function(data) {
    const { alias: columnAlias, page_no: pageNumber, sort_type: sortType } = data;
    const { content, total } = await api({ columnAlias, pageNumber, sortType });
    const list = map(content, item => {
      const { columnContentDTO, videoContentDTO, ...otherItem } = item;
      return Object.assign(otherItem, columnContentDTO, videoContentDTO);
    });
    return { list, total };
  };
}

// 获取内容详情
export function getContent(api) {
  return async function(data) {
    const { alias, sort_type: sortType } = data;
    const detailRes = await api({ alias, sortType });
    const { isPaid, detailInfo, isFx } = getTargetDetail(detailRes);
    let { column = {}, content = {}, sellerContent = {}, ...otherResult } = detailInfo;
    content = isFx ? sellerContent : content;
    const { picture, ...otherColumn } = column;
    const { audioContentDTO, videoContentDTO, textContentDTO, ...otherContent } = content;
    const columnDetail = Object.assign(otherColumn, picture);
    return Object.assign(
      { columnDetail },
      otherResult,
      otherContent,
      textContentDTO,
      audioContentDTO,
      videoContentDTO,
      { isPaid, bizType: isFx }
    );
  };
}

// 获取专栏详情
export function getColumn(api) {
  return async function(data) {
    const detailRes = await api(data);
    let { isPaid, detailInfo, isFx } = getTargetDetail(detailRes);
    if (isFx) {
      // 分销铺平
      detailInfo = Object.assign(detailInfo, detailInfo.sellerColumn);
      delete detailInfo.sellerColumn;
    }
    return Object.assign(
      detailInfo,
      { isPaid, columnType: isFx }
    );
  };
}

// 获取直播详情
export function getLiveDetail(api) {
  return async function(data) {
    const detailRes = await api(data);
    const { isPaid, detailInfo } = getTargetDetail(detailRes);
    return Object.assign(
      detailInfo,
      { isPaid }
    );
  };
}

// 已购内容列表
export function getAllPaidContents(api) {
  return async function(data) {
    const { content, pageable = {}, total } = await api(data);
    const items = map(content, item => {
      const { contentExtendInfo, ...otherItem } = item;
      return Object.assign({}, otherItem, contentExtendInfo);
    });

    const { pageNumber, pageSize } = pageable;

    return {
      items,
      paginator: {
        page: pageNumber,
        pageSize,
        totalCount: total,
      },
    };
  };
}

// 根据alias获取商品id
export function getGoodsId(api) {
  return async function(data) {
    const res = await api(data);
    const { productId } = res || {};
    return productId;
  };
}

// 根据alias获取简化版的内容、专栏、直播等详情
export function getSimple(api) {
  return async function(data) {
    const detailRes = await api(data);
    const { detailInfo } = getTargetDetail(detailRes);
    return detailInfo;
  };
}

// 从详情整合接口中抽取具体某个需要的详情信息
function getTargetDetail(detailRes) {
  // 教育商品类型，1:自营专栏 2：分销专栏 3:自营内容 4:分销内容 5:直播 6:线下课
  const getDetailTypeMap = {
    1: 'column',
    2: 'sellerColumn',
    3: 'content',
    4: 'sellerContent',
    5: 'live',
    6: 'course',
  };

  const detailInfo = detailRes[getDetailTypeMap[detailRes.type]] || {};
  const isPaid = detailRes.isOwnAsset;
  const isFx = detailRes.type === 2 || detailRes.type === 4;
  return {
    detailInfo, isPaid, isFx,
  };
}
