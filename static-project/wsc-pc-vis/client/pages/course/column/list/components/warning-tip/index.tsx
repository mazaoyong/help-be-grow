import { Pop } from '@zent/compat';
import React, { FC, useCallback } from 'react';
import { Notify, Icon } from 'zent';
import { ignoreWarningV2 as setIgnoreWarningV2 } from '../../../../api/pct';
import './style.scss';

const { withPop } = Pop;

interface IProps {
  alias: string;
  text: string;
  reload: () => void;
  actionText: string;
  type: string;
}

const WarningContent = withPop((props: any) => {
  const { alias, text, actionText, type, reload } = props;

  const ignoreWarning = useCallback(() => {
    const overlook = {
      state_info: 'overlookState',
      price_info: 'overlookPrice',
    };
    setIgnoreWarningV2({
      alias,
      [overlook[type]]: true,
    })
      .then(() => {
        reload();
      })
      .catch(msg => {
        Notify.error(msg || '请求异常');
      });
  }, [alias, type, reload]);

  return (
    <div className="fx-warning fx-warning__price">
      {text}
      <a
        className="fx-warning__cancel action"
        onClick={() => {
          if (props.pop) {
            props.pop.close();
          }
          ignoreWarning();
        }}
      >
        {actionText}
      </a>
    </div>
  );
});

const WarningTip: FC<IProps> = props => {
  const content = <WarningContent {...props} />;
  return (
    <Pop trigger="hover" position="bottom-left" content={content} centerArrow>
      <Icon className="error-icon" type="error-circle" />
    </Pop>
  );
};

export default WarningTip;
