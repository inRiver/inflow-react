import { fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ComponentSidebar } from './ComponentSidebar';

function Location() { return <output aria-label="Current route">{useLocation().pathname}</output>; }

describe('ComponentSidebar local assets entry', () => {
  it('navigates to the local assets guide', () => {
    renderWithInflow(<MemoryRouter><ComponentSidebar open onClose={vi.fn()} searchQuery="" onSearchQueryChange={vi.fn()} /><Location /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Local assets' }));
    expect(screen.getByLabelText('Current route')).toHaveTextContent('/local-assets');
  });
});


describe('ComponentSidebar documentation entries', () => {
  it.each([
    ['Getting started', '/getting-started'],
    ['Theming', '/theming'],
    ['CLI reference', '/cli'],
  ])('navigates from %s to %s', (label, path) => {
    renderWithInflow(<MemoryRouter><ComponentSidebar open onClose={vi.fn()} searchQuery="" onSearchQueryChange={vi.fn()} /><Location /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(screen.getByLabelText('Current route')).toHaveTextContent(path);
    expect(screen.getByRole('button', { name: label })).toHaveClass('Mui-selected');
  });
});
