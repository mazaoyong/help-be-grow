import React from 'react';
import { IButtonProps, Notify } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

export interface IBatchSamButtonConfig {
  name: string;
  btnText: string;
  samName: string;
  /** 优先级，越小放的越靠前 */
  priority?: number;
  restButtonProps?: Omit<IButtonProps, 'onClick'> & { onClick(data: any[]): void };
}

export interface IBatchSamButtonsProps {
  data: any[];
  configs: IBatchSamButtonConfig[];
  nodataHint?: React.ReactNode;
}

const BatchSamButtons: React.FC<IBatchSamButtonsProps> = ({ data, configs, nodataHint }) => {
  const clickProxy = React.useCallback(
    (callback?: (data: any[]) => void) => () => {
      if (callback) {
        if (Array.isArray(data) && data.length) {
          callback(data);
        } else if (nodataHint) {
          // 如果需要展示没有数据的错误提示
          Notify.error(nodataHint);
        }
      }
    },
    [data, nodataHint],
  );

  const RestButtons = React.useMemo(() => {
    if (Array.isArray(configs) && configs.length) {
      return configs
        .sort((a, b) => (a.priority || 0) - (b.priority || 0))
        .map((config) => {
          const { name, btnText, samName, restButtonProps } = config;
          const { onClick, ...passiveProps } = restButtonProps || {};
          return (
            <SamButton key={name} name={samName} {...passiveProps} onClick={clickProxy(onClick)}>
              {btnText}
            </SamButton>
          );
        });
    }
    return null;
  }, [clickProxy, configs]);

  return (
    <section className="sam-button-group">
      <span style={{ marginRight: '8px' }}>当页全选</span>
      {RestButtons}
    </section>
  );
};

export default BatchSamButtons;
