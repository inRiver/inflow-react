import {
  Box,
  Container,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { formatDate, formatDateTime, formatTime, getDateTimeFormats } from '../datetime';

// One fixed moment so the examples are the real output of the shared formatters, not hand-typed copies.
const EXAMPLE = '2022-03-09T16:33:00';

const US = { locale: 'en' } as const;
const us = getDateTimeFormats(US);

interface FormatRule {
  value: string;
  format: string;
  example: string;
  use: string;
}

const localeRows = [
  { locale: 'en', name: 'English (US)' },
  { locale: 'en-GB', name: 'English (UK)' },
  { locale: 'de', name: 'German' },
  { locale: 'sv', name: 'Swedish' },
  { locale: 'fr', name: 'French' },
  { locale: 'ja', name: 'Japanese' },
].map(({ locale, name }) => ({
  name,
  date: formatDate(EXAMPLE, { locale }),
  time: formatTime(EXAMPLE, { locale }),
  dateTime: formatDateTime(EXAMPLE, { locale }),
}));

const fixedStyles = (['iso', 'unambiguous'] as const).map((style) => ({
  name: style === 'iso' ? 'ISO' : 'Unambiguous',
  style,
  format: getDateTimeFormats({ style, locale: 'de' }).dateTime,
  example: formatDateTime(EXAMPLE, { style, locale: 'de' }),
  use:
    style === 'iso'
      ? 'Exports, logs and anything copied into tickets or other systems.'
      : 'Views that people in several regions read together, such as audit trails.',
}));

const dateTimeRules: FormatRule[] = [
  { value: 'Date', format: us.date, example: formatDate(EXAMPLE, US), use: 'Dates on their own, such as a due date or a birthday.' },
  { value: 'Time', format: us.time, example: formatTime(EXAMPLE, US), use: 'Times on their own, such as an alarm or a meeting.' },
  {
    value: 'Date and time',
    format: us.dateTime,
    example: formatDateTime(EXAMPLE, US),
    use: 'A moment in time, such as when a record was created or changed.',
  },
];

const code = (text: string) => (
  <Box component="code" sx={{ fontFamily: 'monospace' }}>
    {text}
  </Box>
);

const li = (children: React.ReactNode) => (
  <li>
    <Typography variant="body1">{children}</Typography>
  </li>
);

export function ContentStandardsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">Content standards</Typography>
        <Typography variant="body1">
          How text and values are written and formatted in every Inflow interface, so the same thing looks the same
          everywhere. For the casing of labels, buttons and headings, see <Link component={RouterLink} to="/capitalization">
            Capitalization
          </Link>.
        </Typography>

        <Stack spacing={2}>
          <Typography variant="h4" component="h2">
            Dates and times
          </Typography>
          <Typography variant="body1">
            Never show a raw ISO string such as{' '}
            {code('2026-08-04T02:14:00.000Z')} in the interface, including in table cells and filter lists.
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table aria-label="Date and time formats">
              <TableHead>
                <TableRow>
                  <TableCell>Value</TableCell>
                  <TableCell>Format (English US)</TableCell>
                  <TableCell>Example (English US)</TableCell>
                  <TableCell>Use for</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dateTimeRules.map((rule) => (
                  <TableRow key={rule.value}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>
                      {rule.value}
                    </TableCell>
                    <TableCell>{code(rule.format)}</TableCell>
                    <TableCell>{code(rule.example)}</TableCell>
                    <TableCell>{rule.use}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" component="h3">
            Locale
          </Typography>
          <Typography variant="body1">
            Follow the user's locale, so the order, separators and clock are what they expect. English (US) matches the
            PIM table. The US writes month first and many other countries write day first, so a fixed order can be
            misread.
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table aria-label="Date and time by locale">
              <TableHead>
                <TableRow>
                  <TableCell>Locale</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Date and time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {localeRows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>
                      {row.name}
                    </TableCell>
                    <TableCell>{code(row.date)}</TableCell>
                    <TableCell>{code(row.time)}</TableCell>
                    <TableCell>{code(row.dateTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" component="h3">
            Fixed styles for shared views
          </Typography>
          <Typography variant="body1">
            Where people from several regions read the same view, use a fixed style so nobody has to guess whether{' '}
            {code('3/9/2022')} is March or September. Do not mix styles within one screen.
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table aria-label="Fixed date and time styles">
              <TableHead>
                <TableRow>
                  <TableCell>Style</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell>Example</TableCell>
                  <TableCell>Use for</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fixedStyles.map((row) => (
                  <TableRow key={row.style}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>
                      {row.name}
                    </TableCell>
                    <TableCell>{code(row.format)}</TableCell>
                    <TableCell>{code(row.example)}</TableCell>
                    <TableCell>{row.use}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" component="h3">
            Rules
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {li(
              <>
                Write AM and PM in capitals, with a space and no periods: {code('2:00 PM')}. On a 24-hour clock do not
                show AM or PM: {code('14:00')}. Remove the leading zero from single-digit hours.
              </>,
            )}
            {li('Put the date before the time, separated by a single space.')}
            {li(
              <>
                Show a date with no time, such as a due date or birthday, exactly as it is. It never moves to another
                day.
              </>,
            )}
            {li(
              <>
                Show times in the user's timezone, which the PIM sets. Do not add a timezone label to a value. Add one
                only where a missing zone could cause confusion, such as an event for people in several regions.
              </>,
            )}
            {li(
              <>
                Separate a range with an en dash and no spaces: {code('8:00 AM–12:30 PM')}. Add spaces when a month is
                spelled out or the range would be unclear: {code('6 Jan – 2 Feb')}. Use one AM or PM when both times
                share it: {code('8:00–10:30 AM')}.
              </>,
            )}
            {li(
              <>
                Show the year at both ends of a date range, such as {code('Dec 6, 2013–Jan 2, 2014')}, unless both dates
                are in the current year.
              </>,
            )}
            {li(
              <>
                Approximate (relative) time rounds down to the largest unit, such as {code('3 days ago')} or{' '}
                {code('In 5 minutes')}. Use the exact date and time when an approximation isn't appropriate.
              </>,
            )}
            {li(
              <>
                Show the length of a recording or other duration as {code('H:MM:SS')}, leaving out hours or seconds that
                do not apply: {code('0:30')}, {code('1:01:05')}. Use the same format for the same kind of value across a
                page.
              </>,
            )}
          </Box>
          <Typography variant="body1">
            Tables always show the year, so sorting and filtering read clearly.
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
