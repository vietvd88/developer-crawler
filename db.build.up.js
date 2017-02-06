var fs = require('fs');
var file = './app/db/app.db';
var exists = fs.existsSync(file);

if(!exists) {
  console.log("Creating DB file.");
  fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
    // if(!exists) {
        // db.run(`
        //     CREATE TABLE github_developer (
        //         user_name VARCHAR(255) PRIMARY KEY NOT NULL,
        //         name VARCHAR(255) NOT NULL,
        //         avatar VARCHAR(255) NOT NULL,
        //         email VARCHAR(255) NOT NULL,
        //         location VARCHAR(255) NOT NULL
        //     )
        // `);

        // db.run(`
        //     CREATE TABLE github_developer_repo (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        //         user_name VARCHAR(255) NOT NULL,
        //         repo_name VARCHAR(255) NOT NULL,
        //         description TEXT NOT NULL,
        //         language VARCHAR(255) NOT NULL,
        //         star INT NOT NULL
        //     )
        // `);

        // db.run(`
        //     CREATE TABLE github_developer_comment (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        //         user_name VARCHAR(255) NOT NULL,
        //         comment VARCHAR(255) NOT NULL
        //     )
        // `);

        // db.run(`
        //     CREATE TABLE qiita_developer (
        //         user_name VARCHAR(255) PRIMARY KEY NOT NULL,
        //         name VARCHAR(255) NOT NULL,
        //         description VARCHAR(1024) NOT NULL,
        //         avatar VARCHAR(255) NOT NULL,
        //         email VARCHAR(255) NOT NULL,
        //         website VARCHAR(255) NOT NULL,
        //         post INT NOT NULL,
        //         contribution INT NOT NULL,
        //         follower INT NOT NULL
        //     )
        // `);

        // db.run(`
        //     CREATE TABLE qiita_developer_post (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        //         user_name VARCHAR(255) NOT NULL,
        //         title VARCHAR(255) NOT NULL,
        //         tags VARCHAR(255) NOT NULL,
        //         comment INT NOT NULL,
        //         like INT NOT NULL
        //     )
        // `);

        db.run(`
            CREATE TABLE facebook_developer (
                user_name VARCHAR(255) PRIMARY KEY NOT NULL,
                name VARCHAR(255) NOT NULL,
                birthday VARCHAR(1024) NOT NULL,
                avatar VARCHAR(255) NOT NULL,
                website VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                hometown VARCHAR(255) NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE facebook_developer_job (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                user_name VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                position VARCHAR(255) NOT NULL,
                duration VARCHAR(255) NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE facebook_developer_education (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                user_name VARCHAR(255) NOT NULL,
                college VARCHAR(255) NOT NULL,
                grade VARCHAR(255) NOT NULL,
                duration VARCHAR(255) NOT NULL
            )
        `);

        // db.run(`
        //     CREATE TABLE developer_url_queue (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        //         url VARCHAR(1024) NOT NULL,
        //         type VARCHAR(255) NOT NULL
        //     )
        // `);

        // db.run(`
        //     CREATE TABLE github_developer_activity (
        //         user_name VARCHAR(255) PRIMARY KEY NOT NULL,
        //         repo_name VARCHAR(255) PRIMARY KEY NOT NULL,
        //         repo_name TEXT PRIMARY KEY NOT NULL,
        //         language VARCHAR(255) NOT NULL,
        //         star INT NOT NULL
        //     )
        // `);

    // }

    // db.each("SELECT * FROM github_developer", function(err, row) {
    //       console.log(row);
    // });

    // db.each("SELECT * FROM github_developer_repo", function(err, row) {
    //       console.log(row);
    // });
});

db.close();

