import React from 'react';
import { withRouter } from 'react-router';
import { Button } from 'zent';

function Continue() {
  return (
    <div className="certificate-editor-continue">
      <img src="https://b.yzcdn.cn/publicPath/20190506/yes.png" alt=""/>
      <h1>入学证书设置成功</h1>
      <h3>此课程没有设置毕业证书，点击新建毕业证书立即设置</h3>
      <div className="certificate-editor-continue-button-group">
        <Button type="primary" outline>继续新建入学证书</Button>
        <Button type="primary" outline>返回证书列表</Button>
        <Button type="primary">新建毕业证书</Button>
      </div>
    </div>
  );
}

export default withRouter(Continue);
