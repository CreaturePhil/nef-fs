# nef-fs

[![build status](https://img.shields.io/travis/CreaturePhil/nef-fs/master.svg?style=flat-square)](https://travis-ci.org/CreaturePhil/nef-fs)
[![Dependency Status](https://david-dm.org/CreaturePhil/nef-fs.svg?style=flat-square)](https://david-dm.org/CreaturePhil/nef-fs)
[![devDependency Status](https://david-dm.org/CreaturePhil/nef-fs/dev-status.svg?style=flat-square)](https://david-dm.org/CreaturePhil/nef-fs#info=devDependencies)

File system plugin for [nef](https://github.com/CreaturePhil/nef)

## Install

```
npm install nef-fs --save
```

## Usage

```js
const nef = require('nef');
const nefFs = require('nef-fs');
const db = nef(nefFs('db'));

db.money.set('phil', 10);
db.money.set('some_user', db.money.get('phil') + 10);
db.seen.set('some_user', Date.now());
db.posts.set('posts', [
  { title: 'OriginDB is awesome!', body: '...', likes: 10 },
  { title: 'flexbility ', body: '...', likes: 3 },
  { title: 'something someting something', body: '...', likes: 8 }
]);
```

In `db` folder:

```js
// money.json
{
  "phil": 10
}

// seen.json
{
  "some_user": 1439674925906
}

// posts.json
{
  "posts": [
    { "title": "OriginDB is awesome!", "body": "...", "likes": 10 },
    { "title": "flexbility ", "body": "...", "likes": 3 },
    { "title": "something someting something", "body": "...", "likes": 8 }
  ]
}
```

## Docs

### nefFs(directory)

Loads in data and save function from a folder that contains JSON files.

## LICENSE

[MIT](LICENSE)
