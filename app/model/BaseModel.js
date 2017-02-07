// const knex = require('../db/knex')

console.log(__dirname)

const DB = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: __dirname +'/../db/app.db'
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

    delete(condition) {
        DB(this.table).where(condition).del()
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

    get(fields, condition, limit, offset) {
        var queryBuilder = DB.select(fields)
        .from(this.table)
        .where(condition)

        if (limit != null && limit != undefined) {
            queryBuilder = queryBuilder.limit(limit)
        }

        if (offset != null && offset != undefined) {
            queryBuilder = queryBuilder.offset(offset)
        }

        return queryBuilder.then(function(rows) {
            return rows
        })
        .catch(function (err) {
            console.log(err)
            return err
        });
    }
}
