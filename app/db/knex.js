
let dbFile = '/Users/vu.viet/jobsearch/jobsearchapp/app/db/app.db';
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: dbFile
    }
});

module.exports knex;
