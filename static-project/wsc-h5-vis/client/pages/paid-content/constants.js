export const PCT_TYPE = {
  content: 'content',
  column: 'column',
  live: 'live',
  punch: 'punch',
};

export const PAID_STATE = {
  NOT_PAID: 0,
  PAID: 1,
};

export const VIP_FREE_STATE = {
  PAY: 0,
  FREE: 1,
};

export const SELLER_TYPE = {
  // 单独售卖
  SINGLE: 1,
  // 专栏售卖
  COLUMN: 2,
  // 可单独也可专栏
  BOTH: 3,
};

// 内容类型
export const MEDIA_TYPE = {
  IMAGE_TEXT: 1,
  AUDIO: 2,
  VIDEO: 3,
  LIVE: 4,
};

// 内容类型文案
export const MEDIA_TEXT_MAP = {
  [MEDIA_TYPE.IMAGE_TEXT]: '图文',
  [MEDIA_TYPE.AUDIO]: '音频',
  [MEDIA_TYPE.VIDEO]: '视频',
};

// 邀请卡类型文案
export const INVITE_TEXT_MAP = {
  [MEDIA_TYPE.IMAGE_TEXT]: '邀请你阅读',
  [MEDIA_TYPE.AUDIO]: '邀请你收听',
  [MEDIA_TYPE.VIDEO]: '邀请你观看',
  COLUMN: '邀请你订阅',
};

// 分享类型文案
export const SHARE_TEXT_MAP = {
  [MEDIA_TYPE.IMAGE_TEXT]: '好友请你读',
  [MEDIA_TYPE.AUDIO]: '好友请你听',
  [MEDIA_TYPE.VIDEO]: '好友请你看',
  COLUMN: '好友请你看',
};

// 是否免费试读
export const IS_FREE = {
  PAY: 0,
  FREE: 1,
};

// 专栏状态
export const COLUMN_STATUS = {
  DELETE: 0,
  INSTOCK: 1,
  OUTSTOCK: 2,
  STASH: 3,
};

// 内容状态
export const CONTENT_STATUS = {
  DELETE: 0,
  INSTOCK: 1,
  OUTSTOCK: 2,
  NOT_INSTOCK: 3, // 暂不上架
  TIME_INSTOCK: 4, // 定时上架
};

// 直播开售时间类型
export const SELL_TIME_TYPE = {
  // 立即上架
  INSTOCK: 1,
  // 定时上架
  TIME_INSTOCK: 2,
  // 暂存
  STASH: 3,
};

// 直播上架状态
export const LIVE_SELL_STATUS = {
  // 上架
  INSTOCK: 1,
  // 下架
  OUTSTOCK: 2,
};

// 用户参团状态
export const USER_JOIN_GROUPON_STATUS = {
  NOT_JOIN: 0,
  JOINED: 1,
  SUCCESS: 2,
};

// 用户参与活动状态
export const USER_JOIN_PROMOTION_STATUS = {
  NOT_JOIN: 0,
  JOINED: 1,
  SUCCESS: 2,
};

// 团状态: 0->待成团，1->成团，2->成团失败，
export const GROUP_STATUS = {
  GROUPON_WAITING: 0,
  GROUPONED: 1,
  GROUPON_FAILURE: 2,
};

// 拼团活动label
export const GROUPON_LABEL = {
  ORIGIN: '原价购买',
  GROUPON: '一键开团',
};

