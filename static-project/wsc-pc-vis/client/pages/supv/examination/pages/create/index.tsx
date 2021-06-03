import React, { useState } from 'react';
import { Steps } from 'zent';
import AddQuestion from './add-question';
import Setting from './setting';
import Success from './success';
import { hot } from 'react-hot-loader';
import './index.scss';
import store from './store';

const { Provider } = store;

function Wrapper({ params }) {
  const { id } = params;
  return <CreatePage params={params} key={id} />;
}

function CreatePage({ params }) {
  const id: number = params.id;
  const [current, setCurrent] = useState(1);
  const next = React.useCallback(() => {
    setCurrent(prevCurrent => {
      if (prevCurrent === 3) {
        return 1;
      }
      return prevCurrent + 1;
    });
  }, []);
  const last = React.useCallback(() => {
    setCurrent((prevCurrent) => {
      if (prevCurrent > 1) return prevCurrent - 1;
      return prevCurrent;
    });
  }, []);

  return (
    <Provider>
      <div className="create-page">
        <Steps current={current} type="breadcrumb">
          <Steps.Step title="设置考试信息" />
          <Steps.Step title="添加题目" />
          <Steps.Step title="发布成功" />
        </Steps>
        {current === 1 && <Setting next={next} index={current} id={id} />}
        {current === 2 && <AddQuestion last={last} next={next} index={current} id={id} />}
        {current === 3 && <Success next={next} />}
      </div>
    </Provider>
  );
}

export default hot(module)(Wrapper);
