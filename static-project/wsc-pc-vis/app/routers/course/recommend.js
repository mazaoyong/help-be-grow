module.exports = [
  [
    // 页面
    'GET',
    '/v4/vis/pct/page/goodsrecommend',
    'course.GoodsRecommendController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    'GET',
    '/v4/vis/pct/goodsrecommend/recommend.json',
    'course.GoodsRecommendController',
    'findRecommend',
  ],
  [
    'POST',
    '/v4/vis/pct/goodsrecommend/mediaEndingRecommend.json',
    'course.GoodsRecommendController',
    'createMediaEndingRecommend',
  ],
  [
    'PUT',
    '/v4/vis/pct/goodsrecommend/mediaEndingRecommend.json',
    'course.GoodsRecommendController',
    'changeMediaEndingRecommend',
  ],
  [
    'DELETE',
    '/v4/vis/pct/goodsrecommend/mediaEndingRecommend.json',
    'course.GoodsRecommendController',
    'deleteMediaEndingRecommend',
  ],
  [
    'POST',
    '/v4/vis/pct/goodsrecommend/pageDetailRecommend.json',
    'course.GoodsRecommendController',
    'createPageDetailRecommend',
  ],
  [
    'PUT',
    '/v4/vis/pct/goodsrecommend/pageDetailRecommend.json',
    'course.GoodsRecommendController',
    'changePageDetailRecommend',
  ],
  [
    'DELETE',
    '/v4/vis/pct/goodsrecommend/pageDetailRecommend.json',
    'course.GoodsRecommendController',
    'deletePageDetailRecommend',
  ],
];