export const ICON = {
  IMAGE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAAzZJREFUWAnVmb9rU1EUxxt/pELUNkMbdOjQoUJwqD+XdkhBJ9HJyU0EyZYlo2P/gWzFxU7FWe2kQ4R0CmpByVDBIUIEOzRWA6Yi8fuJuSG+vJvcl76k8cCXd+875577zb3vnnvvSWRicJlR00VhTphuYUpP5JtQbaGs57awKwSWSMAWZ2WfEi4J54UgUpHxOyEv7AtO4krwlLzdbGHSybPdqC7VyxZ+2s3+alwIXpbpPeFMP2cB9d9lvyG87dXueA8l5G8LkDvsqPl1g8+rAv189DPgnY1gVLoHQkoYtiyog3PCe+G3tzM/gvwiyF3xGg+xzoJLCF3T7UeQaU0JoxYTFXY6O/YSNAui02aUZaa7InwxnR4zBT0JJSyIoxY4wKUpJ0xBT+KcNZTkcrmL6XT6WjQaPdnRJnDx4ODg19raWjGTyXywNIYDXJ6jN3GQHWJVsIaTer1+v1ar1Uul0lcaDirJZHI2FotNSp708EEwfyTsmxFcUcVKDkeMXLFY/Ly8vPyK+qBSKBRuLC0tzfdpD5eU8Mx8g2z64ybs9xMQ5FRiljjvxkXgNAPBcRw9M0iLEOQ8N64yB8HpcWUHt/+CoDmmj+NATpk46ESO+NVoNB46GYdkBEEuOLMu/vb29n6EsZPE4/HTLv3BDYJVwYkg5ELaSVwJVg1Bpx/EPspW5WRsMcKHReX3ukmwLM11P633HVOj79D113ubD1IvM4Lbwl2X1ltbW5/6TXHIi2gbgtz4OcX23Y8TiUQsm83Ou/yYEGzgtGvOg3dUudXLacgjMxGJRB736k+6TaF93MqrwiHRKpyErcqACgdfcMnjlq0OIVdCOsIqHNMdHFvbG4U58pu65QmXZv7GTDF2XFRWBeu9BKMRCCkRjvvNvI0ZQfrlxQaFIxY4tJNK3nsx91FGdeGISL5Qv687+/YSREcih1xJ37CDcYjyRr6eev35EcSGRA65klGRhNy64JQ8kl3T0CRyhj3dTCsj10UOIrYRRIfsCBXhgtDz3ix9UGG1rgv/fHNeJ51hxqvrrBOCSEeAwxIlCBPnQHu1quwrrgRNY1IkKwJX1aDfJzMxtCS6fHfJSP6G+AOI0rrlIzgwHgAAAABJRU5ErkJggg==',
  AUDIO: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAABH1JREFUWAnNWVtIFFEYblNr18zdkAqVklI2EILVRERTTKqHYBHChwh9EtQnEfExiKA3QfTNFyFUIiFC24KgEPOGoVZgT6td2NAosdbVvOxi9X3jThxnd3bOZF5++Jxz+f7/fHtmzn/OjJYD/27H4eoCTgOOMOy40hYBfxg+XN8C84Bps5j0SAa/FMgB0gAzNgfyG2AACABSJivQimhXwjgsFVmftI6u52Gs6dM2e2QE5oJ6EzhqFMxk/xL494HXsfziYnRSvBuguO3OWrRhGDMP4DjT0Qhs0xN4CH3VQCmw0+bEAKnAFLChHSyaQP4iirugJe9gnQvuJBBxu6MJ5G0tBXbb1KzgFQfWClQXhMjZzTJv9xzwRR30oFrAlamEC2KvjRqoRbF4tYAr85ypVFJYWGivrq7OLCgoSEtJSTnicDgSGc/v968sLCz8HBsbm+vo6Hg/OjrKnUXWqIFaPHRQ8yB3iLuAVDrJysqydXV1XYSwMwyyurq6Pjs7uwhTEq/dbremp6fbbTabEg9CP1ZVVQ3PzMyski9hTOa3gIAqsByVaxKOB8rKyo719fW5k5KSDo+MjHxoaWmZ8ng886FQ6Lfon5CQYHG73ccbGxvPFxUVnV1eXl4vLy/39Pf3/xB5McpP0fdYFXgbFXUV6fo4nU4bZuN6YmLioYaGhhft7e2fdclCR11d3anW1tbLKysrQcz6I6/XKzOTXCx3uIp5KuEMGlpPT8/F7Ozs1Pr6+uey4hh0YmIigGfye0VFBdyzbZ2dnZ8MB9tcD684g3wgK4wc8vLyjo6Pj98YGhp6X1JS0m/Ej9Y/ODhYVlxcnIlYDyYnJ7kXG9lDphme5wytpqYmEyRLW1vbO0OyDiHsa6mtrWUsGTtNgTxsGlp+fn7a2tpasLe395shWYdAX8ZgLB2KttkhLTAjI+OYz+f7vrERsZ9rg+rW6csYjKVL2tqhCLRvbYteQ1qxLi0tMT9tyxiDsSSD2MWtLqZPfHx8HG7Pv09fODpjMFbMwYRObnXchk4IbbpFq9Ua19TUdDYQCIS6u7tnkdd+6ZKFDuTNg5WVlenJyckJjCF0GRUXKZBvX1ICMYC1ubn5MqMi+fpyc3OfsWxkw8PDV3NycpRsMT09/dWIL/T7eYsp0LS5XK5Tsk5muJqYikCfplGqaoFJEUEyw9XE9HEG+VK9X+0tBfKNnxvzfjNqmqdA2pvNy776q2hSBQ5AmqkkHAwGQ7I/xww3HJNaBlhWBfJbCT9HSBkHxHFrXIoMErkmRVKL8v1GXIncfnjsN/VeAv7/Nh7DeNxXXh/UGeQgbLjPwh4bNSjiqEO77fB9lLPqZOce2BOM+VIcVyuQffyQkwrIntno8z9sEkEeaANFE0jOFMBvJbslkuLuARGnJT2BJKofcnb6dvO2cuYixKEt4hlkm2heVOaAc4DUS73obFDmar0HbHnmtD5imtH2iXWmIL79EdsVyiTMPEf8Xa0oRzVZgaozP5FcAlyA2eeTd4Lb1wCgJGFcDc2sQDHgrvwb4g80HkYCVTm9DgAAAABJRU5ErkJggg==',
  VIDEO: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAA7VJREFUWAnNWd9Lk1EYni1dFLWB2VaQGEiN4YWZpBdeTMiL0ClWFxbeSKD+EXmjgn+Cd7or6U6SSYGCixQmtBoMxjQhEdSWXmxG0aSi5/nakfm5uXP2fZs98HC+b+c973m+8+M9P1ZhKR41KNoI1oKODO1IiRSYzHALaQTcA5VRoVjiCuy94F3wBqiCHRh/BIPgASgFWYEX4K0jQ5uU5/xGaWQtZPgzv9m/HBmBTTB9Bl4u5Ewx/xvsZ8APp5WznpJJ8T6Q4oy2Wq5q6LMZZD2fchnwt3wCq5D3HPSCpcZtVHAdjIK/9ZXlEsgvorh7euMSvnPCOcET3Z1LILvVC5YbIiqsZ1esFygmRLZNOZ/Z3Tvgrqj0nHhAylDCCXHWoAZq0ZAtkHFOKZT4fL6ri4uL3omJCbfVqu+MTA3qCTVQiwYRB7lCjINK4WR/f/9pdXW19lHxePxLf3//UjgcZnwzCgbzF+CBaMF2vCiJowIhjs9ut9u1srLyeHR0lOPIKKjFSydCIBd9w7DZbFUjIyPeUCjUUVdXdzSOinTM9V4TyF2JmOJF+jperKWl5VYkEnkyPDx883iO0hs11bAFTWk9fdV2u/3i5OTkw0Ag0OZwOM7r8yXfGymQ+7mSobOz04MJ9Ki7u5s9pYpaCnSollK1dzqdjtnZ2Z6pqammyspKETlk3DjKIpBKzgEDAwPNsVisp6Gh4ZKMOthoAsU2XbKMMbP6+vprfr+/TdKLnS34X4MCecApGzY2Nr6iq5clK0xRYFLS2JDZH2B6evq9x+N5FY1Gv0s6SzI+lVxgIpFIDg4OLs3NzakePTWBWxB5X/KLlM3m5+dj2ESEksnkL+XCFssWuzhSRMGCRVKp1I+hoaHXXV1dy0WKYx0RdjGbnbtY09bj1dXVz319fe82NzcLnntRbz5Q0x5bkOCJ3zDS6fTh2NhYsLW1dcGgOGrRNIlFPIgfHoBKe0IOfi5jKGcpwYY1SL9in84dLMUqbTbX1tYSLpfLinU23tvbu7y9vX1IpybgDXzwnKyd6oU/bjDHQaVziShsYsojA7f72vgVY5D++cMMH84Y1HA0uUQXC027eOB2SKmrRWET0gB8vM32oxfIPF7k8K7EtLBDpxIIw+al3i6XQNpwgPKupFwiKc4PSl0ewU4zFBc5pe5uditb7oQ4CsnXgswj1sEd8A6oFCNhXwicrX7w2JjTF5I9HzAE8TqCNCqUMdfUK2D4OwKvSNrBRlB1fLInSnaJDt8nUJa/If4CThDqvt/KCpMAAAAASUVORK5CYII=',
  COLUMN: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAArZJREFUWAnVmT9vEzEYxnuAgAFoE6kgKtGxrOXPipQObLAxdUUKXyEfIV+BTJ0qZmBjCWIGIlViaLcglaFSkgIDDCg8v3CODscudtJzj0d6dHf2a79PXp99fp1saX6sqummuC6u5FzWFRyLo5x9XXvikRiNLLLFNdk3xDvimhiDQxl/FLviVzEIoQIvq7eHOS8F9ew3+qmqNzl/+M3+1IQIvCvTbfHqvzqLrP8m+13xw0ntzp9QifjHIuIWjZrLDX3eF/Fz4DKgzCfwouqeig2xbGzIwU1xT/xlO3MJ5Bch7p5tXOIzE+6GODPcLoEMa0NMDbMq7Bcd2wLNhCjapLxnuA/FL8bpBXOjK0sJE8KJZrN5q91uP6jValecBoGFw+Hwe6vVetfpdD57mqDhkzhZgorLDEP7yNNoaTAYbC8qzvSNyHq9vmueHdfXKntF+bm8ki8EC7EXpyUOBwF9oQVNU4Fbui9jrcPHPEBLg4bmHeSjH4UsyzoxDcbjcTPGXrZ8718yxOxK1sSqAU2rRDA6evySOSJCs1hsEkH2c1XFOgJXqqoObZUXyDtotulRgUwwi9GzTAQrDSJIgnM9VmWiWXxMBEex4hLaj/4Lgf2EEYl11ecd7IlPYlsmmsU9hpiMn11s1YCmIyIIyPijNgwJZjGapvvBru7J+KsCtHQRwxADzko4jvCCbbq3MrIioC+0TM5vjEBcUMhxhBMkOgEdO9sWC+mDvopl1j0apsEqJk3YkXY+4+YM8Vy+pwm8nReTjyJ644wEks29Lfq2BVJ3IHJWEjWrabgg3qv9C7sPl0Bs9kTOSlKJRNyOGHR4JLuJoXkPyh5uhpXIzYhDiC+C1IF9kRX9tkiueppgtu6If71ztgN7Ftv15rnSR8BGJFeOI7ZEUtXY95ORKO0QXX3PIMnfEL8BMFCbkYlrEg8AAAAASUVORK5CYII=',
  LIVE: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABGdBTUEAALGPC/xhBQAAA5RJREFUWAnNWc1rE0EU70dsPET7RRUj9mKpCgHrB3gxJS14aIq3lkIvDRVy7TUHIRQ85G8ICC2FkkN7EW0PgigR9KIWDQqtl1ZYD0K/VDBKG3+/zU7ZJLPJ7GY37YNfJzvvzZvfzuy8mXltbnIuPWg6APQCHQbaUVL2gF0DWyjXgB+AbWm22eIs7CPADSAI2BENxh+Al8A+oCSqBE/D2z0DfiXP1kZ5qJ4b+GNtVtSoELwJ00ngTC1nNvU/Yb8IvK/WrrWKkuTvAyRX76jJuqHP2wD72ZAZsM6KYBt0D4AI4LX0o4MLwCfgoLwzGUG+EcndKjf28JkL7jxQMd0ygpzWCNBoEVFh3dxxOUGxIMw2jfzN6daA76LTFvEDJUMJF8RxCzmQiy5mgoxzbocSoxtbBTmQiy6CIHeIo0pDd5wFuZBTk89gMYRSGuvi8filVCoV7uzsDBi2joqdnZ1fiUQim06nvyk4IJcI8IQhhZIExCrSK8Sf7e3tyXrJCV8k2dXVtSiea5RcLLOcYp5KpOTowC1yZl/d3d2+ZDLZPz09fZH1FkJOPRxBzveYhVFToVCIW+mc1K+urn4ZHh7u8/v9pw4gPp/vcRU/SxxBnuccy/Ly8seVlZXPcFBQcTIyMnKN5GjbCqnRppcEedh0LBMTE29HR0dfx2KxZ/zGHDuSN+yomyBmSXc9Pz+vhUKhpWw2+1Xel6NanaA4pjvyYG6kadrfwcHBFwsLCxWbvtnOxu92jqDrcnh4qPQ9qnTMQM0LzjkV41o2wWCwLZPJ3A2Hw321bBX1exxB3r4cS0tLcRKmpqaCuVxuzEVy5LTLEayLIEbsTiAQaEP4uApfYmeiczdkl6+/VY+n8fHx64xt8KFEjoE6n8//Y5+irNL/FkeQl2rLnaRKY0eqaDSaxVb3ZmZm5vLm5ubvGk7WxFuf6MMCX4I3fqnwiOTGDiGOW9JO5JU6JzGCPBw+AqRnQnl7T2uZfXgI7BdjRDFXwnTESRFy0fM3giCJsZLpiOMWcjgaLDNBJnJUT7tevgQ5HCWVys9jvI/yu+z3kkEV30+he2XWlxOkbgNgrsTyGkAjD+QdfGbK/coI0oaJHOZKGkWS5OYApeQR7HRDcabzero5rRy5CnIkYjWC1FHWAQ24ArgdI7la54CSbw7PJSICdUml5IG5Et7+iHqJup4CNvPljjMEDAB2v0/OhGdJdPiukIb8G+I/8Arapsjf6rEAAAAASUVORK5CYII=',
};

