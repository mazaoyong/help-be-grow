import React, { Component } from 'react';
import { Input, Pagination, Button, Notify, BlockLoading } from 'zent';
import CardService from './CardService';
import { getCourseList } from '../../api/reserve';

export default class PanelServiceSelect extends Component {
  state = {
    current: 1,
    totalItem: 0,
    pageSize: 20,
    loading: true,
    searchValue: '',
    courseList: [],
    choosed: {},
  };

  scrollContainerRef = React.createRef();

  getCourseList = option => {
    const { searchValue, current, pageSize } = this.state;
    const param = {
      courseType: 0, // 课程类型：0：体验课 1：正式课 2：全部
      soldStatus: 2, // 出售状态： -1： 未上架 0： 在售 1： 售罄 2： 全部
      title: searchValue,
      page: current,
      size: pageSize,
      ...option,
    };
    this.setState({ loading: true });
    getCourseList(param)
      .then(({ content, total }) => {
        this.setState({ courseList: content, totalItem: total });
      })
      .catch(msg => {
        Notify.error(msg);
      })
      .finally(() => {
        this.setState({ loading: false });
        this.scrollToTop(); // 滚动到初始位置
      });
  };

  chooseService = () => {
    const { choosed } = this.state;
    const { onChange, closeDialog } = this.props;
    onChange(choosed);
    closeDialog();
  };

  onPressEnter = () => {
    this.setState({ current: 1 });
    this.getCourseList({ page: 1 });
  };

  onChangePage = page => {
    this.setState({ current: page });
    this.getCourseList({ page: page });
  };

  scrollToTop = () => {
    if ('scrollBehavior' in document.documentElement.style) {
      this.scrollContainerRef.current.scrollTo(0, 0);
    }
  };

  componentDidMount() {
    const { value } = this.props;
    this.setState({ choosed: value });
    this.getCourseList();
  }

  render() {
    const { courseList, choosed, searchValue, loading } = this.state;
    return (
      <div className="panel-service-select">
        <div className="panel-service-select__search">
          <div className="panel-service-select__search-input">
            <Input
              icon="search"
              value={searchValue}
              onChange={e => this.setState({ searchValue: e.target.value })}
              onPressEnter={this.onPressEnter}
              placeholder="请搜索"
            />
            {/* <span className="anel-service-select__search-icon" /> */}
          </div>
        </div>
        <BlockLoading loading={loading}>
          <div className="panel-service-select__content" ref={this.scrollContainerRef}>
            {courseList.map((course, index) => {
              return (
                <CardService
                  key={index}
                  service={course}
                  onSelect={() => this.setState({ choosed: course })}
                  isSelect={course.alias === choosed.alias}
                />
              );
            })}
            {!courseList.length &&
              !loading && <div className="panel-service-select__empty">未找到数据</div>}
          </div>
        </BlockLoading>
        <Pagination
          current={this.state.current}
          totalItem={this.state.totalItem}
          pageSize={this.state.pageSize}
          onChange={this.onChangePage}
        />
        <div className="panel-service-select__action">
          <Button type="primary" onClick={this.chooseService}>
            确定
          </Button>
        </div>
      </div>
    );
  }
}
