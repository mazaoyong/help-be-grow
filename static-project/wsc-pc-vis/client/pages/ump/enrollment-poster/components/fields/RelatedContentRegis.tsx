import React, { useMemo, useCallback, useEffect } from 'react';
import { Radio, IGridColumn, Grid, FormError } from 'zent';
// import ChooseFeature from '@youzan/react-components/es/components/choose-dialog/dialogs/feature';
import { useStoreRelatedContent, useStoreByValidFlag } from '../../store';
import { RELATED_TYPE } from '../../contants';
import { url as ZanUrl } from '@youzan/utils';
import { pick } from 'lodash';
import ChooseDialog from '../dialogs/MicroPageChooseDialog';

const styleNamePrefix = 'related-content-regis';
interface IRelatedContentRegisProps {
  onRadioChange: (e: any) => void;
}

export default function RelatedContentRegis(props: IRelatedContentRegisProps) {
  const { onRadioChange } = props;
  const [formData, dispatch] = useStoreRelatedContent();
  const [isValid, setValid] = useStoreByValidFlag('relatedSelect');
  const { relatedType, regisform = null, resourceAlias = '' } = formData;

  const hasRegisform = regisform !== null;
  useEffect(() => {
    if (hasRegisform) {
      setValid(true);
    }
  }, [hasRegisform, setValid]);

  const openRegisForm = () => {
    ChooseDialog({
      onChoose: data => {
        const url = data[0].url;
        dispatch(
          'regisform',
          pick(data[0], ['title', 'id', 'alias', 'url']),
          ZanUrl.args.add(url, { resourceAlias }),
        );
      },
    });
    /* ChooseFeature({
      config: _global,
      onChoose: data => {
        const url = data[0].url;
        dispatch(
          'regisform',
          pick(data[0], ['title', 'id', 'alias', 'url']),
          ZanUrl.args.add(url, { resourceAlias }),
        );
      },
    }); */
  };
  const removeChoosed = useCallback(() => {
    dispatch('regisform', null, '');
  }, [dispatch]);
  const choosedColumn = useMemo<IGridColumn[]>(() => {
    return [
      {
        title: '表单名称',
        width: '330px',
        nowrap: true,
        textAlign: 'left',
        name: 'title',
      },
      {
        title: '操作',
        width: '60px',
        textAlign: 'right',
        bodyRender: () => {
          return (
            <a
              href="javascript:;"
              onClick={() => {
                removeChoosed();
              }}
            >
              删除
            </a>
          );
        },
      },
    ];
  }, [removeChoosed]);
  return (
    <>
      <Radio onChange={onRadioChange} checked={relatedType === RELATED_TYPE.REGISFORM}>
        报名表单
      </Radio>
      {relatedType === RELATED_TYPE.REGISFORM ? (
        <div className="related-content-regis left-tab">
          <a className="cursor-link" onClick={openRegisForm}>
            {regisform ? '重新选择' : '选择报名表单'}
          </a>
          {regisform && (
            <Grid
              className={`${styleNamePrefix}__grid`}
              datasets={[regisform]}
              columns={choosedColumn}
              ellipsis={true}
              rowKey="alias"
            />
          )}
          {!isValid && <FormError>请选择报名表单</FormError>}
          <div className="desc-info">选择创建的表单微页面，搜集学员报名信息。</div>
        </div>
      ) : (
        <br />
      )}
    </>
  );
}
