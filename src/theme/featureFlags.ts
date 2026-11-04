// Dark mode is generally available: it ships enabled in the published library and the deployed
// showcase. The flag remains as a stable public export so consumers can detect support; it is now
// always true.
export const INFLOW_DARK_MODE_ENABLED: boolean = true;

type PublishedInflowColorMode = 'light' | 'dark';

export const resolveInflowColorMode = (
  mode: PublishedInflowColorMode,
): PublishedInflowColorMode => mode;
