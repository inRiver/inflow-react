import { Button, DialogActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { usePickerContext, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import type { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';

// Same name and slot as the stock bar, so `MuiPickersLayout` theme overrides still reach it. The compact layout is the
// base style, which a theme override, and then a consumer's `sx`, can both replace.
const ActionBarRoot = styled(DialogActions, { name: 'MuiPickersLayout', slot: 'ActionBar' })(
  ({ theme, disableSpacing }) => ({
    padding: theme.spacing(0.5, 1, 1),
    gap: disableSpacing ? 0 : theme.spacing(1),
    '& > :not(style) ~ :not(style)': { marginLeft: 0 },
  }),
);

/**
 * Compact action bar for MUI X pickers: small buttons, outlined Cancel/Clear/Today,
 * contained OK. The stock bar renders plain `<Button>`s, which pick up the Inflow
 * theme's default `contained` variant and look oversized and all-filled.
 */
export function InflowPickerActionBar({ actions, sx, ...other }: PickersActionBarProps) {
  const translations = usePickerTranslations();
  const { clearValue, setValueToToday, acceptValueChanges, cancelValueChanges, goToNextStep, hasNextStep } =
    usePickerContext();

  if (!actions?.length) return null;

  const buttons = actions.map((action) => {
    switch (action) {
      case 'clear':
        return <Button key={action} size="small" variant="outlined" onClick={clearValue}>{translations.clearButtonLabel}</Button>;
      case 'cancel':
        return <Button key={action} size="small" variant="outlined" onClick={cancelValueChanges}>{translations.cancelButtonLabel}</Button>;
      case 'today':
        return <Button key={action} size="small" variant="outlined" onClick={setValueToToday}>{translations.todayButtonLabel}</Button>;
      case 'next':
        return <Button key={action} size="small" variant="contained" onClick={goToNextStep}>{translations.nextStepButtonLabel}</Button>;
      case 'accept':
        return <Button key={action} size="small" variant="contained" onClick={acceptValueChanges}>{translations.okButtonLabel}</Button>;
      case 'nextOrAccept':
        return hasNextStep ? (
          <Button key={action} size="small" variant="contained" onClick={goToNextStep}>{translations.nextStepButtonLabel}</Button>
        ) : (
          <Button key={action} size="small" variant="contained" onClick={acceptValueChanges}>{translations.okButtonLabel}</Button>
        );
      default:
        return null;
    }
  });

  return (
    <ActionBarRoot {...other} sx={sx}>
      {buttons}
    </ActionBarRoot>
  );
}
