import React from 'react';
import { Router, Route, Redirect, hashHistory } from 'react-router';
import { visPush } from 'fns/router';

const onListEnter = ({ params }) => {
  let { splat = 'content' } = params;
  if (splat === 'gpunch') {
    splat = 'punch';
  }
  visPush(`tabs/${splat}`);
};

const createRouterEnter = proj => {
  return ({ params, location }) => {
    const { splat } = params;
    const { search } = location;
    if (!splat) {
      if (proj === 'punch') {
        visPush(`/tabs${proj}`);
      } else {
        visPush(`/${proj}/list`);
      }
    } else {
      visPush(`/${proj}${splat}${search}`);
    }
  };
};

const Routes = (
  <Router history={hashHistory}>
    <Route path="list/*" onEnter={onListEnter} />
    <Router path="goods-recommend*" onEnter={createRouterEnter('goodsrecommend')} />
    <Router path="exam*" onEnter={createRouterEnter('exam')} />
    <Router path="gpunch*" onEnter={createRouterEnter('punch')} />
    <Router path="referral*" onEnter={createRouterEnter('referral')} />
    <Router path="setting*" onEnter={() => visPush('settings/setting')} />
    <Router path="records*" onEnter={createRouterEnter('record')} />
    <Redirect from="*" to="list/content" />
  </Router>
);

export default Routes;
