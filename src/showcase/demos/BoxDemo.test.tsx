import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { BoxDemo } from './BoxDemo';

const bg = (text: string) => getComputedStyle(screen.getByText(text).closest('div') as HTMLElement);

describe('BoxDemo', () => {
  it('renders the interactive box and every state', () => {
    renderWithInflow(<BoxDemo />);

    expect(screen.getAllByText('Primary Box').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Secondary Box')).toBeInTheDocument();
    expect(screen.getByText('Grey Box with Border')).toBeInTheDocument();
  });

  it('keeps the box label and its fill from the theme, so text stays readable in dark mode', () => {
    renderWithInflow(<BoxDemo />, { providerProps: { mode: 'dark' } });

    // Dark primary is a light blue, so white text would fail contrast. The label must be the theme's contrast text.
    const [box] = screen.getAllByText('Primary Box');
    const primary = bg('Secondary Box');
    expect(getComputedStyle(box.closest('div') as HTMLElement).color).not.toBe('rgb(255, 255, 255)');
    expect(primary.color).not.toBe('rgb(255, 255, 255)');
  });

  it('draws the grey box on a dark surface in dark mode and on grey.100 in light mode', () => {
    const { unmount } = renderWithInflow(<BoxDemo />, { providerProps: { mode: 'dark' } });
    expect(bg('Grey Box with Border').backgroundColor).not.toBe('rgb(245, 245, 245)');
    unmount();

    renderWithInflow(<BoxDemo />);
    expect(bg('Grey Box with Border').backgroundColor).toBe('rgb(245, 245, 245)');
  });
});
