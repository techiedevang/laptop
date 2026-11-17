const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'prisma', 'schema.postgresql.prisma');
const destPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

const original = fs.readFileSync(srcPath, 'utf8');

const enums = new Set([
  'UserRole',
  'AdminRole',
  'LaptopStatus',
  'LaptopGrade',
  'UnitStatus',
  'OrderStatus',
  'PaymentStatus',
  'PaymentMethod',
  'MeetingStatus',
  'DataRequestType',
  'DataRequestStatus',
  'TicketStatus',
  'ReviewStatus',
  'NotificationType',
  'BulkEnquiryStatus'
]);

const lines = original.split(/\r?\n/);
const outputLines = [];
let insideEnum = false;
let insideDatasource = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Handle datasource replacement
  if (trimmed.startsWith('datasource db {')) {
    insideDatasource = true;
    outputLines.push('datasource db {');
    outputLines.push('  provider = "sqlite"');
    outputLines.push('  url      = env("DATABASE_URL")');
    continue;
  }
  if (insideDatasource) {
    if (trimmed === '}') {
      insideDatasource = false;
      outputLines.push('}');
    }
    continue;
  }

  // Handle enum skip
  if (trimmed.startsWith('enum ')) {
    const enumName = trimmed.split(/\s+/)[1].replace('{', '').trim();
    if (enums.has(enumName)) {
      insideEnum = true;
      continue;
    }
  }
  if (insideEnum) {
    if (trimmed === '}') {
      insideEnum = false;
    }
    continue;
  }

  // Handle field line inside models
  let modifiedLine = line;

  // Replace String[] with String @default("[]")
  if (modifiedLine.includes('String[]')) {
    modifiedLine = modifiedLine.replace(/String\[\](\s*@default\(\[\]\))?/, 'String @default("[]")');
  }

  // Check if any enum is used as type in this line
  for (const enumName of enums) {
    // Match: word characters, spaces, enumName(?), optional default
    // e.g. "  role   UserRole   @default(CUSTOMER)"
    const regex = new RegExp(`(\\b${enumName})(\\??)(\\b)`, 'g');
    if (regex.test(modifiedLine)) {
      // Replace the enum with String
      modifiedLine = modifiedLine.replace(regex, 'String$2$3');
      // If there's @default(VALUE), wrap VALUE in quotes if not already quoted
      modifiedLine = modifiedLine.replace(/@default\(([A-Z0-9_]+)\)/, '@default("$1")');
    }
  }

  outputLines.push(modifiedLine);
}

fs.writeFileSync(destPath, outputLines.join('\n'), 'utf8');
console.log('Successfully generated line-by-line SQLite schema');
