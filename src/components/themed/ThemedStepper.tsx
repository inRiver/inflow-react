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
import { useTheme } from "@mui/material/styles";

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
    position: "relative",
    zIndex: 2,
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
      : `2px solid ${theme.palette.text.secondary}`,    opacity: ownerState.isFuture ? 0.5 : 1,
    transition: theme.transitions.create("opacity"),
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

const HiddenStepConnector = styled(StepConnector)({
  "&&": {
    display: "none",
  },
});

const ThemedStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: theme.palette.inflow.outlineVariant,
    borderTopWidth: 2,
  },
  "&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line": {
    borderColor: theme.palette.primary.main,
  },
}));

function buildConnectorGradient(
  steps: ThemedStep[],
  activeStep: number,
  completedStep: number | undefined,
  theme: Theme,
) {
  if (steps.length < 2) return "none";
  const furthestReached = Math.max(activeStep, completedStep ?? activeStep);
  const segments: string[] = [];
  for (let i = 0; i < steps.length - 1; i++) {
    const startPct = (i / (steps.length - 1)) * 100;
    const endPct = ((i + 1) / (steps.length - 1)) * 100;
    const visibleStart = `calc(${startPct}% + ${ICON_SIZE / 2}px + var(--ThemedStepper-connector-reduction, 0px) / 2)`;
    const visibleEnd = `calc(${endPct}% - ${ICON_SIZE / 2}px - var(--ThemedStepper-connector-reduction, 0px) / 2)`;
    const color =
      i < furthestReached
        ? theme.palette.primary.main
        : theme.palette.inflow.outlineVariant;
    segments.push(
      `transparent ${startPct}%`,
      `transparent ${visibleStart}`,
      `${color} ${visibleStart}`,
      `${color} ${visibleEnd}`,
      `transparent ${visibleEnd}`,
      `transparent ${endPct}%`,
    );
  }
  return `linear-gradient(to right, ${segments.join(", ")})`;
}

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
      connector,
      sx,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const activeStep = props.activeStep ?? 0;
    const furthestCompletedStep = completedStep ?? activeStep;
    const clickable = Boolean(onStepClick) && !disableStepClick;
    const connectorGradient = buildConnectorGradient(
      steps,
      activeStep,
      completedStep,
      theme,
    );
    const hasCustomConnector = connector !== undefined && connector !== null;
    const useOverlayConnector = alternativeLabel && !hasCustomConnector;
    const resolvedConnector = connector ?? (
      alternativeLabel ? <HiddenStepConnector /> : <ThemedStepConnector />
    );

    return (
      <Stepper
        ref={ref}
        alternativeLabel={alternativeLabel}
        connector={resolvedConnector}
        activeStep={activeStep}
        sx={[
          {
            ...(alternativeLabel
              ? {
                  position: "relative",
                  justifyContent: "space-between",
                  "--ThemedStepper-connector-reduction": "0px",
                  ...(useOverlayConnector
                    ? {
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: "11px",
                          left: "12px",
                          right: "12px",
                          height: "2px",
                          zIndex: 0,
                          pointerEvents: "none",
                          borderRadius: "1px",
                          background: connectorGradient,
                        },
                      }
                    : {}),
                  "& .MuiStep-root": {
                    flex: `0 0 ${ICON_SIZE}px`,
                    minWidth: 0,
                    zIndex: 1,
                    padding: 0,
                    display: "flex",
                    justifyContent: "center",
                  },
                  "& .MuiStepLabel-root": {
                    width: ICON_SIZE,
                    minWidth: ICON_SIZE,
                    maxWidth: ICON_SIZE,
                    boxSizing: "border-box",
                  },
                  "& .MuiStepLabel-labelContainer": {
                    width: "max-content",
                    whiteSpace: "nowrap",
                  },
                  "& .MuiStep-root:first-of-type": {
                    justifyContent: "flex-start",
                    "& .MuiStepLabel-root": {
                      alignItems: "flex-start",
                    },
                    "& .MuiStepLabel-labelContainer": {
                      textAlign: "left",
                    },
                    "& .MuiStepLabel-label": {
                      textAlign: "left",
                    },
                  },
                  "& .MuiStep-root:last-of-type": {
                    justifyContent: "flex-end",
                    "& .MuiStepLabel-root": {
                      alignItems: "flex-end",
                    },
                    "& .MuiStepLabel-labelContainer": {
                      textAlign: "right",
                    },
                    "& .MuiStepLabel-label": {
                      textAlign: "right",
                    },
                  },
                }
              : {}),
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
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
