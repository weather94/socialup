/* eslint-disable */
import path from 'path';
import fs from 'fs';
import electron from 'electron';

class Store {
  constructor(filePath, fileName) {
    console.log(`${filePath} ${fileName}`);
    if (filePath === null) {
      this.path = fileName;
    } else if (filePath === 'default') {
      const userDataPath = (electron.app || electron.remote.app).getPath('userData');
      this.path = path.join(userDataPath, `${fileName}.txt`);
    } else {
      this.path = path.join(filePath, `${fileName}.txt`);
    }
    this.data = this.parseDataFile(this.path);
    console.log(this.path);
  }

  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  delete(key) {
    delete this.data[key];
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  deleteAll() {
    Object.keys(this.data).forEach(item => delete this.data[item]);
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  parseDataFile(filePath) {
    try {
      return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      return {};
    }
  }
}

export default Store;
