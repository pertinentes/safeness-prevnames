
function toDiscordTimestamp(isoDate) {
    const date = new Date(isoDate);
    return `<t:${Math.floor(date.getTime() / 1000)}:d>`;
  }
  
function dupremove(db) {
    db.all('SELECT id, user_id, username, name, changedAt FROM Prevnames', (err, rows) => {
      if (err) {
        console.error('Erreur lors de la récupération des données :', err.message);
        sendErrorToWebhook(err);
        return;
      }
  
      const duplicates = {};
      rows.forEach(entry => {
        const key = `${entry.user_id}-${entry.name}`;
        const changedAt = parseInt(entry.changedAt.match(/<t:(\d+):d>/)[1]);
  
        if (!duplicates[key]) {
          duplicates[key] = [];
        }
        duplicates[key].push({ ...entry, changedAt });
      });
  
      Object.keys(duplicates).forEach(key => {
        const entries = duplicates[key];
        entries.sort((a, b) => a.changedAt - b.changedAt);
  
        for (let i = 1; i < entries.length; i++) {
          if (entries[i].name === entries[i - 1].name && (entries[i].changedAt - entries[i - 1].changedAt <= 60)) {
            const idToRemove = entries[i].id;
            db.run('DELETE FROM Prevnames WHERE id = ?', [idToRemove], err => {
              if (err) {
                console.error('Erreur lors de la suppression des doublons :', err.message);
                sendErrorToWebhook(err);
              }
            });
          }
        }
      });
    });
}
  

const save = (client, data) => {
    return new Promise((resolve, reject) => {
        const discordtimestamp = toDiscordTimestamp(data.changedAt);
        const query = `
            INSERT INTO Prevnames (user_id, username, name, changedAt)
            VALUES (?, ?, ?, ?)
        `;
        const params = [data.user_id, data.username, data.name, discordtimestamp];

        client.db.run(query, params, function (err) {
            if (err) {
                reject(err.message);
            } else {
                dupremove(client.db);
                resolve({ id: this.lastID, ...data, changedAt: discordtimestamp });
            }
        });
    });
};

const prevnames = (client, userId) => {
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

const clear = (client, userId) => {
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

const count = (client) => {
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
        dupremove(client.db);
        resolve({ message: 'Duplicate check completed.' });
    });
};

function toDiscordTimestamp(isoDate) {
    const date = new Date(isoDate);
    return `<t:${Math.floor(date.getTime() / 1000)}:d>`;
}

function dupremove(db) {
    db.all('SELECT id, user_id, username, name, changedAt FROM Prevnames', (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des données :', err.message);
            sendErrorToWebhook(err);
            return;
        }

        const duplicates = {};
        rows.forEach(entry => {
            const key = `${entry.user_id}-${entry.name}`;
            const changedAt = parseInt(entry.changedAt.match(/<t:(\d+):d>/)[1]);

            if (!duplicates[key]) {
                duplicates[key] = [];
            }
            duplicates[key].push({ ...entry, changedAt });
        });

        Object.keys(duplicates).forEach(key => {
            const entries = duplicates[key];
            entries.sort((a, b) => a.changedAt - b.changedAt);

            for (let i = 1; i < entries.length; i++) {
                if (entries[i].name === entries[i - 1].name && (entries[i].changedAt - entries[i - 1].changedAt <= 60)) {
                    const idToRemove = entries[i].id;
                    db.run('DELETE FROM Prevnames WHERE id = ?', [idToRemove], err => {
                        if (err) {
                            console.error('Erreur lors de la suppression des doublons :', err.message);
                            sendErrorToWebhook(err);
                        }
                    });
                }
            }
        });
    });
}

module.exports = {
    save,
    prevnames,
    clear,
    count,
    clearDouble,
    toDiscordTimestamp,
    dupremove,
};