/**
 * Production Build Script
 * 
 * This script orchestrates the entire build process:
 * 1. Sets environment variables for production
 * 2. Cleans the build directory
 * 3. Builds the project with optimizations
 * 4. Prepares for Cloudflare deployment
 * 
 * Run with: node scripts/build-prod.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const execPromise = promisify(exec);

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Platform-specific commands
const isWindows = process.platform === 'win32';
const rmCommand = isWindows ? 'if exist dist rmdir /s /q dist' : 'rm -rf dist';
const setEnvCommand = isWindows 
  ? 'set NODE_ENV=production&&set ASTRO_TELEMETRY_DISABLED=1' 
  : 'export NODE_ENV=production && export ASTRO_TELEMETRY_DISABLED=1';

/**
 * Execute a command and log its output
 */
async function runCommand(command, description) {
  console.log(`\n🚀 ${description}...\n`);
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
}

/**
 * Main build process
 */
async function build() {
  console.log('\n🔥 Starting production build process 🔥\n');
  
  // Step 1: Clean dist directory
  await runCommand(rmCommand, 'Cleaning build directory');
  
  // Step 2: Set environment variables and run build
  const buildCommand = `${setEnvCommand} && pnpm build`;
  const buildSuccess = await runCommand(buildCommand, 'Building project for production');
  
  if (!buildSuccess) {
    console.error('❌ Build failed');
    process.exit(1);
  }
  
  console.log('\n✅ Production build completed successfully!\n');
  
  // Optional: Run wrangler preview
  if (process.argv.includes('--preview')) {
    await runCommand('pnpm wrangler:preview', 'Starting Wrangler preview');
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. Deploy to Cloudflare: pnpm wrangler:deploy');
  console.log('2. Check your site at https://digibilder.se\n');
}

// Run the build
build(); 