const fs = require('graceful-fs');
const jph = require('json-parse-helpfulerror');
const path = require('path');
const steno = require('steno');

function nefFs(name) {
  let objects = {
    _save(file, object) {
      const fileDir = path.join(name, file + '.json');

      steno.writeFile(fileDir, JSON.stringify(object, null, 2), (err) => {
        if (err) throw err;
      });
    }
  };

  try {
    fs.statSync(name);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      fs.mkdirSync(name);
    }
  }

  function isJSONFile(file) {
    return file.indexOf('.json') >= 0;
  }

  function isTempFile(file) {
    return file.indexOf('~') >= 0;
  }

  const dir = fs.readdirSync(name)
    .filter(file => isJSONFile(file) && !isTempFile(file));

  dir.forEach(file => {
    const fileDir = path.join(name, file);
    const fileName = file.slice(0, -5);
    const data = (fs.readFileSync(fileDir, 'utf-8') || '').trim();

    try {
      objects[fileName] = jph.parse(data);
    } catch (e) {
      if (e instanceof SyntaxError) {
        e.message = 'Malformed JSON in file: ' + file + '\n' + e.message;
      }
      throw e;
    }
  });

  return objects;
}

module.exports = nefFs;
