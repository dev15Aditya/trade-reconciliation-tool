# Trade Reconciliation Tool

This Trade Reconciliation Tool is designed to verify the accuracy of trade records by comparing data between an **internal database** and an **external data feed**. This process ensures data consistency, highlights missing trades, and identifies discrepancies in transaction details, which are critical for financial integrity and regulatory compliance.

## Project Overview

In finance, companies need to reconcile trade data across various systems to ensure records are accurate and complete. This tool simulates a common financial reconciliation workflow by:
- Generating simulated trade data in a CSV file and a database.
- Comparing trade details between the CSV (external data feed) and the database (internal records).
- Producing a report listing any discrepancies, such as missing trades or mismatched details.

## Features

- **Data Generation**: Generates sample trade data in both a CSV file (external feed) and an SQLite database (internal records).
- **Reconciliation Logic**: Compares trades in the database with those in the CSV, flagging missing records and discrepancies in quantity or price.
- **Error Reporting**: Generates a reconciliation report listing any identified discrepancies, supporting quick data verification and audit processes.

## Tech Stack

- **Node.js**: Used to build and run scripts for data generation and reconciliation.
- **SQLite**: Serves as the internal database to store trade records.
- **CSV Parser**: Parses the external trade data stored in a CSV file.
- **FS Module**: Handles file system operations, such as reading and writing files.

## Project Structure

```plaintext
trade-reconciliation-tool/
│
├── data/
│   └── external_feed.csv        # Generated CSV file simulating the external trade data feed
│
├── setupDatabase.js             # Script to set up the SQLite database and table
├── generateData.js              # Script to generate sample trade data in CSV and database
├── reconcile.js                 # Main reconciliation script to compare data and output discrepancies
└── reconciliation_report.txt    # Report generated after reconciliation, listing discrepancies



## Test it
```bash
node setupDatabase.js --> sets up sqlite db with a trades column
node generateData.js --> generate a csv data to simulate exteral environment data
node reconcile.js --> verify data from db & csv, and creates decripency report

- You can alter csv or db data then run reconcile script to see generated report
