import * as React from 'react';

const LastSearches = ({ lastSearches, onLastSearch }) => (
    <>
        {lastSearches.map((searchTerm, index) => (
            <button
                key={searchTerm + index}
                type="button"
                onClick={() => onLastSearch(searchTerm)}
            >
                {searchTerm}
            </button>
        ))}
    </>
);

export { LastSearches };