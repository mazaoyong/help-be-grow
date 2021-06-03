const { join, resolve } = require('path');
const { createRenderer } = require('vue-server-renderer');

module.exports = async function genSkeleton(pathname, html, data = {}) {
  const skeletonDirPath = resolve(__dirname, '../../static/skeletons/');
  const jsName = 'main.js';

  let ssrHtml = '';
  try {
    const dirPath = join(skeletonDirPath, pathname);
    const renderer = createRenderer({
      template: '<!--vue-ssr-outlet-->',
    });
    const componentPath = join(dirPath, jsName);
    if (['qa', 'development'].indexOf(process.env.NODE_ENV) > -1 &&
      require.cache[componentPath]
    ) {
      delete require.cache[componentPath];
    }
    const Ctor = require(componentPath).default;
    const component = new Ctor({
      propsData: data,
    });
    ssrHtml = await renderer.renderToString(component);
    ssrHtml = ssrHtml.replace(' data-server-rendered="true"', '');
  } catch (err) {
    console.error(err);
  }
  return html.replace('<!--vue-ssr-outlet-->', `${ssrHtml}`);
};
