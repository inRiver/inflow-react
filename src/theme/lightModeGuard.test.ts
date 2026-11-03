import { describe, expect, it } from 'vitest';
import { inflowGridThemeParams, inflowGridThemeParamsDark } from '../ag-grid';
import { baseTokens, lightTokens } from './inflow-tokens';
import { createInflowTheme } from './inflow';

// Light mode is the shipped look. Dark mode work must not change it.
// If one of these snapshots fails, a light color changed: either revert it, or update the
// snapshot on purpose (`npx vitest --run -u`) and call it out as a visual change in the changelog.
describe('light mode stays unchanged while dark mode is built', () => {
  it('keeps the shared status colors and radii', () => {
    expect(baseTokens).toMatchInlineSnapshot(`
      {
        "error": {
          "dark": "#c62828",
          "light": "#ef5350",
          "main": "#ba1a1a",
        },
        "info": {
          "dark": "#00419f",
          "light": "#2067cc",
          "main": "#0057cf",
        },
        "radiusFull": 9999,
        "radiusLg": 10,
        "radiusMd": 8,
        "radiusSm": 5,
        "radiusXl": 28,
        "radiusXs": 4,
        "success": {
          "dark": "#1b5e20",
          "light": "#4caf50",
          "main": "#2c9b4b",
        },
        "warning": {
          "dark": "#e65100",
          "light": "#ff9800",
          "main": "#ff6424",
        },
      }
    `);
  });

  it('keeps the light tokens', () => {
    expect(lightTokens).toMatchInlineSnapshot(`
      {
        "appBackground": "#ebf1fc",
        "certaintyHigh": "#2c9b4b",
        "certaintyMedium": "#ff9800",
        "diffAddedBg": "#d6efdd",
        "diffAddedText": "#1e4620",
        "diffRemovedBg": "#f4d9d9",
        "diffRemovedText": "#5f2120",
        "error": {
          "dark": "#c62828",
          "light": "#ef5350",
          "main": "#ba1a1a",
        },
        "highlightGreen": "#d6efdd",
        "highlightRed": "#f4d9d9",
        "highlightYellow": "#fff2cc",
        "info": {
          "dark": "#00419f",
          "light": "#2067cc",
          "main": "#0057cf",
        },
        "inverseOnSurface": "#f0f0f7",
        "inverseSurface": "#2e3038",
        "mandatoryRow": "#e6f1ff",
        "navSurface": "#0b2d6e",
        "navy100": "#ebf1fc",
        "navy400": "#485d92",
        "navy600": "#0057cf",
        "navy700": "#0b2d6e",
        "navy800": "#22243d",
        "navy900": "#16243d",
        "navyDark": "#003687",
        "onSurface": "#191b24",
        "onSurfaceVariant": "#424655",
        "outline": "#727787",
        "outlineVariant": "#c2c6d8",
        "primaryFixed": "#dae2ff",
        "primaryTab": "#c3defe",
        "radiusFull": 9999,
        "radiusLg": 10,
        "radiusMd": 8,
        "radiusSm": 5,
        "radiusXl": 28,
        "radiusXs": 4,
        "ratingActive": "#0b2d6e",
        "rowHover": "#f1f6fe",
        "rowSelected": "rgba(11,45,110,0.08)",
        "rowSelectedHover": "rgba(11,45,110,0.14)",
        "secondaryFixed": "#dfe2f9",
        "success": {
          "dark": "#1b5e20",
          "light": "#4caf50",
          "main": "#2c9b4b",
        },
        "surfaceContainer": "#edf2fb",
        "surfaceContainerHigh": "#e8edf7",
        "surfaceHighest": "#e3e9f8",
        "surfaceLow": "#f1f6fe",
        "surfaceLowest": "#ffffff",
        "surfaceVariant": "#d8e0f4",
        "tertiaryFixed": "#ffd8e4",
        "toastInfoBg": "#c9dcff",
        "warning": {
          "dark": "#e65100",
          "light": "#ff9800",
          "main": "#ff6424",
        },
        "white": "#ffffff",
      }
    `);
  });

  it('keeps the light AG Grid params', () => {
    expect(inflowGridThemeParams).toMatchInlineSnapshot(`
      {
        "accentColor": "#0b2d6e",
        "backgroundColor": "#ffffff",
        "borderColor": "#c2c6d8",
        "cellHorizontalPadding": 16,
        "cellTextColor": "#424655",
        "cellWidgetSpacing": 12,
        "checkboxBorderRadius": 2,
        "checkboxBorderWidth": 2,
        "checkboxCheckedBackgroundColor": "#0b2d6e",
        "checkboxCheckedBorderColor": "#0b2d6e",
        "checkboxCheckedShapeColor": "#ffffff",
        "checkboxIndeterminateBackgroundColor": "#0b2d6e",
        "checkboxIndeterminateBorderColor": "#0b2d6e",
        "checkboxIndeterminateShapeColor": "#ffffff",
        "checkboxUncheckedBackgroundColor": "#ffffff",
        "checkboxUncheckedBorderColor": "#727787",
        "fontFamily": ""Inter", system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        "fontSize": "0.875rem",
        "foregroundColor": "#191b24",
        "headerBackgroundColor": "#ffffff",
        "headerHeight": 48,
        "headerTextColor": "#191b24",
        "inputFocusBorder": "1px solid #0b2d6e",
        "oddRowBackgroundColor": "#ffffff",
        "pinnedColumnBorder": false,
        "rangeSelectionBackgroundColor": "#dae2ff",
        "rangeSelectionBorderColor": "#0b2d6e",
        "rowBorder": "1px solid #c2c6d8",
        "rowHeight": 52,
        "rowHoverColor": "#f1f6fe",
        "selectedRowBackgroundColor": "#dae2ff",
        "wrapperBorderRadius": 4,
      }
    `);
  });

  it('keeps the light MUI palette', () => {
    const { primary, secondary, error, warning, info, success, text, divider, action, background, inflow } =
      createInflowTheme('light').palette;

    expect({ primary, secondary, error, warning, info, success, text, divider, action, background, inflow })
      .toMatchInlineSnapshot(`
        {
          "action": {
            "activatedOpacity": 0.12,
            "active": "rgba(0, 0, 0, 0.54)",
            "disabled": "rgba(0,0,0,0.38)",
            "disabledBackground": "rgba(0,0,0,0.12)",
            "disabledOpacity": 0.38,
            "focus": "rgba(0, 0, 0, 0.12)",
            "focusOpacity": 0.12,
            "hover": "#f1f6fe",
            "hoverOpacity": 0.04,
            "selected": "rgba(11,45,110,0.08)",
            "selectedOpacity": 0.08,
          },
          "background": {
            "default": "#ebf1fc",
            "paper": "#ffffff",
          },
          "divider": "#c2c6d8",
          "error": {
            "contrastText": "#ffffff",
            "dark": "#c62828",
            "light": "#ef5350",
            "main": "#ba1a1a",
          },
          "inflow": {
            "appBackground": "#ebf1fc",
            "certaintyHigh": "#2c9b4b",
            "certaintyMedium": "#ff9800",
            "diffAddedBg": "#d6efdd",
            "diffAddedText": "#1e4620",
            "diffRemovedBg": "#f4d9d9",
            "diffRemovedText": "#5f2120",
            "highlightGreen": "#d6efdd",
            "highlightRed": "#f4d9d9",
            "highlightYellow": "#fff2cc",
            "inverseOnSurface": "#f0f0f7",
            "inverseSurface": "#2e3038",
            "mandatoryRow": "#e6f1ff",
            "navSurface": "#0b2d6e",
            "navy100": "#ebf1fc",
            "navy700": "#0b2d6e",
            "navy800": "#22243d",
            "navy900": "#16243d",
            "outline": "#727787",
            "outlineVariant": "#c2c6d8",
            "primaryFixed": "#dae2ff",
            "primaryTab": "#c3defe",
            "rowHover": "#f1f6fe",
            "rowSelected": "rgba(11,45,110,0.08)",
            "rowSelectedHover": "rgba(11,45,110,0.14)",
            "secondaryFixed": "#dfe2f9",
            "surfaceContainer": "#edf2fb",
            "surfaceContainerHigh": "#e8edf7",
            "surfaceHighest": "#e3e9f8",
            "surfaceLow": "#f1f6fe",
            "surfaceLowest": "#ffffff",
            "surfaceVariant": "#d8e0f4",
            "tertiaryFixed": "#ffd8e4",
            "toastInfoBg": "#c9dcff",
          },
          "info": {
            "contrastText": "#ffffff",
            "dark": "#00419f",
            "light": "#2067cc",
            "main": "#0057cf",
          },
          "primary": {
            "contrastText": "#ffffff",
            "dark": "#003687",
            "light": "#485d92",
            "main": "#0b2d6e",
          },
          "secondary": {
            "contrastText": "#ffffff",
            "dark": "#000000",
            "light": "#22243d",
            "main": "#22243d",
          },
          "success": {
            "contrastText": "#ffffff",
            "dark": "#1b5e20",
            "light": "#4caf50",
            "main": "#2c9b4b",
          },
          "text": {
            "disabled": "rgba(0,0,0,0.38)",
            "primary": "#191b24",
            "secondary": "#424655",
          },
          "warning": {
            "contrastText": "#ffffff",
            "dark": "#e65100",
            "light": "#ff9800",
            "main": "#ff6424",
          },
        }
      `);
  });
});

describe('dark AG Grid params', () => {
  it('define every parameter the light params define', () => {
    expect(Object.keys(inflowGridThemeParamsDark).sort()).toEqual(Object.keys(inflowGridThemeParams).sort());
  });
});
