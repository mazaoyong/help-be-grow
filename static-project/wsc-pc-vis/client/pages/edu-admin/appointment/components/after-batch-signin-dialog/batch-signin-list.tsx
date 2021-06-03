import { Pop } from '@zent/compat';
import React, { FC, useState, useCallback, useMemo } from 'react';
import { Icon } from 'zent';
import { EasyList } from '@youzan/ebiz-components';
import { IBatchDetailDataProps } from './types';
import { IEasyGridColumn, IFormatData } from '@youzan/ebiz-components/es/types/easy-list';

const { List, EasyGrid } = EasyList;

const BatchSigninList: FC<{ data: IBatchDetailDataProps[], mode: 'schedule' | 'educlass' }> = (props) => {
  const { data = [], mode } = props;
  const [ pageShow, setPageShow ] = useState<boolean>(false);

  const columns = useMemo<IEasyGridColumn[]>(() => [
    {
      title: '学员',
      name: 'studentName',
    },
    {
      title: '失败原因',
      bodyRender(data) {
        const { checkCode, extMsg = '', msg } = data;
        return <span>
          {mode === 'schedule' && (checkCode === 30 || checkCode === 31 || checkCode === 100) ? <>
            {msg}
            { extMsg && <Pop trigger='hover' content={extMsg} >
              <Icon type='help-circle' style={{ color: '#A0A0A0', marginLeft: '2px' }}/>
            </Pop> }
          </> : msg}
        </span>;
      },
    },
  ], [mode]);

  const onFetch = useCallback<(params: any) => Promise<IFormatData>>((params) => {
    const pageNumber = params.page || 1;
    const pageSize = 5;
    const currentPageData = data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    if (data.length > pageSize && !pageShow) {
      setPageShow(true);
    } else if (data.length <= pageSize && pageShow) {
      setPageShow(false);
    }
    return new Promise((resolve) => {
      resolve({
        dataset: currentPageData,
        pageInfo: {
          page: pageNumber,
          pageSize: pageSize,
          total: data.length,
        },
      });
    });
  }, [ data ]);

  return <List mode='none' defaultFilter={{ pageSize: 5 }} onSubmit={onFetch}>
    <EasyGrid
      pageable={pageShow}
      paginationType={'lite'}
      columns={columns}
    />
  </List>;
};

export default BatchSigninList;
