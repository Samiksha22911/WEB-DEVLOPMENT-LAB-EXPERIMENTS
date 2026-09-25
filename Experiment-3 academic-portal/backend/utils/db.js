// Lightweight JSON-file "database" utility.
// Each table is a JSON file inside /data. Reads & writes are synchronous
// and wrapped to keep the API simple for a demo/college-project backend.

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

function filePath(table) {
  return path.join(DATA_DIR, `${table}.json`);
}

function ensureFile(table, defaultValue = []) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const fp = filePath(table);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, JSON.stringify(defaultValue, null, 2));
  }
}

function readTable(table) {
  ensureFile(table);
  const raw = fs.readFileSync(filePath(table), "utf-8");
  try {
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeTable(table, data) {
  ensureFile(table);
  fs.writeFileSync(filePath(table), JSON.stringify(data, null, 2));
}

function nextId(rows) {
  if (!rows.length) return 1;
  return Math.max(...rows.map((r) => Number(r.id) || 0)) + 1;
}

// Generic CRUD helpers used by every route module
const Model = (table) => ({
  all() {
    return readTable(table);
  },
  find(id) {
    return readTable(table).find((r) => String(r.id) === String(id));
  },
  where(predicate) {
    return readTable(table).filter(predicate);
  },
  create(payload) {
    const rows = readTable(table);
    const row = { id: nextId(rows), ...payload };
    rows.push(row);
    writeTable(table, rows);
    return row;
  },
  update(id, payload) {
    const rows = readTable(table);
    const idx = rows.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...payload, id: rows[idx].id };
    writeTable(table, rows);
    return rows[idx];
  },
  remove(id) {
    const rows = readTable(table);
    const idx = rows.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return false;
    rows.splice(idx, 1);
    writeTable(table, rows);
    return true;
  },
});

module.exports = { readTable, writeTable, nextId, Model };
