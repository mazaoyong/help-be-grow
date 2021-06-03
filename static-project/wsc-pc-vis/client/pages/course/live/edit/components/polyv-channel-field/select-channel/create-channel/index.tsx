import React, { PureComponent } from 'react';
import { Dialog, Button, Notify } from 'zent';
import { Form } from '@zent/compat';
import LiveSceneField from './live-scene-field';
import { asyncCreatePolyvLive, getAsyncCreateStatus } from './api';
import { Scene } from '../enums';
import style from './index.m.scss';

const { createForm, FormInputField, Field } = Form;
const { openDialog, closeDialog } = Dialog;

class CreateChannelDialog extends PureComponent<any, {}> {
  state = {
    loading: false,
  };

  onCancel = () => {
    this.props.reject();
  }

  onSubmit = value => {
    this.setState({
      loading: true,
    });
    asyncCreatePolyvLive(value)
      .then(id => {
        this.checkCreate(id);
      })
      .catch(err => {
        Notify.error(err || '频道创建失败，请稍后重试');
        this.setState({
          loading: false,
        });
      });
  }

  checkCreate = (createId: string) => {
    // 暂定重试40次，每次1s
    let times = 40;
    const check = () => {
      getAsyncCreateStatus({ createId })
        .then(res => {
          if (res === 1) {
            this.props.resolve();
            return;
          }
          if (times) {
            times--;
            setTimeout(check, 1000);
            return;
          }
          return Promise.reject();
        })
        .catch(() => {
          if (times) {
            times--;
            check();
            return;
          }
          Notify.error('频道创建失败，请稍后重试');
          this.setState({
            loading: false,
          });
        });
    };
    check();
  }

  render() {
    const { loading } = this.state;
    const { onCancel, onSubmit } = this;

    return (
      <Form className={style['create-channel']} horizontal onSubmit={this.props.handleSubmit(onSubmit)}>
        <FormInputField
          name="name"
          label="频道名称:"
          placeholder="最多输入50字"
          width={240}
          maxLength={50}
          validations={{ required: true }}
          validationErrors={{ required: '请填写频道名称' }}
          required
        />
        <Field
          name="scene"
          label="直播场景:"
          component={LiveSceneField}
          value={Scene.normal}
          required
        />
        <div className={style['button-wrap']}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
        </div>
      </Form>
    );
  }
}

const CreateChannelForm = createForm()(CreateChannelDialog);

// 可以抽离 getOpenDialog 逻辑，当前没时间做了。。。
export default function createChannel() {
  const dialogId = Date.now().toString();
  return new Promise((resolve, reject) => {
    const res = (args) => {
      closeDialog(dialogId);
      resolve(args);
    };
    const rej = (...args) => {
      closeDialog(dialogId);
      reject(...args);
    };
    openDialog({
      dialogId,
      title: '创建直播频道',
      children: <CreateChannelForm resolve={res} reject={rej} />,
      maskClosable: false,
      onClose: () => reject(),
    });
  });
}
