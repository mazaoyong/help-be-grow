import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  Grid,
  Button,
  IGridColumn,
  Notify,
  Radio,
  RadioGroup,
  IGridOnChangeConfig,
  closeDialog,
} from 'zent';
import buildUrl from '@youzan/utils/url/buildUrl';
import { getMicroPageList } from '../../api';
import SearchInput from 'components/search-input';
import YZLocalStorage from '@youzan/utils/browser/local_storage';
import './styles.scss';

const { openDialog } = Dialog;
const DIALOG_ID = 'micropage';
const initialPageInfo = {
  total: 0,
  current: 1,
  pageSize: 8,
};

interface IMicroPageProps {
  onChoose: (data: any) => void;
}
function MicroPage(props: IMicroPageProps) {
  const { onChoose } = props;
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [keywordText, setKeywordText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [chooseId, setChooseId] = useState(0);

  const requestData = useCallback(() => {
    setLoading(true);
    getMicroPageList({
      p: pageInfo.current,
      v: 2,
      keyword,
      _: Date.now(),
    })
      .then(res => {
        setPageInfo({
          ...pageInfo,
          total: res.total_items,
        });
        setList(res.data_list);
      })
      .catch(() => {
        Notify.error('获取列表失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageInfo.current, keyword]);
  const handleSearchChange = e => {
    setKeywordText(e.target.value);
  };
  const handleSearch = () => {
    setKeyword(keywordText);
  };
  const onOk = () => {
    closeDialog(DIALOG_ID);
    onChoose(list.filter((item: any) => item.id === chooseId));
  };
  const createNewForm = () => {
    if (YZLocalStorage.getItem('choose_new_editor') === '1') {
      window.open(`${_global.url.v4}/shop/decorate#/create/209`);
    } else {
      window.open(`${_global.url.www}/showcase/feature/design#/create/209`);
    }
  };
  useEffect(() => {
    requestData();
  }, [requestData]);
  const choosedColumn = useMemo<IGridColumn[]>(() => {
    return [
      {
        title: '微页面名称',
        width: '288px',
        nowrap: true,
        textAlign: 'left',
        bodyRender: data => {
          return (
            <div>
              <Radio value={data.id} />
              <a
                href={buildUrl(data.url, '', _global.kdtId)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.title}
              </a>
            </div>
          );
        },
      },
      {
        title: '创建时间',
        name: 'created_time',
        width: '240px',
        textAlign: 'right',
      },
    ];
  }, []);
  const onGridChange = (option: IGridOnChangeConfig) => {
    const { current } = option;
    setPageInfo({ ...pageInfo, current: current || 1 });
  };
  return (
    <div className="micro-page">
      <div className="micro-page-header">
        <div className="micro-page-header__left">
          <Button onClick={createNewForm}>新建表单</Button>
          <a className="cursor-link" href="javascript:;" onClick={() => requestData()}>
            刷新
          </a>
        </div>
        <div className="micro-page-header__right">
          <SearchInput
            value={keywordText}
            placeholder="搜索微页面"
            onChange={handleSearchChange}
            onPressEnter={handleSearch}
          />
        </div>
      </div>
      <div className="micro-page-content">
        <RadioGroup
          onChange={e => {
            setChooseId(e.target.value || 0);
          }}
          value={chooseId}
        >
          <Grid
            columns={choosedColumn}
            datasets={list}
            rowKey={'alias'}
            onChange={onGridChange}
            loading={loading}
            pageInfo={pageInfo}
            emptyLabel={
              <span>
                没有找到微页面{`"${keyword}"`}，你可以去
                <a className="cursor-link" onClick={createNewForm}>
                  新建
                </a>
              </span>
            }
          />
        </RadioGroup>
      </div>
      <div className="micro-page-footer">
        <Button onClick={() => closeDialog(DIALOG_ID)}>取消</Button>
        <Button type="primary" onClick={onOk}>
          确定
        </Button>
      </div>
    </div>
  );
}

export default function chooseDialog(config) {
  openDialog({
    dialogId: DIALOG_ID,
    title: '选择微页面',
    children: <MicroPage onChoose={config.onChoose} />,
  });
}
