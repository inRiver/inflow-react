# Inriver Theme Migration Guide

## Quick Start
Replace hardcoded values with theme tokens. Use `sx` prop with theme-aware values.

## Step 1: Import Theme Components
❌ Before: <div style={{...}}>
✅ After: <Paper sx={{...}}>

## Step 2: Replace Hardcoded Colors
❌ Before: color: '#1976d2'
✅ After: color: 'primary.main'

**Palette Tokens:**
- Primary: primary.main, primary.light, primary.dark
- Grey: grey.50, grey.100, ..., grey.900
- Semantic: error.main, warning.main, info.main, success.main
- Text: text.primary, text.secondary, text.disabled
- Background: background.default, background.paper

## Step 3: Replace Spacing
❌ Before: padding: '16px'
✅ After: p: 2  // 16px (2 * 8px)

**Spacing System:** 1=8px, 1.5=12px, 2=16px, 3=24px, 4=32px

## Step 4: Replace Typography
❌ Before: fontSize: '24px', fontWeight: 600
✅ After: typography: 'h4'

**Variants:** h1-h6, body1-2, subtitle1-2, caption, overline, button

## Step 5: Replace Border Radius
❌ Before: borderRadius: '8px'
✅ After: borderRadius: 1

## Step 6: Replace Shadows
❌ Before: boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
✅ After: boxShadow: 1

## Common Patterns

### Pattern 1: Card Components
**Before (57 lines):**
```tsx
<div style={{
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}}>
  <h3 style={{ fontSize: '20px', color: '#1a1a1a' }}>Title</h3>
  <p style={{ fontSize: '14px', color: '#666' }}>Content</p>
</div>
```

**After (12 lines):**
```tsx
<Card sx={{ p: 3 }}>
  <Typography variant="h5">Title</Typography>
  <Typography variant="body2" color="text.secondary">Content</Typography>
</Card>
```

### Pattern 2: Button Variants
**Before:**
```tsx
<button style={{
  backgroundColor: '#1976d2',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: '4px'
}}>
```

**After:**
```tsx
<Button variant="contained">
```

### Pattern 3: Layout Containers
**Before:**
```tsx
<div style={{ display: 'flex', gap: '16px', padding: '24px' }}>
```

**After:**
```tsx
<Stack spacing={2} sx={{ p: 3 }}>
```

## Migration Checklist
- [ ] Replace <div> with MUI components
- [ ] Replace hex colors with palette tokens
- [ ] Replace pixel spacing with theme units
- [ ] Replace font styles with typography variants
- [ ] Replace shadows
- [ ] Remove all magic numbers
- [ ] Test in both themes (toggle)
- [ ] Verify no visual regressions

## Gotchas

### sx vs style
❌ Wrong (bypasses theme): <Box style={{ padding: '16px' }}>
✅ Correct: <Box sx={{ p: 2 }}>

### Nested selectors
```tsx
<Box sx={{
  '& .MuiButton-root': { m: 1 },
  '&:hover': { bgcolor: 'primary.light' }
}}>
```

## Real Examples from Codebase

### DevEventBusPanel.tsx (157 violations → 12)
**Before:**
```tsx
<div style={{
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderLeft: '4px solid #1976d2'
}}>
  <span style={{ color: '#d32f2f', fontSize: '14px' }}>Error</span>
</div>
```

**After:**
```tsx
<Alert severity="error" sx={{ mb: 2 }}>Error</Alert>
```

## Testing
1. Visual regression: Compare screenshots
2. Theme toggle: Switch themes, verify adaptation
3. TypeScript: Run `npx tsc --noEmit`

## Reference
- Theme tokens: `src/theme/tokens.ts`
- MUI sx docs: https://mui.com/system/getting-started/the-sx-prop/
- Inriver theme: `src/theme/inriver.ts`
