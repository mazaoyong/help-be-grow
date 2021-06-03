import { React, useState } from '@youzan/tany-react';
import { FormError } from 'zent';
import cx from 'classnames';
import { RichText } from 'components/field/rich-text';
import { richTextFilter } from '../../constants';
import { homeworkEditToolbar } from '../detail/utils';

import './styles.scss';

const RichtextField = ({ value, onChange, showErrorRef }) => {
  const [touched, toggleTouched] = useState(false);

  const showError = showErrorRef?.current;

  const isError = !value && (touched || showError); // 如果没有值即为错误

  return (
    <div className="richtext-field">
      <RichText
        className={cx('richtext-element', { hasError: isError })}
        value={value}
        onChange={(val: string) => {
          toggleTouched(true);
          onChange(val);
        }}
        editorConfig={{
          initialFrameWidth: 466,
          filterTxtRules: richTextFilter,
          // minFrameWidth: 300,
          toolbars: homeworkEditToolbar,
        }}
      />
      {isError && <FormError style={{ marginTop: '8px' }}>请输入图文内容</FormError>}
    </div>
  );
};

export default RichtextField;
