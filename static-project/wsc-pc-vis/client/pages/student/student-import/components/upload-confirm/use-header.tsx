import React, { useCallback, useMemo } from 'react';
import { Button, Alert, Checkbox } from 'zent';

export default function useHeader({
  open,
  taskId,
  setCurrent,
  taskTotal,
  errDataNo,
  toggleErrOnly,
  errOnly,
}) {
  // 是否仅查看错误数据，false：查看所有数据，true：仅查看错误数据

  const handleToggleErrOnly = useCallback(
    (option?: boolean) => {
      if (!taskId) return;
      setCurrent(1);
      if (option) {
        // 点击查看错误数据
        toggleErrOnly(true);
        return;
      }
      // 勾选Checkbox
      toggleErrOnly(value => !value);
    },
    [setCurrent, taskId, toggleErrOnly],
  );

  const headerElement = useMemo(() => {
    return (
      <div className="head">
        {errDataNo ? (
          <Alert type="warning">
            预计导入{taskTotal}条数据，其中{errDataNo}条可能有误，请按提示调整后再导入。
            <span className="toggle-error-text" onClick={() => handleToggleErrOnly(true)}>
              查看错误数据
            </span>
          </Alert>
        ) : null}
        <div className="head-actions">
          <Button onClick={() => open('添加', taskId)}>添加</Button>
          {errDataNo ? (
            <Checkbox
              className="toggle-error-checkbox"
              checked={errOnly}
              onChange={() => handleToggleErrOnly()}
            >
              仅查看错误数据
            </Checkbox>
          ) : null}
        </div>
      </div>
    );
  }, [errDataNo, errOnly, handleToggleErrOnly, open, taskId, taskTotal]);

  return {
    headerElement,
  };
}
