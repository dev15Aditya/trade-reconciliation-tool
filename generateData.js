const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

// Fetch data from JSON server
async function fetchData() {
  try {
    const response = await axios.get('http://localhost:3000/trades');
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function main() {
  const externalData = await fetchData();

  // Writing trade data to a CSV file
  fs.writeFileSync(
    'data/external_feed.csv',
    'trade_id,symbol,quantity,price,timestamp\n'
  );
  externalData.forEach((trade) => {
    fs.appendFileSync(
      'data/external_feed.csv',
      `${trade.trade_id},${trade.symbol},${trade.quantity},${trade.price},${trade.timestamp}\n`
    );
  });

  // Insert trade data into the SQLite database
  const db = new sqlite3.Database('trades.db');

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS trades (
        trade_id TEXT PRIMARY KEY,
        symbol TEXT,
        quantity INTEGER,
        price REAL,
        timestamp TEXT
      )`
    );

    const stmt = db.prepare(
      `INSERT OR REPLACE INTO trades (trade_id, symbol, quantity, price, timestamp) VALUES (?, ?, ?, ?, ?)`
    );

    externalData.forEach((trade) => {
      stmt.run(
        trade.trade_id,
        trade.symbol,
        trade.quantity,
        trade.price,
        trade.timestamp
      );
    });

    stmt.finalize();
  });

  db.close();
  console.log('Data generated and loaded into db successfully!');
}

// Run the main function
main();
