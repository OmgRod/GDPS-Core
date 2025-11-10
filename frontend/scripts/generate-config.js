const fs = require('fs');
const path = require('path');

// Path to backend config relative to frontend folder
const backendConfigPath = path.resolve(__dirname, '..', '..', 'backend', 'config', 'config.json');
const outDir = path.resolve(__dirname, '..', 'src', 'generated');
const outFile = path.join(outDir, 'config.ts');
const publicDir = path.resolve(__dirname, '..', 'public');
const publicFile = path.join(publicDir, 'config.js');

let config = { gdpsName: 'GDPS' };
try {
  if (fs.existsSync(backendConfigPath)) {
    const raw = fs.readFileSync(backendConfigPath, 'utf8');
    config = JSON.parse(raw);
  } else {
    console.warn('Backend config not found at', backendConfigPath, ' - using default');
  }
} catch (err) {
  console.warn('Failed to read backend config:', err, ' - using default');
}

const content = `// GENERATED FILE - do not edit by hand\nconst config = ${JSON.stringify(config, null, 2)} as const;\nexport default config;\n`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, content, 'utf8');
console.log('Wrote', outFile);

// Also emit a small runtime JS file that can be mounted/served at /config.js so the deployed
// nginx proxy can serve dynamic config without rebuilding the frontend.
const publicContent = `window.__GDPS_CONFIG = ${JSON.stringify(config, null, 2)};`;
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(publicFile, publicContent, 'utf8');
console.log('Wrote', publicFile);
