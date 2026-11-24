import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { usePickerContext, usePickerTranslations } from '@mui/x-date-pickers/hooks';
import type { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';

/**
 * Compact action bar for MUI X pickers: small buttons, outlined Cancel/Clear/Today,
 * contained OK. The stock bar renders plain `<Button>`s, which pick up the Inflow
 * theme's default `contained` variant and look oversized and all-filled.
 */
export function InflowPickerActionBar({ actions, ...other }: PickersActionBarProps) {
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
        return <Button key={action} size="small" onClick={goToNextStep}>{translations.nextStepButtonLabel}</Button>;
      case 'accept':
        return <Button key={action} size="small" onClick={acceptValueChanges}>{translations.okButtonLabel}</Button>;
      case 'nextOrAccept':
        return hasNextStep ? (
          <Button key={action} size="small" onClick={goToNextStep}>{translations.nextStepButtonLabel}</Button>
        ) : (
          <Button key={action} size="small" onClick={acceptValueChanges}>{translations.okButtonLabel}</Button>
        );
      default:
        return null;
    }
  });

  return (
    <DialogActions {...other} sx={{ px: 1, pt: 0.5, pb: 1, gap: 1, '& > :not(style) ~ :not(style)': { ml: 0 } }}>
      {buttons}
    </DialogActions>
  );
}
