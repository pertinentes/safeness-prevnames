# Safeness Prevnames Client

The `safeness-prevnames` module is a lightweight Node.js client designed to interact with an API that stores previous usernames of Discord users. This client allows you to retrieve, save, delete, count, and manage previous usernames both via an API and locally using SQLite. It supports both HTTP and HTTPS connections and can be configured with an optional access key for secure requests.

## Important Links

- **npm Module:** [safeness-prevnames](https://www.npmjs.com/package/safeness-prevnames)
- **Api Repository:** [safeness-prevnames](https://github.com/pertinentes/safeness-prevnames)
- **Example Usage Repository:** [exemple-safeness](https://github.com/pertinentes/safeness-api)
- **Prevnames Bot Without Safeness Module :** [prevnames-bot](https://github.com/pertinentes/prevnames-bot)

## Installation

You can install this module via npm:

```bash
npm install safeness-prevnames
```

## Usage

### Client Initialization

To get started, create an instance of the `Client` by specifying the base URL of your API. You can also provide an optional access key if your API requires authentication.

You can import the `Client` class directly or via the `Safeness` namespace:

```javascript
// Import Client directly
const { Client } = require('safeness-prevnames');

// or Import via Safeness namespace
const Safeness = require('safeness-prevnames'); 
```

### Initializing the Client

```javascript
// Initialize the client without an access key
const client = new Client({ url: 'https://example.com' });
// or
const client = new Safeness.Client({ url: 'https://example.com' }); 

// Initialize the client with an access key
const clientWithKey = new Client({ url: 'https://example.com', key: 'your-access-key' });
// or
const clientWithKey = new Safeness.Client({ url: 'https://example.com', key: 'your-access-key' }); 
```

### Offline Mode

The client can operate in offline mode using SQLite to store and manage previous usernames. To use this feature, simply initialize the client without specifying a URL or access key:

```javascript
const client = new Safeness.Client({ api: false });
```

### Available Methods

#### `prevnames(userId)`

Retrieves the previous usernames for a given Discord user ID.

```javascript
async function getPrevnames() {
    try {
        const userId = '123456789'; // a Discord user ID
        const prevnames = await client.prevnames(userId);
        console.log(prevnames);
    } catch (error) {
        console.error('Error retrieving prevnames:', error);
    }
}
```

#### `save(data)`

Saves a new username for a given Discord user.

```javascript
async function savePrevname() {
    try {
        const data = {
            user_id: '123456789',  // a Discord user ID
            username: 'newUsername',
            name: 'newName',
            changedAt: new Date().toISOString()  // Date in ISO format
        };

        await client.save(data);
        console.log('Name saved successfully');
    } catch (error) {
        console.error('Error saving name:', error);
    }
}
```

#### `clear(userId)`

Deletes all previous usernames for a given Discord user ID.

```javascript
async function clearPrevnames() {
    try {
        const userId = '123456789';  // a Discord user ID
        await client.clear(userId);
        console.log('Prevnames deleted successfully');
    } catch (error) {
        console.error('Error deleting prevnames:', error);
    }
}
```

#### `count()`

Retrieves the total number of previous usernames stored.

```javascript
async function getPrevnamesCount() {
    try {
        const count = await client.count();
        console.log(`Total number of prevnames: ${count}`);
    } catch (error) {
        console.error('Error retrieving prevnames count:', error);
    }
}
```

#### `clearDouble(userId)`

Clears duplicate previous usernames for a given Discord user ID. If no user ID is provided, it clears duplicates for all users. If there are no previous usernames to clear, it simply logs a message.

```javascript
async function clearDuplicatePrevnames() {
    try {
        const userId = '123456789';  // Optional: a Discord user ID
        await client.clearDouble(userId);
        console.log('Duplicate prevnames cleared successfully');
    } catch (error) {
        console.error('Error clearing duplicate prevnames:', error);
    }
}
```

### Automated Duplicate Clearing

The client can automatically clear duplicate previous usernames at startup and every 24 hours. This feature is available when the client is initialized without the API (`api: false`):

```javascript
const client = new Safeness.Client({ api: false });

// The client will automatically clear duplicates at startup
// and every 24 hours.
```

### Usage Examples

Here is a complete example demonstrating how to use the various methods of the `prevnames` client:

```javascript
const { Client } = require('safeness-prevnames');
// or
const Safeness = require('safeness-prevnames'); 

(async () => {
    const client = new Client({ url: 'https://example.com', key: 'your-access-key' });

    try {
        const userId = '123456789';  // a Discord user ID
        
        // Retrieve previous usernames
        const prevNames = await client.prevnames(userId);
        console.log('Prevnames:', prevNames);
        
        // Save a new username
        await client.save({ user_id: userId, username: 'newUsername', name: 'newName', changedAt: new Date().toISOString() });
        console.log('Name saved successfully');
        
        // Delete previous usernames
        await client.clear(userId);
        console.log('Prevnames deleted successfully');
        
        // Count the total number of previous usernames
        const count = await client.count();
        console.log(`Total number of prevnames: ${count}`);

        // Clear duplicate prevnames
        await client.clearDouble(userId);
        console.log('Duplicate prevnames cleared successfully');
    } catch (error) {
        console.error('Error:', error);
    }
})();
```

## Configuration

- **`url`**: The base URL of the API to which the client should connect. This is a required parameter if `api` is set to `true`.
- **`key`**: An optional access key to include in request headers for secured APIs.
- **`api`**: Set to `false` to use the client in offline mode with SQLite.


## Warnings

- Ensure that your API is properly configured to accept requests from this client.
- The access key should be kept secret and should not be exposed in insecure environments.
- Ensure the URL does not end with a trailing slash (`/`). The client will automatically correct this, but it's best practice to provide the correct format.

## License

This module is open source and distributed under the MIT license. You are free to modify it as needed, but please retain credit to the original authors.