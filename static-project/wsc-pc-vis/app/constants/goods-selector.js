const CHANNELS = {
  // 门店自营
  online: 'online',
  // 分销
  distribution: 'distribution',
};

const GOODS_TYPES = {
  // 全部类型
  all: 'all',
  // 实物
  real: 'real',
  // 知识付费
  knowledge: 'knowledge',
  // 虚拟
  virtual: 'virtual',
};

const PCT_GROUPS = {
  column: {
    alias: '',
    groupId: 1,
    title: '专栏',
  },
  contentText: {
    alias: '',
    groupId: 2,
    title: '图文',
  },
  contentAudio: {
    alias: '',
    groupId: 3,
    title: '音频',
  },
  contentVideo: {
    alias: '',
    groupId: 4,
    title: '视频',
  },
  live: {
    alias: '',
    groupId: 5,
    title: '直播',
  },
};

const PCT_NEW_GROUPS = {
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
      mediaType: 0,
    },
    title: '内容',
  },
  live: {
    alias: '',
    groupId: {
      subType: 4,
      mediaType: 0,
    },
    title: '直播',
  },
  course: {
    alias: '',
    groupId: {
      subType: 10,
      mediaType: 0,
    },
    title: '课程',
  },
};

const PCT_NEW_MEDIA_GROUPS = {
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
  course: {
    alias: '',
    groupId: {
      subType: 10,
      mediaType: 0,
    },
    title: '课程',
  },
};

module.exports = {
  CHANNELS,
  GOODS_TYPES,
  PCT_GROUPS,
  PCT_NEW_GROUPS,
  PCT_NEW_MEDIA_GROUPS,
};
