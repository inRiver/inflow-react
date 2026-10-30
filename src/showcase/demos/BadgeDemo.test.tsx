import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { BadgeDemo } from './BadgeDemo';

describe('BadgeDemo', () => {
  it('captions the MUI badge examples and gives each icon an accessible name', () => {
    renderWithInflow(<BadgeDemo />);

    expect(screen.getByText('Count: 4 unread')).toBeInTheDocument();
    expect(screen.getByText('Overflow: 99+')).toBeInTheDocument();
    expect(screen.getByTitle('Mail, 4 unread')).toBeInTheDocument();
  });
});
