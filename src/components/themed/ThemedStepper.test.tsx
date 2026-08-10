import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { InflowProvider } from '../../providers/InflowProvider';
import { ThemedStepper } from './ThemedStepper';

const steps = ['Configure', 'Options', 'Test', 'Review'].map((label) => ({ label }));
const navy = 'rgb(11, 45, 110)';
const grey = 'rgb(66, 70, 85)';

function renderStepper(activeStep = 1, completedStep?: number) {
  return render(
    <InflowProvider>
      <ThemedStepper steps={steps} activeStep={activeStep} completedStep={completedStep} />
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
    const { container } = renderStepper(1, 2);
    const completedLabels = Array.from(
      container.querySelectorAll('.MuiStep-root.Mui-completed .MuiStepLabel-label'),
    );

    expect(completedLabels.length).toBe(2);
    completedLabels.forEach((completedLabel) => {
      const completedStep = completedLabel.closest('.MuiStep-root');
      const completedIcon = completedStep?.querySelector('.MuiStepIcon-root');

      expect(completedIcon).not.toBeNull();
      const completedInner = completedIcon?.querySelector('span');
      expect(getComputedStyle(completedInner as Element).backgroundColor).toBe(navy);
      expect(getComputedColor(completedLabel)).toBe(navy);
    });
  });

  it('shows the active step with a ring and inner dot and a non-underlined label', () => {
    const { container } = renderStepper(1, 2);
    const activeStepLabel = container.querySelector('.MuiStepLabel-label.Mui-active');
    const activeLabelRoot = activeStepLabel?.closest('.MuiStepLabel-root, .MuiStepButton-root');
    const activeStep = activeStepLabel?.closest('.MuiStep-root');
    const activeIcon = activeStep?.querySelector('.MuiStepIcon-root');

    expect(activeStepLabel).toHaveTextContent('Options');
    expect(activeIcon).not.toBeNull();
    const activeDot = activeIcon?.querySelector('span');
    expect(activeDot).not.toBeNull();
    expect(getComputedStyle(activeDot as Element).backgroundColor).toBe(navy);
    expect(activeLabelRoot).not.toHaveClass('inflow-selected');
    expect(activeStepLabel && getComputedStyle(activeStepLabel).textDecoration).not.toContain('underline');
  });

  it('underlines all completed steps when activeStep equals completedStep', () => {
    const { container } = renderStepper(2, 2);
    const completedLabels = Array.from(
      container.querySelectorAll('.MuiStep-root.Mui-completed .MuiStepLabel-label'),
    );

    expect(completedLabels.length).toBe(2);
    completedLabels.forEach((label) => {
      expect(getComputedStyle(label).textDecoration).toContain('underline');
      const root = label.closest('.MuiStepLabel-root, .MuiStepButton-root');
      expect(root).toHaveClass('inflow-selected');
    });
  });

  it('marks the previously active step as completed when stepping back', () => {
    const { container } = renderStepper(1, 2);

    const labels = Array.from(container.querySelectorAll('.MuiStepLabel-label'));
    const testLabel = labels.find((l) => l.textContent?.trim() === 'Test');

    expect(testLabel?.classList.contains('Mui-completed')).toBe(true);
    expect(testLabel && getComputedStyle(testLabel).textDecoration).toContain('underline');
  });

  it('shows inactive steps with outlined grey circles and grey labels', () => {
    const { container } = renderStepper(1, 1);
    const root = container.querySelector('.MuiStepper-root');
    const activeLabel = container.querySelector('.MuiStepLabel-label.Mui-active');
    const completedLabels = container.querySelectorAll('.MuiStepLabel-label.Mui-completed');
    const allLabels = root?.querySelectorAll('.MuiStepLabel-label');

    expect(allLabels?.length).toBe(4);
    expect(completedLabels.length).toBe(1);
    const inactiveLabels = Array.from(allLabels ?? []).filter(
      (label) => label !== activeLabel && !Array.from(completedLabels).includes(label as Element),
    );

    expect(inactiveLabels.length).toBe(2);
    inactiveLabels.forEach((label) => {
      const step = label.closest('.MuiStep-root');
      const icon = step?.querySelector('.MuiStepIcon-root');

      expect(icon).not.toBeNull();
      expect(getComputedColor(icon)).toBe(grey);
      expect(getComputedColor(label)).toBe(grey);
    });
  });

  it('renders a continuous connector line behind the icons', () => {
    const { container } = renderStepper(2, 2);
    const connectors = container.querySelectorAll('.MuiStepConnector-root');

    expect(connectors.length).toBe(steps.length - 1);
    connectors.forEach((connector) => {
      expect(getComputedStyle(connector).display).toBe('none');
    });
  });

  it('updates step state when activeStep and completedStep change', () => {
    const { container, rerender } = render(
      <InflowProvider>
        <ThemedStepper steps={steps} activeStep={1} completedStep={1} />
      </InflowProvider>,
    );

    expect(container.querySelectorAll('.MuiStep-root.Mui-completed')).toHaveLength(1);
    expect(container.querySelector('.MuiStepLabel-label.Mui-active')).toHaveTextContent('Options');

    rerender(
      <InflowProvider>
        <ThemedStepper steps={steps} activeStep={3} completedStep={3} />
      </InflowProvider>,
    );

    expect(container.querySelectorAll('.MuiStep-root.Mui-completed')).toHaveLength(3);
    expect(container.querySelector('.MuiStepLabel-label.Mui-active')).toHaveTextContent('Review');
  });

  it('forwards ref to the Stepper root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <InflowProvider>
        <ThemedStepper ref={ref} steps={steps} activeStep={0} completedStep={0} />
      </InflowProvider>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(container.querySelector('.MuiStepper-root'));
  });

  it('calls onStepClick with the correct index', () => {
    const handleStepClick = vi.fn();
    const { container } = render(
      <InflowProvider>
        <ThemedStepper steps={steps} activeStep={0} completedStep={0} onStepClick={handleStepClick} />
      </InflowProvider>,
    );

    const buttons = container.querySelectorAll('.MuiStepButton-root');
    expect(buttons.length).toBe(steps.length);
    expect(handleStepClick).not.toHaveBeenCalled();

    (buttons[0] as HTMLElement).click();
    expect(handleStepClick).toHaveBeenCalledTimes(1);
    expect(handleStepClick).toHaveBeenCalledWith(0);
  });

  it('underlines completed steps except the active step', () => {
    const { container } = render(
      <InflowProvider>
        <ThemedStepper steps={steps} activeStep={1} completedStep={2} />
      </InflowProvider>,
    );

    const labels = Array.from(container.querySelectorAll('.MuiStepLabel-label'));

    const configureLabel = labels.find((l) => l.textContent === 'Configure');
    expect(configureLabel?.classList.contains('Mui-completed')).toBe(true);
    expect(configureLabel && getComputedStyle(configureLabel).textDecoration).toContain('underline');

    const optionsLabel = labels.find((l) => l.textContent === 'Options');
    expect(optionsLabel?.classList.contains('Mui-active')).toBe(true);
    expect(optionsLabel && getComputedStyle(optionsLabel).textDecoration).not.toContain('underline');

    const testLabel = labels.find((l) => l.textContent?.trim() === 'Test');
    expect(testLabel?.classList.contains('Mui-completed')).toBe(true);
    expect(testLabel && getComputedStyle(testLabel).textDecoration).toContain('underline');
  });

  it('does not render buttons when onStepClick is present but disableStepClick is true', () => {
    const handleStepClick = vi.fn();
    const { container } = render(
      <InflowProvider>
        <ThemedStepper
          steps={steps}
          activeStep={0}
          completedStep={0}
          onStepClick={handleStepClick}
          disableStepClick
        />
      </InflowProvider>,
    );

    expect(container.querySelectorAll('.MuiStepButton-root')).toHaveLength(0);
    expect(container.querySelectorAll('.MuiStepLabel-root')).toHaveLength(steps.length);
  });

  it('normalizes layout geometry so steps are exactly 24px wide regardless of hit area', () => {
    const handleStepClick = vi.fn();
    const { container } = render(
      <InflowProvider>
        <ThemedStepper steps={steps} activeStep={0} onStepClick={handleStepClick} />
      </InflowProvider>,
    );

    const stepRoots = container.querySelectorAll('.MuiStep-root');
    expect(stepRoots.length).toBe(steps.length);

    stepRoots.forEach((stepRoot) => {
      const style = getComputedStyle(stepRoot);
      expect(style.flex).toContain('0 0 24px');
      expect(style.minWidth).toBe('0px');
    });

    const labelRoots = container.querySelectorAll('.MuiStepLabel-root');
    expect(labelRoots.length).toBe(steps.length);
    labelRoots.forEach((labelRoot) => {
      const style = getComputedStyle(labelRoot);
      expect(style.width).toBe('24px');
      expect(style.minWidth).toBe('24px');
      expect(style.maxWidth).toBe('24px');
      expect(style.boxSizing).toBe('border-box');
    });

    const labelContainers = container.querySelectorAll('.MuiStepLabel-labelContainer');
    expect(labelContainers.length).toBe(steps.length);
    labelContainers.forEach((labelContainer) => {
      const style = getComputedStyle(labelContainer);
      expect(style.width).toBe('max-content');
      expect(style.whiteSpace).toBe('nowrap');
    });

    const icons = container.querySelectorAll('.MuiStepIcon-root');
    expect(icons.length).toBe(steps.length);
    icons.forEach((icon) => {
      const style = getComputedStyle(icon);
      expect(style.position).toBe('relative');
      expect(style.zIndex).toBe('2');
    });
  });
});
