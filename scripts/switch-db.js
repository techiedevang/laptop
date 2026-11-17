/**
 * NextGen IT Hub — Database Switcher Utility
 * Allows seamless switching between:
 * 1. PostgreSQL (High Concurrency: 10,000+ users, Cloud / Docker with PgBouncer)
 * 2. SQLite (Portable: 1-file offline zero-setup)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = process.argv[2]?.toLowerCase();

if (!['postgres', 'postgresql', 'sqlite'].includes(target)) {
  console.log('Usage: node scripts/switch-db.js <postgres|sqlite>');
  process.exit(1);
}

const rootDir = path.join(__dirname, '..');
const prismaDir = path.join(rootDir, 'prisma');
const envPath = path.join(rootDir, '.env');
const targetSchema = path.join(prismaDir, 'schema.prisma');

if (target === 'postgres' || target === 'postgresql') {
  console.log('⚡ Switching to PostgreSQL (High Concurrency: 10,000+ Users & Connection Pooling)...');
  const pgSchema = path.join(prismaDir, 'schema.postgresql.prisma');
  if (!fs.existsSync(pgSchema)) {
    console.error('Error: schema.postgresql.prisma not found!');
    process.exit(1);
  }
  fs.copyFileSync(pgSchema, targetSchema);

  // Update .env if currently pointing to sqlite
  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8');
    if (env.includes('DATABASE_URL="file:./dev.db"')) {
      env = env.replace(
        'DATABASE_URL="file:./dev.db"',
        'DATABASE_URL="postgresql://nextgen_user:nextgen_dev_pass@localhost:5432/nextgen_it_hub?schema=public&connection_limit=50&pool_timeout=10"'
      );
      fs.writeFileSync(envPath, env, 'utf8');
    }
  }

  console.log('Regenerating Prisma Client for PostgreSQL...');
  try {
    execSync('npx prisma generate', { cwd: rootDir, stdio: 'inherit' });
    console.log('\n✅ Successfully switched to PostgreSQL mode!');
    console.log('👉 To connect to your high-concurrency database:');
    console.log('   - Cloud DB (Supabase/Neon): paste your DATABASE_URL with pgbouncer in .env');
    console.log('   - Local Docker: run "docker compose up -d db redis pgbouncer"');
  } catch (err) {
    console.error('Failed to generate Prisma client:', err.message);
  }
} else if (target === 'sqlite') {
  console.log('📁 Switching to SQLite (Portable Single-File zero-setup)...');
  require('./convert_to_sqlite.js');

  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8');
    if (env.includes('postgresql://')) {
      env = env.replace(
        /DATABASE_URL="?postgresql:[^"\n]+"?/,
        'DATABASE_URL="file:./dev.db"'
      );
      fs.writeFileSync(envPath, env, 'utf8');
    }
  }

  console.log('Regenerating Prisma Client for SQLite...');
  try {
    execSync('npx prisma generate', { cwd: rootDir, stdio: 'inherit' });
    console.log('\n✅ Successfully switched to SQLite portable mode (file:./dev.db)!');
  } catch (err) {
    console.error('Failed to generate Prisma client:', err.message);
  }
}
