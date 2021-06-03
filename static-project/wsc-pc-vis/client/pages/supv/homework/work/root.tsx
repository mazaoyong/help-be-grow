import { React, createBlock } from '@youzan/tany-react';
import { RouterView } from './router';

import './styles.scss';

const model = () => ({});

function Root() {
  return (
    <div className="homework">
      <RouterView />
    </div>
  );
}

export default createBlock({
  root: Root,
  model,
});
