import React, { useState } from 'react';
import { IListPopupEditorContent } from './types';
import { Input } from 'zent';

export const StrPopupEditor: IListPopupEditorContent = ({
  pop, value, width, validate, onChange, onSubmit, onCancel,
}) => {
  const [error, setError] = useState<string>('');
  const formatAndChange = (e: any) => {
    const value = e.target.value;
    setError('');
    onChange(value);
  };
  const handleSubmit = () => {
    const _error = validate ? validate(value) : '';
    if (_error) {
      setError(_error);
    } else {
      onSubmit(pop.close)();
    }
  };
  return (
    <div className={error ? 'has-error' : ''}>
      <div className="list-popup-editor-num">
        <Input autoFocus value={value} width={width} onChange={formatAndChange} onPressEnter={handleSubmit} />
        <ButtonGroup submit={handleSubmit} cancel={onCancel(pop.close)} />
      </div>
      {error ? <p className="list-popup-editor_desc">{error}</p> : null}
    </div>
  );
};

// only support positive number
export const NumPopupEditor: IListPopupEditorContent = ({
  pop, value, width, validate, onChange, onSubmit, onCancel,
}) => {
  const [error, setError] = useState<string>('');
  const formatAndChange = (e: any) => {
    const value = e.target.value;
    setError('');
    onChange(value);
  };
  const handleSubmit = () => {
    const _error = validate ? validate(value) : '';
    if (_error) {
      setError(_error);
    } else {
      onSubmit(pop.close)();
    }
  };
  return (
    <div className={error ? 'has-error' : ''}>
      <div className="list-popup-editor-num">
        <Input autoFocus type="number" value={value} width={width} onChange={formatAndChange} onPressEnter={handleSubmit} />
        <ButtonGroup submit={handleSubmit} cancel={onCancel(pop.close)} />
      </div>
      {error ? <p className="list-popup-editor_desc">{error}</p> : null}
    </div>
  );
};

export const NullPopupEditor: IListPopupEditorContent = () => {
  return null;
};

function ButtonGroup({ submit, cancel }: { submit: () => void, cancel: () => void }) {
  return (
    <div className="list-popup-editor_btn-group">
      <a href="javascript: void(0)" onClick={submit}>保存</a>
      <a href="javascript: void(0)" onClick={cancel}>取消</a>
    </div>
  );
}
