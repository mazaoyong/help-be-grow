import React, { FC, useContext } from 'react';
import { Button } from 'zent';
import { Icon as EbizIcon } from '@youzan/ebiz-components';
import { context } from '../../store';

const ViewActions: FC<{}> = () => {
  const { store, dispatch } = useContext(context);

  return (
    <div className="panel__filter__view-actions">
      <Button.Group className="panel__filter__type-group">
        <Button
          type={store.type === 'view' ? 'primary' : 'default'}
          // icon="calendar-o"
          onClick={() => dispatch({ type: 'setType', value: 'view' })}
        >
          <EbizIcon type="calendar-o" size="20px" />
        </Button>
        <Button
          type={store.type === 'list' ? 'primary' : 'default'}
          onClick={() => dispatch({ type: 'setType', value: 'list' })}
        >
          <EbizIcon type="list-o" size="20px" />
        </Button>
      </Button.Group>
    </div>
  );
};

export default ViewActions;
