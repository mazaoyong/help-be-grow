import React from 'react';
import omit from 'lodash/omit';
import { ZentForm } from 'zent/es/form/ZentForm';
import { colorize } from '../utils/colorizer';
import { getTokens, IJsonToken, JsonTypeEmus } from '../utils/lexer';
import { propWalker } from '../utils/props-walker';
import { IFieldStatus } from '../types';

interface IEasyFormPreview {
  form: ZentForm<any>;
  statusForm: ZentForm<any>;
}

export const EasyFormPreview: React.FC<IEasyFormPreview> = ({ form, statusForm }) => {
  const previewUpdateRef = React.useRef<number | null>(null);
  const [formValues, setFormValues] = React.useState({});
  const jsonTokens = React.useMemo(() => getTokens(formValues, { pretty: true }), [formValues]);
  const colorizeTokens = React.useMemo(() => colorize(jsonTokens, {}), [jsonTokens]);

  React.useEffect(() => {
    function updateFormValues() {
      const formValues = form.getValue();
      const statusValues = statusForm.getValue();
      const invisibleKeys = omitInvisibleValues(statusValues);
      setFormValues(omit(formValues, invisibleKeys));
      if (previewUpdateRef.current) cancelAnimationFrame(previewUpdateRef.current);
      previewUpdateRef.current = requestAnimationFrame(updateFormValues);
    }
    updateFormValues();
    return () => {
      if (previewUpdateRef.current) cancelAnimationFrame(previewUpdateRef.current);
    };
  }, [form, statusForm]);
  return (
    <div
      className="easy-form preview"
      dangerouslySetInnerHTML={{
        __html: colorizeTokens.reduce(jsonDisplayReducer, ''),
      }}
    />
  );
};

interface IColorizeToken extends IJsonToken {
  color: string;
}
function jsonDisplayReducer(prevHtmlString: string, curToken: IColorizeToken) {
  if (curToken.type === JsonTypeEmus.NEXT_LINE) return (prevHtmlString += curToken.value);
  return (
    prevHtmlString +
    `<span class="easy-form preview-token token-${curToken.type}" style="color: ${curToken.color}">${curToken.value}</span>`
  );
}

function omitInvisibleValues(statusValues: Record<string, IFieldStatus>): string[] {
  const invisiblePaths: string[][] = [];
  const walker = propWalker<IFieldStatus>(value => value.visible === false)
  Object.entries(statusValues).forEach(([topKey, topValue]) => {
    const path = walker(topKey, topValue);
    if (path) {
      invisiblePaths.push(path);
    }
  });
  return invisiblePaths.reduce((prePaths, curPath) => prePaths.concat(curPath), []);
}
