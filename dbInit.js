const sqlite3 = require('sqlite3');

let db1 = new sqlite3.Database('./database.sqlite');

// db1.run(`
// DROP TABLE settings2;
// DROP TABLE settings1;
// CREATE TABLE settings1 ( 
//     guild INTEGER, 
//     settings TEXT
// );
// INSERT INTO settings1 (guild, settings)
// 	SELECT guild, settings FROM settings;
// DROP TABLE settings;
// ALTER TABLE settings1 RENAME TO settings;
// `);

db1.run(`
CREATE TABLE settings ( 
    guild INTEGER, 
    settings TEXT
);
`);

db1.close();