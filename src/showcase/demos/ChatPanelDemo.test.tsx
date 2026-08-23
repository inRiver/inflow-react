import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import { ChatPanelDemo } from './ChatPanelDemo';

describe('ChatPanelDemo', () => {
  it('starts with the input hint turned off', () => {
    renderWithInflow(<ChatPanelDemo />);

    expect(screen.getByRole('checkbox', { name: 'Show input hint' })).not.toBeChecked();
  });
});
