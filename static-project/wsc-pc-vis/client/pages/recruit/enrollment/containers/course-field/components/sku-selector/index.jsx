import { Pop, Table } from '@zent/compat';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Button, Notify } from 'zent';

export default function SkuSelector({ children, data, extColumns, onSelect, initialValue, skuErrors, dialogOpen }) {
  // auto select when have only one selection
  if (data.length === 1) {
    initialValue = (data[0] && data[0].id) ? [data[0].id] : [];
  }
  const [ visible, setVisible ] = useState(false);
  const [ position, setPosition ] = useState('top-center');
  const handleVisibleChange = vis => {
    setVisible(vis);
  };
  const handlePositionChange = pos => {
    setPosition(pos);
  };
  useEffect(() => {
    if (dialogOpen > 0) {
      handleVisibleChange(true);
    }
  }, [dialogOpen]);

  return (
    <Pop
      trigger="click"
      position={position}
      visible={visible}
      className="edu-enrollment-sku-select-pop"
      onVisibleChange={handleVisibleChange}
      content={<SkuList
        data={data}
        initialValue={initialValue}
        extColumns={extColumns}
        onSelect={onSelect}
        onVisibleChange={handleVisibleChange}
        onPositionChange={handlePositionChange}
        skuErrors={skuErrors}
      />}
    >
      {children}
    </Pop>
  );
}

function SkuList({
  data,
  initialValue,
  extColumns,
  onSelect,
  onSubmit,
  onVisibleChange,
  onPositionChange,
  skuErrors = {},
}) {
  const [ skuIds, setSkuIds ] = useState(initialValue);
  const columns = getColumns(data, extColumns, skuErrors);
  const datasets = formatDatasets(data);
  const handleCancel = () => {
    onVisibleChange(false);
  };

  const handleSubmit = () => {
    if (!skuIds || skuIds.length === 0) {
      return Notify.error('请选择一个规格');
    }
    onSelect(skuIds);
    onVisibleChange(false);
  };

  useLayoutEffect(() => {
    const doms = document.getElementsByClassName('zent-pop');
    if (doms && doms[0]) {
      setTimeout(() => {
        const { y } = doms[0].getBoundingClientRect();
        if (y < 0) {
          onPositionChange('bottom-left');
        }
      }, 0);
    }
  }, [onPositionChange]);
  return (
    <div>
      <Table
        className="edu-enrollment-sku-select-list"
        selection={{
          isSingleSelection: true,
          selectedRowKeys: skuIds,
          onSelect: (selectedkeys) => {
            setSkuIds(selectedkeys);
          },
        }}
        getRowConf={({ id }) => {
          return {
            canSelect: !(skuErrors && skuErrors[id]),
          };
        }}
        columns={columns}
        pageInfo={null}
        datasets={datasets}
        rowKey="id"
      />
      <div className="edu-enrollment-sku-select">
        <Button onClick={handleCancel}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>确定</Button>
      </div>
    </div>
  );
}

function getColumns(datasets, extColumns, skuErrors) {
  const columns = [];
  datasets.forEach(item => {
    let index = 1;
    while (true) {
      const kOfK = 'k' + index;
      const kOfV = 'v' + index;
      const vOfK = item[kOfK];
      if (!vOfK) {
        break;
      }
      if (!columns[index - 1]) {
        if (index === 1) {
          columns[0] = {
            title: vOfK,
            name: kOfV,
            width: '120px',
          };
        } else {
          columns[index - 1] = {
            title: vOfK,
            name: kOfV,
            width: '60px',
          };
        }
      }
      index++;
    }
  });
  const formattedExtColumns = extColumns.map(extColumn => {
    if (!extColumn.bodyRender) {
      return extColumn;
    }
    return {
      ...extColumn,
      bodyRender: data => extColumn.bodyRender(data, skuErrors[data.id]),
    };
  });
  return extColumns ? columns.concat(formattedExtColumns) : columns;
}

function formatDatasets(datasets) {
  datasets.sort((prevItem, curItem) => {
    let index = 1;
    while (true) {
      const prevValue = prevItem['v' + index];
      const curValue = curItem['v' + index];
      if (!prevValue || !curValue) {
        return 1;
      }
      if (curValue === prevItem) {
        return 0;
      }
      index++;
    }
  });
  return datasets;
}
