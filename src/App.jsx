import * as React from 'react';

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  // Callback function introduced as event handler
  const handleSearch = (event) => {
    // Callback function calls back to the place it was introduced
    console.log(event.target.value);
  };

  console.log("App renders.");

  return (
    <div>
      <h1>My Hacker Stories</h1>

      {/* // Callback function is passed as a function in props */}
      <Search onSearch={handleSearch}/>

      <hr></hr>

      <List list={stories}/>
    </div>
  );
}

const Search = (props) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleBlur = () => {
    console.log("Input has lost focus.");
  }

  // Callback function is executed as a handler
  props.onSearch(event);

  console.log("Search renders.");

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} onBlur={handleBlur}></input>
    </div>
  );
}

const List = (props) => {
  console.log("List renders");

  return (
    <ul>
      {props.list.map((item) => (
        <Item key={item.objectID} item={item}/>
      ))}
    </ul>
  );
}

const Item = (props) => {
  console.log("Item renders.");

  return (
    <li>
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>
    </li>
  )
}

export default App
