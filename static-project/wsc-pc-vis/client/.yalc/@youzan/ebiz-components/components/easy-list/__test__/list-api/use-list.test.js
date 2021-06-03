import React from 'react';
import qs from 'qs';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { renderHook, cleanup as cleanupHooks, act as actHooks } from '@testing-library/react-hooks';
import EasyList from '../../index';

const getUrl = () => new URL('https://www.youzan.com/edu');
Object.defineProperty(window, 'location', {
  value: getUrl(),
});
const resetURL = () => {
  // 清空url
  location.href = getUrl();
};
beforeEach(resetURL);
afterEach(() => {
  cleanup();
  cleanupHooks();
});

const { List, useList } = EasyList;
const initFilter = {
  dreamCar: 'Mercedes',
  favoriteBook: 'Steve Jobs',
  highlyRecommendBooks: ['Design under design', 'Black and white'],
};
const testFilter = {
  page: 2,
  pageSize: 30,
  strNumber: '996',
  dreamCar: 'Audi',
};
const resolveSubmit = () => {
  return Promise.resolve({
    dataset: [],
    pageInfo: {
      current: 1,
      pageSize: 20,
      total: 0,
    },
  });
};
const rejectSubmit = () => Promise.reject('error in request');
const jsError = () => {
  throw new Error('error in js running');
};
const renderEasyList = (props) => {
  const listRef = React.createRef(null);
  /** @type {import('@testing-library/react').RenderResult<import('@testing-library/react').queries>} */
  let list;
  act(() => {
    list = render(
      <div data-testid="easy-list-wrapper">
        <List ref={listRef} onError={() => void 0} {...props}>
          <p>list的内容</p>
        </List>
      </div>
    );
  });
  return {
    list,
    listRef,
  };
};
describe('测试List', () => {
  test('测试渲染', async () => {
    const { list } = renderEasyList({ onSubmit: resolveSubmit });
    await waitFor(() => {
      expect(
        list.getByTestId('easy-list-wrapper').querySelector('p').innerHTML.includes('list的内容')
      ).toBe(true);
    });
  });

  test('测试defaultFilter', async () => {
    const { listRef } = renderEasyList({ onSubmit: resolveSubmit, defaultFilter: initFilter });
    await waitFor(() => {
      expect(listRef.current.state.filter).toMatchObject(initFilter);
    });
  });

  test('测试onError', async () => {
    const errorHandle = jest.fn((e) => {
      console.log('error type?', typeof e);
    });
    const { list } = renderEasyList({ onSubmit: rejectSubmit, onError: errorHandle });

    act(() => {
      list.rerender(
        <List onSubmit={jsError} onError={errorHandle}>
          <p>list的内容</p>
        </List>
      );
    });

    await waitFor(() => {
      expect(errorHandle.mock.calls.length).toBe(2);
    });
  });
});

/**
 * @param {Partial<import('../../types/list').IListProps>} props
 */
const renderUseList = (props) => {
  const fetchListMock = jest.fn(resolveSubmit);
  /** @type {import('@testing-library/react-hooks').RenderHookResult<any, import('../../types/list').IListContext>} */
  let useListRes;
  actHooks(() => {
    useListRes = renderHook(() =>
      useList({ onSubmit: fetchListMock, defaultFilter: initFilter, ...props })
    );
  });
  return {
    fetchListMock,
    ...useListRes,
  };
};

describe('测试useList', () => {
  test('测试URL初始化', () => {
    location.search = qs.stringify(testFilter, { addQueryPrefix: true });
    const { result } = renderUseList({ defaultFilter: {} });
    // 只有page相关的会被转换成数字
    expect(result.current.state).toMatchObject({
      page: 2,
      filter: {
        pageSize: 30,
        strNumber: '996',
        dreamCar: 'Audi',
      },
    });
  });

  test('mode为none', () => {
    renderUseList({ mode: 'none', defaultFilter: testFilter });
    expect(location.search).toBe('');
  });

  test('mode为hash', async () => {
    location.hash = '#/?';
    const historyReplaceStateMock = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { replaceState: historyReplaceStateMock },
    });
    renderUseList({ mode: 'hash', fetchInInit: false, defaultFilter: testFilter });
    await waitFor(() => {
      expect(historyReplaceStateMock).toBeCalledWith(
        null,
        '',
        '/edu#/?page=2&pageSize=30&strNumber=996&dreamCar=Audi'
      );
    });

    location.hash = '#/';
    renderUseList({ mode: 'hash', fetchInInit: false, defaultFilter: testFilter });
    await waitFor(() => {
      expect(historyReplaceStateMock).toBeCalledWith(
        null,
        '',
        '/edu#/?page=2&pageSize=30&strNumber=996&dreamCar=Audi'
      );
    });
  });

  test('测试query adaptors', () => {
    const normalizerMock = jest.fn((filter) => filter);
    const { result } = renderUseList({ filterNormalizer: normalizerMock });
    const prevFilter = result.current.state.filter;
    expect(prevFilter).toMatchObject(initFilter);
    const newFilter = {
      ...prevFilter,
      dreamCar: 'Audi',
    };
    act(() => {
      result.current.action.setFilter(newFilter);
    });
    expect(normalizerMock.mock.calls.length).toEqual(2);
    expect(result.current.state.filter).toMatchObject(newFilter);
  });

  test('测试list.current API', async () => {
    const { fetchListMock, result } = renderUseList();
    // 测试页面加载
    const curFilter = result.current.state.filter;
    expect(curFilter).toMatchObject(initFilter);
    const newFilter = { ...curFilter, fruit: 'apple', dreamCar: 'Audi' };
    act(() => {
      result.current.action.setFilter(newFilter);
    });
    expect(result.current.state.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.state.filter).toMatchObject(newFilter);
      expect(fetchListMock.mock.calls.length).toBe(2);
    });

    // 翻页
    act(() => {
      // global state 不会发起请求
      result.current.action.setGlobalState({ selectedRowKeys: ['1', '2'] });
      result.current.action.setPage(2);
    });
    expect(result.current.state.page).toBe(2);
    expect(fetchListMock.mock.calls.length).toBe(3);

    // 设置loading
    act(() => {
      result.current.action.setLoading();
    });
    expect(result.current.state.loading).toBe(true);
    act(() => {
      result.current.action.stopLoading();
    });
    expect(result.current.state.loading).toBe(false);
    expect(fetchListMock.mock.calls.length).toBe(3);

    // 设置datasets
    act(() => {
      result.current.action.setDataset([
        { name: 'Jack Ma', id: 996 },
        { name: 'Pony Ma', id: 'duplicator' },
      ]);
    });
    expect(result.current.state.dataset.length).toBe(2);
    expect(fetchListMock.mock.calls.length).toBe(3);

    // 测试刷新
    act(() => {
      result.current.action.refresh();
    });
    expect(result.current.state.loading).toBe(true);
    expect(result.current.state.page).toBe(2);
    await waitFor(() => {
      expect(result.current.state.loading).toBe(false);
      expect(fetchListMock.mock.calls.length).toBe(4);
    });
  });

  test('测试延迟请求API', async () => {
    const { fetchListMock, result } = renderUseList({ fetchInInit: false, delay: 100 });
    expect(fetchListMock.mock.calls.length).toBe(0);
    act(() => {
      // 让list发起请求
      result.current.action.refresh();
      result.current.action.refresh();
    });
    expect(fetchListMock.mock.calls.length).toBe(0);
    await waitFor(() => {
      expect(fetchListMock.mock.calls.length).toBe(1);
    });
  });
});
