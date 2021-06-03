import React from 'react';
import { Button } from 'zent';
import { IEditParams } from '@ability-center/supv/question-bank';

type Func = (...args: any[]) => any;
function useSubmitButtons(
  originQueries: IEditParams,
  loadingState: boolean,
  actions: {
    submit: Func;
    createNext: Func;
  },
): React.ReactNode {
  const { submit, createNext } = actions;
  const restSubmitFooterBtn = React.useMemo(() => {
    if (originQueries.type === 'create') {
      return [
        <Button key="createNext" onClick={createNext} loading={loadingState}>
          保存并新建题目
        </Button>,
        <Button key="createAndBack" type="primary" loading={loadingState} onClick={submit}>
          保存并返回列表
        </Button>,
      ];
    }
    return (
      <Button type="primary" loading={loadingState} onClick={submit}>
        保存并返回列表
      </Button>
    );
  }, [originQueries.type, loadingState, submit, createNext]);

  return restSubmitFooterBtn;
}

export default useSubmitButtons;
