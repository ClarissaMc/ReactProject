import * as React from 'react';
import { sortBy } from 'lodash';

import Check from './check.svg?react';

const SORTS = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, 'title'),
    AUTHOR: (list) => sortBy(list, 'author'),
    COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
    POINT: (list) => sortBy(list, 'points').reverse(),
};

const List = React.memo(
    ({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState('NONE');

    const handleSort = (sortKey) => {
        const sortButtons = document.getElementsByClassName('button_sort');
        for (let i = 0; i < sortButtons.length; i++) {
            if (sortButtons[i].classList.contains(sortKey))
                sortButtons[i].classList.add('active_sort');
            else if (sortButtons[i].classList.contains('active_sort'))
                sortButtons[i].classList.remove('active_sort');
        }
        setSort(sortKey);
    };

    const sortFunction = SORTS[sort];
    const sortedList = sortFunction(list);

    return (
        <ul>
            <li style={{ display: 'flex' }}>
                <span style={{ width: '40%' }}>
                    <button 
                        type="button" 
                        className='button_sort TITLE' 
                        onClick={() => handleSort('TITLE')}
                    >
                        Title
                    </button>
                </span>
                <span style={{ width: '30%' }}>
                    <button
                        type="button"
                        className='button_sort AUTHOR'
                        onClick={() => handleSort('AUTHOR')}
                    >
                        Author
                    </button>
                </span>
                <span style={{ width: '10%' }}>
                    <button
                        type="button"
                        className='button_sort COMMENT'
                        onClick={() => handleSort('COMMENT')}
                    >
                        Comments
                    </button>
                </span>
                <span style={{ width: '10%' }}>
                    <button
                        type="button"
                        className='button_sort POINT'
                        onClick={() => handleSort('POINT')}
                    >
                        Points
                    </button>
                </span>
                <span style={{ width: '10%' }}>Actions</span>
            </li>

            {sortedList.map((item) => (
            <Item 
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem} />
            ))}
        </ul>
    );
    }
);
  
const Item = React.memo(
    ({ item, onRemoveItem }) => (
    <li className='item' style={{ display: 'flex' }}>
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

export { List, Item };