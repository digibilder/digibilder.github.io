/**
 * Image Optimization Script
 * 
 * This script generates WebP versions of all JPG and PNG images in the static directory.
 * Run with: node scripts/generate-webp.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Get the directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const staticDir = join(rootDir, 'src', 'static');
const publicStaticDir = join(rootDir, 'public', 'static');

/**
 * Creates directories recursively if they don't exist
 */
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
}

/**
 * Generate WebP version of an image using Sharp or other installed tools
 */
async function generateWebP(imagePath, outputPath) {
  try {
    // Check if we have cwebp installed
    try {
      await execPromise('cwebp -version');
      // Use cwebp if available
      await execPromise(`cwebp -q 85 "${imagePath}" -o "${outputPath}"`);
      console.log(`Generated WebP: ${outputPath}`);
    } catch (err) {
      // If cwebp is not available, try using sharp through node
      console.log('cwebp not found, using node-based conversion...');
      
      // Dynamic import of sharp to avoid module not found errors if not installed
      const sharp = (await import('sharp')).default;
      
      await sharp(imagePath)
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      console.log(`Generated WebP: ${outputPath}`);
    }
  } catch (err) {
    console.error(`Failed to convert ${imagePath}:`, err);
  }
}

/**
 * Process all images in a directory and its subdirectories
 */
async function processDirectory(dir, outputBaseDir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = join(dir, entry.name);
    
    // Get the relative path from the static directory
    const relativePath = srcPath.replace(staticDir, '');
    const outputDir = join(outputBaseDir, dirname(relativePath));
    
    if (entry.isDirectory()) {
      // Process subdirectory
      await ensureDir(join(outputBaseDir, relativePath));
      await processDirectory(srcPath, outputBaseDir);
    } else if (entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name)) {
      // Process image file
      await ensureDir(outputDir);
      
      // Create the output path with .webp extension
      const outputPath = join(outputBaseDir, 
        relativePath.replace(/\.(jpe?g|png)$/i, '.webp'));
      
      // Also copy the original file
      const outputOriginalPath = join(outputBaseDir, relativePath);
      await fs.copyFile(srcPath, outputOriginalPath);
      console.log(`Copied original: ${outputOriginalPath}`);
      
      // Generate WebP version
      await generateWebP(srcPath, outputPath);
    }
  }
}

// Main function
async function main() {
  try {
    // Ensure output directories exist
    await ensureDir(publicStaticDir);
    
    // Process all images
    await processDirectory(staticDir, publicStaticDir);
    
    console.log('Image optimization complete!');
  } catch (err) {
    console.error('Error processing images:', err);
    process.exit(1);
  }
}

main(); 