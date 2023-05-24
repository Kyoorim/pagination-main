import * as React from 'react';
import expect from 'expect';
import { screen, render, fireEvent } from '@testing-library/react';

import ListPaginationContextProvider, { usePaginationContext } from './list-pagination-context-provider';

describe('ListPaginationContextProvider', () => {
  const NaiveList = (props) => {
    const { pagination, setNextPage, setPrevPage } = usePaginationContext();
    return (
      <div>
        {pagination.previousEnabled && <button onClick={setPrevPage}>previous page</button>}
        <span>{`currentPage: ${pagination.currentPage}`}</span>
        <span>{`totalPages: ${pagination.totalPages}`}</span>
        <span>{`pageSize: ${pagination.pageSize}`}</span>
        {pagination.nextEnabled && <button onClick={setNextPage}>next page</button>}
      </div>
    );
  };

  it('should return currentPage, totalPages, pageSize and view more button', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    expect(getByText('currentPage: 1')).not.toBeNull();
    expect(getByText('totalPages: 2')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(getByText('next page')).not.toBeNull();
  });

  it('should update pagination state when clicking "view more" button', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 5,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('next page'));

    expect(getByText('currentPage: 2')).not.toBeNull();
    expect(getByText('totalPages: 3')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(screen.queryByText('next page')).not.toBeNull();
  });

  it('should go to the previous page when setPrevPage is called', () => {
    const { getByText } = render(
      <ListPaginationContextProvider
        value={{
          total: 7,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    fireEvent.click(getByText('next page'));

    fireEvent.click(getByText('previous page'));

    expect(getByText('currentPage: 1')).not.toBeNull();
    expect(getByText('totalPages: 4')).not.toBeNull();
    expect(getByText('pageSize: 2')).not.toBeNull();
    expect(getByText('next page')).not.toBeNull();
    expect(screen.queryByText('previous page')).toBeNull();
  });
});
