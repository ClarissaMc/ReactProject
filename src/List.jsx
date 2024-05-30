import * as React from 'react';
import Check from './check.svg?react';

const List = React.memo(
    ({ list, onRemoveItem }) => 
      <ul>
        {list.map((item) => (
          <Item 
            key={item.objectID}
            item={item}
            onRemoveItem={onRemoveItem} />
        ))}
      </ul>
);
  
const Item = React.memo(
    ({ item, onRemoveItem }) => (
      <li className='item'>
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>{item.author}</span>
        <span style={{ width: '10%' }}>{item.num_comments}</span>
        <span style={{ width: '10%' }}>{item.points}</span>
        <span style={{ width: '10%' }}>
          <button 
            type="button"
            onClick={() => onRemoveItem(item)}
            className="button button_small"
          >
            <Check height="18px" width="18px"/>
          </button>
        </span>
      </li>
    )
);

export { List };