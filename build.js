const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Starting build process...');

// Function to execute commands and handle errors
function runCommand(command) {
  console.log(`🔄 Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// 1. Clean previous builds if they exist
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync(path.join(__dirname, 'out'))) {
  try {
    fs.rmSync(path.join(__dirname, 'out'), { recursive: true, force: true });
    console.log('✅ Previous builds cleaned');
  } catch (error) {
    console.error('❌ Failed to clean previous builds:', error.message);
  }
}

// 2. Rebuild native dependencies
console.log('🔨 Rebuilding native dependencies for Electron...');
if (!runCommand('npm run rebuild')) {
  console.error('❌ Failed to rebuild native dependencies');
  process.exit(1);
}

// 3. Package the application
console.log('📦 Packaging application...');
if (!runCommand('electron-forge package')) {
  console.error('❌ Failed to package application');
  process.exit(1);
}

// 4. Create distributables
console.log('🚀 Creating distributables...');
if (!runCommand('electron-forge make')) {
  console.error('❌ Failed to create distributables');
  process.exit(1);
}

console.log('✅ Build process completed successfully');
console.log('📂 Outputs can be found in the "out" directory');