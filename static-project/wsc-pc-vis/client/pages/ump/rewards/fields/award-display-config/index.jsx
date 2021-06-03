
import { Pop, Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { AWARD_SAMPLE_PIC } from '../../constants';
import { Img } from '@youzan/ebiz-components';
import './index.scss';
const { FormCheckboxField } = Form;
const { ImgWrap } = Img;

class AwardsDisplayConfig extends PureComponent {
  getOpenDialog = (img) => {
    return (
      <div className="award-show-example-dialog">
        <div>
          <ImgWrap
            width={'300px'}
            height={'445px'}
            src={img}
          />
        </div>
      </div>
    );
  };

  render() {
    const { label, awardDisplay, isView } = this.props;
    return (
      <div className='award-display-wrap'>
        <FormCheckboxField
          name='awardDisplay'
          label={label}
          value={awardDisplay}
          className='award-display'
          disabled={isView}
        >
        </FormCheckboxField>
        <span className="award-display-text">在课程商品详情页展示奖励</span>
        <Pop
          trigger="click"
          content={this.getOpenDialog(AWARD_SAMPLE_PIC)}
          position="right-bottom"
          className='course-example-pop'
        >
          <span className='award-show-example'>查看示例</span>
        </Pop>
      </div>
    );
  }
}

export default AwardsDisplayConfig;
