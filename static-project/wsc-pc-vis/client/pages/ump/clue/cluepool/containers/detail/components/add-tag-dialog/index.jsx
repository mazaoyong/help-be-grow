// 标签选择弹窗
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Tag, Button, Notify, BlockLoading } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import { findTagGroupPageAPI, updateClueTagsAPI } from '../../../../api';
import getCurClueId from '../../utils/get-cur-clueid';
import './style.scss';
import SamWrapper from '../../../../components/sam-wrapper';

const { DialogFooter } = Dialog;
// 标签组
const TagGroup = ({ data: { name, multiSelect, tagDTOS }, selected, onChange }) => {
  const isSingleSelect = useMemo(() => {
    return multiSelect === 0 ? null : '(可多选)';
  }, [multiSelect]);

  const tagIds = useMemo(() => {
    return tagDTOS.map(({ tagId }) => tagId);
  }, [tagDTOS]);

  const isSelected = useCallback((tagId) => {
    return selected.includes(tagId);
  }, [selected]);

  const validate = useMemo(() => {
    if (!multiSelect) {
      if (tagDTOS.filter(tag => selected.includes(tag.tagId)).length > 1) {
        return false;
      }
    }
    return true;
  }, [multiSelect, selected, tagDTOS]);

  const handleTagClick = useCallback((tagId, remove = false) => {
    if (remove) {
      onChange(selected.filter(sel => sel !== tagId));
    } else {
      if (!multiSelect) {
        onChange([...selected.filter(sel => !tagIds.includes(sel)), tagId]);
      } else {
        onChange([...new Set([...selected, tagId])]);
      }
    }
  }, [multiSelect, onChange, selected, tagIds]);

  return (
    <section className="tags-dialog__group">
      <p className="tags-dialog__group__title">
        <span>{name}{isSingleSelect}</span>
        {!validate && (<span className="has-error">该分组只能选择一个标签</span>)}
      </p>
      <ul className="tags-dialog__group__content">
        {tagDTOS.map(({ tagId, name }) => (
          <li
            key={tagId}
            className={`tags-dialog__group__item ${isSelected(tagId) ? 'active' : ''}`}
            onClick={() => handleTagClick(tagId, isSelected(tagId))}
          >
            <Tag
              style={{
                borderColor: isSelected(tagId) ? '#3388FF' : '#bbb',
                backgroundColor: isSelected(tagId) ? '#3388FF' : '#fff',
              }}
              outline={!isSelected(tagId)}
            >
              {name}
            </Tag>
          </li>
        ))}
      </ul>
    </section>
  );
};

/**
 *
 * @param {import("@youzan/ebiz-components").IDialogChildrenProps} param
 */
const AddTagDialog = ({ dialogref, data }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(data.selected || []);
  const clueId = getCurClueId();

  const handleRefresh = useCallback(() => {
    findTagGroupPageAPI({
      pageNumber: 1,
      pageSize: 100,
      sort: {
        orders: [{
          direction: 'DESC',
          property: 'updated_at',
        }],
      },
      countEnabled: true,
    }).then((res = []) => {
      setOptions(res.content);
    }).catch(msg => {
      Notify.error(msg || '获取标签列表失败');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleSelectedChange = useCallback((selected) => {
    setSelected(selected);
  }, []);

  const handleSave = useCallback(() => {
    setLoading(true);
    updateClueTagsAPI(clueId, selected)
      .then(() => {
        Notify.success('标签更新成功');
        dialogref.submit();
      })
      .catch(msg => {
        Notify.error(msg || '更新标签失败');
        setLoading(false);
      });
  }, [clueId, dialogref, selected]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <div className="tags-dialog__wrapper">
      <BlockLoading loading={loading}>
        <article className="tags-dialog">
          {options.map(option => (
            <TagGroup
              key={option.groupId}
              data={option}
              selected={selected}
              onChange={handleSelectedChange}
            />
          ))}
          {options.length === 0 && (
            <p className="tags-dialog__empty">暂无标签 <a href={`${_global.url.v4}/vis/ump/clue/tags`} target="_blank" rel="noopener noreferrer" >去创建</a></p>
          )}
        </article>
      </BlockLoading>
      <DialogFooter>
        <div>
          <span className="cursor-link" onClick={() => setSelected([])}>清空</span>
          <SamWrapper name="编辑标签">
            <span className="tags-dialog__link-group">
              <a onClick={handleRefresh}>刷新</a>
              <a href="/v4/vis/ump/clue/tags" target="_blank" rel="noopener noreferrer">添加标签</a>
            </span>
          </SamWrapper>
        </div>
        <div>
          <Button onClick={() => dialogref.close()}>取消</Button>
          <Button type="primary" loading={loading} onClick={handleSave} disabled={options.length === 0}>保存</Button>
        </div>
      </DialogFooter>
    </div>
  );
};

export default AddTagDialog;
