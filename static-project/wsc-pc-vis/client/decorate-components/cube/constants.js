// 选择模版
export const tempTypeMap = [
  {
    title: '一行二个',
    image: '/public_files/2017/11/03/60342dcc32a039ef613a14db0291f3ab.png',
  },
  {
    title: '一行三个',
    image: '/public_files/2017/11/03/6268ad7610bdc42ece83ac20379b28e9.png',
  },
  {
    title: '一行四个',
    image: '/public_files/2017/11/03/2781e737570549d45604867d8045aada.png',
  },
  {
    title: '二左二右',
    image: '/public_files/2017/11/09/83a31af68ff039a2a636151fa7fa9279.png',
  },
  {
    title: '一左二右',
    image: '/public_files/2017/11/09/ba54374788fe99d976963da2fa7eca6e.png',
  },
  {
    title: '一上二下',
    image: '/public_files/2017/11/09/7b4cdf2cc81d386c2ec316cde4d7c419.png',
  },
  {
    title: '一左三右',
    image: '/public_files/2017/11/09/baf20bd9462316851c81e47f8ae2cadf.png',
  },
  {
    title: '自定义',
    image: '/public_files/2017/11/03/266e578c7470586e6be573cb0fc4d699.png',
  },
];

// 魔方总宽度
export const cubeWidth = 325;

// 建议图片总宽度像素
export const cubeImageWidth = 750;

// 魔方密度
export const cubeLayoutArray = [4, 5, 6, 7];

// 不同模板默认sub_entry x,y,width,height值
export const tempSubEntrySizeMap = [
  [
    // 1行2个
    {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    },
    {
      x: 1,
      y: 0,
      width: 1,
      height: 1,
    },
  ],
  [
    // 1行3个
    {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    },
    {
      x: 1,
      y: 0,
      width: 1,
      height: 1,
    },
    {
      x: 2,
      y: 0,
      width: 1,
      height: 1,
    },
  ],
  [
    // 1行4个
    {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    },
    {
      x: 1,
      y: 0,
      width: 1,
      height: 1,
    },
    {
      x: 2,
      y: 0,
      width: 1,
      height: 1,
    },
    {
      x: 3,
      y: 0,
      width: 1,
      height: 1,
    },
  ],
  [
    // 2左2右
    {
      x: 0,
      y: 0,
      width: 2,
      height: 2,
    },
    {
      x: 2,
      y: 0,
      width: 2,
      height: 2,
    },
    {
      x: 0,
      y: 2,
      width: 2,
      height: 2,
    },
    {
      x: 2,
      y: 2,
      width: 2,
      height: 2,
    },
  ],
  [
    // 1左2右
    {
      x: 0,
      y: 0,
      width: 2,
      height: 4,
    },
    {
      x: 2,
      y: 0,
      width: 2,
      height: 2,
    },
    {
      x: 2,
      y: 2,
      width: 2,
      height: 2,
    },
  ],
  [
    // 1上2下
    {
      x: 0,
      y: 0,
      width: 4,
      height: 2,
    },
    {
      x: 0,
      y: 2,
      width: 2,
      height: 2,
    },
    {
      x: 2,
      y: 2,
      width: 2,
      height: 2,
    },
  ],
  [
    // 1左3右
    {
      x: 0,
      y: 0,
      width: 2,
      height: 4,
    },
    {
      x: 2,
      y: 0,
      width: 2,
      height: 2,
    },
    {
      x: 2,
      y: 2,
      width: 1,
      height: 2,
    },
    {
      x: 3,
      y: 2,
      width: 1,
      height: 2,
    },
  ],
];
