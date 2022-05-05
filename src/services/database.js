// Put your database code here
const Database = require('better-sqlite3');

const db = Database('log.db'); 

const sql = `
        CREATE TABLE IF NOT EXISTS accesslog ( id INTEGER PRIMARY KEY AUTOINCREMENT, remoteaddr TEXT, remoteuser TEXT, time TEXT, method TEXT,
                                    url TEXT, protocol TEXT, httpversion TEXT, secure TEXT, status TEXT, referer TEXT, useragent TEXT);
        `
db.exec(sql); 

module.exports = db 
