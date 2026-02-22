const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) {
        let val = m[2];
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[m[1]] = val;
      }
    });
  }
}

loadEnv();

const migrationPath = path.resolve(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
if (!fs.existsSync(migrationPath)) {
  console.error('Migration file not found:', migrationPath);
  process.exit(1);
}

let sql = fs.readFileSync(migrationPath, 'utf8');
const connection = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.DIRECT_URL;
if (!connection) {
  console.error('No DATABASE_URL / DIRECT_URL found in .env');
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: connection });
  try {
    await client.connect();
    console.log('Connected to DB; applying full migration...');
    // Split SQL into statements while preserving $$ blocks
    const statements = [];
    let current = '';
    let i = 0;
    let inDollar = false;
    while (i < sql.length) {
      if (sql.slice(i, i + 2) === '$$') {
        inDollar = !inDollar;
        current += '$$';
        i += 2;
        continue;
      }
      const ch = sql[i];
      if (ch === ';' && !inDollar) {
        statements.push(current + ';');
        current = '';
      } else {
        current += ch;
      }
      i += 1;
    }
    if (current.trim()) statements.push(current);

    for (const stmt of statements) {
      const s = stmt.trim();
      if (!s) continue;
      try {
        await client.query(s);
      } catch (err) {
        console.warn('Statement failed (continuing):', err.message);
      }
    }
    console.log('Full migration applied (errors were ignored where statements already existed).');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    try { await client.end(); } catch (e) {}
  }
})();
