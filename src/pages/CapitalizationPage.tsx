import {
  Box,
  Container,
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


type CaseStyle = 'Title Case' | 'Sentence case' | 'Sentence case (optional)';

interface CapitalizationRule {
  element: string;
  style: CaseStyle;
  examples: string[];
}

const rules: CapitalizationRule[] = [
  { element: 'Buttons', style: 'Title Case', examples: ['Add User', 'Submit Form'] },
  { element: 'Menu Items', style: 'Title Case', examples: ['Download PDF', 'Edit Profile'] },
  { element: 'Form Labels', style: 'Sentence case', examples: ['Email address', 'Phone number'] },
  { element: 'Placeholder Text', style: 'Sentence case (optional)', examples: ['Enter your email'] },
  { element: 'Error Messages', style: 'Sentence case', examples: ['This field is required.'] },
  { element: 'Tooltips', style: 'Sentence case', examples: ['Copy to clipboard'] },
  { element: 'Navigation Items', style: 'Title Case', examples: ['Settings', 'User Profile'] },
  { element: 'Headings (H1–H6)', style: 'Title Case', examples: ['User Management', 'Dashboard'] },
  { element: 'Table Column Headers', style: 'Title Case', examples: ['Name', 'Email Address'] },
  { element: 'Checkbox / Switch Labels', style: 'Sentence case', examples: ['Receive email updates'] },
  { element: 'Snackbar Messages', style: 'Sentence case', examples: ['Item added to cart.'] },
  { element: 'Modals', style: 'Sentence case', examples: ['Delete items?'] },
];

export function CapitalizationPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={4}>
        <Typography variant="h3">Capitalization</Typography>
        <Typography variant="body1">
          Use these rules for the text in every Inflow interface. They are based on Material Design guidelines
          and general UX best practices.
        </Typography>

        <TableContainer component={Paper} variant="outlined">
          <Table aria-label="Capitalization rules by UI element">
            <TableHead>
              <TableRow>
                <TableCell>UI Element</TableCell>
                <TableCell>Recommended Capitalization</TableCell>
                <TableCell>Example</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.element}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>
                    {rule.element}
                  </TableCell>
                                    <TableCell>{rule.style}</TableCell>
                  <TableCell>
                    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {rule.examples.map((example) => (
                        <Box key={example} component="code" sx={{ fontFamily: 'monospace' }}>
                          {example}
                        </Box>
                      ))}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
