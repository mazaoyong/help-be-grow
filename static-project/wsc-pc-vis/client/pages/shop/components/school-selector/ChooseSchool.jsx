import React, { useState, useEffect } from 'react';
import { Notify } from 'zent';
import isPromise from 'fns/is-promise';
import { findPageAllCampus } from './api';
import FilterFC from './Filter';
import FootFC from './Foot';
import List from './List';
import { assign, cloneDeep } from 'lodash';

// 可传入自定义Foot, Filter, List。
function SchoolChooser(props) {
  const { Foot = FootFC, Filter = FilterFC, data = {}, fetch = null, ...listProps } = props;

  const [datasets, setDatasets] = useState(assign({
    content: [],
    pageInfo: {
      pageSize: 6,
      current: 1,
      totalItem: 0,
    },
    filterInfo: {
      currentSelect: 0,
      searchValue: '',
    },
    selectInfo: {
      selectedRowKeys: [],
      selectedRows: [],
    },
    isContentEmpty: false,
  }, data));

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  const fetchData = ({ filterConditions = {}, pageConditions }) => {
    if (filterConditions.isContentEmpty) {
      setDatasets(assign({}, datasets, { isContentEmpty: true }));
      return;
    }
    setLoading(true);
    const { current, pageSize } = pageConditions;
    let asyncFetch = null;
    if (fetch && typeof fetch === 'function') {
      asyncFetch = fetch({ filterConditions, pageConditions });
    } else {
      const shopCampusQuery = {
        name: filterConditions.searchValue || '',
      };
      if (filterConditions.currentSelect) {
        shopCampusQuery['shopLifecycleStatus'] = filterConditions.currentSelect;
      }
      asyncFetch = findPageAllCampus({
        pageRequest: {
          pageNumber: current,
          pageSize: pageSize,
        },
        shopCampusQuery,
      });
    }

    return asyncFetch.then(res => {
      const results = assign({}, datasets, {
        content: res.content || [],
        pageInfo: {
          pageSize: pageSize,
          current: res.pageable ? res.pageable.pageNumber : pageConditions.current,
          totalItem: res.total || 0,
        },
        filterInfo: {
          currentSelect: filterConditions.currentSelect || 0,
          searchValue: filterConditions.searchValue || '',
        },
      });

      setDatasets(results);
      setLoading(false);
    }).catch(err => {
      Notify.error(err);
      setLoading(false);
    });
  };

  const onSubmit = (data) => {
    if (props.submit && typeof props.submit === 'function') {
      props.submit(data);
    }
  };

  const onClose = () => {
    props.close();
  };

  const onSelect = (selectedRowKeys, selectedRows, currentRow) => {
    const selectInfo = { selectedRowKeys, selectedRows, currentRow };
    if (props.select && typeof props.select === 'function') {
      const selectResult = props.select(selectInfo);
      if (isPromise(selectResult)) {
        setLoading(true);
        selectResult.then(selectiton => {
          setDatasets(assign({}, datasets, { selectInfo: getFinalSelections(selectiton || selectInfo) }));
          setLoading(false);
        // eslint-disable-next-line handle-callback-err
        }).catch(err => {
          console.error('err', err);
          setLoading(false);
        });
      } else {
        setDatasets(assign({}, datasets, { selectInfo: getFinalSelections(selectResult || selectInfo) }));
      }
    } else {
      setDatasets(assign({}, datasets, { selectInfo: getFinalSelections(selectInfo) }));
    }
  };

  const getFinalSelections = (selectInfo) => {
    const rowKey = listProps.rowKey || 'shopName';
    let fDataSelection = cloneDeep(selectInfo);
    if (fDataSelection && fDataSelection.selectedRowKeys) {
      fDataSelection['selectedRows'] = fDataSelection.selectedRowKeys.map(itemKey => {
        if (selectInfo && selectInfo.selectedRows && selectInfo.selectedRows.find(item => item[rowKey] === itemKey)) {
          return selectInfo.selectedRows.find(item => item[rowKey] === itemKey);
        } else {
          return datasets.selectInfo ? datasets.selectInfo.selectedRows.find(item => item[rowKey] === itemKey) : null;
        }
      });
    }

    return fDataSelection;
  };

  return <div >
    <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'space-between' }} className='dialog-head-panel'>
      {ComponentWrap(Filter, { datasets, fetchData })}
    </div>
    <div className='dialog-foot-body'>
      {!datasets.isContentEmpty && ComponentWrap(List, { onSelect, loading, datasets, fetchData, ...listProps })}
      {datasets.isContentEmpty && <div className="empty-content" >{!!listProps.emptyContent && listProps.emptyContent()}</div>}
    </div>
    <div className='dialog-foot-panel'>
      {ComponentWrap(Foot, { submit: () => onSubmit(datasets), onClose, datasets })}
    </div>
  </div>;
}

const ComponentWrap = (Com, props) => {
  if (typeof Com === 'function') {
    return <Com {...props}/>;
  } else if (React.isValidElement(Com)) {
    return React.cloneElement(Com, props);
  } else {
    return null;
  }
};

export default SchoolChooser;
