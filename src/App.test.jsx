import { describe, it, expect, vi } from 'vitest';
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react';

import App, {
    storiesReducer,
    Item,
    List,
    SearchForm,
    InputWithLabel,
} from './App';

const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
};

const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
    it('removes a story from all stories', () => {
        const action = { type: 'REMOVE_STORY', payload: storyOne };
        const state = { data: stories, isLoading: false, isError: false };

        const newState = storiesReducer(state, action);

        const expectedState = {
            data: [storyTwo],
            isLoading: false,
            isError: false,
        };

        expect(newState).toStrictEqual(expectedState);
    });

    it('initializes stories fetching', () => {
        const action = { type: 'STORIES_FETCH_INIT' };
        const state = { data: [], isLoading: false, isError: false };

        const newState = storiesReducer(state, action);

        const expectedState = {
            data: [],
            isLoading: true,
            isError: false,
        };

        expect(newState).toStrictEqual(expectedState);
    });

    it('successfully fetches stories', () => {
        const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };
        const state = { data: [], isLoading: true, isError: false };

        const newState = storiesReducer(state, action);

        const expectedState = {
            data: stories,
            isLoading: false,
            isError: false,
        };

        expect(newState).toStrictEqual(expectedState);
    });

    it('fails to fetch stories', () => {
        const action = { type: 'STORIES_FETCH_FAILURE' };
        const state = { data: [], isLoading: true, isError: false };

        const newState = storiesReducer(state, action);

        const expectedState = {
            data: [],
            isLoading: false,
            isError: true,
        };

        expect(newState).toStrictEqual(expectedState);
    });
});

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={storyOne}/>);

        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute(
            'href',
            'https://reactjs.org/'
        );
    });

    it('renders a clickable dismiss button', () => {
        render(<Item item={storyOne}/>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = vi.fn();

        render(<Item item={storyOne} onRemoveItem={handleRemoveItem}/>);

        fireEvent.click(screen.getByRole('button'));

        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
        expect(handleRemoveItem).toHaveBeenCalledWith({...storyOne});
    });
});

describe('SearchForm', () => {
    const searchFormProps = {
        searchTerm: 'React',
        onSearchInput: vi.fn(),
        onSearchSubmit: vi.fn(),
    };

    it('renders the input field with its value', () => {
        render(<SearchForm {...searchFormProps}/>);
        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    });

    it('renders the correct label', () => {
        render(<SearchForm {...searchFormProps}/>);
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    });

    it('calls onSearchInput on input field change', () => {
        render(<SearchForm {...searchFormProps}/>);

        fireEvent.change(screen.getByDisplayValue('React'), {
            target: { value: 'Redux' },
        });

        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    });

    it('calls onSearchSubmit on button submit click', () => {
        render(<SearchForm {...searchFormProps}/>);
        
        fireEvent.submit(screen.getByRole('button'));

        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    });
});

describe('InputWithLabel', () => {
    const inputWithLabelProps = {
        id: 'search',
        value: 'React',
        onInputChange: vi.fn(),
        children: <strong>Search:</strong>,
    };

    it('renders the input field with its value', () => {
        render(<InputWithLabel {...inputWithLabelProps}/>);
        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    });

    it('renders the correct label', () => {
        render(<InputWithLabel {...inputWithLabelProps}/>);
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    });

    it('calls onInputSearch on input field change', () => {
        render(<InputWithLabel {...inputWithLabelProps}/>);
        
        fireEvent.change(screen.getByDisplayValue('React'), {
            target: { value: 'Redux' },
        });

        expect(inputWithLabelProps.onInputChange).toHaveBeenCalledTimes(1);
    });
});

describe('List', () => {
    const listProps = {
        list: stories,
        onRemoveItem: vi.fn(),
    };

    it('renders the stories', () => {
        render(<List {...listProps}/>);
        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Redux')).toBeInTheDocument();
    });
});