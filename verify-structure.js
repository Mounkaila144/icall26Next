/**
 * Verification script for modular architecture
 * Run: node verify-structure.js
 */

const fs = require('fs');
const path = require('path');

const requiredStructure = {
  'src/modules/UsersGuard/admin/components/LoginForm.tsx': 'LoginForm component',
  'src/modules/UsersGuard/admin/hooks/useAuth.ts': 'useAuth hook',
  'src/modules/UsersGuard/admin/services/authService.ts': 'Auth service',
  'src/modules/UsersGuard/types/auth.types.ts': 'Auth types',
  'src/modules/UsersGuard/index.ts': 'Module barrel export',
  'src/shared/lib/api-client.ts': 'API client',
  'src/shared/lib/tenant-context.tsx': 'Tenant context',
  'src/shared/types/api.types.ts': 'API types',
  'app/admin/login/page.tsx': 'Login page',
  'app/admin/dashboard/page.tsx': 'Dashboard page',
  'app/admin/layout.tsx': 'Admin layout',
  '.env.local': 'Environment variables',
};

console.log('🔍 Verifying Modular Architecture Structure...\n');

let allExists = true;
let missingFiles = [];

Object.entries(requiredStructure).forEach(([filePath, description]) => {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    console.log(`✅ ${description}: ${filePath}`);
  } else {
    console.log(`❌ ${description}: ${filePath} [MISSING]`);
    allExists = false;
    missingFiles.push(filePath);
  }
});

console.log('\n' + '='.repeat(60) + '\n');

if (allExists) {
  console.log('✅ All required files exist!');
  console.log('\n📦 Module Structure:');
  console.log('   - UsersGuard module created');
  console.log('   - Admin layer implemented');
  console.log('   - Shared utilities configured');
  console.log('   - Pages and routes set up');

  console.log('\n🚀 Next Steps:');
  console.log('   1. Ensure Laravel backend is running on http://localhost:8000');
  console.log('   2. Run: npm run dev');
  console.log('   3. Visit: http://localhost:3000/admin/login');
  console.log('   4. Test login with your tenant credentials');

  console.log('\n📚 Documentation:');
  console.log('   - MODULES.md - Main documentation');
  console.log('   - ARCHITECTURE.md - Architecture diagrams');
  console.log('   - src/modules/README.md - Module creation guide');

} else {
  console.log('❌ Some files are missing:');
  missingFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
  process.exit(1);
}

console.log('\n' + '='.repeat(60));