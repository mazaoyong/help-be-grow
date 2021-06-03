export const GOODS_TYPE_MAP = {
  all: 'all',
  real: 'real',
  knowledge: 'knowledge',
  virtual: 'virtral',
};

export const SELECTED = {
  distribution: {
    type: 'part',
    value: [],
  },
  offline: {
    type: 'part',
    value: [],
  },
  online: {
    type: 'part',
    value: [],
  },
};

export const IGNORE_ITEMS = {
  distribution: {
    value: [],
  },
  offline: {
    value: [],
  },
  online: {
    value: [],
  },
};

export const GOODS_TYPE_VALUE_MAP = {
  [GOODS_TYPE_MAP.all]: 0,
  [GOODS_TYPE_MAP.real]: 1,
  [GOODS_TYPE_MAP.knowledge]: 2,
  [GOODS_TYPE_MAP.virtual]: 3,
};

export const CHANNEL_TYPE_MAP = {
  online: 'online',
  distribution: 'distribution',
};

export const CHANNEL_TYPE_VALUE_MAP = {
  [CHANNEL_TYPE_MAP.online]: 0,
  [CHANNEL_TYPE_MAP.distribution]: 1,
};

export const SUBTYPE_VALUE_MAP = {
  1: 1,
  2: 2,
  3: 4,
};

export const MEDIATYPE_VALUE_MAP = {
  1: 1,
  2: 2,
  3: 3,
};

export const GOODS_TYPES = [
  {
    label: '全部类型',
    value: 'all',
  },
  {
    label: '实物商品',
    value: 'real',
  },
  {
    label: '知识商品',
    value: 'knowledge',
  },
  {
    label: '虚拟商品',
    value: 'virtual',
  },
];

export const GOODS_ONLY_EDU_TYPES = [
  {
    label: '知识商品',
    value: 'knowledge',
  },
];

export const PCT_GROUPS_MAP = {
  all: {
    alias: '',
    groupId: {
      subType: 0,
      mediaType: 0,
    },
    title: '全部',
  },
  column: {
    alias: '',
    groupId: {
      subType: 1,
      mediaType: 0,
    },
    title: '专栏',
  },
  contentText: {
    alias: '',
    groupId: {
      subType: 2,
      mediaType: 1,
    },
    title: '图文',
  },
  contentAudio: {
    alias: '',
    groupId: {
      subType: 2,
      mediaType: 2,
    },
    title: '音频',
  },
  contentVideo: {
    alias: '',
    groupId: {
      subType: 2,
      mediaType: 3,
    },
    title: '视频',
  },
  live: {
    alias: '',
    groupId: {
      subType: 4,
      mediaType: 0,
    },
    title: '直播',
  },
};
