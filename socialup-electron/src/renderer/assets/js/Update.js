import path from 'path';
import fs from 'fs';
import cp from 'child_process';
import request from 'request';
import electron from 'electron';
import WorkLog from './WorkLog';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function run(targetUrl, progress, store) {
  return new Promise((resolve, reject) => {
    let userDataPath = (electron.app || electron.remote.app).getPath('userData');
    userDataPath = userDataPath + '\\socialup_update.exe';
  
    const req = request({
      method: 'GET',
      uri: targetUrl,
    })

    const out = fs.createWriteStream(userDataPath);
    const stream = req.pipe(out);
    stream.on('finish', async () => {
      while (true) {
        store.dispatch('addWorkLog', new WorkLog(33, 'success', '', 'update', 'run_loop'));
        try {
          const args = [];
          cp.spawn(userDataPath, args, {detached: true});
          store.dispatch('addWorkLog', new WorkLog(33, 'success', '', 'update', 'run_success'));
          break;
        } catch (e) {
          console.log(e);
          store.dispatch('addWorkLog', new WorkLog(33, 'error', '', 'update', e));
        }
        await sleep(100);
      }
      resolve(userDataPath);
    })
  
    req.on('response', (data) => {
      store.dispatch('addWorkLog', new WorkLog(33, 'success', '', 'update', 'response_start'));
      progress.total = parseInt(data.headers['content-length']);
    });
  
    req.on('data', (chunk) => {
      progress.current += chunk.length;
    })
  
    req.on('end', () => {
      store.dispatch('addWorkLog', new WorkLog(33, 'success', '', 'update', 'response_end'));
    });
  });
}

export default run; 