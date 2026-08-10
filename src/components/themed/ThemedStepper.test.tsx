import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InflowProvider } from '../../providers/InflowProvider';
import { ThemedStepper } from './ThemedStepper';

const steps = ['Configure', 'Options', 'Test', 'Review'].map((label) => ({ label }));
const navy = 'rgb(11, 45, 110)';
const grey = 'rgb(66, 70, 85)';
const connectorGrey = 'rgb(194, 198, 216)';

function renderStepper(activeStep = 1) {
  return render(
    <InflowProvider>
      <ThemedStepper steps={steps} activeStep={activeStep} />
    </InflowProvider>,
  );
}

function getComputedColor(element: Element | null | undefined) {
  if (!element) return '';
  return getComputedStyle(element).color;
}

describe('ThemedStepper', () => {
  it('renders the correct number of steps and labels', () => {
    const { container } = renderStepper();

    expect(container.querySelectorAll('.MuiStep-root')).toHaveLength(steps.length);
    steps.forEach(({ label }) => expect(screen.getByText(label)).toBeInTheDocument());
  });

  it('shows completed steps with a checkmark, solid navy circle, and navy label', () => {
    const { container } = renderStepper(2);
    const completedStep = container.querySelector('.MuiStep-root.Mui-completed');
    const completedIcon = completedStep?.querySelector('.MuiStepIcon-root');
    const completedLabel = completedStep?.querySelector('.MuiStepLabel-label');

    expect(completedIcon).not.toBeNull();
    expect(completedIcon?.querySelector('polyline')).not.toBeNull();
    const completedInner = completedIcon?.querySelector('span');
    expect(getComputedStyle(completedInner as Element).backgroundColor).toBe(navy);
    expect(getComputedColor(completedLabel)).toBe(navy);
  });

  it('shows the active step with an inner dot and underlined navy label', () => {
    const { container } = renderStepper(1);
    const activeStepLabel = container.querySelector('.MuiStepLabel-label.Mui-active');
    const activeLabelRoot = activeStepLabel?.closest('.MuiStepLabel-root, .MuiStepButton-root');
    const activeStep = activeStepLabel?.closest('.MuiStep-root');
    const activeIcon = activeStep?.querySelector('.MuiStepIcon-root');

    expect(activeIcon).not.toBeNull();
    expect(activeIcon?.querySelector('span')).not.toBeNull();
    expect(activeLabelRoot).toHaveClass('inflow-selected');
    expect(getComputedColor(activeStepLabel)).toBe(navy);
    expect(activeStepLabel && getComputedStyle(activeStepLabel).textDecoration).toContain('underline');
  });

  it('shows inactive steps with outlined grey circles and grey labels', () => {
    const { container } = renderStepper(1);
    const inactiveLabels = container.querySelectorAll('.MuiStepLabel-label:not(.Mui-active):not(.Mui-completed)');

    expect(inactiveLabels).toHaveLength(2);
    inactiveLabels.forEach((label) => {
      const step = label.closest('.MuiStep-root');
      const icon = step?.querySelector('.MuiStepIcon-root');

      expect(icon).not.toBeNull();
      expect(getComputedColor(icon)).toBe(grey);
      expect(getComputedColor(label)).toBe(grey);
    });
  });

  it('colors connector lines according to their step state', () => {
    const { container } = renderStepper(2);
    const connectors = container.querySelectorAll('.MuiStepConnector-root');
    const lines = container.querySelectorAll('.MuiStepConnector-line');

    expect(lines).toHaveLength(steps.length - 1);
    expect(connectors[0]).toHaveClass('Mui-completed');
    expect(connectors[1]).toHaveClass('Mui-active');
    expect(connectors[2]).not.toHaveClass('Mui-active');
    expect(connectors[2]).not.toHaveClass('Mui-completed');
    expect(getComputedStyle(lines[0]).borderTopColor).toBe(navy);
    expect(getComputedStyle(lines[1]).borderTopColor).toBe(navy);
    expect(getComputedStyle(lines[2]).borderTopColor).toBe(connectorGrey);
  });

  it('updates step state when activeStep changes', () => {
    const { container, rerender } = render(
      <InflowProvider>
        <ThemedStepper steps={steps} activeStep={1} />
      </InflowProvider>,
    );

    expect(container.querySelectorAll('.MuiStep-root.Mui-completed')).toHaveLength(1);
    expect(container.querySelector('.MuiStepLabel-label.Mui-active')).toHaveTextContent('Options');

    rerender(
      <InflowProvider>
        <ThemedStepper steps={steps} activeStep={3} />
      </InflowProvider>,
    );

    expect(container.querySelectorAll('.MuiStep-root.Mui-completed')).toHaveLength(3);
    expect(container.querySelector('.MuiStepLabel-label.Mui-active')).toHaveTextContent('Review');
  });

  it('forwards ref to the Stepper root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <InflowProvider>
        <ThemedStepper ref={ref} steps={steps} activeStep={0} />
      </InflowProvider>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(container.querySelector('.MuiStepper-root'));
  });

  it('calls onStepClick with the correct index', () => {
    const handleStepClick = vi.fn();
    const { container } = render(
      <InflowProvider>
        <ThemedStepper steps={steps} activeStep={0} onStepClick={handleStepClick} />
      </InflowProvider>,
    );

    const buttons = container.querySelectorAll('.MuiStepButton-root');
    expect(buttons.length).toBe(steps.length);
    expect(handleStepClick).not.toHaveBeenCalled();

    (buttons[0] as HTMLElement).click();
    expect(handleStepClick).toHaveBeenCalledTimes(1);
    expect(handleStepClick).toHaveBeenCalledWith(0);
  });

  it('does not render buttons when onStepClick is present but disableStepClick is true', () => {
    const handleStepClick = vi.fn();
    const { container } = render(
      <InflowProvider>
        <ThemedStepper
          steps={steps}
          activeStep={0}
          onStepClick={handleStepClick}
          disableStepClick
        />
      </InflowProvider>,
    );

    expect(container.querySelectorAll('.MuiStepButton-root')).toHaveLength(0);
    expect(container.querySelectorAll('.MuiStepLabel-root')).toHaveLength(steps.length);
  });
});
