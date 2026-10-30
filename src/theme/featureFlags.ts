// Dark mode is on only in the local dev server (`npm run dev`) so it can be reviewed in the
// showcase. Vite replaces `import.meta.env.DEV` with `false` in production builds, so the
// published library and the deployed showcase stay light-only until this is flipped on purpose.
export const INFLOW_DARK_MODE_ENABLED: boolean = import.meta.env.DEV;

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
