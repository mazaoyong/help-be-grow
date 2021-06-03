import React, { FC, useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { FormInputField, FormRadioGroupField, FormCheckboxGroupField, Radio, Checkbox, Notify, Disabled, Validators } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';
import { EasyFormArchive } from '@youzan/ebiz-components';
import { isEduBranchStore } from '@youzan/utils-shop';
import { ZentForm } from 'zent/es/form/ZentForm';
import { getCeresConfig, updateCeresConfig } from '../../api';
import './style.scss';

const { EasyForm } = EasyFormArchive;

export const Settings: FC = () => {
  const [loading, setLoading] = useState(false);
  const form = useRef<any>();
  const onSubmit = useCallback((ctx: ZentForm<{}>) => {
    setLoading(true);
    // @upgrade: zent8
    const { moduleName = '家校圈', postPublishAuth = 0, postContentRestriction = [] } = ctx.getValue() as Record<string, any>;
    let restriction = 0;
    if (postContentRestriction.includes('allowpicture')) restriction += 1;
    if (postContentRestriction.includes('allowvideo')) restriction += 2;
    updateCeresConfig({
      moduleName,
      postPublishAuth,
      postContentRestriction: restriction,
    }).then(() => {
      Notify.success('保存成功');
      setLoading(false);
    }).catch(err => {
      Notify.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    getCeresConfig().then(({ moduleName, postPublishAuth, postContentRestriction }) => {
      const restriction: string[] = [];
      if (postContentRestriction & 1) restriction.push('allowpicture');
      if (postContentRestriction & 2) restriction.push('allowvideo');
      form.current.initialize({
        moduleName,
        postPublishAuth,
        postContentRestriction: restriction,
      });
      setLoading(false);
    }).catch(err => Notify.error(err));
  }, []);

  const config = useMemo(() => [
    {
      name: 'moduleName',
      label: '家校圈名称：',
      type: 'field',
      component: FormInputField,
      helpDesc: '在用户个人中心将以设定的名称显示家校圈',
      validators: [
        Validators.required('家校圈名称不能为空'),
        Validators.maxLength(5, '最多输入5个字'),
      ],
    },
    {
      name: 'postPublishAuth',
      type: 'field',
      component: () => (
        <FormRadioGroupField
          label="动态发布权限："
          name="postPublishAuth"
        >
          <Radio value={0}>不允许用户发布动态</Radio>
          <p className="form-desc single">仅学校的管理员和老师可发布动态</p>
          <Radio value={1}>允许正式学员、家长发布动态</Radio>
          <p className="form-desc single">仅关联了在读学员的客户可发表动态</p>
          <Radio value={2}>允许所有人发布动态</Radio>
          <p className="form-desc single">所有用户访问家校圈后可发布动态</p>
        </FormRadioGroupField>
      ),
    },
    {
      name: 'postContentRestriction',
      type: 'field',
      component: () => (
        <FormCheckboxGroupField
          name="postContentRestriction"
          label="发布内容限制："
        >
          <Checkbox value="allowpicture">允许用户上传图片</Checkbox>
          <br />
          <Checkbox value="allowvideo">允许用户上传视频</Checkbox>
          <p className="form-desc">用户上传的图片和视频将占据素材中心的储存空间，请谨慎选择</p>
        </FormCheckboxGroupField>
      ),
    },
    {
      name: 'save',
      component: () => {
        return (
          <div className="moments-setting-save">
            <div className="moments-setting-save-left" />
            <div className="moments-setting-save-right">
              <SamButton
                disabled={isEduBranchStore}
                name="编辑家校圈设置"
                type="primary"
                loading={loading}
                htmlType="submit"
              >
                保存
              </SamButton>
            </div>
          </div>
        );
      },
    },
  ], [loading]);
  return (
    <Disabled value={isEduBranchStore}>
      <EasyForm
        // @ts-ignore
        ref={form}
        className="moments-setting"
        layout="horizontal"
        config={config}
        onSubmit={onSubmit}
      />
    </Disabled>
  );
};
