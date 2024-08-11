const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const ApiClient = require('./api');
const { savePrevnames, getPrevnames, clearPrevnames, countPrevnames, clearDouble } = require('./fonctions');

class Client {
    constructor({ api = false, url = '', key = '' }) {
        if (api && url.endsWith('/')) {
            console.error("The URL should not end with a '/'. Please correct it to something like: https://example.com");
            this.url = url.slice(0, -1);
        } else {
            this.url = url;
        }

        this.api = api;
        this.key = key;
        this.db = null;
        this.apiClient = null;

        if (this.api) {
            this.apiClient = new ApiClient(this.url, this.key);
        } else {
            this.initDb();
            this.scheduleClearDouble();
        }
    }

    initDb() {
        const dbPath = path.resolve(__dirname, 'prevnames.db');

        if (fs.existsSync(dbPath)) {
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Failed to connect to the database:', err.message);
                } else {
                    console.log('Connected to the existing SQLite database.');
                    this.clearDoubleAtStartup();
                }
            });
        } else {
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Failed to create the database:', err.message);
                } else {
                    console.log('Created a new SQLite database.');
                    this.createTable();
                }
            });
        }
    }

    createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS Prevnames (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                username TEXT NOT NULL,
                name TEXT NOT NULL,
                changedAt TEXT NOT NULL,
                UNIQUE(user_id, name, changedAt) ON CONFLICT IGNORE
            );
        `;
        this.db.run(query, (err) => {
            if (err) {
                console.error('Failed to create table:', err.message);
            } else {
                console.log('Table "Prevnames" is ready.');
            }
        });
    }

    save(data) {
        if (this.api) {
            return this.apiClient.save(data.user_id, data.username, data.name, data.changedAt);
        }
        return savePrevnames(this, data);
    }

    prevnames(userId) {
        if (this.api) {
            return this.apiClient.prevnames(userId);
        }
        return getPrevnames(this, userId);
    }

    clear(userId) {
        if (this.api) {
            return this.apiClient.clear(userId);
        }
        return clearPrevnames(this, userId);
    }

    count() {
        if (this.api) {
            return this.apiClient.count();
        }
        return countPrevnames(this);
    }

    clearDouble(userId) {
        if (this.api) {
            return this.apiClient.clearDouble(userId);
        }

        return countPrevnames(this).then(count => {
            if (count > 0) {
                return clearDouble(this, userId);
            } else {
                console.log("No prevnames to clear.");
                return { deleted: 0 };
            }
        });
    }

    clearDoubleAtStartup() {
        this.clearDouble(null)
            .then(() => {
                console.log("All duplicates cleared at startup.");
            })
            .catch(err => {
                console.error("Error clearing duplicates at startup:", err.message);
            });
    }

    scheduleClearDouble() {
        const oneDay = 24 * 60 * 60 * 1000;
        setInterval(() => {
            this.clearDouble(null)
                .then(() => {
                    console.log("All duplicates cleared every 24 hours.");
                })
                .catch(err => {
                    console.error("Error clearing duplicates every 24 hours:", err.message);
                });
        }, oneDay);
    }
}

const Safeness = {
    Client
}

module.exports = { Safeness, Client };