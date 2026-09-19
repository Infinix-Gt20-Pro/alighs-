const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, '..', 'data', 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const backupFile = path.join(backupDir, `aligsware_rdb_backup_${timestamp}.json`);

const sourceFile = path.join(__dirname, '..', 'data', 'aligsware_rdb.json');
fs.copyFileSync(sourceFile, backupFile);

const stats = fs.statSync(backupFile);
console.log('✓ Backup created successfully:');
console.log('  File:', backupFile);
console.log('  Size:', stats.size, 'bytes');

const content = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
console.log('  Products:', content.products?.length);
console.log('  Customers:', content.customers?.length);
console.log('  Orders:', content.orders?.length);
console.log('  Order Items:', content.order_items?.length);
console.log('  Status History:', content.order_status_history?.length);
console.log('  Admin Users:', content.admin_users?.length);
