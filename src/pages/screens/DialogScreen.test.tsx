import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithInflow } from '../../test/renderWithInflow';
import DialogScreen from './DialogScreen';

describe('DialogScreen', () => {
  it('keeps reached steps completed when navigating back', async () => {
    // Given
    const user = userEvent.setup();
    renderWithInflow(<DialogScreen />);
    await user.click(screen.getByRole('button', { name: 'Open Form Dialog' }));

    // When
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Back' }));

    // Then
    const confirmationStep = screen.getByText('Confirmation').closest('.MuiStep-root');
    expect(confirmationStep?.querySelector('.MuiStepIcon-root')).toHaveAttribute(
      'aria-label',
      'Completed',
    );
  });
});
