
import { Form, Table, ITableColumn } from '@zent/compat';
// 添加内容弹窗
import React, { FC, useEffect, useState, useCallback } from 'react';
import { Button, Tabs, Notify, Dialog } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { isEduHqStore } from '@youzan/utils-shop';
import { visPush } from 'fns/router';
import { isInStoreCondition, ShowWrapper } from 'fns/chain';
import SearchInput from 'components/search-input';
import { LockWrap } from '@youzan/ebiz-components';
import { LockType } from '@youzan/ebiz-components/es/lock-wrap';
import { ADD_DIALOG_ID, tabsOptions } from '../../constants';
import { renderColumnImgItem } from '../../utils';
import { getLive } from '../../../../api/pct/live';
import { getContentLists } from '../../api';
import { chainSupportSingle } from '../../../../common/chain';
import { SELLER_TYPE as SELLER_TYPE_MAP } from '../../../../common/constants';

import './style.scss';

const { Field, CheckboxField, createForm } = Form;
const { closeDialog } = Dialog;
const errMsg = '网络错误';
const PAGE_SIZE = 5;
const TAB_MAP = {
  1: 'text',
  2: 'audio',
  3: 'video',
  4: 'live',
};

const ColumnNoticeCheckForm = () => {
  return (
    <Form className="checkbox-form">
      <Field name="column_notice" component={CheckboxField} value={false}>
        开启专栏更新通知
      </Field>
    </Form>
  );
};
const CheckBoxForm = createForm()(ColumnNoticeCheckForm);

interface IProps {
  alias: String;
  isLock: boolean;
  author: string;
  showColumnNoticeConf: boolean;
  onSubmit: (selected: any, showColumnNotice: boolean) => Promise<any>;
}

const AddContent: FC<IProps> = (props) => {
  const { isLock, alias, author, showColumnNoticeConf, onSubmit } = props;
  const [query, setQuery] = useState({
    title: '',
    activeId: 1,
    page: 1,
  });
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [datasets, setDatasets] = useState([]);
  const [selected, setSelected] = useState([] as { alias: string, type: number }[]);
  const [total, setTotal] = useState(0);
  // 是否配置专栏更新提醒
  const [columnNotice, setColumnNotice] = useState(false);

  // 获取列表
  const getLists = useCallback(() => {
    const { activeId, page, title } = query;
    setLoading(true);
    let getData;

    if (activeId !== 4) {
      getData = getContentLists({
        pageNumber: page,
        title,
        mediaType: activeId,
        pageSize: PAGE_SIZE,
      });
    } else {
      getData = getLive({
        query: {
          title,
        },
        pageRequest: {
          pageNumber: page,
          pageSize: PAGE_SIZE,
          sort: {
            orders: [
              {
                direction: 'DESC',
                property: 'created_at',
              },
            ],
          },
        },
      });
    }
    getData
      .then(data => {
        setDatasets(data.content);
        setTotal(data.total);
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  const onTabChange = useCallback(id => {
    setQuery({
      ...query,
      activeId: id,
      page: 1,
    });
  }, [query]);

  const handleAddClick = useCallback(id => {
    closeDialog(ADD_DIALOG_ID);
    visPush(
      TAB_MAP[id] === 'live'
        ? `live/add?column=${alias}`
        : `content/add/${TAB_MAP[id]}?column=${alias}&author=${author}`
    );
  }, [alias, author]);

  const onTableChange = useCallback(conf => {
    setQuery({
      ...query,
      page: conf.current,
    });
  }, [query]);

  const onSearchChange = useCallback(evt => {
    setQuery({
      ...query,
      title: evt.target.value,
      page: 1,
    });
  }, [query]);

  const handleSelect = (_, selectedRows) => {
    const selected = selectedRows.map(item => {
      return {
        alias: item.alias,
        type: item.mediaType || 4,
      };
    });
    setSelected(selected);
  };

  const onChangeNotice = data => setColumnNotice(data && data.column_notice);

  // 不可选
  const getRowConf = (rowData) => {
    return {
      canSelect: !(!!rowData.columnTitle || !!rowData.column_title),
      rowClass: '',
    };
  };

  useEffect(() => {
    getLists();
  }, [getLists]);

  const columns = [
    {
      title: tabsOptions[query.activeId - 1].title,
      width: '45%',
      textAlign: 'left',
      bodyRender: item => {
        return renderColumnImgItem(item, true, true);
      },
    },
    {
      title: '价格(元)',
      width: '10%',
      textAlign: 'right',
      bodyRender: item => {
        // 根据sellerTypes来判断商品是否是仅专栏售卖，如果是仅专栏售卖就不展示价格
        const sellerType = item.seller_type || 0;
        const showPrice = sellerType !== SELLER_TYPE_MAP.COLUMN;
        if (showPrice) {
          return (
            <span>
              {(item.price / 100).toFixed(2)}
            </span>
          );
        }
        return '-';
      },
    },
    {
      title: '不可选原因',
      bodyRender: item => {
        const columnTitle = item.columnTitle || item.column_title;
        const columnUrl = item.columnAlias || item.column_alias;
        const url = `${_global.url.v4}/vis/course/column/manage/${columnUrl}#/?pageSize=20&page=1`;
        if (columnTitle) {
          return (
            <span className="ellipsis-2" style={{ width: '100%' }}>
              已关联《<a href={url} rel="noopener noreferrer" target="_blank">{columnTitle}</a>》专栏
            </span>
          );
        }
        return '-';
      },
    },
  ] as ITableColumn[];

  return (
    <div className="add-content-dialog-content">
      <Tabs
        activeId={query.activeId}
        onChange={onTabChange}
        tabs={tabsOptions}
      />
      <div className="app-filter-region">
        <div className="list-filter clearfix">
          <LockWrap
            key="new"
            lockType={LockType.PCT_SHOP}
            isLock={isLock}
          >
            <ShowWrapper isInStoreCondition={
              query.activeId !== 4 || !isInStoreCondition({
                supportHqStore: true,
              })
            }>
              <SamButton
                type="primary"
                name="新建内容"
                onClick={() => { handleAddClick(query.activeId); }}
              >
                新建{tabsOptions[query.activeId - 1].title}
              </SamButton>
            </ShowWrapper>
          </LockWrap>
          <SearchInput
            placeholder="内容名称"
            onPressEnter={onSearchChange}
          />
        </div>
      </div>
      <Table
        className="column-content-add-table"
        columns={columns}
        datasets={datasets}
        loading={loading}
        emptyLabel="还没有内容"
        onChange={onTableChange}
        rowKey="alias"
        getRowConf={getRowConf}
        selection={{
          selectedRowKeys: selected.map(item => item.alias),
          needCrossPage: true,
          onSelect: handleSelect,
        }}
        pageInfo={{
          limit: PAGE_SIZE,
          current: query.page,
          total,
        }}
      />
      <div className="modal-footer">
        {showColumnNoticeConf && (
          <ShowWrapper isInStoreCondition={chainSupportSingle || isEduHqStore}>
            <CheckBoxForm
              onChange={onChangeNotice}
            />
          </ShowWrapper>
        )}
        <Button
          type="primary"
          loading={btnLoading}
          onClick={() => {
            setBtnLoading(true);
            // 临时逻辑延迟2秒后刷新
            onSubmit(selected, columnNotice).finally(() => {
              setBtnLoading(false);
            });
          }}
          disabled={selected.length === 0}
        >
          确定
          {selected.length > 0 && `(${selected.length})`}
        </Button>
      </div>
    </div>
  );
};

export default AddContent;
