import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css';
import copy from 'clipboard-copy';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'tsx' }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await copy(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: '#2d2d2d',
        my: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          bgcolor: '#1e1e1e',
          borderBottom: '1px solid #444',
        }}
      >
        <Typography variant="caption" sx={{ color: '#ccc', fontFamily: 'monospace' }}>
          {language.toUpperCase()}
        </Typography>
        <Tooltip title={copied ? 'Copied!' : 'Copy code'} placement="left">
          <IconButton 
            size="small" 
            onClick={handleCopy} 
            sx={{ color: copied ? 'success.main' : '#ccc' }}
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ overflowX: 'auto', p: 2 }}>
        <pre style={{ margin: 0, padding: 0, backgroundColor: 'transparent' }}>
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </Box>
    </Box>
  );
};
