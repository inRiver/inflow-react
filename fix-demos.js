import fs from 'fs';
import path from 'path';

const demosDir = './src/showcase/demos';
const files = fs.readdirSync(demosDir).filter(f => f.endsWith('Demo.tsx'));

files.forEach(file => {
  const filePath = path.join(demosDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix unused imports
  content = content.replace(/import \{ ([^}]+), (Avatar|Box|Dialog|Button|Menu|Snackbar) \} from '@mui\/material';/, 'import { $1 } from \'@mui/material\';');
  
  // Fix number to string in options arrays
  content = content.replace(/"options": \[\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\]/g, '"options": ["$1", "$2", "$3", "$4", "$5", "$6"]');
  
  // Fix ListItem disabled -> ListItemButton
  content = content.replace(/<ListItem disabled/g, '<ListItemButton disabled');
  content = content.replace(/<\/ListItem>/g, '</ListItemButton>');
  
  // Fix ContainerDemo disableGutters
  if (file === 'ContainerDemo.tsx') {
    content = content.replace(/disableGutters: true/g, 'disableGutters: "true"');
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${file}`);
});

console.log('All fixes applied!');
