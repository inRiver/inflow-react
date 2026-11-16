import { fireEvent, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ThemedTablePage, type Column } from '../../index';
import { renderWithInflow } from '../../test/renderWithInflow';

type Product = { id: string; name: string };
const columns: Column<Product>[] = [{ id: 'name', label: 'Name', render: (row) => row.name }];
const data: Product[] = [{ id: '1', name: 'Mower' }];

describe('ThemedTablePage', () => {
  it.each(['light', 'dark'] as const)('renders header, toolbar and table in %s mode', (mode) => {
    const onRowClick = vi.fn();
    const ref = createRef<HTMLDivElement>();
    renderWithInflow(
      <ThemedTablePage
        ref={ref}
        header={{ title: 'Products', actions: [{ label: 'Add product' }] }}
        toolbar={<form role="search" aria-label="Product filters"><button>Filter</button></form>}
        columns={columns}
        data={data}
        tableProps={{ 'aria-label': 'Products', keyExtractor: (row) => row.id, onRowClick }}
        sx={[{ maxWidth: '100%' }, { minWidth: 0 }]}
      />,
      { providerProps: { mode } },
    );

    expect(screen.getByRole('heading', { name: 'Products', level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add product' })).toBeInTheDocument();
    expect(screen.getByRole('search', { name: 'Product filters' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Products' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('row', { name: 'Mower' }));
    expect(onRowClick).toHaveBeenCalledWith(data[0], 0, expect.anything());
    expect(ref.current).toContainElement(screen.getByRole('table'));
  });

  it('prioritizes loading over stale rows and empty state, then renders data or empty content', () => {
    const { rerender } = renderWithInflow(
      <ThemedTablePage columns={columns} data={data} loading loadingContent="Loading products" emptyContent="No products" />,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading products');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    rerender(<ThemedTablePage columns={columns} data={[]} loading emptyContent="No products" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');

    rerender(<ThemedTablePage columns={columns} data={[]} emptyContent="No products" />);
    expect(screen.getByRole('status')).toHaveTextContent('No products');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    rerender(<ThemedTablePage columns={columns} data={data} />);
    expect(screen.getByRole('cell', { name: 'Mower' })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('provides a default empty message', () => {
    renderWithInflow(<ThemedTablePage columns={columns} data={[]} />);
    expect(screen.getByRole('status')).toHaveTextContent('No data available');
  });
});
