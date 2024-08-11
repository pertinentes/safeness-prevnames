const savePrevnames = (client, data) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO Prevnames (user_id, username, name, changedAt)
            VALUES (?, ?, ?, ?)
        `;
        const params = [data.user_id, data.username, data.name, data.changedAt];

        client.db.run(query, params, function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({ id: this.lastID, ...data });
            }
        });
    });
};

const getPrevnames = (client, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM Prevnames
            WHERE user_id = ?
            ORDER BY changedAt DESC
        `;
        client.db.all(query, [userId], (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
};

const clearPrevnames = (client, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM Prevnames
            WHERE user_id = ?
        `;
        client.db.run(query, [userId], function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({ deleted: this.changes });
            }
        });
    });
};

const countPrevnames = (client) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(*) AS count FROM Prevnames
        `;
        client.db.get(query, [], (err, row) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(row.count);
            }
        });
    });
};

const clearDouble = (client, userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM Prevnames
            WHERE rowid NOT IN (
                SELECT MIN(rowid)
                FROM Prevnames
                GROUP BY user_id, name, changedAt
            ) AND user_id = ?
        `;
        client.db.run(query, [userId], function (err) {
            if (err) {
                reject(err.message);
            } else {
                resolve({ deleted: this.changes });
            }
        });
    });
};

module.exports = {
    savePrevnames,
    getPrevnames,
    clearPrevnames,
    countPrevnames,
    clearDouble,
};