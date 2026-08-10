import { forwardRef } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepButton,
  StepConnector,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import type { StepIconProps, StepperProps, Theme } from "@mui/material";

export interface ThemedStep {
  /** Label shown beneath the step icon. */
  label: React.ReactNode;
  /** Optional label rendered as MUI StepLabel's optionalLabel. */
  optional?: React.ReactNode;
  /** Marks the step as errored. */
  error?: boolean;
  /** Disables the step (passed to MUI Step). */
  disabled?: boolean;
}

export interface ThemedStepperProps extends Omit<StepperProps, "children"> {
  /** Steps to render. */
  steps: ThemedStep[];
  /** Callback fired when a step label is clicked. Enables non-linear navigation. */
  onStepClick?: (index: number) => void;
  /** Renders read-only labels even when onStepClick is supplied. */
  disableStepClick?: boolean;
  /**
   * Furthest step that has been completed. Steps before this index show a checkmark.
   * Defaults to `activeStep`, which gives standard linear stepper behavior.
   */
  completedStep?: number;
}

interface ThemedStepIconProps extends StepIconProps {
  /** True when this step is ahead of the furthest reached step. */
  isFuture?: boolean;
}

const ICON_SIZE = 24;
const INNER_CIRCLE_SIZE = 15;

const StepIconRoot = styled("span")<{ ownerState: ThemedStepIconProps }>(
  ({ theme, ownerState }) => ({
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    border: `2px solid ${ownerState.active ? theme.palette.primary.main : "transparent"}`,
    backgroundColor: "transparent",
    color: ownerState.completed
      ? theme.palette.common.white
      : ownerState.active
        ? theme.palette.primary.main
        : theme.palette.text.secondary,
    opacity: ownerState.isFuture ? 0.5 : 1,
    transition: theme.transitions.create("opacity"),
  }),
);

const InnerCircle = styled("span")<{ ownerState: ThemedStepIconProps }>(
  ({ theme, ownerState }) => ({
    width: INNER_CIRCLE_SIZE,
    height: INNER_CIRCLE_SIZE,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    backgroundColor: ownerState.completed
      ? theme.palette.primary.main
      : "transparent",
    border: ownerState.completed
      ? "none"
      : `2px solid ${theme.palette.text.secondary}`,
  }),
);

const InnerDot = styled("span")(({ theme }) => ({
  width: 13,
  height: 13,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
}));

function StepIconCheckmark() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ThemedStepIcon(props: ThemedStepIconProps) {
  const { active, completed, className } = props;

  return (
    <StepIconRoot
      ownerState={props}
      className={`MuiStepIcon-root${className ? ` ${className}` : ""}`}
      aria-label={completed ? "Completed" : active ? "Current" : "Incomplete"}
    >
      {active ? (
        <InnerDot />
      ) : (
        <InnerCircle ownerState={props}>
          {completed ? <StepIconCheckmark /> : null}
        </InnerCircle>
      )}
    </StepIconRoot>
  );
}

const ThemedStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: theme.palette.inflow.outlineVariant,
    borderTopWidth: 2,
  },
  "&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line":
    {
      borderColor: theme.palette.primary.main,
    },
}));

const selectedLabelStyle = (theme: Theme) => ({
  color: theme.palette.primary.main,
  textDecoration: "underline" as const,
});

const ThemedStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-completed": {
      color: theme.palette.primary.main,
    },
  },
  "&.inflow-selected .MuiStepLabel-label": selectedLabelStyle(theme),
}));

const StyledStepButton = styled(StepButton)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: theme.palette.primary.main,
  },
  "&.inflow-selected .MuiStepLabel-label": selectedLabelStyle(theme),
  "&.Mui-focusVisible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}));

/**
 * ThemedStepper
 *
 * A future-proof, scoped stepper component built on top of MUI's public Stepper APIs.
 * It renders the Inflow design-system stepper look: labels beneath icons, completed
 * steps as checkmarks in solid navy circles, active steps as navy circles with an inner
 * dot, and inactive steps as outlined grey circles. Connector lines and label colors
 * reflect each step's state.
 *
 * `activeStep` is the currently viewed step: it renders the ring + inner dot and is never
 * underlined. `completedStep` is the furthest reached step: those steps keep their checkmarks
 * and are underlined unless they are the active step. When `completedStep` is omitted, it
 * defaults to `activeStep`, giving standard linear stepper behavior.
 *
 * @example
 * ```tsx
 * import { ThemedStepper } from '@/components/themed';
 *
 * const steps = [
 *   { label: 'Configure' },
 *   { label: 'Options' },
 *   { label: 'Test' },
 *   { label: 'Review' },
 * ];
 *
 * <ThemedStepper activeStep={1} steps={steps} />
 * <ThemedStepper
 *   activeStep={currentStep}
 *   completedStep={furthestStep}
 *   steps={steps}
 *   onStepClick={(index) => {
 *     setCurrentStep(index);
 *     if (index > furthestStep) setFurthestStep(index);
 *   }}
 * />
 * ```
 */
export const ThemedStepper = forwardRef<HTMLDivElement, ThemedStepperProps>(
  (
    {
      steps,
      onStepClick,
      disableStepClick,
      completedStep,
      alternativeLabel = true,
      connector = <ThemedStepConnector />,
      sx,
      ...props
    },
    ref,
  ) => {
    const activeStep = props.activeStep ?? 0;
    const furthestCompletedStep = completedStep ?? activeStep;
    const clickable = Boolean(onStepClick) && !disableStepClick;

    return (
      <Stepper
        ref={ref}
        alternativeLabel={alternativeLabel}
        connector={connector}
        activeStep={activeStep}
        sx={[...(Array.isArray(sx) ? sx : [sx])]}
        {...props}
      >
        {steps.map((step, index) => {
          const active = index === activeStep;
          const completed = index <= furthestCompletedStep && index !== activeStep;
          const isFuture = index > furthestCompletedStep;
          const underline = completed;

          return (
            <Step key={index} completed={completed} disabled={step.disabled}>
              {clickable ? (
                <StyledStepButton
                  disableRipple
                  onClick={() => onStepClick?.(index)}
                  icon={
                    <ThemedStepIcon
                      icon={index + 1}
                      active={active}
                      completed={completed}
                      isFuture={isFuture}
                    />
                  }
                  className={underline ? "inflow-selected" : undefined}
                >
                  {step.label}
                </StyledStepButton>
              ) : (
                <ThemedStepLabel
                  slots={{ stepIcon: ThemedStepIcon }}
                  slotProps={{
                    stepIcon: { active, completed, isFuture } as ThemedStepIconProps,
                  }}
                  optional={step.optional}
                  error={step.error}
                  className={underline ? "inflow-selected" : undefined}
                >
                  {step.label}
                </ThemedStepLabel>
              )}
            </Step>
          );
        })}
      </Stepper>
    );
  },
);

ThemedStepper.displayName = "ThemedStepper";
