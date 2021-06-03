import React, { FC, useState, useEffect } from 'react';
import { IFormPreviewProps } from '../../types';
import './index.css';

export const FormPreview: FC<IFormPreviewProps> = props => {
  const { form } = props;
  const [val, setVal] = useState('');
  useEffect(() => {
    function render() {
      const value = JSON.stringify(form.getValue(), null, 2);
      setVal(value);
      requestAnimationFrame(render);
    }
    render();
  }, []);
  return (
    <div className="ebiz-form__preview">
      {val}
    </div>
  );
};
