# GGS Database

GGS Database (https://github.com/garnik93/ggs.git).

## Installation

```text
$ npm install ggs-database
```

### Example:

#### Create client:

```js
const client = new GGSClient({
  store: {
      username: 'Username',
      password: 'Password',
      projectName: 'Your project name', 
      secreteKey: 'Your secrete key',
      host: 'localhost' || '12.34.02.100',
      port: 2456 || 'default' 3000
  }
})
```

#### Write data in db:

```js
const collection = 'Your collection name'

const your_data = {
    name: 'Alina',
    age: 23,
    sex: 'Famele',
    country: 'Ukraine'
}

client.set(collection, your_data)
```

#### Read data in db:

```js
const collection = 'Your collection name'

client.get(collection).then((data) => {
  console.log(data)
})
```

#### Destroy data in db:

```js
const collection = 'Your collection name'

client.set(collection, {})
```

## API

### Methods:

#### Create method:

```js
fetch(`http://${host}:${port}/api/${collection}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Your token}`,
    'Project-Name': `${Project name}`
  },
  body: JSON.stringify(Your object),
})
```

#### Get data method:

```js
fetch(`http://${host}:${port}/api/${collection}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Your token}`,
    'Project-Name': `${Project name}`
  }
})
```