import { describe, it, expect, vi } from 'vitest';
import {
    render,
    screen,
    fireEvent,
    waitFor,
} from '@testing-library/react';

import App, {
    storiesReducer,
    List,
    SearchForm,
} from './App';

import { Item } from './List';
import { InputWithLabel } from './InputWithLabel';
import { LastSearches } from './LastSearches';

import axios from 'axios';

vi.mock('axios');

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

// --------------------------- Unit Tests ----------------------------------- //
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

    it('renders snapshot', () => {
        const { container } = render(<Item item={storyOne} onRemoveItem={vi.fn()}/>);
        expect(container.firstChild).toMatchSnapshot();
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

    it('renders snapshot', () => {
        const { container } = render(<SearchForm {...searchFormProps}/>);
        expect(container.firstChild).toMatchSnapshot();
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

    it('renders snapshot', () => {
        const { container } = render(<InputWithLabel {...inputWithLabelProps}/>);
        expect(container.firstChild).toMatchSnapshot();
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

    it('renders the sort buttons', () => {
        render(<List {...listProps}/>);
        expect(screen.getAllByRole('button').length).toBe(6);
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Author')).toBeInTheDocument();
        expect(screen.getByText('Comments')).toBeInTheDocument();
        expect(screen.getByText('Points')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('fires sort buttons', () => {
        const {container } = render(<List {...listProps}/>);

        expect(container.getElementsByClassName('active_sort').length).toBe(0);

        fireEvent.click(screen.getAllByRole('button')[0]);  // Title

        expect(container.getElementsByClassName('active_sort').length).toBe(1);
        expect(container.getElementsByClassName('active_sort')[0].classList.contains('TITLE')).toBeTruthy();

        fireEvent.click(screen.getAllByRole('button')[1]);  // Author

        expect(container.getElementsByClassName('active_sort').length).toBe(1);
        expect(container.getElementsByClassName('active_sort')[0].classList.contains('AUTHOR')).toBeTruthy();
    });

    it('renders sort arrows', () => {
        render(<List {...listProps}/>);

        expect(screen.queryByTitle('down-arrow')).toBeNull();
        expect(screen.queryByTitle('up-arrow')).toBeNull();

        fireEvent.click(screen.getAllByRole('button')[0]);  // Title

        expect(screen.queryByTitle('down-arrow')).toBeInTheDocument();
        expect(screen.queryByTitle('up-arrow')).toBeNull();

        fireEvent.click(screen.getAllByRole('button')[0]);  // Title Reversed

        expect(screen.queryByTitle('down-arrow')).toBeNull();
        expect(screen.queryByTitle('up-arrow')).toBeInTheDocument();

        fireEvent.click(screen.getAllByRole('button')[3]);  // Comment

        expect(screen.queryByTitle('down-arrow')).toBeInTheDocument();
        expect(screen.queryByTitle('up-arrow')).toBeNull();

        fireEvent.click(screen.getAllByRole('button')[3]);  // Comment Reversed

        expect(screen.queryByTitle('down-arrow')).toBeNull();
        expect(screen.queryByTitle('up-arrow')).toBeInTheDocument();
    });

    it('renders snapshot', () => {
        const { container } = render(<List {...listProps}/>);
        expect(container.firstChild).toMatchSnapshot();
    });
});

describe('LastSearches', () => {
    const lastSearches = [
        'React',
        'Redux',
        'Java',
        'Python',
        'C',
    ]
    const lastSearchesProps = { lastSearches: lastSearches, onLastSearch: vi.fn() };

    it('renders the buttons', () => {
        render(<LastSearches {...lastSearchesProps}/>);
        expect(screen.getAllByRole('button').length).toBe(5);
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Redux')).toBeInTheDocument();
        expect(screen.getByText('Java')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('calls onLastSearch when button clicked', () => {
        render(<LastSearches {...lastSearchesProps}/>);
        fireEvent.click(screen.getByText('Java'));
        expect(lastSearchesProps.onLastSearch).toHaveBeenCalledTimes(1);
    });

    it('renders snapshot', () => {
        const { container } = render(<LastSearches {...lastSearchesProps}/>);
        expect(container.firstChild).toMatchSnapshot();
    });
});
// ------------------------- End Unit Tests --------------------------------- //

// ----------------------- Integration Tests -------------------------------- //
describe('App', () => {
    it('succeeds fetching data', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });

        axios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        expect(screen.queryByText(/Loading/)).toBeInTheDocument();

        await waitFor(async () => await promise);

        expect(screen.queryByText(/Loading/)).toBeNull();

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Redux')).toBeInTheDocument();
    });

    it('fails fetching data', async () => {
        const promise = Promise.reject();
        axios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        expect(screen.getByText(/Loading/)).toBeInTheDocument();

        try {
            await waitFor(async () => await promise);
        } catch (error) {
            expect(screen.queryByText(/Loading/)).toBeNull();
            expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
        }
    });

    it('removes a story', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });

        axios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        await waitFor(async () => await promise);

        expect(screen.getAllByRole('button').length).toBe(7);
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

        fireEvent.click(screen.getAllByRole('button')[5]);

        expect(screen.getAllByRole('button').length).toBe(6);
        expect(screen.queryByText('Jordan Walke')).toBeNull();
    });

    it('searches for specific stories', async () => {
        // tests the initial request and another request

        const reactPromise = Promise.resolve({
            data: {
                hits: stories,
            },
        });

        const anotherStory = {
            title: 'JavaScript',
            url: 'https://en.wikipedia.org/wiki/JavaScript',
            author: 'Brendan Eich',
            num_comments: 15,
            points: 10,
            objectID: 3,
        };

        const javascriptPromise = Promise.resolve({
            data: {
                hits: [anotherStory],
            },
        });

        axios.get.mockImplementation((url) => {
            if (url.includes('React')) {
                return reactPromise;
            }
            if (url.includes('JavaScript')) {
                return javascriptPromise;
            }

            throw Error();
        });

        // Initial Render

        render(<App/>);

        // First Data Fetching

        await waitFor(async () => await reactPromise);

        expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

        expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
        expect(
            screen.queryByText('Dan Abramov, Andrew Clark')
        ).toBeInTheDocument();
        expect(screen.queryByText('Brendan Eich')).toBeNull();

        // User Interaction -> Search

        fireEvent.change(screen.queryByDisplayValue('React'), {
            target: {
                value: 'JavaScript',
            },
        });

        expect(screen.queryByDisplayValue('React')).toBeNull();
        expect(
            screen.queryByDisplayValue('JavaScript')
        ).toBeInTheDocument();

        fireEvent.submit(screen.queryByText('Submit'));

        // Second Data Fetching

        await waitFor(async () => await javascriptPromise);

        expect(screen.queryByText('Jordan Walke')).toBeNull();
        expect(
            screen.queryByText('Dan Abramov, Andrew Clark')
        ).toBeNull();
        expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
    });

    it('sorts the list', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });

        axios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        await waitFor(async () => await promise);

        const reactElement = screen.getByText('React');
        const reduxElement = screen.getByText('Redux');

        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(4);

        fireEvent.click(screen.getAllByRole('button')[2]);  // Author
        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(2);
        fireEvent.click(screen.getAllByRole('button')[2]);  // Author Reverse
        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(4);

        fireEvent.click(screen.getAllByRole('button')[1]);  // Title
        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(4);
        fireEvent.click(screen.getAllByRole('button')[1]);  // Title Reverse
        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(2);

        fireEvent.click(screen.getAllByRole('button')[3]);  // Comments
        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(4);
        fireEvent.click(screen.getAllByRole('button')[3]);  // Comments Reverse
        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(2);

        fireEvent.click(screen.getAllByRole('button')[4]);  // Points
        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(2);
        fireEvent.click(screen.getAllByRole('button')[4]);  // Points Reverse
        expect(reactElement.compareDocumentPosition(reduxElement)).toBe(4);
    });

    it('updates InputWithLabel when LastSearches button clicked', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });

        axios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        await waitFor(async () => await promise);

        expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Submit'));    // 'JavaScript' search
        fireEvent.change(screen.getByDisplayValue('JavaScript'), {
            target: { value: 'React' },
        });
        fireEvent.click(screen.getByText('Submit'));    // 'React' search

        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();

        fireEvent.click(screen.getByText('JavaScript')); // 'JavaScript' search

        expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();
    });

    it('adds new last search button', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });

        axios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        await waitFor(async () => await promise);

        expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Submit'));    // 'JavaScript' search
        fireEvent.change(screen.getByDisplayValue('JavaScript'), {
            target: { value: 'React' },
        });
        fireEvent.click(screen.getByText('Submit'));    // 'React' search

        expect(screen.queryAllByText('JavaScript').length).toBe(1);
        expect(screen.queryAllByText('React').length).toBe(0);

        fireEvent.click(screen.getByText('Submit'));    // 'React' search

        expect(screen.queryAllByText('JavaScript').length).toBe(1);
        expect(screen.queryAllByText('React').length).toBe(0);

        fireEvent.change(screen.getByDisplayValue('React'), {
            target: { value: 'JavaScript' },
        });
        fireEvent.click(screen.getByText('Submit'));    // 'JavaScript' search

        expect(screen.queryAllByText('JavaScript').length).toBe(1);
        expect(screen.queryAllByText('React').length).toBe(1);

        fireEvent.change(screen.getByDisplayValue('JavaScript'), {
            target: { value: 'Python' },
        });
        fireEvent.click(screen.getByText('Submit'));    // 'Python' search

        expect(screen.queryAllByText('JavaScript').length).toBe(2);
        expect(screen.queryAllByText('React').length).toBe(2);  // last search & story
    });
});
// ----------------------- End Integration Tests ---------------------------- //