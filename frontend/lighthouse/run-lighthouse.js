const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const routes = [
  { url: 'http://localhost:3000/', name: 'home' },
  { url: 'http://localhost:3000/login', name: 'login' },
  { url: 'http://localhost:3000/register', name: 'register' },
  { url: 'http://localhost:3000/dashboard', name: 'dashboard' },
  { url: 'http://localhost:3000/profile', name: 'profile' },
  { url: 'http://localhost:3000/mentors', name: 'mentors' },
  { url: 'http://localhost:3000/bookings', name: 'bookings' },
  { url: 'http://localhost:3000/bookings/new', name: 'bookings_new' },
  // Replace <mentorId> with a real mentor ID from your database
  { url: 'http://localhost:3000/book/1', name: 'book_mentorId' }
];

const outputDir = path.join(__dirname, 'reports');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

routes.forEach(route => {
  const outPath = path.join(outputDir, `${route.name}.html`);
  console.log(`Running Lighthouse for ${route.url}...`);
  try {
    execSync(`npx lighthouse ${route.url} --output html --output-path=${outPath} --quiet --chrome-flags="--headless"`, { stdio: 'inherit' });
    console.log(`Report saved: ${outPath}`);
  } catch (err) {
    console.error(`Lighthouse failed for ${route.url}`);
  }
});