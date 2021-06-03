import Vue from 'vue';
import ThemePlugin from '@youzan/vue-theme-plugin';
import { setRulesets, mainBtn } from '@youzan/vue-theme-plugin/lib/rulesets';
import generateColors from '@youzan/vue-theme-plugin/lib/colors';
import render from '@youzan/vue-theme-plugin/lib/render';

// 项目自定义colorMap
const colorMap = () => setRulesets({
  'default-theme': {
    main: '#f44',
    mainText: '#fff',
    vice: '#f85',
    viceText: '#fff',
    linear: 'linear-gradient(to right, #ff6060 0%, #f44 100%)',
  },
  'red-black-theme': {
    main: '#f44',
    mainText: '#fff',
    vice: '#555',
    viceText: '#fff',
    linear: 'linear-gradient(to right, #ff4f8d 0%, #f44 100%)',
  },
  'orange-theme': {
    main: '#ff5e15',
    mainText: '#fff',
    vice: '#ff9300',
    viceText: '#fff',
    linear: 'linear-gradient(to right, #ff8717 0%, #ff5e16 100%)',
  },
  'pink-theme': {
    main: '#ff547b',
    mainText: '#fff',
    vice: '#ffe6e8',
    viceText: '#ff547b',
    linear: 'linear-gradient(to right, #ff73ab 0%, #ff5179 100%)',
  },
  'blue-theme': {
    main: '#4990e2', // 4a90e2
    mainText: '#fff',
    vice: '#dbe9f9',
    viceText: '#4990e2',
    linear: 'linear-gradient(to right, #0da6f3 0%, #0080ff 100%)',
  },
  'brown-theme': {
    main: '#c3a769',
    mainText: '#fff',
    vice: '#f3eee1',
    viceText: '#c3a769',
    linear: 'linear-gradient(to right, #d9bc3d 0%, #c3a769 100%)',
  },
  'gold-theme': {
    main: '#fcc600',
    mainText: '#fff',
    vice: '#1d262e',
    viceText: '#fff',
    linear: 'linear-gradient(to right, #eabe00 0%, #fa0 100%)',
  },
  'fantasy-theme': {
    main: '#9a875f',
    mainText: '#fff',
    vice: '#f6edec',
    viceText: '#9a875f',
    linear: 'linear-gradient(to right, #cfb67f 0%, #b8a06f 100%)',
  },
  'black-white-theme': {
    main: '#2f2f34',
    mainText: '#fff',
    vice: '#ebecf2',
    viceText: '#333',
    linear: 'linear-gradient(to right, #4a4d52 0%, #333 100%)',
  },
  'green-black-theme': {
    main: '#09bb07',
    mainText: '#fff',
    vice: '#383838',
    viceText: '#fff',
    linear: 'linear-gradient(to right, #56c700 0%, #09bb07 100%)',
  },
  'light-green-theme': {
    main: '#65c4aa',
    mainText: '#fff',
    vice: '#ddf2ec',
    viceText: '#65c4aa',
    linear: 'linear-gradient(to right, #00d6b9 0%, #65c4aa 100%)',
  },
  'middle-green-theme': {
    main: '#6cbe72',
    mainText: '#fff',
    vice: '#e1f4e3',
    viceText: '#6cbe72',
    linear: 'linear-gradient(to right, #77d330 0%, #5bb161 100%)',
  },
  'haitao-theme': {
    main: '#884cff',
    mainText: '#fff',
    vice: '#efe6ff',
    viceText: '#884cff',
    linear: 'linear-gradient(to right, #9673ff 0%, #884cff 100%)',
  },
  'red-linear-theme': {
    main: '#ee0a24',
    mainText: '#fff',
    vice: '#ffd01e',
    viceText: '#fff',
    linear: 'linear-gradient(to right, #ff6034 0%, #ee0a24 100%)',
  },
}, 'main-btn', mainBtn);

// 主题配置
const themeConfig = { colorMap };

// 用于在隔离环境（extension）获取 themeHook
const getThemeHook = () => {
  const colors = generateColors(themeConfig);

  if (!colors) {
    return false;
  }

  const $theme = {};
  $theme.colors = colors;
  window.__themeColors = colors;
  Vue.prototype.$theme = $theme;

  const hookFn = render(colors);

  return hookFn;
};

// 普通非隔离环境，注入全局plugin
Vue.use(ThemePlugin, themeConfig);

export {
  getThemeHook,
};
