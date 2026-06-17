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
  plain?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'tsx', plain = false }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!plain) {
      Prism.highlightAll();
    }
  }, [code, language, plain]);

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
      className="code-block"
      sx={{
        position: 'relative',
        borderRadius: "5px",
        overflow: 'hidden',
        bgcolor: '#16243d',
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
        my: 2,
        maxWidth: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2.5,
          py: 1.25,
          bgcolor: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Typography sx={{ 
          fontFamily: "Roboto Mono, monospace",
          fontSize: 12,
          letterSpacing: "1.5px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.55)"
        }}>
          {language.toUpperCase()}
        </Typography>
        <Tooltip title={copied ? 'Copied!' : 'Copy code'} placement="left">
          <IconButton 
            size="small" 
            onClick={handleCopy} 
            sx={{ 
              color: copied ? 'success.main' : 'rgba(255,255,255,0.7)',
              "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" }
            }}
          >
            {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box 
        component="pre" 
        sx={{ 
          m: 0,
          px: 3,
          py: 2.5,
          fontFamily: plain ? "Roboto Mono, monospace" : "inherit",
          fontSize: 14,
          lineHeight: 1.7,
          color: "#c9d4ea",
          whiteSpace: "pre",
          overflowX: "auto",
          backgroundColor: 'transparent',
          textAlign: 'left',
          '& code': {
            background: 'transparent',
            padding: 0,
            ...(plain ? { color: '#c9d4ea' } : {}),
          },
        }}
      >
        {plain ? (
          <code>{code}</code>
        ) : (
          <code className={`language-${language}`}>{code}</code>
        )}
      </Box>
    </Box>
  );
};