// 路由埋点类型映射表
export const BURING_POINT_MAP = {
  'column-show': 'pcm',
  'content-show': 'pct',
  'all-columns': 'pcam',
  'all-contents': 'pcat',
  'all-lives': 'pcal',
  'live-detail': 'pcl',
  'live-room': 'pclm',
  'my-pay': 'scpc',
  AllColumns: 'pcam',
  AllContents: 'pcat',
  AllLives: 'pcal',
  ContentShow: 'pct',
  ColumnShow: 'pcm',
  LiveDetail: 'pcl',
  LiveRoom: 'pclm',
  MyPay: 'scpc',
};
// 路由 owlType映射表
export const PAGE_TYPE_MAP = {
  'column-show': 1,
  'content-show': 2,
  'live-detail': 4,
  'live-room': 4,
  'vip-benefit': 3,
  ContentShow: 2,
  ColumnShow: 1,
  LiveDetail: 4,
  LiveRoom: 4,
  VipBenefit: 3,
};

// 礼物页类型，分享or领取
export const GIFT_TYPE = {
  SHARE_GIFT: 1,
  RECEIVE_GIFT: 2,
};

export const RECEIVE_GIFT_STATUS = {
  OVER_CONTENT_COUNT: 1,
  OVER_FRIEND_COUNT: 2,
  PAIED: 3,
  RECEIVED: 4,
  UNRECEIVE: 5,
  RECEIVED_FAIL: 6,
  HAS_BEEN_RECEIVED: 7,
};

