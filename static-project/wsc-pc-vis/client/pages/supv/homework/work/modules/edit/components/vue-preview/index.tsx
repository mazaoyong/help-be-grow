import { format } from 'date-fns';
import { React, FC, createComponent } from '@youzan/tany-react';
import { Affix, Icon } from 'zent';
import unify from 'components/vue-preview/unify';
import VuePreview from 'components/vue-preview';
import Vue from 'vue';
import CompositionApi from '@vue/composition-api';
import MediaContainer from '../../../../../components/media-container';
import './styles.scss';

Vue.use(CompositionApi);

const DATA_KEY = 'data-is-pc-preview';
const VueMediaContainer = unify(MediaContainer, null, options => {
  return {
    ...options,
    [DATA_KEY]: true,
  };
});

interface HomeworkPreviewProps {
  title: string
  footer: JSX.Element
  footerBtnText: string
  detail: any
  publishTime: string
}

const HomeworkPreview: FC<HomeworkPreviewProps> = (props) => {
  return (
    <Affix offsetTop={16} placeholderClassName="homework-preview">
      <div className="viewport-container">
        <div className="viewport-container__header">
          <div className="viewport-container__header__left">
            <Icon type="left" />
          </div>

          <div className="viewport-container__header__title">
            作业
          </div>

          <div className="viewport-container__header__right">
            <Icon type="more" />
          </div>
        </div>

        <div className="viewport-container__body">
          <div className="homework-detail">
            <div className="homework-detail__title">
              {props.title}
            </div>
            {
              props.publishTime
                ? (
                  <div className="homework-detail__desc">
                    布置于 {format(props.publishTime, 'MM.DD HH:mm')}
                  </div>
                )
                : null
            }
            <VuePreview
              className="homework-detail__media-content"
              vueComponent={VueMediaContainer}
              value={{
                mode: 'list',
                overflowStyle: 'none',
                defaultFoldStatus: false,
                mediaBlocks: props.detail.map(item => {
                  switch (item.mediaType) {
                    case 1:
                      item.richTextItem = item.detail;
                      break;
                    case 2:
                      item.pictureItem = item.detail;
                      break;
                    case 3:
                      item.audioItem = item.detail;
                      break;
                    case 4:
                      item.videoItem = item.detail;
                      break;
                    case 5:
                      item.documentItem = item.detail;
                  }
                  return item;
                }),
              }}
            />
          </div>
        </div>

        {
          props.footer || props.footerBtnText
            ? (
              <div className="viewport-container__footer">
                {
                  props.footerBtnText
                    ? (
                      <div className="viewport-container__footer__button">
                        {props.footerBtnText}
                      </div>
                    ) : props.footer
                }
              </div>
            ) : null
        }
      </div>
    </Affix>
  );
};

export default createComponent(HomeworkPreview);
