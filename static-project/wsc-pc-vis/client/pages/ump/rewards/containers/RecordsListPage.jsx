import React, { PureComponent } from 'react';
import RecordsList from '../components/RecordsList.jsx';

class RecordsListPage extends PureComponent {
  render() {
    return (<div className='record-list'>
      <RecordsList></RecordsList>
    </div>);
  }
}

export default RecordsListPage;
