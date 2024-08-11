const http = require('http');
const https = require('https');
const { URL } = require('url');

class ApiClient {
    constructor(url, key) {
        this.url = url;
        this.key = key;
        const parsedUrl = new URL(url);
        this.protocol = parsedUrl.protocol === 'https:' ? https : http;
    }

    request(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(`${this.url}${endpoint}`);
            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port,
                path: parsedUrl.pathname + parsedUrl.search,
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            if (this.key) {
                options.headers['X-Access-Key'] = this.key;
            }

            const req = this.protocol.request(options, (res) => {
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        resolve(parsedData);
                    } catch (e) {
                        reject(new Error(`Error parsing JSON: ${e.message}. Response: ${rawData}`));
                    }
                });
            });

            req.on('error', (e) => {
                reject(e);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    async prevnames(userId) {
        return await this.request(`/api/prevnames/users/${userId}`);
    }

    async save(user_id, username, name, changedAt) {
        const data = { user_id, username, name, changedAt };
        return await this.request('/api/prevnames/save', 'POST', data);
    }

    async clear(userId) {
        return await this.request(`/api/prevnames/clear${userId}`);
    }

    async count() {
        return await this.request('/api/prevnames/count');
    }
}

module.exports = ApiClient;