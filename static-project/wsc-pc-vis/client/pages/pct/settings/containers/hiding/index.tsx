import React from 'react';
import { reduce } from 'lodash';
import {
  Sweetalert,
  Alert,
  Switch,
  LayoutRow as Row,
  LayoutCol as Col,
  Notify,
  BlockLoading,
} from 'zent';
import {
  isWscBranchStore,
  isUnifiedBranchStore,
  isInStoreCondition,
  isUnifiedPartnerStore,
} from 'fns/chain';
import { hideSwitchList, itemFieldMap } from './config';
import { ENUM_SWITCH_FUNC, ENUM_SWITCH_STATUS, VisibilityResult, HideItem } from './types';
import * as API from '../../api';

import './style.scss';

interface State {
  [key: number]: HideItem;
}

const isRetailMinifydisAbleShop = isInStoreCondition({
  supportMinifyRetailBranchShop: true,
  supportMinifyParterShop: true,
});

function initInfo(): HideItem {
  return {
    switchStatus: ENUM_SWITCH_STATUS.INIT,
    loading: false,
  };
}

function setNewHideItem(
  nextState: State,
  switchFun: ENUM_SWITCH_FUNC,
  switchValue: Partial<HideItem>): State {
  const value: HideItem = nextState[switchFun] || initInfo();
  const nextValue = Object.assign({}, value, switchValue);
  nextState[switchFun] = nextValue;
  return nextState;
}

const Hiding: React.FC = () => {
  // 全局 loading
  const [pageLoading, setPageLoading] = React.useState<boolean>(true);
  const [state, setState] = React.useState<State>(
    () => reduce(hideSwitchList, (prevState, item) => {
      prevState[item.switchFun] = initInfo();
      return prevState;
    }, {}));

  const setSwitchState = React.useCallback(
    (switchFun: ENUM_SWITCH_FUNC, switchValue: Partial<HideItem>) => {
      setState(prevState => setNewHideItem({ ...prevState }, switchFun, switchValue));
    },
    [],
  );

  const updateVisibility = React.useCallback(
    (switchFun: ENUM_SWITCH_FUNC) => (checked: boolean) => {
      setSwitchState(switchFun, { loading: true });
      const { switchStatus } = state[switchFun] || initInfo();
      const showType = checked ? ENUM_SWITCH_STATUS.OPEN : ENUM_SWITCH_STATUS.CLOSE;
      Promise.resolve(
        switchStatus === ENUM_SWITCH_STATUS.INIT
          ? API.createKdtVisibility({
            switchFun,
            showType,
            itemFields: itemFieldMap[switchFun],
          })
          : API.putKdtVisibility({
            switchFun,
            showType,
          })
      )
        .then(data => {
          if (data) {
            setSwitchState(switchFun, {
              switchStatus: showType,
            });
          }
        })
        .catch(msg => Notify.error(msg))
        .finally(() => setSwitchState(switchFun, { loading: false }));
    }, [state, setSwitchState]);

  React.useEffect(() => {
    API.getBatchVisibility({
      switchFuns: JSON.stringify(hideSwitchList.map(({ switchFun }) => switchFun)),
    })
      .then((data: VisibilityResult[]) => {
        setState(prevState =>
          reduce(data, (nextState, { switchFun, switchStatus }) =>
            setNewHideItem(nextState, switchFun, { switchStatus }), { ...prevState })
        );
        setPageLoading(false);
      })
      // 请求失败的情况下不取消loading
      .catch((error) => Notify.error(error));
  }, []);

  React.useEffect(() => {
    if (window._global.isYZEdu) {
      Sweetalert.alert({
        title: '下线提醒',
        content: '本应用即将下线，您可以访问“设置-课程设置”来变更您的设置。',
      });
    }
  }, []);

  return (
    <BlockLoading loading={pageLoading}>
      <div className="hide-info">
        <Alert className="hide-info__title_bg">信息隐藏功能只在知识付费插件内可使用，该插件到期后则无法使用。</Alert>
        {hideSwitchList.map(({ title, renderDesc, switchFun, switchProps = {} }) => {
          const { switchStatus, loading } = state[switchFun] || initInfo();
          const checked = switchStatus !== ENUM_SWITCH_STATUS.CLOSE;
          return (
            <Row className="hide-info__list" key={switchFun}>
              <Col className="hide-info__list__item1" span={5}>
                {title}
              </Col>
              <Col className="hide-info__list__item2 hide-info__list__item2_em_num1" span={14}>
                {renderDesc(checked)}
              </Col>
              <Col className="hide-info__list__item3" span={5}>
                <Switch
                  checked={checked}
                  size="small"
                  loading={loading}
                  disabled={
                    isWscBranchStore ||
                    isUnifiedBranchStore ||
                    isRetailMinifydisAbleShop ||
                    isUnifiedPartnerStore
                  }
                  onChange={updateVisibility(switchFun)}
                  {...switchProps}
                />
              </Col>
            </Row>
          );
        })}
      </div>
    </BlockLoading>
  );
};

export default Hiding;
