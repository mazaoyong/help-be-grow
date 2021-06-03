
import { Form } from '@zent/compat';
import React from 'react';
import { Dialog, Button, Notify, BlockLoading } from 'zent';
import { useOpenDialog } from './use-open-dialog';
import * as api from './api';

import './index.scss';
import { findContentSubscriptionCountList } from 'pages/course/column/manage/api';

const { createForm, FormInputField } = Form;

interface State {
  loading: boolean;
  num: number | string;
}

interface IDeleteItemDTO {
  /** 内容的 mediaType */
  contentType: number;
  alias: string;
}
export interface Props {
  alias: string | IDeleteItemDTO[];
  container: HTMLElement;
  type: 'content' | 'column' | 'live';
  zentForm: any;
  onDelete: () => void;
  isBatch?: boolean;
}

const DELETE_TIPS = '永久删除';
const TYPE_NAME_MAP = {
  content: '内容',
  column: '专栏',
  live: '直播',
};
const API_MAP = {
  content: api.getContentSubscriptionCount,
  column: api.getColumnSubscriptionCount,
  live: api.getLiveSubscriptionCount,
};

const PctDeleteDialog = React.forwardRef<any, Props>((props, ref) => {
  const { type, container, zentForm, alias, onDelete, isBatch } = props;
  const dialogProps = useOpenDialog(container);
  const [state, setState] = React.useState<State>({
    loading: false,
    num: '',
  });
  const hasSubscriber = Number(state.num) > 0;

  React.useEffect(() => {
    Promise.resolve()
      .then(async () => {
        setState(prevState => ({ ...prevState, loading: true }));
        let susCount = 0;
        if (Array.isArray(alias)) {
          const result = await findContentSubscriptionCountList({ aliases: alias });
          if (Array.isArray(result)) {
            for (const item of result) {
              const { suscriptionCount } = item;
              if (suscriptionCount > 0) {
                susCount = suscriptionCount;
                break;
              }
            }
          }
        } else {
          const { suscriptionCount } = await API_MAP[type](alias);
          susCount = suscriptionCount;
        }
        setState(prevState => ({ ...prevState, loading: false, num: susCount }));
      })
      .catch(error => {
        setState(prevState => ({ ...prevState, loading: false }));
        Notify.error(error);
      });
  }, [alias]);

  const handleCheckClick = () => {
    dialogProps.onClose();
    onDelete();
  };

  const name = TYPE_NAME_MAP[type] || '';
  const title = `删除${name}`;

  const content = hasSubscriber ? (
    <div className="dialog-row">
      {!isBatch ? <p>
        这篇{name}有<span className="text-bolder">&nbsp;{state.num}&nbsp;</span>
        位用户已订阅，删除后，已订阅用户将<span className="text-bolder">&nbsp;无法继续查看</span>
        ，同时该内容也将从后台删除，无法找回，你确定永久删除吗？
        {type === 'column' && '（删除专栏不会删除专栏中的内容）'}
      </p> : <p>
        你选择删除的内容已有用户订阅，删除后，已订阅的用户将无法继续查看，同时该内容将从后台删除，无法找回，你确认永久删除吗？
      </p>}
    </div>
  ) : (
    <div className="dialog-row">
      {!isBatch ? <p>
        删除后这篇内容将从后台删除，无法找回，且用户将无法继续查看，你确认删除吗？
      </p> : <p>
        你选择删除的内容将从后台删除，无法找回，且用户将无法继续查看，你确认删除吗？
      </p>}
    </div>
  );

  const { deleteCheck } = zentForm.getFormValues();
  const footer = (
    <div>
      <Button disabled={deleteCheck !== DELETE_TIPS } onClick={handleCheckClick} type="primary">
        {hasSubscriber ? '永久删除' : '删除'}
      </Button>
      <Button onClick={dialogProps.onClose}>
        {hasSubscriber ? '我再想想' : '取消'}
      </Button>
    </div>
  );

  return (
    <Dialog
      className="pct-delete-dialog"
      style={{ width: '480px' }}
      title={title}
      footer={footer}
      {...dialogProps}
    >
      <BlockLoading loading={state.loading}>
        {content}
        <Form horizontal ref={ref}>
          <FormInputField
            name="deleteCheck"
            type="text"
            label="请输入："
            required
            placeholder={DELETE_TIPS}
            validations={{
              current: (_, value) => {
                return value === DELETE_TIPS || value === '' ? true : '请输入“永久删除”';
              },
            }}
          />
        </Form>
      </BlockLoading>
    </Dialog>
  );
});

export default createForm()(PctDeleteDialog);
