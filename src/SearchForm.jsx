import * as React from 'react';
import { InputWithLabel } from './InputWithLabel';

const SearchForm = React.memo(
    ({ searchTerm, onSearchInput, onSearchSubmit, }) => (
    <form onSubmit={onSearchSubmit} className='search-form'>
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={onSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
  
      <button type="submit" disabled={!searchTerm} className='button button_large'>
        Submit
      </button>
    </form>
));

export { SearchForm };