import React, { useMemo, useState } from 'react';
import NestedListComponent from './NestedListComponent';
import LIST_DATA from '../../list data/data.json';
import './styles.scss';

const NestedListApp: React.FC = () => {
  const listData = useMemo<any[]>(() => LIST_DATA, []);
  const [listItems, setListItems] = useState<any[]>(listData);

  return (
    <div className="nested-list-wrapper">
      <NestedListComponent listItems={listItems} setListItems={setListItems} />
    </div>
  );
};

export default NestedListApp;
