import UA from 'zan-utils/browser/ua';
import $ from 'zepto';

const viewportMeta = document.querySelector('meta[name="viewport"]');
const metaContent = viewportMeta.content;
// 适配iphonex
if (UA.isIOS() && (screen.height === 812 || screen.height === 896)) {
  viewportMeta.setAttribute('content', metaContent + ', viewport-fit=cover');
  let bodyClass = document.body.getAttribute('class');
  bodyClass = bodyClass + ' is-iphonex';
  document.body.setAttribute('class', bodyClass);
}

// 调整容器高度
const container = $('.container');
container && container.css('minHeight', $(window).height());
