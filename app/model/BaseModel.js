// const knex = require('../db/knex')

const DB = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: '/Users/vu.viet/jobsearch/mainapp/app/db/app.db'
    },
    useNullAsDefault: true
});

module.exports = class BaseModel {
    constructor(table) {
        this.table = table;
    }

    insert(data) {
        DB(this.table).insert(data)
        .then(function (result) {
            console.log(result)
        }, function (err) {
            console.log(err)
        })
    }

    update(condition, data) {
        var model = this;
        DB(this.table)
        .where(condition)
        .update(data)
        .then(function (result) {
            if (result <= 0) {
                model.insert(data)
            }
        }, function (err) {
            console.log(err)
        })
    }

    getAll() {
        return DB.select()
        .from(this.table)
        .then(function(rows) {
            return rows
        })
        .catch(function (err) {
            console.log(err)
            return err
        });
    }

    get(fields, condition) {
        return DB.select(fields)
        .from(this.table)
        .where(condition)
        .then(function(rows) {
            return rows
        })
        .catch(function (err) {
            console.log(err)
            return err
        });
    }
}
