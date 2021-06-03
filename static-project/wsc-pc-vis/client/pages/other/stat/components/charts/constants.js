import cloneDeep from 'lodash/cloneDeep';

const base = {
  // color: [
  //   '#5d9cec', '#62c87f', '#f15755', '#fc863f',
  //   '#7053b6', '#ffce55', '#6ed5e6', '#f57bc1',
  //   '#dcb186', '#647c9d', '#cc99ff'
  // ],
  color: [
    '#3AA1FF',
    '#4ECB73',
    '#F2637B',
    '#FF963E',
    '#975FE5',
    '#FBD437',
    '#88D1EA',
    '#DC81D2',
    '#EAA674',
    '#ACDF82',
    '#9F8BF0',
    '#13B4A4',
    '#FFB5B5',
    '#FF6D29',
    '#82DFA9',
    '#AEE5FF',
    '#FFD898',
    '#4ECB73',
    '#36CBCB',
    '#3090FF',
  ],
  tooltip: {
    backgroundColor: 'rgba(50, 50, 51, 0.85)',
    borderRadius: 5,
    padding: 16,
    showDelay: 10,
    trigger: 'axis',
    textStyle: {
      color: '#fff',
      fontSize: 14,
    },
  },
  grid: { borderWidth: 0 },
};

export const ECHART_BASE_OPTION = base;

export const ECHART_PIE_OPTION = Object.assign({}, base, {
  animation: false,
  legend: {
    itemGap: 10,
    orient: 'vertical',
    left: 'left',
    height: '100%',
  },
  series: [
    {
      type: 'pie',
      center: ['50%', '50%'],
      label: {
        normal: {
          formatter: () => '',
          position: 'inner',
        },
      },
      labelLine: {
        normal: { show: false },
      },
      radius: ['35%', '70%'],
      tooltip: {
        formatter: '{b} <br/>{a} : {c} <br/>占比 : {d}%',
        trigger: 'item',
      },
    },
  ],
});

export const ECHART_COLUMN_OPTION = Object.assign({}, base, {
  animation: true,
  animationDelay(idx) {
    return idx * 100;
  },
  legend: {
    padding: [15, 0, 0, 0],
  },
  series: [
    {
      type: 'bar',
      tooltip: {
        trigger: 'axis',
        formatter: '{a} <br />{b}: {c}',
      },
      barMaxWidth: '15%',
    },
  ],
  tooltip: Object.assign({}, base.tooltip, {
    axisPointer: {
      type: 'shadow',
      areaStyle: {
        color: 'rgba(150,150,150,0.13)',
      },
    },
  }),
  grid: {
    borderWidth: 0,
    // 图表边距
    x: 75,
    x2: 60,
    y: 55,
    y2: 50,
  },
  xAxis: [
    {
      type: 'category',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc',
          width: 1,
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#333',
        },
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#ddd'],
          width: 1,
          // eChart的bug，设置为 dotted 时，需要把 grid:{borderWidth: } 设为非1
        },
      },
    },
  ],
});

export const ECHART_STACK_COLUMN_OPTION = Object.assign({}, base, {
  animation: true,
  animationDelay(idx) {
    return idx * 100;
  },
  legend: {
    padding: [15, 0, 0, 0],
  },
  series: [
    {
      type: 'bar',
      tooltip: {
        trigger: 'axis',
        formatter: '{a} <br />{b}: {c}',
      },
      barMaxWidth: '15%',
    },
  ],
  tooltip: Object.assign({}, base.tooltip, {
    axisPointer: {
      type: 'shadow',
      areaStyle: {
        color: 'rgba(150,150,150,0.13)',
      },
    },
  }),
  grid: {
    borderWidth: 0,
    // 图表边距
    x: 75,
    x2: 60,
    y: 55,
    y2: 50,
  },
  xAxis: [
    {
      type: 'category',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc',
          width: 1,
        },
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#333',
        },
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#ddd'],
          width: 1,
          // eChart的bug，设置为 dotted 时，需要把 grid:{borderWidth: } 设为非1
        },
      },
    },
  ],
});

export const ECHART_X_BAR_OPTION = Object.assign({}, base, {
  animation: true,
  animationDelay(idx) {
    return idx * 100;
  },
  legend: {},
  series: [
    {
      stack: 'group1',
      type: 'bar',
      barMaxWidth: '40%',
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'inside',
          },
        },
      },
    },
    {
      stack: 'group1',
      type: 'bar',
      barMaxWidth: '40%',
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'inside',
          },
        },
      },
    },
  ],
  tooltip: { show: false },
  xAxis: [
    {
      type: 'value',
      axisLine: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#333',
          type: 'dotted',
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
      },
    },
  ],
  yAxis: [
    {
      type: 'category',
      offset: 15,
      axisLine: { show: false },
      splitLine: { show: false },
    },
  ],
});

