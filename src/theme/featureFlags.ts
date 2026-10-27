export const INFLOW_DARK_MODE_ENABLED = false;

type PublishedInflowColorMode = 'light' | 'dark';

declare const process:
  | {
      env?: {
        NODE_ENV?: string;
      };
    }
  | undefined;

const DARK_MODE_DISABLED_WARNING =
  "Inflow dark mode is currently disabled; falling back to light mode. Requested mode: 'dark'.";

const shouldWarnAboutDisabledDarkMode =
  typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';

export const resolveInflowColorMode = (
  mode: PublishedInflowColorMode,
): PublishedInflowColorMode => {
  if (INFLOW_DARK_MODE_ENABLED || mode !== 'dark') {
    return mode;
  }

  if (shouldWarnAboutDisabledDarkMode) {
    console.warn(DARK_MODE_DISABLED_WARNING);
  }

  return 'light';
};
