
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { Button, Checkbox, Notify } from 'zent';
import { Link, hashHistory } from 'react-router';
import { isInStoreCondition } from 'fns/chain';
import get from 'lodash/get';

import FileField from '../../components/file-field';
import AssignField from '../../components/assign-field';
import ChainAssignField from '../../components/chain-assign-field';
import SourceField from '../../../cluepool/components/add-dialog/components/source-field';

import { createImportTask, getImportTempFile } from '../../api/import';

import './styles.scss';

const { Field, createForm } = Form;

const isChainMaster = isInStoreCondition({ supportHqStore: true });

class BatchImport extends PureComponent {
  state = {
    // 用来控制线索分配方式和选择分配规则的联动
    kdtType: isChainMaster ? 1 : 3,
    agreeProtocol: true,
  };

  // 分配规则改变
  handleKdtTypeChange = ({ kdtType }) => {
    if (isChainMaster) {
      this.setState({ kdtType }, this.props.zentForm.asyncValidateForm);
    }
  };

  // 选中项目(这里需要修改form)
  handleSelect = (key, evt) => {
    const { form } = this.state;
    const { value } = evt.target;
    this.setState({ form: Object.assign(form, { [key]: value }) });
  };

  // 是否勾选免责声明
  handleTriggerAgreement = evt => this.setState({ agreeProtocol: evt.target.checked });

  handleSubmit = data => {
    this.props.zentForm.asyncValidateForm(() => {
      const { kdt, assign, fileUrl, source } = data;
      const sourceId = (source && source[1]) || 0;
      const payload = {
        clueAddDistribute: {
          // kdt不存在的时候，单店分配给单店，kdtype为3
          kdtType: (kdt && kdt.kdtType) || 3,
          receiveType: (assign && assign.receiveType) || 0,
          targetKdtId: (kdt && kdt.targetKdtId) || window._global.kdtId,
          userId: (assign && assign.userId) || 0,
        },
        importFile: {
          privateUrl: true,
          fileUrl,
        },
        sourceId,
      };
      createImportTask(payload)
        .then(data => {
          Notify.success('保存成功');
          hashHistory.push('/list');
        })
        .catch(err => {
          Notify.error(err);
        });
    });
  };

  // 从后端获取线索导入的模板
  getImportTemp = () => {
    getImportTempFile().then(data => {
      const template = get(data, 'fileUrl');
      if (template) {
        window.open(`${template}?attname=leads-import.csv`, '_blank');
      }
    });
  };

  render() {
    const { handleSubmit } = this.props;
    const { kdtType } = this.state;
    return (
      <Form horizontal className="batchimport" onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="new-title">第一步</div>
        <section>
          <a onClick={this.getImportTemp}>点击下载文件模板</a>
          <div className="description">导入前，请下载文件模板，并按照模板格式填写数据后再导入</div>
        </section>
        <div className="new-title">第二步</div>
        <section className="edu-clue-import-no-label">
          <Field
            name="fileUrl"
            component={FileField}
            asyncValidation={(values, value) => {
              if (!value) {
                return Promise.reject('请上传 csv 格式的文件');
              }
              return Promise.resolve();
            }}
            className="field-with-no-margin"
          />
          {/* 上传文件之后需要将文件的cdn地址放入form中,key为importFile: { fileUrl: ... } */}
          <div className="description">
            <p>当前仅支持 csv 格式文件（大小在10M以内），请使用 Office 2010 及以上版本，否则可能出现乱码</p>
            <p>必须严格按照模板内容填入客户数据，否则可能会出现导入异常</p>
          </div>
        </section>
        <div className="new-title">第三步</div>
        <section className="third-step">
          {
            isChainMaster ? (
              <Field
                name="kdt"
                label="线索分配方式："
                className="choose-field"
                required
                value={{
                  kdtType: 1,
                }}
                asyncValidation={(values, value) => {
                  if (value && (value.kdtType === 1 || (value.kdtType === 2 && value.targetKdtId))) {
                    return Promise.resolve();
                  }
                  return Promise.reject('请选择线索分配方式');
                }}
                onChange={this.handleKdtTypeChange}
                component={ChainAssignField}
              />
            ) : null
          }
          {
            (this.state.kdtType === 1 || this.state.kdtType === 3) ? (
              <Field
                name="assign"
                label="选择分配规则："
                className="choose-field"
                required
                kdtType={kdtType}
                value={{
                  receiveType: 0,
                }}
                asyncValidation={(values, value) => {
                  if ((value.receiveType === 1) && (!value.userId)) {
                    return Promise.reject('请选择分配规则');
                  }
                  return Promise.resolve();
                }}
                component={AssignField}
              />
            ) : null
          }
          <Field
            name="source"
            label="线索来源："
            className="edu-clue-import-source"
            required
            value={[]}
            component={SourceField}
            asyncValidation={(values, value) => {
              if (value && value.length > 0) return Promise.resolve();
              return Promise.reject('请输入线索来源');
            }}
          />
          <Checkbox
            checked={this.state.agreeProtocol}
            className="singleline protocol"
            onChange={this.handleTriggerAgreement}
          >
            我已阅读并同意
            <a
              href="//www.youzan.com/intro/rule/detail?alias=st6h0mrh&pageType=rules"
              target="_blank"
              rel="noopener noreferrer"
            >《数据导入免责声明》</a>
          </Checkbox>
        </section>
        <div className="footer">
          <Button
            type="primary"
            className="btn"
            htmlType="submit"
            disabled={!this.state.agreeProtocol}
          >导入</Button>
          <Link className="btn" to="list">
            <Button>取消</Button>
          </Link>
        </div>
      </Form>
    );
  }
};

export default createForm()(BatchImport);