export const ECHART_MAP_OPTION = {
  animation: true,
  animationDelay(idx) {
    return idx * 100;
  },
  visualMap: {
    type: 'piecewise',
    splitNumber: 4,
    orient: 'horizontal',
    maxOpen: true,
    itemGap: 5,
    min: 1,
    left: 'left',
    top: 'top',
    text: ['High', 'Low'],
    seriesIndex: [0],
    itemSymbol: 'rect',
    inverse: true,
    inRange: {
      color: ['#bcdaf8', '#5d9cec'],
    },
    outOfRange: {
      color: ['#ccc', '#ccc'],
    },
  },
  tooltip: Object.assign({}, base.tooltip, {
    trigger: 'item',
    axisPointer: {
      type: 'shadow',
      areaStyle: {
        color: 'rgba(150,150,150,0.13)',
      },
    },
  }),
  series: [
    {
      type: 'map',
      mapType: 'china',
      mapLocation: {
        x: 50,
        y: 25,
        height: 260,
      },
      roam: false,
      label: {
        emphasis: {
          show: false,
        },
      },
      itemStyle: {
        normal: {
          areaColor: '#000',
          color: '#000',
          borderColor: '#fff',
          borderWidth: 1,
        },
      },
      tooltip: {
        formatter: '{b} <br/> {a} : {c}',
      },
    },
  ],
};

export const ECHART_LINE_OPTION = Object.assign({}, base, {
  animation: true,
  animationDelay(idx) {
    return idx * 100;
  },
  legend: {
    x: 'center',
    padding: [15, 15, 15, 15],
  },
  grid: {
    borderWidth: 0,
    // 图表边距
    x: 75,
    x2: 60,
    y: 55,
    y2: 50,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ccc',
          width: 1,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 'auto',
        textStyle: {
          color: '#969799',
        },
      },
      splitLine: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#ddd'],
          width: 1,
          // eChart的bug，设置为 dotted 时，需要把 grid:{borderWidth: } 设为非1
          type: 'dotted',
        },
      },
    },
  ],
});

export const ECHART_RADAR_OPTION = Object.assign({}, base, {
  color: ['#fc863f', '#6ed5e6'],
  legend: {
    orient: 'vertical',
    x: 'left',
    y: 'top',
    padding: 15,
  },
  grid: {
    borderWidth: 0,
    // 图表边距
    x: 75,
    x2: 60,
    y: 55,
    y2: 50,
  },
  polar: [
    {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ddd',
          width: 1,
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ddd',
          width: 1,
        },
      },
    },
  ],
});

export const CHART_STYLE = {
  height: '266px',
  padding: '8px',
};

const MAP_FALLBACK = [
  {
    name: '浙江',
    value: 0,
  },
  {
    name: '北京',
    value: 0,
  },
  {
    name: '广东',
    value: 0,
  },
  {
    name: '江苏',
    value: 0,
  },
  {
    name: '福建',
    value: 0,
  },
  {
    name: '上海',
    value: 0,
  },
  {
    name: '湖北',
    value: 0,
  },
  {
    name: '山西',
    value: 0,
  },
  {
    name: '内蒙古',
    value: 0,
  },
  {
    name: '黑龙江',
    value: 0,
  },
  {
    name: '江西',
    value: 0,
  },
  {
    name: '重庆',
    value: 0,
  },
  {
    name: '河北',
    value: 0,
  },
  {
    name: '四川',
    value: 0,
  },
  {
    name: '山东',
    value: 0,
  },
  {
    name: '云南',
    value: 0,
  },
  {
    name: '安徽',
    value: 0,
  },
  {
    name: '河南',
    value: 0,
  },
  {
    name: '广西',
    value: 0,
  },
  {
    name: '陕西',
    value: 0,
  },
  {
    name: '辽宁',
    value: 0,
  },
  {
    name: '湖南',
    value: 0,
  },
  {
    name: '天津',
    value: 0,
  },
  {
    name: '甘肃',
    value: 0,
  },
  {
    name: '宁夏',
    value: 0,
  },
  {
    name: '海南',
    value: 0,
  },
  {
    name: '吉林',
    value: 0,
  },
  {
    name: '贵州',
    value: 0,
  },
  {
    name: '新疆',
    value: 0,
  },
  {
    name: '西藏',
    value: 0,
  },
  {
    name: '青海',
    value: 0,
  },
  {
    name: '香港',
    value: 0,
  },
  {
    name: '澳门',
    value: 0,
  },
  {
    name: '台湾',
    value: 0,
  },
  {
    name: '南海诸岛',
    value: 0,
    itemStyle: {
      normal: {
        borderColor: '#ccc',
      },
    },
  },
];

export const handleMapData = meta => {
  const originData = cloneDeep(MAP_FALLBACK);
  const afterFilter = originData.map(x => {
    const replacer = meta.find(m => m.name === x.name);
    if (replacer) {
      x.value = Number(replacer.value);
    }
    return x;
  });
  return afterFilter.sort((a, b) => b.value - a.value);
};

export const SERIES_STYLE_MAP = {
  bar: {
    barMaxWidth: '35%',
  },
  line: {},
};
