
import { Select, Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import { getCourseTagApi } from '../../../api/course-manage';
import openDemoImg from '../../../components/demo-image';
import { DEMO_IMG, DEMO_TEXT } from '../../constants';

const { getControlGroup } = Form;

const maxTagTextLength = 6;

const createOptions = keyword => ({
  text: `${keyword}`,
  tag: `${keyword}`,
});

class TagFieldComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remoteTags: [],
      tags: [],
      value: [],
    };
  }

  componentDidMount() {
    this.fetchTags();
  }

  // 获取课程标签
  fetchTags = () => {
    getCourseTagApi().then(data => {
      let tags = data.map(item => {
        return {
          tag: item.tag,
          text: item.tag,
        };
      });
      this.setState({
        tags,
        remoteTags: tags,
      });
      this.filterSelectedTags(tags);
    });
  };

  filterSelectedTags = allTags => {
    let value = this.props.value;
    value.forEach((selectedTag, index) => {
      if (
        findIndex(allTags, tag => {
          return tag.text === selectedTag.tag;
        }) === -1
      ) {
        value.splice(index, 1);
        this.props.onChange(value);
      }
    });
  };

  onTagChange = (evt, data) => {
    let value = this.props.value;
    let { remoteTags } = this.state;

    if (!value.length) {
      value.push({ tag: data.text });
    } else {
      if (
        findIndex(value, val => {
          return val.tag === data.text;
        }) === -1
      ) {
        value.push({ tag: data.text });
      }
    }

    value.forEach(val => {
      if (
        findIndex(remoteTags, rt => {
          return rt.tag === val.tag;
        }) === -1
      ) {
        remoteTags.push({ text: val.tag, tag: val.tag });
      }
    });

    this.props.onChange(value);
    this.setState({
      tags: remoteTags,
    });
  };

  onTagDelete = data => {
    let value = this.props.value;
    value = value.filter(item => item.tag !== data.text);
    this.props.onChange(value);
  };

  onTagsAsyncFilter = keyword => {
    let { remoteTags } = this.state;
    let tmpTags = [];
    keyword = keyword.substring(0, maxTagTextLength);
    /** @fixme @戴勇：在升级到zent@7.4.0版本后改回使用Select自带的filter过滤 */
    const filteredTags = remoteTags.filter(tag => tag.text.includes(keyword));
    this.setState({
      tags: filteredTags,
    });

    setTimeout(() => {
      let newOption = createOptions(keyword);

      if (
        findIndex(filteredTags, tag => {
          return tag.text === newOption.text;
        }) === -1
      ) {
        tmpTags.push(newOption);
      }
      this.setState({
        tags: filteredTags.concat(tmpTags),
      });
    }, 500);
  };

  filterHandler = (item, keyword) => {
    keyword = keyword.substring(0, maxTagTextLength);
    return `${item.text}`.includes(keyword);
  };

  formatOptions = () => {
    let { remoteTags } = this.state;
    this.setState({
      tags: remoteTags,
    });
  };

  render() {
    let { tags } = this.state;
    let { value } = this.props;
    let val = [];
    const totalTags = [].concat(tags);
    value.map(item => {
      if (totalTags && !totalTags.find(tagItem => tagItem.tag === item.tag)) {
        totalTags.push(item.tag);
      }
      val.push(item.tag);
    });
    return (
      <div>
        <Select
          data={totalTags}
          value={val}
          tags
          autoWidth
          optionValue="tag"
          placeholder="请选择标签"
          emptyText="木有找到这个标签"
          className="select-large slt"
          popupClassName="select-large__popup"
          onChange={this.onTagChange}
          onDelete={this.onTagDelete}
          onAsyncFilter={this.onTagsAsyncFilter}
          filter={this.filterHandler}
          onOpen={this.formatOptions}
        />
        {/* <p className="help-inline">
          <a href="javascript:;" onClick={() => this.fetchTags(true)}>
            刷新
          </a>
        </p> */}
        <div className="help-tip">
          可以输入如：5-15岁、初级钢琴基础、一对一等、显示在线下课商品下一行。
          <Pop
            trigger="click"
            content={openDemoImg(DEMO_IMG.TAG, DEMO_TEXT.TAG)}
            position="right-top"
            className='course-example-pop'
          >
            <a href="javascript:;">查看示例</a>
          </Pop>
        </div>
      </div>
    );
  }
}

export default getControlGroup(TagFieldComponent);