// 礼物页文案展示
export const GIFT_TEXT_INFO = {
  [RECEIVE_GIFT_STATUS.OVER_CONTENT_COUNT]: {
    title: '不能再领取啦',
    desc: '你已经领取多期TA分享的此专栏内容',
    btnText: '我也要',
  },
  [RECEIVE_GIFT_STATUS.OVER_FRIEND_COUNT]: {
    title: '不能再领取啦',
    desc: '你已经领取多期TA分享的此专栏内容',
    btnText: '我也要',
  },
  [RECEIVE_GIFT_STATUS.PAIED]: {
    title: '你已购买该内容',
    desc: '快去查看吧',
    btnText: '立即查看',
  },
  [RECEIVE_GIFT_STATUS.RECEIVED]: {
    title: '你已领取该内容',
    desc: '快去查看吧',
    btnText: '立即查看',
  },
  [RECEIVE_GIFT_STATUS.UNRECEIVE]: {
    title: '你收到一份礼物',
    desc: '快去领取吧',
    btnText: '免费领取',
  },
  [RECEIVE_GIFT_STATUS.RECEIVED_FAIL]: {
    title: '手慢啦，礼物被抢光了',
    desc: '',
    btnText: '我也要',
  },
  [RECEIVE_GIFT_STATUS.HAS_BEEN_RECEIVED]: {
    title: '不能再领取啦',
    desc: '该专栏内容已被其他人领取',
    btnText: '我也要',
  },
  SHARE_GIFT: {
    title: '份礼物已被打包好',
    desc: '快去喊好友来收礼吧',
    btnText: '喊好友来收礼',
  },
};

