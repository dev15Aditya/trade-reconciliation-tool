const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('trades.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS trades (
        trade_id TEXT PRIMARY KEY,
        symbol TEXT,
        quantity INTEGER,
        price REAL,
        timestamp DATETIME
    )`);
});

db.close();