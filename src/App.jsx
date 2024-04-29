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

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem('search') || 'React');
  
  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  // Callback function introduced as event handler
  const handleSearch = (event) => {
    // Callback function calls back to the place it was introduced
    setSearchTerm(event.target.value);
  };

 const searchedStories = stories.filter(function (story) { 
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>My Hacker Stories</h1>

      {/* // Callback function is passed as a function in props */}
      <Search search={searchTerm} onSearch={handleSearch}/>

      <hr></hr>

      <List list={searchedStories}/>
    </div>
  );
}

const Search = ({ search, onSearch}) => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      {/* // Callback function is executed as a handler */}
      <input 
        id="search"
        type="text"
        value={search}
        onChange={onSearch}>
      </input>
    </div>
  );
}

const List = ({ list }) => {
  return (
    <ul>
      {list.map(({ objectID, ...item }) => (
        <Item key={objectID} {...item} />
      ))}
    </ul>
  );
}

const Item = ({ title, url, author, num_comments, points }) => {
  return (
    <li>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
    </li>
  )
}

export default App
