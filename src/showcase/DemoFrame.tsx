import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface DemoFrameProps {
  children: ReactNode;
  title?: string;
}

interface DemoFrameState {
  hasError: boolean;
}

export class DemoFrame extends Component<DemoFrameProps, DemoFrameState> {
  constructor(props: DemoFrameProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): DemoFrameState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DemoFrame caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { children, title } = this.props;

    return (
      <Paper variant="outlined" sx={{ p: 3, my: 2, position: 'relative', overflow: 'hidden' }}>
        {title && (
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            {title}
          </Typography>
        )}
        
        {this.state.hasError ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              bgcolor: 'error.lighter',
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'error.light',
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" color="error" gutterBottom>
              Something went wrong in this demo.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The component crashed during render. Check the console for details.
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReset}>
              Reset Demo
            </Button>
          </Box>
        ) : (
          children
        )}
      </Paper>
    );
  }
}
