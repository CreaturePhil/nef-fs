const test = require('tape');
const fs = require('graceful-fs');
const rimraf = require('rimraf');
const nef = require('nef');
const nefFs = require('../');

function reset() {
  rimraf.sync('db');
}

reset();

test.onFinish(() => reset());

const db = nef(nefFs('db'));

function readJSON(name, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fs.readFile('db/' + name + '.json', 'utf8', (err, data) => {
        if (err) return reject(err);
        resolve(JSON.parse(data));
      });
    }, time);
  });
}

test('get and set', t => {
  t.plan(5);

  t.equal(db.foo.get('bar'), undefined);
  db.foo.set('bar', 1);
  t.equal(db.foo.get('bar'), 1);

  readJSON('foo', 100).then(data => {
    t.equal(data.bar, 1);
  });

  db.powers.set('flash', 'super speed');
  t.equal(db.foo.get('bar'), 1);

  readJSON('powers', 100).then(data => {
    t.equal(data.flash, 'super speed');
  });
});

test('keys', t => {
  t.plan(5);

  t.deepEqual(db.foo.keys(), ['bar']);
  readJSON('foo', 100).then(data => {
    t.deepEqual(Object.keys(data), ['bar']);
    db.foo.set('baz', 49);
    t.deepEqual(db.foo.keys(), ['bar', 'baz']);
    return readJSON('foo', 100);
  }).then(data => {
    t.deepEqual(Object.keys(data), ['bar', 'baz']);
  });

  readJSON('powers', 100).then(data => {
    t.deepEqual(Object.keys(data), ['flash']);
  });
});

test('put', t => {
  t.plan(7);

  readJSON('foo', 100).then(data => {
    t.equal(data.bar, 1);
    t.equal(data.baz, 49);
    db.foo.put('bar', val => val + 1);
    db.foo.put('baz', val => Math.sqrt(val));
    t.equal(db.foo.get('bar'), 2);
    t.equal(db.foo.get('baz'), 7);
    return readJSON('foo', 100);
  }).then(data => {
    t.equal(data.bar, 2);
    t.equal(data.baz, 7);
  });

  db.powers.put('flash', val => val + ' and tossing lightning');
  readJSON('powers', 100).then(data => {
    t.equal(data.flash, 'super speed and tossing lightning');
  });
});

test('remove', t => {
  t.plan(5);

  t.equal(db.foo.get('baz'), 7);
  readJSON('foo', 100).then(data => {
    t.equal(data.baz, 7);
    db.foo.remove('baz');
    t.equal(db.foo.get('baz'), undefined);
    return readJSON('foo', 100);
  }).then(data => {
    t.equal(data.baz, undefined);
  });

  db.powers.remove('flash');
  readJSON('powers', 100).then(data => {
    t.equal(data.flash, undefined);
  });
});
