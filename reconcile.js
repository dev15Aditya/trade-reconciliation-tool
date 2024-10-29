const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');

const db = new sqlite3.Database('trades.db');
const externalTrades = {};

// Load external feed data from CSV
fs.createReadStream('data/external_feed.csv')
    .pipe(csv())
    .on('data', (row) => {
        externalTrades[row.trade_id] = row;
    })
    .on('end', () => {
        const mismatches = [];
        
        db.serialize(() => {
            db.each("SELECT * FROM trades", (err, internalTrade) => {
                if (err) {
                    throw err;
                }
                const externalTrade = externalTrades[internalTrade.trade_id];

                if (!externalTrade) {
                    mismatches.push(`Missing trade in external feed: ${internalTrade.trade_id}`);
                } else if (externalTrade.quantity != internalTrade.quantity || externalTrade.price != internalTrade.price) {
                    mismatches.push(`Mismatch for trade ${internalTrade.trade_id}: external(${externalTrade.quantity}, ${externalTrade.price}) vs internal(${internalTrade.quantity}, ${internalTrade.price})`);
                }
            }, () => {
                // Report results after all internal trades are checked
                if (mismatches.length > 0) {
                    fs.writeFileSync('reconciliation_report.txt', mismatches.join('\n'));
                    console.log('Reconciliation report generated with discrepancies.');
                } else {
                    console.log('All records match!');
                }
                db.close();
            });
        });
    });
