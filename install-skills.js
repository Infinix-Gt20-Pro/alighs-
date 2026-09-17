/**
 * Skills Manager for Antigravity Projects
 * Installs skills from the local cache into .agents/skills or ~/.gemini/antigravity/skills
 * No Git or Admin privileges required.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

// Find the local npm cache where agentic-awesome-skills is stored
const npxCacheBase = path.join(process.env.LOCALAPPDATA || '', 'npm-cache', '_npx');
let catalogDir = null;

if (fs.existsSync(npxCacheBase)) {
  const dirs = fs.readdirSync(npxCacheBase);
  for (const d of dirs) {
    const candidate = path.join(npxCacheBase, d, 'node_modules', 'agentic-awesome-skills');
    if (fs.existsSync(path.join(candidate, 'skills_index.json'))) {
      catalogDir = candidate;
      break;
    }
  }
}

if (!catalogDir) {
  console.error('Error: Could not locate cached agentic-awesome-skills library.');
  console.error('Run: npx --yes agentic-awesome-skills --help first to download the package.');
  process.exit(1);
}

const skillsSourceDir = path.join(catalogDir, 'skills');
const indexFile = path.join(catalogDir, 'skills_index.json');
const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));

// Parse command line arguments
const args = process.argv.slice(2);
const isGlobal = args.includes('--global');
const targetDir = isGlobal
  ? path.join(os.homedir(), '.gemini', 'antigravity', 'skills')
  : path.join(__dirname, '.agents', 'skills');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function installSkill(name) {
  const src = path.join(skillsSourceDir, name);
  if (!fs.existsSync(src)) {
    console.warn(`[!] Skill not found: "${name}"`);
    return false;
  }
  const dest = path.join(targetDir, name);
  copyDir(src, dest);
  console.log(`[+] Installed: ${name} -> ${dest}`);
  return true;
}

const CORE_SKILLS = [
  'antigravity-workflows',
  'brainstorming',
  'systematic-debugging',
  'clean-code',
  'backend-dev-guidelines',
  'frontend-design',
  'security-audit',
  'test-driven-development',
  'api-endpoint-builder'
];

if (args.includes('--list-categories')) {
  const cats = {};
  index.forEach(s => { cats[s.category] = (cats[s.category] || 0) + 1; });
  console.log('\nAvailable Categories in Library:');
  Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  - ${cat.padEnd(25)} (${count} skills)`);
  });
  process.exit(0);
}

const searchIdx = args.indexOf('--search');
if (searchIdx !== -1 && args[searchIdx + 1]) {
  const query = args[searchIdx + 1].toLowerCase();
  const matches = index.filter(s =>
    s.id.toLowerCase().includes(query) ||
    (s.description && s.description.toLowerCase().includes(query))
  );
  console.log(`\nFound ${matches.length} matching skills for "${query}":`);
  matches.slice(0, 30).forEach(m => {
    console.log(`  • ${m.id} [${m.category}] - ${m.description ? m.description.slice(0, 75) + '...' : ''}`);
  });
  if (matches.length > 30) {
    console.log(`  ... and ${matches.length - 30} more.`);
  }
  process.exit(0);
}

const skillsIdx = args.indexOf('--skills');
const categoryIdx = args.indexOf('--category');

if (args.includes('--core') || (!args.includes('--skills') && !args.includes('--category'))) {
  console.log(`\nInstalling Core Skills pack into: ${targetDir}\n`);
  let count = 0;
  CORE_SKILLS.forEach(s => {
    if (installSkill(s)) count++;
  });
  console.log(`\nSuccessfully installed ${count} core skills!\n`);
} else if (skillsIdx !== -1 && args[skillsIdx + 1]) {
  const list = args[skillsIdx + 1].split(',').map(s => s.trim()).filter(Boolean);
  console.log(`\nInstalling requested skills into: ${targetDir}\n`);
  let count = 0;
  list.forEach(s => {
    if (installSkill(s)) count++;
  });
  console.log(`\nDone! Installed ${count} skills.\n`);
} else if (categoryIdx !== -1 && args[categoryIdx + 1]) {
  const cat = args[categoryIdx + 1].toLowerCase();
  const matched = index.filter(s => s.category.toLowerCase() === cat);
  console.log(`\nInstalling all ${matched.length} skills from category "${cat}" into: ${targetDir}\n`);
  let count = 0;
  matched.forEach(s => {
    if (installSkill(s.id)) count++;
  });
  console.log(`\nDone! Installed ${count} skills.\n`);
}
