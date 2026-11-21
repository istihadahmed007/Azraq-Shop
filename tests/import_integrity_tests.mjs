import fs from 'fs';
import path from 'path';
import assert from 'assert';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.jsx') || (file.endsWith('.js') && !file.includes('test'))) {
      results.push(fullPath);
    }
  });
  return results;
}

console.log('='.repeat(64));
console.log('🧪 AZRAQ REACT HOOKS & IMPORT INTEGRITY AUDIT');
console.log('='.repeat(64));

const files = walk('src');
const hooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext', 'useId'];
let missingCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const importLines = content.split('\n').filter(l => (l.includes('import') && l.includes("from 'react'")) || (l.includes('import') && l.includes('from "react"')));
  const importedNamed = new Set();

  for (const line of importLines) {
    const match = line.match(/\{([^}]+)\}/);
    if (match) {
      match[1].split(',').forEach(item => importedNamed.add(item.trim()));
    }
  }

  for (const hook of hooks) {
    const hookRegex = new RegExp(`(?<!React\\.)\\b${hook}\\s*\\(`, 'g');
    if (hookRegex.test(content)) {
      if (!importedNamed.has(hook)) {
        console.error(`❌ [${file}]: uses ${hook}() but it is not imported from 'react'`);
        missingCount++;
      }
    }
  }
}

assert.strictEqual(missingCount, 0, `Found ${missingCount} unimported React hooks in src/`);
console.log('✓ All React hook usages in src/ are strictly declared in imports.');
console.log('='.repeat(64));
console.log('🎉 ALL REACT HOOK & IMPORT INTEGRITY CHECKS PASSED!');
console.log('='.repeat(64));
