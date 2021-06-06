export = [
  [
    'GET',
    '/wscvis/course/detail/goods.json',
    'course.detail.DetailController',
    'goods',
  ],
  [
    'GET',
    '/wscvis/course/detail/activity.json',
    'course.detail.DetailController',
    'activity',
  ],
  [
    'GET',
    '/wscvis/course/detail/getAssetState.json',
    'course.detail.DetailController',
    'getAssetState',
  ],
  [
    'GET',
    '/wscvis/course/detail/:alias',
    'course.detail.DetailController',
    [
      'detailAcl',
      'prepare',
      'getHasBookedOrder',
      'getIndexHtml',
    ],
  ],
  [
    'GET',
    '/wscvis/course/detail/getSkuFormatModel.json',
    'course.detail.DetailController',
    'getSkuFormatModel',
  ],
]