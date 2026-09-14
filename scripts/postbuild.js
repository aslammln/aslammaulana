import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // 1. Create 404.html for SPA static hosting fallback
  fs.writeFileSync(path.join(distDir, '404.html'), htmlContent, 'utf8');

  // 2. Create static directories and index.html for direct path requests
  const routes = [
    'admin',
    'admin/login',
    'admin/dashboard',
  ];

  for (const route of routes) {
    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent, 'utf8');
  }

  console.log('✓ Successfully generated SPA fallback and static routes for /admin, /admin/login, and /admin/dashboard');
} else {
  console.warn('dist/index.html not found, skipping postbuild route generation');
}