export const ACTIVITY_TYPE = {
  INVITE_FRIEND: 1,
  INVITE_CARD: 2,
  PERSENT_GIFT: 3,
  COLLECT_ZAN: 4,
  RECOMMEND_POLITE: 6,
};

export const RECEIVE_GIFT_RESULT_TEXT = {
  [RECEIVE_GIFT_STATUS.OVER_CONTENT_COUNT]: '领取失败，不能再领取更多TA分享的此专栏内容',
  [RECEIVE_GIFT_STATUS.OVER_FRIEND_COUNT]: '领取失败，不能再领取更多TA分享的此专栏内容',
  [RECEIVE_GIFT_STATUS.PAIED]: '你已购买该内容，可直接观看',
  [RECEIVE_GIFT_STATUS.RECEIVED_FAIL]: '很遗憾，礼物被抢光了',
};

export const DEFAULT_USER_INFO = {
  avatar: 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
  name: '匿名用户',
};

// 分销员相关常量

export const DIRECT_SELLER_MAP = {
};

export const DIRECT_SELLER_ICON_MAP = [
  {
    iconSrc: 'https://img01.yzcdn.cn/public_files/2017/08/29/b2e228542c67919b211c00ca8dbfed97.png',
    iconDesc: '微信',
    jsHook: 'js-wechat',
  },
  {
    iconSrc: 'https://img01.yzcdn.cn/public_files/2017/08/29/c7a1a93ccd5036686573e093840678be.png',
    iconDesc: '复制链接',
    jsHook: 'js-copy',
  },
  {
    iconSrc: 'https://img01.yzcdn.cn/public_files/2017/08/29/2c62babaef58fea6f0f4e95e77c5b221.png',
    iconDesc: '二维码',
    jsHook: 'js-qrcode',
  },
  {
    iconSrc: 'https://img01.yzcdn.cn/public_files/2017/08/29/a187dc59cd1e615cea329439fedd2fde.png',
    iconDesc: '图文二维码',
    jsHook: 'js-img-qrcode',
  },
];

