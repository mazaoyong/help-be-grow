import React, { useState, useEffect, useRef } from 'react';
import { FormField, Input, FormError } from 'zent';
import { useStore, useStoreByValidFlag } from '../../store';
import { nameMaxLength } from '../../contants';

export default function TitleField() {
  const ref = useRef(true);
  const [data, dispatch] = useStore();
  const [isValid] = useStoreByValidFlag('title');
  const [errorMessage, setErrorMessage] = useState('');
  const { formData, validFlag } = data;
  const { title } = formData;

  useEffect(() => {
    if (ref.current) {
      ref.current = false;
      return;
    }
    if (!title || title.length > nameMaxLength) {
      if (title === '') {
        setErrorMessage('请输入海报名称');
      } else if (title.length > nameMaxLength) {
        setErrorMessage(`请输入少于${nameMaxLength}个字的名称`);
      }
    } else {
      setErrorMessage('');
    }
  }, [title, isValid]);
  const handleOnChange = e => {
    const val = e.target.value;
    let valid;
    if (!val || val.length > nameMaxLength) {
      valid = false;
    } else {
      valid = true;
    }
    dispatch({
      formData: { ...formData, title: val },
      validFlag: { ...validFlag, title: valid },
    });
  };
  const className = isValid ? '' : 'has-error';
  return (
    <FormField name="title" defaultValue="title" label="海报名称：" required className={className}>
      {() => (
        <div>
          <Input value={title} onChange={handleOnChange} placeholder={`${nameMaxLength}个字以内`} />
          <FormError>{errorMessage}</FormError>
        </div>
      )}
    </FormField>
  );
}
