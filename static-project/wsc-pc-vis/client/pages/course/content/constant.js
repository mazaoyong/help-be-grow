import { isInStoreCondition, arrayColumnWrapper } from 'fns/chain';
const isUnifiedShop = isInStoreCondition({
  supportUnifiedShop: true,
});

export const CONTENT_OPTION = (extendOption) =>
  arrayColumnWrapper([
    {
      type: 'Input',
      name: 'keyword',
      label: '内容名称：',
      props: {
        width: '185px',
      },
    },
    {
      type: 'Select',
      name: 'status',
      label: '出售状态：',
      props: {
        width: '185px',
      },
      data: [
        {
          value: '0',
          text: '全部',
        },
        {
          value: '1',
          text: '出售中',
        },
        {
          value: '2',
          text: '已停售',
        },
      ],
    },
    {
      type: 'Select',
      name: 'media_type',
      label: '内容类型：',
      props: {
        width: '185px',
      },
      data: [
        {
          value: '0',
          text: '全部',
        },
        {
          value: '1',
          text: '图文',
        },
        {
          value: '2',
          text: '音频',
        },
        {
          value: '3',
          text: '视频',
        },
      ],
    },
    {
      type: 'Select',
      name: 'show_in_store',
      label: '显示状态：',
      props: {
        width: '185px',
      },
      data: [
        {
          value: '',
          text: '全部',
        },
        {
          value: '1',
          text: '显示',
        },
        {
          value: '0',
          text: '隐藏',
        },
      ],
      chainState: isUnifiedShop,
    },
    {
      type: 'Select',
      name: 'seller_types',
      label: '销售方式：',
      props: {
        width: '185px',
      },
      data: [
        {
          value: '0',
          text: '全部',
        },
        {
          value: '1',
          text: '仅单篇销售',
        },
        {
          value: '2',
          text: '仅专栏销售',
        },
        {
          value: '3',
          text: '单篇或专栏销售',
        },
      ],
    },
    ...extendOption,
  ]);

export const SELL_STATUS = {
  1: '销售中',
  3: '草稿',
  4: '即将开售',
  5: '转码/审核中',
  6: '转码/审核失败',
};

export const MediaType = {
  1: 'text',
  2: 'audio',
  3: 'video',
};
