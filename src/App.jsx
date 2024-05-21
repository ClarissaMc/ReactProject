import * as React from 'react';

const initialStories = [
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

const getAsyncStories = () => 
  new Promise((resolve) => 
    // adding delay to mimic asynch data retrieval
    setTimeout(
      () => resolve({ data: { stories: initialStories }}),
      2000
    )
  );

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const [stories, setStories] =  React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
      .then(result => {
        setStories(result.data.stories);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []); // Empty dependecy array means side-effect only runs once component renders for first time

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );
    console.log(item);
    console.log(newStories);

    setStories(newStories);
  };

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
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>

      <hr></hr>

      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
};

const InputWithLabel = ({ id, value, type = 'text', onInputChange, isFocused, children, }) => (
  <>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input
      id={id}
      type={type}
      value={value}
      autoFocus={isFocused}
      onChange={onInputChange}
    />
  </>
)

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => (
        <Item 
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  );
}

const Item = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
)

export default App