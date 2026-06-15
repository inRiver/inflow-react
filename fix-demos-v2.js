import fs from 'fs';
import path from 'path';

const demosDir = './src/showcase/demos';
const files = fs.readdirSync(demosDir).filter(f => f.endsWith('Demo.tsx'));

files.forEach(file => {
  const filePath = path.join(demosDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Fix unused Avatar import
  if (file === 'BadgeDemo.tsx' && content.includes(', Avatar }')) {
    content = content.replace(', Avatar }', ' }');
    changed = true;
  }
  
  // Fix unused Box import
  if ((file === 'ContainerDemo.tsx' || file === 'PaperDemo.tsx' || file === 'SkeletonDemo.tsx') && content.includes(', Box }')) {
    content = content.replace(', Box }', ' }');
    changed = true;
  }
  
  // Fix unused Dialog import
  if (file === 'DialogDemo.tsx' && content.includes('Dialog, ')) {
    content = content.replace('Dialog, ', '');
    changed = true;
  }
  
  // Fix unused Button import
  if ((file === 'DrawerDemo.tsx' || file === 'MenuDemo.tsx') && content.includes(', Button }')) {
    content = content.replace(', Button }', ' }');
    changed = true;
  }
  
  // Fix unused Menu import
  if (file === 'MenuDemo.tsx' && content.includes('Menu, ')) {
    content = content.replace('Menu, ', '');
    changed = true;
  }
  
  // Fix unused Snackbar import
  if (file === 'SnackbarDemo.tsx' && content.includes('Snackbar, ')) {
    content.replace('Snackbar, ', '');
    changed = true;
  }
  
  // Fix number options to strings
  if (file === 'GridDemo.tsx' || file === 'PaperDemo.tsx' || file === 'StackDemo.tsx') {
    const numberOptions = /"options": \[\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\]/g;
    if (numberOptions.test(content)) {
      content = content.replace(numberOptions, (match, p1, p2, p3, p4, p5, p6) => {
        return `"options": ["${p1}", "${p2}", "${p3}", "${p4}", "${p5}", "${p6}"]`;
      });
      changed = true;
    }
  }
  
  // Fix ListDemo disabled prop - ONLY in "All States" section
  if (file === 'ListDemo.tsx') {
    const listItemDisabledPattern = /(<DemoFrame title="All States">[\s\S]*?)<ListItem disabled/;
    if (listItemDisabledPattern.test(content)) {
      content = content.replace(listItemDisabledPattern, '$1<ListItemButton disabled');
      content = content.replace(/(<\/ListItemText>[\s\S]*?<\/DemoFrame>)/, match => {
        return match.replace('</ListItem>', '</ListItemButton>');
      });
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${file}`);
  }
});

console.log('Selective fixes applied!');
