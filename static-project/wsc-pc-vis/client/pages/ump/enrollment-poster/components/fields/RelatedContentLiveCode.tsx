import { Pop } from '@zent/compat';
import React, { useMemo, useCallback, useEffect } from 'react';
import { Radio, Icon, IGridColumn, Grid, FormError } from 'zent';
import ChooseLiveQrcode from '@youzan/react-components/es/components/choose-dialog/dialogs/live-qrcode';
import { useStoreRelatedContent, useStoreByValidFlag } from '../../store';
import { RELATED_TYPE } from '../../contants';
import { url as ZanUrl } from '@youzan/utils';
import { pick } from 'lodash';

const styleNamePrefix = 'related-content-livecode';

interface IRelatedContentLiveCode {
  onRadioChange: (e: any) => void;
}

export default function RelatedContentLiveCode(props: IRelatedContentLiveCode) {
  const { onRadioChange } = props;
  const [formData, dispatch] = useStoreRelatedContent();
  const [isValid, setValid] = useStoreByValidFlag('relatedSelect');
  const { relatedType, liveCode = null, resourceAlias = '' } = formData;

  const hasLiveCode = liveCode !== null;
  useEffect(() => {
    if (hasLiveCode) {
      setValid(true);
    }
  }, [hasLiveCode, setValid]);

  const openLiveCode = () => {
    ChooseLiveQrcode({
      config: _global,
      multiple: false,
      onChoose(data) {
        const url = data[0].url;
        dispatch(
          'liveCode',
          pick(data[0], ['url', 'id', 'name']),
          ZanUrl.args.add(url, { resourceAlias }),
        );
      },
    });
  };
  const removeChoosed = useCallback(() => {
    dispatch('liveCode', null, '');
  }, [dispatch]);
  const choosedColumn = useMemo<IGridColumn[]>(() => {
    return [
      {
        title: '活码名称',
        width: '330px',
        nowrap: true,
        textAlign: 'left',
        name: 'name',
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
      <Radio onChange={onRadioChange} checked={relatedType === RELATED_TYPE.LIVECODE}>
        活码
        <Pop trigger="hover" position="top-center" content="根据扫码人数自动轮换微信号及提供相应数据统计分析功能">
          <Icon style={{ marginLeft: '5px', color: '#c8c9cc', fontSize: 16 }} type="help-circle" />
        </Pop>
      </Radio>
      {relatedType === RELATED_TYPE.LIVECODE ? (
        <div className={`${styleNamePrefix}  left-tab`}>
          <a className="cursor-link" onClick={openLiveCode}>
            {liveCode ? '重新选择' : '选择活码'}
          </a>
          {liveCode && (
            <Grid
              className={`${styleNamePrefix}__grid`}
              datasets={[liveCode]}
              columns={choosedColumn}
              ellipsis={true}
              rowKey="alias"
            />
          )}
          {!isValid && <FormError>请选择活码</FormError>}
        </div>
      ) : (
        <br />
      )}
    </>
  );
}
