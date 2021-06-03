// @ts-check
import { hashHistory } from 'react-router';
import { createRouter } from 'fns/router';
import $ from 'zan-utils/jquery';
import { replaceTagName } from 'fns/router/create-router/breadcrumb';

import PreviewPage from './PreviewPage';
import EditPage from './EditPage';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: '/',
    breadcrumb: {
      project: '关联推荐商品',
    },
    onChange(_, { location }) {
      if (/preview/.test(location.pathname)) {
        replaceTagName($('.project'), 'span');
      }
    },
    children: [
      {
        path: 'preview',
        component: PreviewPage,
        breadcrumb: {
          project: '关联推荐商品',
        },
      },
      {
        path: 'edit/:position',
        component: EditPage,
        breadcrumb({ location: { search } }) {
          return {
            project: {
              name: '关联推荐商品',
              href: `${window._global.url.v4}/vis/pct/page/goodsrecommend#/preview${search}`,
            },
            page: '编辑推荐商品',
          };
        },
      },
      {
        // 老链接重定向
        path: 'goods-recommend*',
        onEnter({ params, location }) {
          const { splat = `preview` } = params;
          hashHistory.replace(splat + location.search);
        },
      },
      {
        path: '*',
        redirect: `preview`,
      },
    ],
  },
];

export default createRouter(routes);
