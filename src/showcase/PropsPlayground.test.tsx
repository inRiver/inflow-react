import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../test/renderWithInflow';
import { PropsPlayground } from './PropsPlayground';

describe('PropsPlayground', () => {
  it('left-aligns the settings controls', () => {
    renderWithInflow(
      <PropsPlayground
        schema={[
          { name: 'size', type: 'select', options: ['small', 'medium'] },
          { name: 'disabled', type: 'boolean' },
        ]}
        values={{ size: 'small', disabled: false }}
        onChange={() => {}}
      />,
    );

    const controls = screen.getByRole('checkbox', { name: 'disabled' }).closest('.MuiBox-root')!.parentElement!;
    expect(getComputedStyle(controls).justifyContent).toBe('flex-start');
  });
});