// 微信 sdk 录音相关 jsApiList
export const RECORD_JSSDK_APILIST = ['closeWindow', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'];

/** 直播相关 **/
export const LIVE_STATUS = {
  DELETED: 0,
  UNSTARTED: 1,
  STARTED: 2,
  ENDED: 3,
  PLAYBACK: 4,
};

export const LIVE_ACTION_TYPE = {
  NOSTOCK: 0,
  PAID_DEFAULT: 1,
  UNPAID_DEFAULT: 2,
  UNPAID_COLUMN: 3,
  PAID_UNFOCUS: 4,
  PAID_ENDED: 5,
  UNPAID_ENDED: 6,
  NOT_AllOWED: 7,
  ZERO_BUY: 8,
};
export const LIVE_LIST_DEFAULT_LEN = 20;

// 微信防止误操作录音时间间隔
export const WX_AUDIO_RECORD_DIFF_TIME = 1000;

export const COLLECT_INFO_KEYS = ['name', 'mobile', 'gender', 'weiXin', 'contactAddress'];

export const FEE_TYPE = {
  'RECOMMEND_COMMISSION': '推广佣金',
};

// 资源保护可见类型 1:所有可见 2:所有不可见 3: 部分可见
export const SHOW_TYPE = {
  ALL: 1,
  NONE: 2,
  PART: 3,
};

// 0元商品领取规则 1：需要领取 2：免领取
export const FREE_GOODS_GET_RULE = {
  NEED_GET: 1,
  NOT_GET: 2,
};

export const PRESENT_TYPE = {
  EDU: 1,
  GOODS: 2,
  COUPONS: 3,
  SCORE: 4,
};
