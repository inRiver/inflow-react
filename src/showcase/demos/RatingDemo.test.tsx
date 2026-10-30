import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { RatingDemo } from './RatingDemo';

describe('RatingDemo', () => {
  it('labels the interactive, read-only, disabled and half-star examples', () => {
    renderWithInflow(<RatingDemo />);

    expect(screen.getByText('Interactive: click to rate')).toBeInTheDocument();
    expect(screen.getByText('Read-only: 4 out of 5')).toBeInTheDocument();
    expect(screen.getByText('Disabled: 3 out of 5')).toBeInTheDocument();
    expect(screen.getByText('Half-star precision: starts at 2')).toBeInTheDocument();
  });
});
