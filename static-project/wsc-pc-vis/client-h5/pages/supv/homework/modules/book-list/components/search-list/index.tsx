import { Icon, Field, List, Cell, Loading } from 'vant';
import { createComponent } from '@youzan/tany-vue';
import SearchListModel, { ISearchListModel, ISearchContentType } from './model';
import Empty from 'components/empty/index.vue';
import './style';

function SearchList(model: ISearchListModel) {
  const {
    loading,
    keyword,
    searchHasNext,
    searchContent,
    placeholder,
    isFocus,
    isShowPlaceholder,
    isInitLoading,
    setFocus,
    setKeyword,
    handleNextSearchList,
  } = model;
  const renderList = () => {
    return keyword.value.length > 0 ? (
      <div
        class="search-wrapper__list"
        onTouchstart={() => setFocus(false)}
      >
        {isInitLoading.value ? (
          <div class="search-wrapper__list-loading">
            <Loading size="20px">加载中...</Loading>
          </div>
        ) : (
          <List
            loading={loading.value}
            class="search-wrapper__list-wrapper"
            finished={!searchHasNext.value}
            onLoad={handleNextSearchList}
          >
            {searchContent.value.length > 0 ? (
              searchContent.value.map((item: ISearchContentType) => (
                <Cell
                  key={item.id}
                  title={item.title}
                  border={false}
                  class="search-wrapper__list-item"
                  url={`#/list/${item.id}`}
                  onClick={() => setKeyword('')}
                />
              ))
            ) : (
              <Empty desc="暂无作业本" />
            )}
          </List>
        )}
      </div>
    ) : null;
  };

  return (
    <div class="search-wrapper">
      {isFocus.value && (
        <div class="search-wrapper__overlay" />
      )}
      <div class="search-wrapper__container">
        {isShowPlaceholder.value ? (
          <div class="search-field-overlay" onTouchstart={() => setFocus(true)}>
            <Icon name="search" class="left-search" />
            <span class="search-field-overlay__placeholder">{placeholder}</span>
          </div>
        ) : null}

        <div class="search-field">
          <Field
            ref="fieldRef"
            class="search-field"
            value={keyword.value}
            onClear={() => setKeyword('')}
            onInput={(val: string) => setKeyword(val)}
          >
            <div slot="left-icon">
              <Icon name="search" class="left-search" />
            </div>
            {keyword.value.length > 0 && (
              <div
                slot="right-icon"
                onClick={() => {
                  setKeyword('');
                  setFocus(true);
                }}
              >
                <Icon name="clear" class="right-close" />
              </div>
            )}
          </Field>
        </div>
        <a
          v-show="overlayShow"
          class="cancel-btn"
          onClick={() => {
            setKeyword('');
            setFocus(false);
          }}
        >
          取消
        </a>
        {renderList()}
      </div>
    </div>
  );
}

export default createComponent(SearchList, {
  model: SearchListModel,
});
