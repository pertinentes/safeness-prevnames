# Safeness Prevnames Client

The `safeness-prevnames` module is a lightweight Node.js client designed to interact with an API that stores previous usernames of Discord users. This client allows you to retrieve, save, delete, and count previous usernames through the API. It supports both HTTP and HTTPS connections and can be configured with an optional access key for secure requests.

## Installation

You can install this module via npm:

```bash
npm install safeness-prevnames
```

## Usage

### Client Initialization

To get started, you need to create an instance of the `Client` by specifying the base URL of your API. You can also provide an optional access key if your API requires authentication.

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

#### `save(user_id, username, name, changedAt)`

Saves a new username for a given Discord user.

```javascript
async function savePrevname() {
    try {
        const userId = '123456789'; // a Discord user ID
        const username = 'newUsername';
        const name = 'newName';
        const changedAt = new Date().toISOString();  // Date in ISO format

        await client.save(userId, username, name, changedAt);
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

Retrieves the total number of previous usernames stored in the database.

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

## Usage Examples

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
        await client.save(userId, 'newUsername', 'newName', new Date().toISOString());
        console.log('Name saved successfully');
        
        // Delete previous usernames
        await client.clear(userId);
        console.log('Prevnames deleted successfully');
        
        // Count the total number of previous usernames
        const count = await client.count();
        console.log(`Total number of prevnames: ${count}`);
    } catch (error) {
        console.error('Error:', error);
    }
})();
```

## Configuration

- **`url`**: The base URL of the API to which the client should connect. This is a required parameter.
- **`key`**: An optional access key to include in request headers for secured APIs.

## Warnings

- Ensure that your API is properly configured to accept requests from this client.
- The access key should be kept secret and should not be exposed in insecure environments.

## License

This module is open source and distributed under the MIT license. You are free to modify it as needed, but please retain credit to the original authors.
