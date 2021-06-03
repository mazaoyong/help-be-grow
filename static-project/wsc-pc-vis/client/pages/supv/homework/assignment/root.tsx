import { React, createBlock } from '@youzan/tany-react';
import { RouterView } from './router';
// import withRouterFallback from '../components/router-fallback';

import './styles.scss';

const model = () => ({});

function Root() {
  return (
    <div className="assignment">
      <RouterView />
    </div>
  );
}

export default createBlock({
  root: Root,
  model,
});
