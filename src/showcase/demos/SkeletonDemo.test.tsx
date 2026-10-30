import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { SkeletonDemo } from './SkeletonDemo';

const interactive = () => document.querySelector('.MuiSkeleton-root') as HTMLElement;
const pickVariant = (option: string) => {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: 'variant' }));
  fireEvent.click(screen.getByRole('option', { name: option }));
};

describe('SkeletonDemo', () => {
  it('renders the interactive skeleton and every variant in All States', () => {
    renderWithInflow(<SkeletonDemo />);

    expect(screen.getByText('Skeleton - Interactive')).toBeInTheDocument();
    expect(screen.getByText('All States')).toBeInTheDocument();
    for (const variant of ['text', 'circular', 'rectangular', 'rounded']) {
      expect(document.querySelector(`.MuiSkeleton-${variant}`)).not.toBeNull();
    }
  });

  it('draws the interactive text skeleton as a line, not a 60px block', () => {
    renderWithInflow(<SkeletonDemo />);

    expect(interactive()).toHaveClass('MuiSkeleton-text');
    expect(interactive().style.width).toBe('210px');
    // A text skeleton takes its height from the font, which is MUI's standard line. A fixed 60px made it a tall bar.
    expect(interactive().style.height).toBe('');
  });

  it.each(['rectangular', 'rounded'])('gives the %s skeleton a 210 by 60 box', (variant) => {
    renderWithInflow(<SkeletonDemo />);

    pickVariant(variant);
    expect(interactive()).toHaveClass(`MuiSkeleton-${variant}`);
    expect(interactive().style.width).toBe('210px');
    expect(interactive().style.height).toBe('60px');
  });

  it('draws the circular skeleton as a 60px circle, not a 210 by 60 oval', () => {
    renderWithInflow(<SkeletonDemo />);

    pickVariant('circular');
    expect(interactive()).toHaveClass('MuiSkeleton-circular');
    expect(interactive().style.width).toBe('60px');
    expect(interactive().style.height).toBe('60px');
  });
});
