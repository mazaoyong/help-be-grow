import { createComponent } from '@youzan/tany-vue';
import './style';

const initialState = {
  deleteItem: () => {},
  showOperators: false,
  errMsg: '',
};

type Props<P> = {
  [k in keyof P]: P[k];
} & { children: any }

function Editable(props: Props<typeof initialState>) {
  return (
    <div>
      <div class="card editable">
        {
          props.showOperators
            ? <div class="editable__header">
                <span></span>
                <span class="align-end" onClick={props.deleteItem}>
                  删除
                </span>
              </div>
            : null
        }

        <div class="editable__children">
          { props.children }
        </div>
      </div>

      {
        props.errMsg
          ? (
            <div class="editable__error-msg">
              { props.errMsg}
            </div>
          )
          : null
      }
    </div>
  )
}

export default createComponent(Editable, {
  initialState,
})
