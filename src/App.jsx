import * as React from 'react';

const setStories = 'SET_STORIES';
const removeStory = 'REMOVE_STORY';
const fetchStoriesInit = 'STORIES_FETCH_INIT';
const fetchStoriesSuccess = 'STORIES_FETCH_SUCCESS';
const fetchStoriesFailure = 'STORIES_FETCH_FAILURE';

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

const storiesReducer = (state, action) => {
  switch (action.type) {
    case fetchStoriesInit:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case fetchStoriesSuccess:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case fetchStoriesFailure:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case removeStory:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

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

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }  // this object is the state, which is named stories
  );

  React.useEffect(() => {
    dispatchStories({ type: fetchStoriesInit });

    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: fetchStoriesSuccess,
          payload: result.data.stories,
        });
      })
      .catch(() => 
        dispatchStories({ type: fetchStoriesFailure })
      );
  }, []); // Empty dependecy array means side-effect only runs once component renders for first time

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item,
    });
  };

  // Callback function introduced as event handler
  const handleSearch = (event) => {
    // Callback function calls back to the place it was introduced
    setSearchTerm(event.target.value);
  };

 const searchedStories = stories.data.filter(function (story) { 
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

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
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