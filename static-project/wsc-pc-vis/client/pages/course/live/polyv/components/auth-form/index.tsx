import React, { useState, useCallback } from 'react';
import { withRouter, WithRouterProps } from 'react-router';
import { Button, Notify, Sweetalert } from 'zent';
import { Form } from '@zent/compat';
import { EditPagesFooter } from '@youzan/react-components';
import { LIVE_TYPE } from '../../../../common/constants';
import { isEduShop } from '@youzan/utils-shop';
import { savePolyvAuth } from '../../api';
import style from './index.m.scss';

const { createForm, FormInputField, FormCheckboxField } = Form;

interface IProps extends WithRouterProps {
  handleSubmit: any,
  zentForm: any;
  defaultValue: {
    userId: string,
    appId: string,
    appSecret: string,
  }
}

function AuthForm(props: IProps) {
  const [loading, setLoading] = useState(false);
  const { agree, userId, appId, appSecret } = props.zentForm.getFormValues();

  const toList = useCallback(() => {
    window.location.href = `/v4/vis/course/live/list`;
  }, []);

  const toCreate = useCallback(() => {
    window.location.href = `/v4/vis/course/live/add?type=${LIVE_TYPE.POLYV}`;
  }, []);

  const submit = useCallback(props.handleSubmit(() => {
    setLoading(true);
    savePolyvAuth({
      userId,
      appId,
      appSecret,
    })
      .then(res => {
        if (res) {
          /**
           * question: why to judge the edu shop?
           * awnser: 直播商品编辑页编辑成功的返回是通过 history 做的
           * 在教育店铺下可以主动 push 一个路由解决
           * 但是在微商城知识付费插件下，由于路由不匹配问题，主动 push 路由无法解决
           * 所以区分了两个店铺，做不同处理
           */
          if (isEduShop) {
            Sweetalert.confirm({
              title: '授权成功',
              content: '你已完成保利威视频直播的开发授权，可在有赞创建保利威视频直播课。',
              confirmText: '创建直播',
              onConfirm: toCreate,
              cancelText: '返回列表',
              onCancel: toList,
            });
          } else {
            Notify.success('授权成功');
            toList();
          }
        } else {
          Notify.error('帐号信息未通过验证，请检查后重新提交');
          setLoading(false);
        }
      })
      .catch(err => {
        Notify.error(err || '授权失败，请稍后再试');
        setLoading(false);
      });
  }), [userId, appId, appSecret]);

  return (
    <Form className={style['auth-form']} horizontal onSubmit={submit}>
      <FormInputField
        name="userId"
        label="账号ID:"
        value={props.defaultValue.userId}
        maxLength={100}
        width={340}
        validations={{
          required: true,
        }}
        validationErrors={{
          required: '请填写账号ID',
        }}
        required
      />
      <FormInputField
        name="appId"
        label="应用ID:"
        value={props.defaultValue.appId}
        maxLength={100}
        width={340}
        validations={{
          required: true,
        }}
        validationErrors={{
          required: '请填写应用ID',
        }}
        required
      />
      <FormInputField
        name="appSecret"
        label="应用密钥:"
        value={props.defaultValue.appSecret}
        maxLength={100}
        width={340}
        validations={{
          required: true,
        }}
        validationErrors={{
          required: '请填写应用密钥',
        }}
        required
      />
      <FormCheckboxField
        name="agree"
        label="授权协议:"
        required
      >
        我已阅读并同意<a href="https://www.youzan.com/intro/rule/detail?alias=earlsojp&pageType=rules" target="_blank" rel="noopener noreferrer">《有赞商家授权服务协议》</a>
      </FormCheckboxField>
      <EditPagesFooter>
        <Button type="primary" htmlType="submit" disabled={!agree} loading={loading} onClick={submit}>保存</Button>
        <Button onClick={toList}>取消</Button>
      </EditPagesFooter>
    </Form>
  );
}

export default createForm()(withRouter(AuthForm));
