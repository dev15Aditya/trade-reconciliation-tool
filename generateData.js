const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const externalData = [
    { trade_id: 'T1234', symbol: 'AAPL', quantity: 100, price: 150.5, timestamp: new Date().toISOString() },
    { trade_id: 'T1235', symbol: 'TSLA', quantity: 50, price: 600.3, timestamp: new Date().toISOString() },
]

// writing trade data to a csv file
fs.writeFileSync('data/external_feed.csv', 'trade_id,symbol,quantity,price,timestamp\n');
externalData.forEach(trade => {
    fs.appendFileSync('data/external_feed.csv', `${trade.trade_id},${trade.symbol},${trade.quantity},${trade.price},${trade.timestamp}\n`);
})

// insert trade data into the database
const db = new sqlite3.Database('trades.db');

db.serialize(() => {
    const stmt = db.prepare(`INSERT OR REPLACE INTO trades (trade_id, symbol, quantity, price, timestamp) VALUES (?, ?, ?, ?, ?)`);
    externalData.forEach(trade => {
        stmt.run(trade.trade_id, trade.symbol, trade.quantity, trade.price, trade.timestamp);
    });
    stmt.finalize();
})

db.close();
console.log('Data generated and loaded into db successfully!');