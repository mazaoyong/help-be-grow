
import React, { useCallback, useState, useEffect, forwardRef, useMemo } from 'react';
import { Form } from '@zent/compat';
import { Button, Radio, LayoutRow as Row, Notify, Alert } from 'zent';
import assign from 'lodash/assign';
import has from 'lodash/has';
import { BlankLink } from '@youzan/react-components';
import { isEduBranchStore, isEduHqStore } from '@youzan/utils-shop';
import { loggerCustomer } from 'components/logger';
import MediaField from './media-field';
import { createMoments, updateMoments, findLocationInfo } from '../api';
import MentionedFieldWrap from './mention-students-field';
const { createForm, FormInputField, FormRadioGroupField } = Form;

interface ICommentFormProps {
  zentForm: any;
  handleSubmit: any;
  onClose: (saved?: boolean) => void;
  data?: any;
  isEdit?: boolean;
  isBackground?: boolean;
  type: number;
  queryData?: any;
}

interface ILocationInfoProps {
  eduCourseName: string;
  eduCourseId: number | null;
  [index: string]: any;
}

interface mentionedUserType {
  userId: number;
  userName: string;
  userRole: number;
}

const CommentForm = forwardRef((props: ICommentFormProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    handleSubmit,
    onClose,
    data = {},
    isEdit = false,
    isBackground = false,
    type,
    queryData = {},
    zentForm,
  } = props;
  const [ locationInfo, setLocationInfo ] = useState<ILocationInfoProps>(assign({
    eduCourseName: '',
    eduCourseId: null,
    shopName: queryData.shopName || _global.shopName,
  }, data.location));
  const [loading, setLoading] = useState<boolean>(false);
  const defaultVisibility = isBackground ? 0 : 1;
  const [selectedUsers, setSelectedUsers] = useState<mentionedUserType[]>(data.mentionedUsers || []);

  useEffect(() => {
    setLoading(true);
    findLocationInfo({ query: {
      lessonNo: queryData.lessonNo || data.lessonNo || '',
      kdtId: data.kdtId || queryData.kdtId || _global.kdtId,
    } }).then(resp => {
      if (resp) {
        setLocationInfo({
          eduCourseName: resp.eduCourseName,
          eduCourseId: resp.eduCourseId,
          shopName: resp.schoolName || locationInfo.shopName,
        });
        setLoading(false);
      }
    }).catch(err => {
      setLoading(false);
      Notify.error(err);
    });
  }, [data.kdtId, data.lessonNo, queryData.kdtId, queryData.lessonNo, type]);

  const mentionedUsers = useMemo(() => {
    let users = data.mentionedUsers || [];
    if ((!users || !users.length) && type === 0) {
      users = [{
        userName: queryData.userName,
        userId: queryData.userId,
        userRole: 1,
      }];
    }
    return users;
  }, [data.mentionedUsers, queryData.userId, queryData.userName, type]);

  const handleSave = useCallback((values) => {
    if (!values.textContent && (!values.extraContents || !values.extraContents.length)) {
      Notify.error('点评内容必须包含文字，图片，视频其中之一', 2000);
      return;
    }
    setLoading(true);
    loggerCustomer('submit_moment', '点击发布动态按钮');
    if (isEdit) {
      const rootKdtId = isEduBranchStore && data.senderRole === 0 && _global.shopInfo.rootKdtId;
      updateMoments({
        command: { ...data, ...values, kdtId: data.kdtId || queryData.kdtId || _global.kdtId },
        rootKdtId,
      }).then(() => {
        setLoading(false);
        onClose(true);
        Notify.success('修改成功');
      }).catch(err => {
        setLoading(false);
        Notify.error(err, 2000);
      });
    } else {
      createMoments({ command: { ...data, ...values, kdtId: queryData.kdtId || _global.kdtId } }).then(() => {
        setLoading(false);
        Notify.success('点评成功');
        onClose(true);
      }).catch(err => {
        setLoading(false);
        Notify.error(err, 2000);
      });
    }
  }, [data, isEdit, onClose, queryData.kdtId]);

  useEffect(() => {
    if (!isBackground) return;
    if (selectedUsers.length === 0) {
      zentForm.setFieldsValue({ visibility: 0 });
    }
  }, [selectedUsers, isBackground, zentForm]);

  const isHqCreate = isEduHqStore && !isEdit;
  const isEditUserMoment = isEdit && data.senderRole === 0;
  return <div className="comment-form-wrap" ref={ref}>
    {!isEdit && <Alert type="info" style={{ marginBottom: 16 }}>
      点评将会按照已设置的消息推送规则发送给学生。
      <BlankLink href={`${_global.url.v4}/message/messagepush#/setting/postSendRemind`}>推送规则设置</BlankLink>
    </Alert>}
    <Form
      horizontal
      onSubmit={handleSubmit(handleSave)}
    >
      <FormInputField
        name='textContent'
        className="comment-textarea"
        type="textarea"
        maxLength={5000}
        value={data.textContent}
        placeholder="请输入对学员的点评，最多5000字"
        showCount
      />
      <MediaField
        value={data.extraContents || []}
      />
      <div style={{ display: isEditUserMoment ? 'none' : 'block' }}>
        <div style={{ display: isHqCreate ? 'none' : 'block' }}>
          <MentionedFieldWrap
            type={type}
            value={mentionedUsers}
            isEdit={isEdit}
            defaultValue={data.mentionedUsers}
            queryData={queryData}
            isBackground={isBackground}
            onChange={val => isBackground && setSelectedUsers(val)}
          />
        </div>
        <FormRadioGroupField
          name="locationType"
          label="所在位置："
          required
          value={has(data, 'locationType') ? data.locationType : (locationInfo.eduCourseName ? 2 : 1)}
          validations={{ required: true }}
          validationErrors={{
            required: '请选择所在位置',
          }}
        >
          {locationInfo.eduCourseName && <Row>
            <Radio value={2}>{locationInfo.shopName}-{locationInfo.eduCourseName}</Radio>
          </Row>}
          <Row>
            <Radio value={1}>
              {locationInfo.shopName || _global.shopName}
            </Radio>
          </Row>
          <Row>
            <Radio value={0}>不显示位置</Radio>
          </Row>
        </FormRadioGroupField>
        <FormRadioGroupField
          name="visibility"
          label="谁可以看："
          required
          value={has(data, 'visibility') ? data.visibility : defaultVisibility}
          validations={{ required: true }}
          validationErrors={{
            required: '请选择谁可以看',
          }}
        >
          <Row>
            <Radio disabled={isBackground && selectedUsers.length === 0} value={1}>被点评学员</Radio>
          </Row>
          {(type === 1 || data.lessonNo) && <Row>
            <Radio value={2}>本节课学员</Radio>
          </Row>}
          <Row>
            <Radio value={0}>全校</Radio>
          </Row>
        </FormRadioGroupField>
      </div>
      <div className="comment-form-footer-wrap">
        <span className="comment-form-footer">
          <Button onClick={() => onClose(false)}>取消</Button>
          <Button loading={loading} type="primary" htmlType="submit">确定</Button>
        </span>
      </div>
    </Form>
  </div>;
});

export default createForm({ scrollToError: true })(CommentForm);
